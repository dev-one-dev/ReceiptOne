import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * /ca/tax-deadlines and /fr/echeances-fiscales: renders both route modules
 * server-side through TanStack Router (the loader swapped for a fixed server
 * clock, as getServerNow would return), and checks the head: canonical,
 * hreflang pair, OG and the FAQPage JSON-LD against the visible FAQ.
 */

const DIR = resolve("node_modules/.cache/tax-deadlines-page-test");
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
      import { Route as En } from "@/routes/ca/tax-deadlines";
      import { Route as Fr } from "@/routes/fr/echeances-fiscales";

      const ROUTES = { "/ca/tax-deadlines": En, "/fr/echeances-fiscales": Fr };

      export async function render(path, now) {
        const root = createRootRoute();
        const children = Object.entries(ROUTES).map(([p, r]) =>
          r.update({ id: p, path: p, getParentRoute: () => root, loader: () => ({ now }) }));
        const router = createRouter({
          routeTree: root.addChildren(children),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        const match = router.state.matches.at(-1);
        const html = renderToString(createElement(RouterProvider, { router }));
        return {
          status: router.state.status,
          matched: !!match && match.routeId === path && match.status === "success",
          html,
          head: ROUTES[path].options.head({ loaderData: { now } }),
          headers: ROUTES[path].options.headers({ loaderData: { now } }),
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
  loader: { ".svg": "dataurl", ".png": "dataurl", ".webp": "dataurl" },
  format: "esm",
  platform: "node",
  outfile: OUT,
  logLevel: "silent",
});

type Head = {
  meta: Record<string, string>[];
  links: { rel: string; href: string; hrefLang?: string }[];
  scripts: { type: string; children: string }[];
};
const { render } = (await import(pathToFileURL(OUT).href)) as {
  render: (
    path: string,
    now: string,
  ) => Promise<{
    status: string;
    matched: boolean;
    html: string;
    head: Head;
    headers: Record<string, string>;
  }>;
};

const NOW = "2026-11-14T18:00:00Z";
const ORIGIN = "https://receipt-one.com";
const pages = {
  en: await render("/ca/tax-deadlines", NOW),
  fr: await render("/fr/echeances-fiscales", NOW),
};
const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
const jsonLd = (head: Head, type: string) =>
  head.scripts
    .filter((s) => s.type === "application/ld+json")
    .map((s) => JSON.parse(s.children))
    .find((j) => j["@type"] === type);

test("tax-deadlines page: both routes render (router success, matched)", () => {
  for (const [lang, p] of Object.entries(pages)) {
    assert.equal(p.status, "idle", lang);
    assert.ok(p.matched, `${lang} matches its own route`);
    assert.ok(p.html.includes("<h1"), `${lang} renders an h1`);
  }
  assert.ok(text(pages.en.html).includes("Tax deadlines for self-employed Canadians"));
  assert.ok(text(pages.fr.html).includes("Les échéances fiscales des travailleurs autonomes"));
});

test("tax-deadlines page: Next 12 months is server-rendered from the fixed clock", () => {
  const en = text(pages.en.html);
  assert.ok(en.includes("Next 12 months"));
  assert.ok(en.indexOf("Dec 15, 2026") < en.indexOf("Jan 31, 2027"));
  assert.ok(en.includes("on time until Mon, Feb 1"), "Jan 31 2027 (Sunday) shift note");
  assert.ok(en.includes("Pay 2026 income tax balance owing"));
  assert.ok(!en.includes("Nov 14, 2027") && !en.includes("Dec 15, 2027"), "stops at 12 months");
  const fr = text(pages.fr.html);
  assert.ok(fr.includes("Les 12 prochains mois") && fr.includes("15 déc. 2026"));
  assert.ok(fr.includes("à temps jusqu'au lun. 1 février"));
});

test("tax-deadlines page: years in the rules and FAQ are computed, not hardcoded", async () => {
  const en = text(pages.en.html);
  assert.ok(en.includes("Your 2026 income tax balance owing is due April 30, 2027."));
  // A year later every example moves on by one year.
  const later = text((await render("/ca/tax-deadlines", "2027-11-14T18:00:00Z")).html);
  assert.ok(later.includes("Your 2027 income tax balance owing is due April 30, 2028."));
  for (const f of ["src/lib/tax-deadlines.ts", "src/lib/tax-deadlines-page.ts"])
    assert.ok(!/\b20[2-9]\d\b/.test(readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")), f);
});

test("tax-deadlines page: FAQPage JSON-LD parses and matches the visible FAQ exactly", () => {
  for (const [lang, p] of Object.entries(pages)) {
    const faq = jsonLd(p.head, "FAQPage");
    assert.ok(faq, `${lang} has FAQPage JSON-LD`);
    assert.equal(faq["@context"], "https://schema.org");
    assert.ok(faq.mainEntity.length >= 4 && faq.mainEntity.length <= 5);
    const visible = text(p.html);
    for (const q of faq.mainEntity) {
      assert.equal(q["@type"], "Question");
      assert.equal(q.acceptedAnswer["@type"], "Answer");
      assert.ok(typeof q.name === "string" && typeof q.acceptedAnswer.text === "string");
      assert.ok(visible.includes(q.name), `${lang}: question visible: ${q.name}`);
      assert.ok(visible.includes(q.acceptedAnswer.text), `${lang}: answer visible: ${q.name}`);
    }
    // Every visible FAQ question is in the JSON-LD (same count of h3s in the FAQ section).
    const faqSection = p.html.slice(p.html.indexOf('id="tax-deadlines-faq"'));
    const h3s = [
      ...faqSection.slice(0, faqSection.indexOf("</section>")).matchAll(/<h3[^>]*>([^<]+)</g),
    ];
    assert.deepEqual(
      h3s.map((m) => text(m[1])),
      faq.mainEntity.map((q: { name: string }) => q.name),
    );
    assert.ok(!p.head.scripts.some((s) => s.children.includes('"Event"')), "no Event schema");
    const crumbs = jsonLd(p.head, "BreadcrumbList");
    assert.ok(crumbs && crumbs.itemListElement.length === 3);
  }
});

test("tax-deadlines page: canonical, hreflang pair, title, description and OG", () => {
  const expectAlt = [
    `en-CA ${ORIGIN}/ca/tax-deadlines`,
    `fr-CA ${ORIGIN}/fr/echeances-fiscales`,
    `x-default ${ORIGIN}/ca/tax-deadlines`,
  ];
  for (const [lang, path] of [
    ["en", "/ca/tax-deadlines"],
    ["fr", "/fr/echeances-fiscales"],
  ] as const) {
    const { head } = pages[lang];
    assert.equal(head.links.find((l) => l.rel === "canonical")?.href, `${ORIGIN}${path}`);
    assert.deepEqual(
      head.links.filter((l) => l.rel === "alternate").map((l) => `${l.hrefLang} ${l.href}`),
      expectAlt,
    );
    const meta = (k: string) => head.meta.find((m) => m.property === k || m.name === k)?.content;
    assert.equal(meta("og:url"), `${ORIGIN}${path}`);
    // The same og-image as every other page (DEFAULT_OG_IMAGE, with its cache-buster).
    assert.match(meta("og:image")!, /^https:\/\/receipt-one\.com\/og-image\.png(\?v=\d+)?$/);
    assert.ok(meta("description")!.length > 50);
  }
  assert.equal(
    pages.en.head.meta.find((m) => "title" in m)?.title,
    "Self-Employed Tax Deadlines in Canada: CRA and GST/HST Due Dates | ReceiptOne",
  );
  assert.equal(
    pages.en.head.meta.find((m) => m.name === "description")?.content,
    "Every CRA deadline for self-employed Canadians in one place: instalments, the April 30 balance, the June 15 return and GST/HST due dates. Updated automatically.",
  );
  assert.ok(pages.fr.head.meta.some((m) => m.property === "og:locale" && m.content === "fr_CA"));
});

test("tax-deadlines page: edge caching, CTA UTM, disclaimer and canada.ca sources", () => {
  for (const [lang, p] of Object.entries(pages)) {
    assert.equal(p.headers["Cache-Control"], "public, s-maxage=3600, stale-while-revalidate=86400");
    assert.ok(
      p.html.includes(
        `/signup?utm_source=landing&amp;utm_medium=tax-deadlines&amp;utm_campaign=tax-deadlines&amp;utm_content=${lang}`,
      ),
      `${lang} CTA carries the UTM params`,
    );
    const links = [...p.html.matchAll(/href="(https:\/\/www\.canada\.ca[^"]+)"/g)].map((m) => m[1]);
    assert.ok(links.length >= 3);
    for (const l of links)
      assert.ok(l.includes(lang === "fr" ? "/fr/" : "/en/"), `${lang} links ${l}`);
  }
  assert.ok(
    text(pages.en.html).includes(
      "This page is general information, not tax advice. Your own due dates are in your CRA account.",
    ),
  );
  assert.ok(text(pages.fr.html).includes("Cette page fournit des renseignements généraux"));
});

test("tax-deadlines page: pair registered for hreflang and the sitemap; no /us page or header nav link", () => {
  const locales = readFileSync("src/lib/locales.ts", "utf8");
  assert.ok(locales.includes('"/ca/tax-deadlines": "/fr/echeances-fiscales"'));
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  assert.ok(sitemap.includes(`<loc>${ORIGIN}/ca/tax-deadlines</loc><lastmod>2026-11-14</lastmod>`));
  assert.ok(
    sitemap.includes(`<loc>${ORIGIN}/fr/echeances-fiscales</loc><lastmod>2026-11-14</lastmod>`),
  );
  const tree = readFileSync("src/routeTree.gen.ts", "utf8");
  assert.ok(!tree.includes("'/us/tax-deadlines'"));
  assert.ok(!readFileSync("src/components/site/Header.tsx", "utf8").includes("tax-deadlines"));
});
