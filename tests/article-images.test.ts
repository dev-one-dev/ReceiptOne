import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * Article images must never come from an external host. The article photos
 * used to be hotlinked from picsum.photos, and when that service went down
 * every article image on the site broke. Cards and article pages are now
 * text-only, and og:image / JSON-LD use the site's own /og-image.png.
 *
 * Renders both articles indexes and every CA and US article server-side
 * through TanStack Router, and fails if the article data, the HTML, the page
 * head (og:image, twitter:image) or any JSON-LD image points at picsum or any
 * http(s) image not on receipt-one.com.
 */

const DIR = resolve("node_modules/.cache/article-images-test");
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
      import { Route as CaIndex } from "@/routes/articles/index";
      import { Route as CaArticle } from "@/routes/articles/$slug";
      import { Route as UsIndex } from "@/routes/us/articles/index";
      import { Route as UsArticle } from "@/routes/us/articles/$slug";
      export { ARTICLES } from "@/lib/articles";
      export { US_ARTICLES } from "@/lib/articles.us";

      const ROUTES = {
        "/articles/": CaIndex,
        "/articles/$slug": CaArticle,
        "/us/articles/": UsIndex,
        "/us/articles/$slug": UsArticle,
      };

      export async function render(routeId, path, params) {
        const now = "2026-11-14T18:00:00Z";
        const root = createRootRoute();
        const children = Object.entries(ROUTES).map(([p, r]) =>
          r.update({ id: p, path: p, getParentRoute: () => root, loader: () => ({ now }) }));
        const router = createRouter({
          routeTree: root.addChildren(children),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        const match = router.state.matches.at(-1);
        return {
          matched: !!match && match.routeId === routeId && match.status === "success",
          html: renderToString(createElement(RouterProvider, { router })),
          head: ROUTES[routeId].options.head({ params, loaderData: { now } }),
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
  meta?: Record<string, string>[];
  scripts?: { type: string; children: string }[];
};
type Rendered = { matched: boolean; html: string; head: Head };
const mod = (await import(pathToFileURL(OUT).href)) as {
  render: (routeId: string, path: string, params: Record<string, string>) => Promise<Rendered>;
  ARTICLES: { slug: string }[];
  US_ARTICLES: { slug: string }[];
};

const OWN_HOSTS = new Set(["receipt-one.com", "www.receipt-one.com"]);
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg|bmp|ico)(\?|#|$)/i;
const IMAGE_HOSTS =
  /(^|\.)(picsum\.photos|unsplash\.com|placehold\.co|placeholder\.com|loremflickr\.com)$/i;

/** An absolute http(s) URL that is not on our own host. */
function isExternal(url: string): boolean {
  if (!/^https?:\/\//i.test(url)) return false;
  return !OWN_HOSTS.has(new URL(url).hostname.toLowerCase());
}
const looksLikeImage = (url: string) =>
  IMAGE_EXT.test(new URL(url).pathname) || IMAGE_HOSTS.test(new URL(url).hostname);

/** Every string value anywhere in a JSON-ish value, with its key. */
function* strings(v: unknown, key = ""): Generator<[string, string]> {
  if (typeof v === "string") yield [key, v];
  else if (Array.isArray(v)) for (const x of v) yield* strings(x, key);
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) yield* strings(x, k);
}

/** External image URLs in rendered HTML, a page head and its JSON-LD. */
function externalImages(page: Rendered): string[] {
  const found: string[] = [];
  const html = page.html.replace(/&amp;/g, "&");
  // <img src>, srcset, <link rel=preload as=image>, CSS url(), <source>.
  for (const m of html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g))
    if (
      isExternal(m[1]) &&
      (looksLikeImage(m[1]) ||
        /<img|as="image"/.test(html.slice(Math.max(0, m.index! - 200), m.index)))
    )
      found.push(`html: ${m[1]}`);
  for (const m of html.matchAll(/\bsrcset="([^"]+)"/g))
    for (const part of m[1].split(",")) {
      const u = part.trim().split(/\s+/)[0];
      if (isExternal(u)) found.push(`srcset: ${u}`);
    }
  for (const m of html.matchAll(/url\((['"]?)(https?:[^)'"]+)\1\)/g))
    if (isExternal(m[2])) found.push(`css: ${m[2]}`);
  for (const meta of page.head.meta ?? []) {
    const name = meta.property ?? meta.name ?? "";
    if (/image/i.test(name) && meta.content && isExternal(meta.content))
      found.push(`${name}: ${meta.content}`);
  }
  for (const s of page.head.scripts ?? []) {
    if (s.type !== "application/ld+json") continue;
    for (const [key, v] of strings(JSON.parse(s.children)))
      if (/image|logo|thumbnail/i.test(key) && isExternal(v)) found.push(`json-ld ${key}: ${v}`);
  }
  if (/picsum/i.test(page.html) || /picsum/i.test(JSON.stringify(page.head)))
    found.push("mentions picsum");
  return found;
}

const pages: [string, Rendered][] = [
  ["/articles", await mod.render("/articles/", "/articles", {})],
  ["/us/articles", await mod.render("/us/articles/", "/us/articles", {})],
];
for (const { slug } of mod.ARTICLES)
  pages.push([
    `/articles/${slug}`,
    await mod.render("/articles/$slug", `/articles/${slug}`, { slug }),
  ]);
for (const { slug } of mod.US_ARTICLES)
  pages.push([
    `/us/articles/${slug}`,
    await mod.render("/us/articles/$slug", `/us/articles/${slug}`, { slug }),
  ]);

test("article images: every articles page renders (router success)", () => {
  assert.ok(mod.ARTICLES.length > 0 && mod.US_ARTICLES.length > 0);
  for (const [path, page] of pages) assert.ok(page.matched, `${path} matches its route`);
});

test("article images: article data has no external image URL", () => {
  const bad: string[] = [];
  for (const a of [...mod.ARTICLES, ...mod.US_ARTICLES])
    for (const [key, v] of strings(a)) {
      for (const m of v.matchAll(/https?:\/\/[^\s"')<>]+/g))
        if (isExternal(m[0]) && (looksLikeImage(m[0]) || /image|img|photo|cover/i.test(key)))
          bad.push(`${a.slug}.${key}: ${m[0]}`);
      if (/picsum/i.test(v)) bad.push(`${a.slug}.${key}: mentions picsum`);
    }
  assert.deepEqual(bad, []);
});

test("article images: no page, head or JSON-LD uses an external image host", () => {
  const bad = pages.flatMap(([path, page]) => externalImages(page).map((f) => `${path} ${f}`));
  assert.deepEqual(bad, []);
});

test("article images: cards and article pages are text-only, and og:image is our own", () => {
  for (const [path, page] of pages) {
    // The header logo is the only <img> outside the article content.
    const imgs = [...page.html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
    const content = imgs.filter((t) => !/logo-(mark|wordmark)/.test(t));
    assert.deepEqual(content, [], `${path} renders no article image`);
    assert.ok(!page.html.includes("data-article-cover"), `${path} has no cover slot`);
    if (path.split("/").length > 2 && !path.endsWith("/articles")) {
      const og = page.head.meta?.find((m) => m.property === "og:image")?.content;
      assert.ok(og && new URL(og).pathname === "/og-image.png", `${path} og:image ${og}`);
    }
  }
});
