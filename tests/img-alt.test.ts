import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * Every <img> on the landing site carries an alt attribute: meaningful text
 * for informative images, alt="" only for purely decorative ones. Bing reports
 * images without alt, so each public page is server-rendered (header and
 * footer included) and its <img> tags are checked. React drops `alt` when the
 * value is undefined, so a missing data field fails here too.
 *
 * Bing also counts alt="" as missing, so the logo mark (on every page, twice)
 * carries text; the link and button around it set their own accessible name.
 */

const DIR = resolve("node_modules/.cache/img-alt-test");
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
      import { Route as Faq } from "@/routes/faq";
      import { Route as FrFaq } from "@/routes/fr/faq";
      import { Route as UsFaq } from "@/routes/us/faq";
      import { Route as Articles } from "@/routes/articles/index";
      import { Route as Article } from "@/routes/articles/$slug";
      import { Route as Deadlines } from "@/routes/ca/tax-deadlines";
      export { ARTICLES } from "@/lib/articles";

      const now = "2026-11-15T18:00:00Z";
      const ROUTES = {
        "/ca/": [Ca, () => ({ now, roadmap: null })],
        "/fr/": [Fr, () => ({ now, roadmap: null })],
        "/us/": [Us, () => null],
        "/faq": [Faq, () => ({ now })],
        "/fr/faq": [FrFaq, () => ({ now })],
        "/us/faq": [UsFaq, () => null],
        "/articles/": [Articles, () => ({ now })],
        "/articles/$slug": [Article, () => ({ now })],
        "/ca/tax-deadlines": [Deadlines, () => ({ now })],
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
  ARTICLES: { slug: string }[];
  render: (routeId: string, path: string) => Promise<{ matched: boolean; html: string }>;
};

const slug = mod.ARTICLES[0].slug;
const PAGES = [
  ["/ca/", "/ca"],
  ["/fr/", "/fr"],
  ["/us/", "/us"],
  ["/faq", "/faq"],
  ["/fr/faq", "/fr/faq"],
  ["/us/faq", "/us/faq"],
  ["/articles/", "/articles"],
  ["/articles/$slug", `/articles/${slug}`],
  ["/ca/tax-deadlines", "/ca/tax-deadlines"],
] as const;

const shorten = (tag: string) => tag.replace(/src="data:[^"]{40,}"/, 'src="data:…"');
const imgs = (html: string) => html.match(/<img\b[^>]*>/g) ?? [];

for (const [routeId, path] of PAGES) {
  test(`img alt: every <img> on ${path} has an alt attribute`, async () => {
    const { matched, html } = await mod.render(routeId, path);
    assert.ok(matched, `${path} renders`);
    const tags = imgs(html);
    assert.ok(tags.length > 0, `${path} renders at least the logo`);
    const missing = tags.filter((t) => !/\salt="[^"]*"/.test(t)).map(shorten);
    assert.deepEqual(missing, [], `${path}: <img> without alt`);
  });
}

test("img alt: the logo mark carries text, not alt=\"\" (Bing counts empty alt as missing)", async () => {
  const { html } = await mod.render("/us/faq", "/us/faq");
  const empty = imgs(html).filter((t) => /\salt=""/.test(t)).map(shorten);
  assert.deepEqual(empty, [], "/us/faq has no <img alt=\"\">");
});
