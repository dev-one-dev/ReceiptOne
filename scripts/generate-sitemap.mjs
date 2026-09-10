#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from src/routes/*.tsx so new pages are
 * indexed without manual edits. Runs in `prebuild`.
 *
 * Dynamic article routes (/articles/$slug, /us/articles/$slug) are expanded
 * from the article data in src/lib; any other dynamic segment is excluded.
 */
import { readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { build } from "esbuild";

const ORIGIN = process.env.SITE_ORIGIN || "https://receipt-one.com";
const ROUTES_DIR = "src/routes";
const OUTPUT = "public/sitemap.xml";

const PRIORITY = {
  "/ca": { p: "0.9", c: "weekly" },
  "/us": { p: "0.9", c: "weekly" },
  "/terms": { p: "0.3", c: "monthly" },
  "/privacy": { p: "0.3", c: "monthly" },
};

/**
 * Routes excluded from the sitemap.
 * "/" is a geo redirect (302 to /ca or /us), never a canonical page.
 */
const EXCLUDE = new Set(["/"]);

/** Prefix-excluded routes: internal tools and redirect-only surfaces, never indexed. */
const EXCLUDE_PREFIXES = ["/helpdesk", "/r", "/dashboard"];

/** Dynamic routes we know how to expand: route path -> article region. */
const ARTICLE_ROUTES = {
  "/articles/$slug": "ca",
  "/us/articles/$slug": "us",
};

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

function collect(dir, prefix = "") {
  const out = [];
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (e === "api") continue;
      out.push(...collect(full, prefix ? `${prefix}.${e}` : e));
    } else if (/\.(t|j)sx?$/.test(e)) {
      const path = fileToRoutePath(prefix ? `${prefix}.${e}` : e);
      if (path !== null) out.push(path);
    }
  }
  return out;
}

/**
 * Bundles the TypeScript article data with esbuild (resolving the "@/" alias)
 * and imports the result in-process, so the sitemap reads the same source of
 * truth the routes render from instead of regex-scraping slugs.
 */
async function loadArticleSlugs() {
  const result = await build({
    stdin: {
      contents: `
        import { ARTICLES } from "@/lib/articles";
        import { US_ARTICLES } from "@/lib/articles.us";
        export const ca = ARTICLES.map((a) => a.slug);
        export const us = US_ARTICLES.map((a) => a.slug);
      `,
      resolveDir: process.cwd(),
      loader: "ts",
    },
    alias: { "@": resolve("src") },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
  return { ca: mod.ca, us: mod.us };
}

const slugs = await loadArticleSlugs();
const routes = [...new Set(collect(ROUTES_DIR))];

const paths = [];
for (const route of routes) {
  if (isExcluded(route)) continue;
  const region = ARTICLE_ROUTES[route];
  if (region) {
    for (const slug of slugs[region]) paths.push(route.replace("$slug", slug));
    continue;
  }
  if (isDynamic(route)) continue;
  paths.push(route);
}

const lastmod = new Date().toISOString().split("T")[0];
const urls = [...new Set(paths)]
  .sort()
  .map((path) => {
    const meta = PRIORITY[path] ?? { p: "0.6", c: "monthly" };
    return `  <url><loc>${ORIGIN}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${meta.c}</changefreq><priority>${meta.p}</priority></url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
mkdirSync("public", { recursive: true });
writeFileSync(OUTPUT, xml);
console.log(
  `✓ wrote ${OUTPUT} (${paths.length} urls; ${slugs.ca.length} CA + ${slugs.us.length} US articles)`,
);
