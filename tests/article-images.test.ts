import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * Article images must never come from an external host. The article photos
 * used to be hotlinked from picsum.photos, and when that service went down
 * every article image on the site broke. They are now self-hosted in
 * public/articles/ (Pixabay photos, downloaded and resized; credits in
 * docs/image-credits.md): {slug}.webp 1600x900 for the article hero,
 * {slug}-card.webp 800x450 for cards, {slug}-og.jpg 1200x630 for og:image.
 *
 * Renders both articles indexes and every CA and US article server-side
 * through TanStack Router, and fails if an article's image files are missing,
 * its og:image is not its own -og.jpg, or the article data, the HTML, the page
 * head (og:image, twitter:image) or any JSON-LD image points at picsum,
 * pixabay or any other http(s) image not on receipt-one.com.
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
type ArticleLike = {
  slug: string;
  image?: { path?: string; width?: number; height?: number; alt?: string };
};
const mod = (await import(pathToFileURL(OUT).href)) as {
  render: (routeId: string, path: string, params: Record<string, string>) => Promise<Rendered>;
  ARTICLES: ArticleLike[];
  US_ARTICLES: ArticleLike[];
};

const OWN_HOSTS = new Set(["receipt-one.com", "www.receipt-one.com"]);
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg|bmp|ico)(\?|#|$)/i;
const IMAGE_HOSTS =
  /(^|\.)(picsum\.photos|unsplash\.com|pixabay\.com|placehold\.co|placeholder\.com|loremflickr\.com)$/i;

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
  for (const host of ["picsum", "pixabay"])
    if (new RegExp(host, "i").test(page.html + JSON.stringify(page.head)))
      found.push(`mentions ${host}`);
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
      if (/picsum|pixabay/i.test(v)) bad.push(`${a.slug}.${key}: mentions an image host`);
    }
  assert.deepEqual(bad, []);
});

test("article images: no page, head or JSON-LD uses an external image host", () => {
  const bad = pages.flatMap(([path, page]) => externalImages(page).map((f) => `${path} ${f}`));
  assert.deepEqual(bad, []);
});

const SITE = "https://receipt-one.com";
const ALL = [...mod.ARTICLES, ...mod.US_ARTICLES];
const BY_SLUG = new Map(ALL.map((a) => [a.slug, a]));
const metaContent = (page: Rendered, key: string) =>
  page.head.meta?.find((m) => m.property === key || m.name === key)?.content;
const unescape = (s: string) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
/** Article <img> tags: everything but the header and footer logos, which the
 * test bundle inlines as data: URLs. */
const articleImgs = (page: Rendered) =>
  [...page.html.matchAll(/<img\s[^>]*>/g)]
    .map((m) => m[0])
    .filter((t) => !/\ssrc="data:/.test(t));

test("article images: every article has an image whose three files exist", () => {
  const bad: string[] = [];
  for (const a of ALL) {
    const img = a.image;
    if (!img?.path) {
      bad.push(`${a.slug}: no image`);
      continue;
    }
    if (img.path !== `/articles/${a.slug}.webp`) bad.push(`${a.slug}: path ${img.path}`);
    if (img.width !== 1600 || img.height !== 900)
      bad.push(`${a.slug}: size ${img.width}x${img.height}`);
    const alt = img.alt?.trim() ?? "";
    if (!alt || alt.length >= 120) bad.push(`${a.slug}: alt "${alt}" (${alt.length} chars)`);
    for (const suffix of [".webp", "-card.webp", "-og.jpg"]) {
      const file = resolve("public/articles", `${a.slug}${suffix}`);
      if (!existsSync(file) || statSync(file).size === 0) bad.push(`${a.slug}: missing ${file}`);
    }
  }
  assert.deepEqual(bad, []);
});

test("article images: cards and heroes show the article's own image at a fixed size", () => {
  for (const [path, page] of pages) {
    const imgs = articleImgs(page);
    assert.ok(imgs.length > 0, `${path} renders article images`);
    for (const tag of imgs) {
      const src = /\ssrc="([^"]+)"/.exec(tag)?.[1] ?? "";
      assert.match(src, /^\/articles\/[a-z0-9-]+?(-card)?\.webp$/, `${path} img src ${src}`);
      assert.match(tag, /\swidth="\d+"/, `${path} ${src} has width`);
      assert.match(tag, /\sheight="\d+"/, `${path} ${src} has height`);
      const slug = src.replace(/^\/articles\//, "").replace(/(-card)?\.webp$/, "");
      const alt = unescape(/\salt="([^"]*)"/.exec(tag)?.[1] ?? "");
      assert.ok(alt.length > 0, `${path} ${src} has alt`);
      assert.equal(alt, BY_SLUG.get(slug)?.image?.alt, `${path} ${src} alt is its article's`);
    }
  }
});

test("article images: hero is eager; index cards lazy except the featured one", () => {
  for (const [path, page] of pages) {
    const imgs = articleImgs(page);
    const slug = path.split("/").at(-1)!;
    if (BY_SLUG.has(slug)) {
      const hero = imgs.find((t) => t.includes(`src="/articles/${slug}.webp"`));
      assert.ok(hero, `${path} renders its 1600 hero`);
      assert.match(hero!, /loading="eager"/, `${path} hero is eager`);
      assert.match(hero!, /fetchpriority="high"/i, `${path} hero has fetchpriority=high`);
      const others = imgs.filter((t) => t !== hero);
      assert.ok(others.length > 0, `${path} renders related cards`);
      for (const t of others) assert.match(t, /loading="lazy"/, `${path} related card is lazy`);
    } else {
      assert.match(imgs[0], /loading="eager"/, `${path} featured card is eager`);
      for (const t of imgs.slice(1)) assert.match(t, /loading="lazy"/, `${path} card is lazy`);
    }
  }
});

test("article images: og:image, twitter:image and JSON-LD use the article's own files", () => {
  for (const [path, page] of pages) {
    const slug = path.split("/").at(-1)!;
    if (BY_SLUG.has(slug)) {
      for (const key of ["og:image", "twitter:image"])
        assert.equal(metaContent(page, key), `${SITE}/articles/${slug}-og.jpg`, `${path} ${key}`);
      const article = (page.head.scripts ?? [])
        .filter((s) => s.type === "application/ld+json")
        .map((s) => JSON.parse(s.children) as Record<string, unknown>)
        .find((j) => j["@type"] === "Article");
      assert.equal(article?.image, `${SITE}/articles/${slug}.webp`, `${path} JSON-LD image`);
    } else {
      // The articles indexes keep the site's default social card.
      assert.equal(metaContent(page, "og:image"), `${SITE}/og-image.png?v=2`, `${path} og:image`);
    }
  }
});
