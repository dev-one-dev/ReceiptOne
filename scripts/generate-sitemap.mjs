#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from src/routes/*.tsx so new pages are
 * indexed without manual edits. Runs in `prebuild`.
 *
 * Dynamic article routes (/articles/$slug, /us/articles/$slug) are expanded
 * from the article data in src/lib (lastmod = the article's updatedAt, or
 * publishedAt when there is none); any other dynamic segment is excluded.
 *
 * Every other page's lastmod is the explicit date in PAGE_LASTMOD below. The
 * output depends only on source, never on the clock or on git, so a build
 * reproduces the committed sitemap byte for byte (Vercel clones are shallow,
 * so git history is not reliable there anyway). A page missing from
 * PAGE_LASTMOD fails the build rather than getting a made-up date.
 *
 * Pages that have equivalents in another region or language (src/lib/locales.ts:
 * /ca, /us and /fr, and their FAQ and contact pages) list every equivalent as
 * an xhtml:link hreflang alternate, the same set the pages emit in <head>.
 */
import { readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { loadTs } from "./lib/load-ts.mjs";

const ORIGIN = process.env.SITE_ORIGIN || "https://receipt-one.com";
const ROUTES_DIR = "src/routes";
export const OUTPUT = "public/sitemap.xml";

const PRIORITY = {
  "/ca": { p: "0.9", c: "weekly" },
  "/us": { p: "0.9", c: "weekly" },
  "/fr": { p: "0.9", c: "weekly" },
  "/terms": { p: "0.3", c: "monthly" },
  "/privacy": { p: "0.3", c: "monthly" },
};

/**
 * lastmod (YYYY-MM-DD) for every non-article page in the sitemap.
 * Update this date when the page's content changes.
 * Initialised to the last commit that touched each page's route file.
 */
export const PAGE_LASTMOD = {
  "/articles": "2026-10-18",
  "/ca": "2026-11-10",
  "/ca/drivers": "2026-11-09",
  "/contact": "2026-10-18",
  "/faq": "2026-10-18",
  "/fr": "2026-11-10",
  "/fr/contact": "2026-10-18",
  "/fr/faq": "2026-10-18",
  "/fr/roadmap": "2026-11-10",
  "/privacy": "2026-11-09",
  "/roadmap": "2026-11-10",
  "/terms": "2026-10-18",
  "/us": "2026-11-10",
  "/us/articles": "2026-10-18",
  "/us/contact": "2026-10-18",
  "/us/faq": "2026-10-18",
};

/**
 * Routes excluded from the sitemap.
 * "/" is a geo redirect (301 to /ca or /us), never a canonical page.
 */
const EXCLUDE = new Set(["/"]);

/** Prefix-excluded routes: internal tools and redirect-only surfaces, never indexed. */
const EXCLUDE_PREFIXES = ["/r", "/dashboard"];

/** Dynamic routes we know how to expand: route path -> article region. */
const ARTICLE_ROUTES = {
  "/articles/$slug": "ca",
  "/us/articles/$slug": "us",
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function isExcluded(path) {
  return EXCLUDE.has(path) || EXCLUDE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

function isDynamic(path) {
  return path.split("/").some((seg) => seg.startsWith("$"));
}

function fileToRoutePath(name) {
  const base = name.replace(/\.(t|j)sx?$/, "");
  if (base === "index") return "/";
  if (base === "__root") return null;
  const segments = base.split(".").filter((s) => s !== "index");
  if (segments.length === 0) return "/";
  return "/" + segments.join("/");
}

/** -> ["/us/faq", ...] */
function collect(dir, prefix = "") {
  const out = [];
  for (const e of readdirSync(dir).sort()) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) {
      if (e === "api") continue;
      out.push(...collect(full, prefix ? `${prefix}.${e}` : e));
    } else if (/\.(t|j)sx?$/.test(e)) {
      const path = fileToRoutePath(prefix ? `${prefix}.${e}` : e);
      if (path !== null) out.push(path);
    }
  }
  return out;
}

/** -> { xml, pages: Map<path, lastmod>, articleCounts: { ca, us } } */
export async function generateSitemap() {
  const articles = await loadTs(`
    import { ARTICLES } from "@/lib/articles";
    import { US_ARTICLES } from "@/lib/articles.us";
    const dated = (a) => [a.slug, a.updatedAt || a.publishedAt];
    export const ca = ARTICLES.map(dated);
    export const us = US_ARTICLES.map(dated);
  `);
  const { alternatesOf } = await loadTs(`
    import { canadianPageOf, hreflangAlternates } from "@/lib/locales";
    export const alternatesOf = (path) => {
      const ca = canadianPageOf(path);
      return ca ? hreflangAlternates(ca) : [];
    };
  `);

  const pages = new Map(); // path -> lastmod
  const undated = [];
  for (const route of collect(ROUTES_DIR)) {
    if (isExcluded(route)) continue;
    const region = ARTICLE_ROUTES[route];
    if (region) {
      for (const [slug, date] of articles[region]) pages.set(route.replace("$slug", slug), date);
      continue;
    }
    if (isDynamic(route)) continue;
    if (!PAGE_LASTMOD[route]) undated.push(route);
    pages.set(route, PAGE_LASTMOD[route]);
  }
  if (undated.length)
    throw new Error(
      `generate-sitemap: no lastmod for ${undated.join(", ")}. ` +
        `Add the page to PAGE_LASTMOD in scripts/generate-sitemap.mjs.`,
    );
  for (const [path, date] of pages)
    if (!DATE.test(date ?? "")) throw new Error(`generate-sitemap: bad lastmod "${date}" for ${path}`);

  const urls = [...pages.keys()]
    .sort()
    .map((path) => {
      const meta = PRIORITY[path] ?? { p: "0.6", c: "monthly" };
      const alternates = alternatesOf(path)
        .map(
          (a) => `<xhtml:link rel="alternate" hreflang="${a.hrefLang}" href="${ORIGIN}${a.path}"/>`,
        )
        .join("");
      return `  <url><loc>${ORIGIN}${path}</loc><lastmod>${pages.get(path)}</lastmod><changefreq>${meta.c}</changefreq><priority>${meta.p}</priority>${alternates}</url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
  return { xml, pages, articleCounts: { ca: articles.ca.length, us: articles.us.length } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { xml, pages, articleCounts } = await generateSitemap();
  mkdirSync("public", { recursive: true });
  writeFileSync(OUTPUT, xml);
  console.log(
    `✓ wrote ${OUTPUT} (${pages.size} urls; ${articleCounts.ca} CA + ${articleCounts.us} US articles)`,
  );
}
