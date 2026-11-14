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

      // Jan 31, 2027 (a Sunday) is in the footer strip on this date.
      const now = "2026-11-14T18:00:00Z";
      const ROUTES = {
        "/ca/": [Ca, () => ({ now, roadmap: null })],
        "/fr/": [Fr, () => ({ now, roadmap: null })],
        "/us/": [Us, () => null],
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
