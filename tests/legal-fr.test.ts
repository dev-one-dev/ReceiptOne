import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

// @ts-expect-error -- plain .mjs build script, no type declarations
import { loadTs } from "../scripts/lib/load-ts.mjs";

/**
 * /fr/privacy and /fr/terms: the French translations of the legal pages.
 * Renders all four legal routes server-side through TanStack Router (the same
 * route modules the site ships) and checks structure, the precedence note,
 * hreflang pairing and every French link to the two documents.
 */

const FR_NOTE =
  "En cas de divergence entre la version française et la version anglaise, la version française prévaut pour les résidents du Québec.";

/* ------------------------------ SSR harness ------------------------------- */

type Rendered = { status: string; notFound: boolean; html: string };

const OUT = resolve("node_modules/.cache/legal-fr-test/render.mjs");
mkdirSync(resolve("node_modules/.cache/legal-fr-test"), { recursive: true });
await build({
  stdin: {
    contents: `
      import { renderToString } from "react-dom/server";
      import { createElement } from "react";
      import {
        RouterProvider, createMemoryHistory, createRootRoute, createRouter,
      } from "@tanstack/react-router";
      import { Route as Privacy } from "@/routes/privacy";
      import { Route as Terms } from "@/routes/terms";
      import { Route as FrPrivacy } from "@/routes/fr/privacy";
      import { Route as FrTerms } from "@/routes/fr/terms";

      const ROUTES = { "/privacy": Privacy, "/terms": Terms, "/fr/privacy": FrPrivacy, "/fr/terms": FrTerms };

      export async function render(path) {
        const root = createRootRoute();
        const children = Object.entries(ROUTES).map(([p, r]) =>
          r.update({ id: p, path: p, getParentRoute: () => root }));
        const router = createRouter({
          routeTree: root.addChildren(children),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        const match = router.state.matches.at(-1);
        const html = renderToString(createElement(RouterProvider, { router }));
        return {
          status: router.state.status,
          notFound: !match || match.routeId !== path || match.status === "notFound",
          html,
        };
      }
      export const fileRoutes = Object.keys(ROUTES);
    `,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  alias: { "@": resolve("src") },
  bundle: true,
  packages: "external",
  jsx: "automatic",
  loader: { ".svg": "dataurl", ".png": "dataurl" },
  format: "esm",
  platform: "node",
  outfile: OUT,
  logLevel: "silent",
});
const { render } = (await import(pathToFileURL(OUT).href)) as {
  render: (path: string) => Promise<Rendered>;
};

const pages = {
  "/privacy": await render("/privacy"),
  "/fr/privacy": await render("/fr/privacy"),
  "/terms": await render("/terms"),
  "/fr/terms": await render("/fr/terms"),
};

/** Top-level section anchors in render order: "section-1", "section-2", ... */
const topLevelSections = (html: string) =>
  [...html.matchAll(/id="(section-\d+)"/g)].map((m) => m[1]);
const subsections = (html: string) =>
  [...html.matchAll(/id="(section-\d+-\d+)"/g)].map((m) => m[1]);
const partIds = (html: string) => [...html.matchAll(/id="(part-[a-z])"/g)].map((m) => m[1]);
const hrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;|&#39;/g, "'");

/* --------------------------------- Render --------------------------------- */

for (const [path, page] of Object.entries(pages)) {
  test(`legal-fr: ${path} renders (router success, matched, not 404)`, () => {
    assert.equal(page.status, "idle");
    assert.equal(page.notFound, false, `${path} should match its own route`);
    assert.ok(page.html.includes("<h1"), `${path} renders an h1`);
  });
}

test("legal-fr: /fr/privacy has the same sections and subsections as /privacy", () => {
  const en = topLevelSections(pages["/privacy"].html);
  const fr = topLevelSections(pages["/fr/privacy"].html);
  assert.equal(en.length, 13);
  assert.deepEqual(fr, en);
  assert.deepEqual(subsections(pages["/fr/privacy"].html), subsections(pages["/privacy"].html));
});

test("legal-fr: /fr/terms has the same parts and sections as /terms", () => {
  const en = topLevelSections(pages["/terms"].html);
  const fr = topLevelSections(pages["/fr/terms"].html);
  assert.equal(en.length, 34);
  assert.deepEqual(fr, en);
  assert.deepEqual(partIds(pages["/fr/terms"].html), partIds(pages["/terms"].html));
});

test("legal-fr: the precedence note is on both French pages and neither English page", () => {
  for (const p of ["/fr/privacy", "/fr/terms"] as const)
    assert.ok(text(pages[p].html).includes(FR_NOTE), `${p} shows the precedence note`);
  for (const p of ["/privacy", "/terms"] as const)
    assert.ok(!text(pages[p].html).includes("version française prévaut"), `${p} has no note`);
});

test("legal-fr: French pages keep the English 'Last updated' dates", () => {
  assert.match(text(pages["/privacy"].html), /Last updated: November 9, 2026/);
  assert.match(text(pages["/fr/privacy"].html), /Dernière mise à jour : 9 novembre 2026/);
  assert.match(text(pages["/terms"].html), /Last updated: October 18, 2026/);
  assert.match(text(pages["/fr/terms"].html), /Dernière mise à jour : 18 octobre 2026/);
});

test("legal-fr: French pages keep the operator name and address verbatim", () => {
  for (const p of ["/fr/privacy", "/fr/terms"] as const) {
    const t = text(pages[p].html);
    assert.ok(t.includes("Flutter Horizon"), `${p} names Flutter Horizon`);
  }
  // The address appears in the collapsed sections, so check the source.
  for (const f of ["src/routes/fr/privacy.tsx", "src/routes/fr/terms.tsx"])
    assert.ok(readFileSync(f, "utf8").includes("6555 Bonsor Ave, Burnaby, BC V5H 3E9, Canada"));
});

/* ---------------------------------- Links --------------------------------- */

const loadTsSync = (await loadTs(`
  import { canadianPageOf, hreflangAlternates } from "@/lib/locales";
  export const alternates = (p) => hreflangAlternates(p);
  export const cluster = (p) => canadianPageOf(p);
`)) as {
  alternates: (p: string) => { hrefLang: string; path: string }[];
  cluster: (p: string) => string | null;
};

const routeTree = readFileSync("src/routeTree.gen.ts", "utf8");
const hasRoute = (path: string) => routeTree.includes(`'${path}': typeof`);

test("legal-fr: both routes are in the generated route tree", () => {
  assert.ok(hasRoute("/fr/privacy"));
  assert.ok(hasRoute("/fr/terms"));
});

test("legal-fr: every internal link on the French legal pages resolves to a French route", () => {
  for (const p of ["/fr/privacy", "/fr/terms"] as const) {
    const internal = hrefs(pages[p].html).filter((h) => h.startsWith("/"));
    assert.ok(internal.length > 0);
    for (const h of internal) {
      const path = h.split(/[?#]/)[0];
      assert.ok(hasRoute(path), `${p} links to ${h}, which is not a route`);
      assert.ok(path === "/fr" || path.startsWith("/fr/"), `${p} links to English page ${h}`);
    }
  }
});

test("legal-fr: /fr/terms links to /fr/privacy (not the English policy)", () => {
  const links = hrefs(pages["/fr/terms"].html);
  // Section 25 is collapsed on first render; the link lives in the source.
  const src = readFileSync("src/routes/fr/terms.tsx", "utf8");
  assert.ok(src.includes('to="/fr/privacy"'));
  assert.ok(!src.includes('to="/privacy"'));
  assert.ok(!links.includes("/privacy"));
});

test("legal-fr: hreflang pairs /privacy<->/fr/privacy and /terms<->/fr/terms, canonical to self", () => {
  const { alternates, cluster } = loadTsSync;
  for (const [en, fr] of [
    ["/privacy", "/fr/privacy"],
    ["/terms", "/fr/terms"],
  ]) {
    assert.equal(cluster(fr), en);
    const alt = alternates(en);
    assert.deepEqual(
      alt.map((a: { hrefLang: string; path: string }) => `${a.hrefLang} ${a.path}`),
      [`en-CA ${en}`, `fr-CA ${fr}`, `x-default ${en}`],
    );
  }
  for (const f of ["src/routes/fr/privacy.tsx", "src/routes/fr/terms.tsx"]) {
    const src = readFileSync(f, "utf8");
    const self = f.includes("privacy") ? "/fr/privacy" : "/fr/terms";
    assert.ok(src.includes(`path: "${self}"`), `${f} canonical is ${self}`);
  }
  for (const [f, en] of [
    ["src/routes/privacy.tsx", "/privacy"],
    ["src/routes/terms.tsx", "/terms"],
  ]) {
    const src = readFileSync(f, "utf8");
    assert.ok(src.includes(`hreflang: regionHreflang("${en}")`), `${f} emits hreflang`);
  }
});

test("legal-fr: French footer, cookie banner and FAQ link to the French legal pages", async () => {
  const footer = readFileSync("src/components/site/Footer.tsx", "utf8");
  const frLegal = footer.slice(
    footer.indexOf("const LEGAL_LINKS"),
    footer.indexOf("const FOOTER_COPY"),
  );
  assert.match(
    frLegal,
    /fr: \[\s*\{ label: "Conditions d'utilisation", href: ROUTES\.frTerms \},\s*\{ label: "Politique de confidentialité", href: ROUTES\.frPrivacy \},/,
  );

  const { routes } = (await loadTs(`
    import { INTERNAL_ROUTES } from "@/lib/routes";
    export const routes = INTERNAL_ROUTES;
  `)) as { routes: Record<string, string> };
  assert.equal(routes.frTerms, "/fr/terms");
  assert.equal(routes.frPrivacy, "/fr/privacy");
  for (const p of Object.values(routes)) assert.ok(hasRoute(p), `ROUTES entry ${p} is a route`);

  const cookie = readFileSync("src/components/site/CookieConsent.tsx", "utf8");
  assert.ok(cookie.includes('to={lang === "fr" ? "/fr/privacy" : "/privacy"}'));
  assert.ok(!cookie.includes("(en anglais)"));

  const { faqLinks } = (await loadTs(`
    import { faqItemsFR } from "@/lib/faq.fr";
    export const faqLinks = faqItemsFR.flatMap((q) => (q.link ? [q.link] : []));
  `)) as { faqLinks: { to: string; label: string; en?: boolean }[] };
  const policy = faqLinks.filter((l) => /confidentialit/i.test(l.label));
  assert.ok(policy.length > 0);
  for (const l of policy) {
    assert.equal(l.to, "/fr/privacy");
    assert.ok(
      !l.en && !l.label.includes("(en anglais)"),
      `FAQ link "${l.label}" still marked English`,
    );
  }
  // No French surface still points at the English legal pages.
  for (const l of faqLinks)
    assert.ok(l.to !== "/privacy" && l.to !== "/terms", `FAQ links ${l.to}`);
});
