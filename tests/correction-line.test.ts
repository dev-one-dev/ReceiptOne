import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * The "Spotted an error?" line: once on every CA and US article and on both
 * tax-deadlines pages, with a mailto whose subject carries the page title and
 * whose body carries the page URL, both percent-encoded. Not on the landing
 * page or the legal pages. Renders the routes server-side through TanStack
 * Router with a fixed server clock.
 */

const DIR = resolve("node_modules/.cache/correction-line-test");
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
      import { Route as CaArticle } from "@/routes/articles/$slug";
      import { Route as UsArticle } from "@/routes/us/articles/$slug";
      import { Route as DeadlinesEn } from "@/routes/ca/tax-deadlines";
      import { Route as DeadlinesFr } from "@/routes/fr/echeances-fiscales";
      import { Route as CaIndex } from "@/routes/ca/index";
      import { Route as Privacy } from "@/routes/privacy";
      export { ARTICLES, articleDisplayTitle } from "@/lib/articles";
      export { US_ARTICLES } from "@/lib/articles.us";
      export { taxDeadlinesCopy } from "@/lib/tax-deadlines-page";

      const ROUTES = {
        "/articles/$slug": CaArticle,
        "/us/articles/$slug": UsArticle,
        "/ca/tax-deadlines": DeadlinesEn,
        "/fr/echeances-fiscales": DeadlinesFr,
        "/ca/": CaIndex,
        "/privacy": Privacy,
      };

      export async function render(routeId, path) {
        const now = "2026-11-14T18:00:00Z";
        const root = createRootRoute();
        const children = Object.entries(ROUTES).map(([p, r]) =>
          r.update({
            id: p, path: p, getParentRoute: () => root,
            loader: () => ({ now, roadmap: null }),
          }));
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

type ArticleLike = { slug: string; title: string; displayTitle?: string };
const mod = (await import(pathToFileURL(OUT).href)) as {
  render: (routeId: string, path: string) => Promise<{ matched: boolean; html: string }>;
  ARTICLES: ArticleLike[];
  US_ARTICLES: ArticleLike[];
  articleDisplayTitle: (a: ArticleLike) => string;
  taxDeadlinesCopy: (lang: "en" | "fr", today: string) => { h1: string };
};

const ORIGIN = "https://receipt-one.com";
const EMAIL = "support@receipt-one.com";
const decode = (s: string) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
const text = (html: string) => decode(html.replace(/<[^>]+>/g, ""));
const lines = (html: string) => [
  ...html.matchAll(/<p[^>]*data-correction-line[^>]*>([\s\S]*?)<\/p>/g),
];

type Expect = {
  routeId: string;
  path: string;
  title: string;
  lang: "en" | "fr";
};
const expected: Expect[] = [
  ...mod.ARTICLES.map((a) => ({
    routeId: "/articles/$slug",
    path: `/articles/${a.slug}`,
    title: mod.articleDisplayTitle(a),
    lang: "en" as const,
  })),
  ...mod.US_ARTICLES.map((a) => ({
    routeId: "/us/articles/$slug",
    path: `/us/articles/${a.slug}`,
    title: mod.articleDisplayTitle(a),
    lang: "en" as const,
  })),
  {
    routeId: "/ca/tax-deadlines",
    path: "/ca/tax-deadlines",
    title: mod.taxDeadlinesCopy("en", "2026-11-14").h1,
    lang: "en",
  },
  {
    routeId: "/fr/echeances-fiscales",
    path: "/fr/echeances-fiscales",
    title: mod.taxDeadlinesCopy("fr", "2026-11-14").h1,
    lang: "fr",
  },
];

const SENTENCE = {
  en: `Spotted an error or something out of date? Let us know at ${EMAIL}.`,
  fr: `Vous avez repéré une erreur ou une information périmée? Écrivez-nous à ${EMAIL}.`,
};
const SUBJECT = { en: "Correction: ", fr: "Correction : " };
const BODY = { en: "Page: ", fr: "Page : " };

test("correction line: once per article and deadlines page, with an encoded mailto", async () => {
  assert.ok(expected.length > 20, "covers every article and both deadlines pages");
  for (const e of expected) {
    const page = await mod.render(e.routeId, e.path);
    assert.ok(page.matched, `${e.path} renders`);
    const found = lines(page.html);
    assert.equal(found.length, 1, `${e.path} has exactly one correction line`);
    const inner = found[0][1];
    assert.equal(text(inner), SENTENCE[e.lang], `${e.path} sentence`);

    const anchors = [...inner.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)];
    assert.equal(anchors.length, 1, `${e.path} one link (the address is not double-linked)`);
    const [, rawHref, label] = anchors[0];
    assert.equal(label, EMAIL, `${e.path} link text`);
    assert.doesNotMatch(anchors[0][0], /text-ember/, `${e.path} link is not orange`);

    const href = decode(rawHref);
    const m = /^mailto:([^?]+)\?subject=([^&]+)&body=([^&]+)$/.exec(href);
    assert.ok(m, `${e.path} mailto shape: ${href}`);
    assert.equal(m![1], EMAIL);
    // Percent-encoded: no raw spaces, colons or slashes in the query values.
    assert.doesNotMatch(m![2] + m![3], /[ :/+]/, `${e.path} subject/body are encoded`);
    assert.equal(decodeURIComponent(m![2]), `${SUBJECT[e.lang]}${e.title}`, `${e.path} subject`);
    assert.equal(decodeURIComponent(m![3]), `${BODY[e.lang]}${ORIGIN}${e.path}`, `${e.path} body`);
  }
});

test("correction line: not on the landing page or the privacy policy", async () => {
  for (const [routeId, path] of [
    ["/ca/", "/ca"],
    ["/privacy", "/privacy"],
  ]) {
    const page = await mod.render(routeId, path);
    assert.ok(page.matched, `${path} renders`);
    assert.equal(lines(page.html).length, 0, `${path} has no correction line`);
    assert.doesNotMatch(page.html, /subject=Correction/, `${path} has no correction mailto`);
  }
});
