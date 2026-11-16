import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * Landing pages /ca, /fr and /us, rendered server-side through TanStack Router
 * with a fixed server clock: the pricing section carries no "subscribe in the
 * app / billed through the store" paragraph (the FAQ may still say so), and the
 * footer's deadline strip shows only the official date and label, never the
 * "on time until" weekend-shift note (that stays on the deadlines pages).
 * The pricing feature list (shared with /ca/drivers) and the "Who it's for"
 * personas are checked too.
 */

const DIR = resolve("node_modules/.cache/landing-pricing-test");
const OUT = resolve(DIR, "render.mjs");
mkdirSync(DIR, { recursive: true });

const rawImports: Plugin = {
  name: "raw",
  setup(b) {
    b.onResolve({ filter: /\?raw$/ }, (args) => ({
      path: args.path.startsWith("@/")
        ? resolve("src", args.path.slice(2).replace(/\?raw$/, ""))
        : resolve(args.resolveDir, args.path.replace(/\?raw$/, "")),
      namespace: "raw",
    }));
    b.onLoad({ filter: /.*/, namespace: "raw" }, (args) => ({
      contents: readFileSync(args.path, "utf8"),
      loader: "text",
    }));
  },
};

await build({
  stdin: {
    contents: `
      import { renderToString } from "react-dom/server";
      import { createElement } from "react";
      import {
        RouterProvider, createMemoryHistory, createRootRoute, createRouter,
      } from "@tanstack/react-router";
      import { Route as Ca } from "@/routes/ca/index";
      import { Route as Fr } from "@/routes/fr/index";
      import { Route as Us } from "@/routes/us/index";
      import { Route as Drivers } from "@/routes/ca/drivers";

      // Jan 31, 2027 (a Sunday) is in the footer strip on this date.
      const now = "2026-11-14T18:00:00Z";
      const ROUTES = {
        "/ca/": [Ca, () => ({ now, roadmap: null })],
        "/fr/": [Fr, () => ({ now, roadmap: null })],
        "/us/": [Us, () => null],
        "/ca/drivers": [Drivers, () => ({ now })],
      };

      export async function render(routeId, path) {
        const root = createRootRoute();
        const children = Object.entries(ROUTES).map(([p, [r, loader]]) =>
          r.update({ id: p, path: p, getParentRoute: () => root, loader }));
        const router = createRouter({
          routeTree: root.addChildren(children),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        const match = router.state.matches.at(-1);
        return {
          matched: !!match && match.routeId === routeId && match.status === "success",
          html: renderToString(createElement(RouterProvider, { router })),
        };
      }
    `,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  alias: { "@": resolve("src") },
  plugins: [rawImports],
  bundle: true,
  packages: "external",
  jsx: "automatic",
  loader: { ".svg": "dataurl", ".png": "dataurl", ".webp": "dataurl", ".mp4": "dataurl" },
  format: "esm",
  platform: "node",
  outfile: OUT,
  logLevel: "silent",
});

const mod = (await import(pathToFileURL(OUT).href)) as {
  render: (routeId: string, path: string) => Promise<{ matched: boolean; html: string }>;
};

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
const section = (html: string, id: string) => {
  const m = new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`).exec(html);
  assert.ok(m, `#${id} section is rendered`);
  return text(m[0]);
};
const whoItsFor = (html: string, eyebrow: string) => {
  const m = [...html.matchAll(/<section[\s\S]*?<\/section>/g)]
    .map((x) => text(x[0]))
    .find((t) => t.includes(eyebrow));
  assert.ok(m, `"${eyebrow}" section is rendered`);
  return m;
};
const footer = (html: string) => {
  const m = /<footer[\s\S]*?<\/footer>/.exec(html);
  assert.ok(m, "footer is rendered");
  return text(m[0]);
};

const PAGES = [
  { routeId: "/ca/", path: "/ca", lang: "en", strip: true },
  { routeId: "/fr/", path: "/fr", lang: "fr", strip: true },
  { routeId: "/us/", path: "/us", lang: "en", strip: false },
] as const;
const pages = await Promise.all(
  PAGES.map(async (p) => ({ ...p, ...(await mod.render(p.routeId, p.path)) })),
);

test("landing pricing: no app-store subscription paragraph on /ca, /fr, /us", () => {
  for (const p of pages) {
    assert.ok(p.matched, `${p.path} renders`);
    const pricing = section(p.html, "pricing");
    // The rest of the section is still there.
    assert.ok(pricing.includes(p.lang === "fr" ? "Tarifs" : "Pricing"), `${p.path} eyebrow`);
    assert.ok(/(CAD |\$)\d/.test(pricing), `${p.path} shows prices`);
    for (const phrase of [
      "To keep adding receipts after the trial",
      "Subscriptions are billed through the App Store or Google Play",
      "Pour continuer à ajouter des reçus après l'essai",
      "Les abonnements sont facturés par l'App Store ou Google Play",
    ])
      assert.ok(!pricing.includes(phrase), `${p.path} pricing has no "${phrase}"`);
  }
});

test("landing footer: deadline strip shows date and label, no weekend-shift note", () => {
  for (const p of pages) {
    const f = footer(p.html);
    assert.ok(!f.includes("on time until"), `${p.path} footer has no "on time until"`);
    assert.ok(!f.includes("à temps jusqu'au"), `${p.path} footer has no "à temps jusqu'au"`);
    if (!p.strip) continue;
    // The shifted Jan 31, 2027 row still shows its official date and label.
    if (p.lang === "fr") {
      assert.ok(f.includes("31 janv. 2027"), `${p.path} official date`);
      assert.ok(f.includes("Déclarants trimestriels de TPS/TVH (4e trimestre 2026)"));
    } else {
      assert.ok(f.includes("Jan 31, 2027"), `${p.path} official date`);
      assert.ok(f.includes("GST/HST quarterly filers (Q4 2026)"));
    }
  }
});

const NEW_FEATURES = {
  en: ["Forward e-mail receipts", "Telegram bot for quick reports", "Home office expenses"],
  fr: [
    "Transfert des reçus par courriel",
    "Bot Telegram pour des rapports rapides",
    "Dépenses de bureau à domicile",
  ],
} as const;

test("landing pricing: short e-mail item plus Telegram and home office, after the platforms item", async () => {
  const drivers = {
    path: "/ca/drivers",
    lang: "en",
    ...(await mod.render("/ca/drivers", "/ca/drivers")),
  };
  assert.ok(drivers.matched, "/ca/drivers renders");
  for (const p of [...pages, drivers]) {
    const pricing = section(p.html, "pricing");
    for (const f of NEW_FEATURES[p.lang])
      assert.ok(pricing.includes(f), `${p.path} pricing has "${f}"`);
    for (const phrase of [
      "every account gets its own receipt address",
      "chaque compte a sa propre adresse de réception",
    ])
      assert.ok(!pricing.includes(phrase), `${p.path} pricing has no "${phrase}"`);
    // Telegram and home office follow the platforms item (the GST/HST worksheet
    // and tax calendar come after them; see the test below).
    const [, telegram, home] = NEW_FEATURES[p.lang];
    const apps = p.lang === "fr" ? "Applications iOS, Android et Web" : "iOS, Android and web apps";
    assert.ok(pricing.indexOf(apps) < pricing.indexOf(telegram), `${p.path} Telegram after apps`);
    assert.ok(pricing.indexOf(telegram) < pricing.indexOf(home), `${p.path} home office after Telegram`);
  }
});

test("landing who it's for: names drivers and contractors, not only freelancers", () => {
  for (const p of pages) {
    const who = whoItsFor(p.html, p.lang === "fr" ? "Pour qui" : "Who it's for");
    if (p.lang === "fr") {
      for (const w of [
        "Pigistes",
        "travailleurs autonomes",
        "Chauffeurs VTC et livreurs",
        "gens de métier",
      ])
        assert.ok(who.includes(w), `${p.path} mentions "${w}"`);
      continue;
    }
    assert.ok(/drivers/i.test(who), `${p.path} mentions drivers`);
    assert.ok(/contractors/i.test(who), `${p.path} mentions contractors`);
    assert.ok(/tradespeople/i.test(who), `${p.path} mentions tradespeople`);
    if (p.path === "/us") assert.ok(who.includes("1099 contractors"), "/us says 1099 contractors");
  }
});

test("landing pricing: GST/HST worksheet and tax calendar close the CA list, absent on /us", async () => {
  const drivers = {
    path: "/ca/drivers",
    lang: "en",
    ...(await mod.render("/ca/drivers", "/ca/drivers")),
  };
  const NEW = {
    en: ["GST/HST return worksheet", "Tax deadline calendar"],
    fr: ["Feuille de travail de déclaration de TPS/TVH", "Calendrier des échéances fiscales"],
  } as const;
  for (const p of [...pages, drivers]) {
    const pricing = section(p.html, "pricing");
    if (p.path === "/us") {
      for (const f of [...NEW.en, ...NEW.fr, "GST", "TPS"])
        assert.ok(!pricing.includes(f), `/us pricing has no "${f}"`);
      continue;
    }
    const [worksheet, calendar] = NEW[p.lang as "en" | "fr"];
    const home = p.lang === "fr" ? "Dépenses de bureau à domicile" : "Home office expenses";
    // Existing items keep their order; the two new ones follow home office.
    assert.ok(pricing.indexOf(home) > 0, `${p.path} has home office`);
    assert.ok(pricing.indexOf(home) < pricing.indexOf(worksheet), `${p.path} worksheet after home`);
    assert.ok(pricing.indexOf(worksheet) < pricing.indexOf(calendar), `${p.path} calendar last`);
  }
});
