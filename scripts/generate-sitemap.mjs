#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from src/routes/*.tsx so new pages are
 * indexed without manual edits. Runs in `prebuild`.
 *
 * Dynamic article routes (/articles/$slug, /us/articles/$slug) are expanded
 * from the article data in src/lib (lastmod = the article's updatedAt); any
 * other dynamic segment is excluded.
 *
 * Every other page's lastmod is the newest commit date among the source
 * files it is built from: esbuild walks the route file's imports (plus
 * __root.tsx, which wraps every page) and git supplies each file's last
 * commit date. A page's lastmod therefore moves only when something it
 * renders actually changed, not on every build. In a shallow clone (as on
 * some CI hosts) git history is incomplete, so the dates already committed in
 * public/sitemap.xml are reused instead; a page with no known date gets no
 * lastmod rather than a made-up one.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { build } from "esbuild";
import { loadTs } from "./lib/load-ts.mjs";

const ORIGIN = process.env.SITE_ORIGIN || "https://receipt-one.com";
const ROUTES_DIR = "src/routes";
const ROOT_ROUTE = "src/routes/__root.tsx";
const OUTPUT = "public/sitemap.xml";

const PRIORITY = {
  "/ca": { p: "0.9", c: "weekly" },
  "/us": { p: "0.9", c: "weekly" },
  "/terms": { p: "0.3", c: "monthly" },
  "/privacy": { p: "0.3", c: "monthly" },
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

/** Asset types a route can import; they count as page content for lastmod. */
const ASSET_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4", ".webm"];

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

/** -> [{ path: "/us/faq", file: "src/routes/us/faq.tsx" }, ...] */
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
      if (path !== null) out.push({ path, file: full.replaceAll("\\", "/") });
    }
  }
  return out;
}

/* ------------------------------ lastmod --------------------------------- */

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return null;
  }
}

/** file -> YYYY-MM-DD of the newest commit touching it, from one log pass. */
function gitLastCommitDates() {
  if (git(["rev-parse", "--is-shallow-repository"])?.trim() !== "false") return null;
  const log = git(["log", "--format=%x00%cs", "--name-only", "--", "src"]);
  if (log === null) return null;
  const dates = new Map();
  let date = null;
  for (const line of log.split("\n")) {
    if (line.startsWith("\0")) date = line.slice(1);
    else if (line && !dates.has(line)) dates.set(line, date); // log is newest-first
  }
  return dates;
}

/** Repo-relative paths of every src/ file a route module pulls in. */
async function sourceFilesOf(entry) {
  const result = await build({
    entryPoints: [entry],
    alias: { "@": resolve("src") },
    bundle: true,
    write: false,
    metafile: true,
    outdir: "sitemap-scan", // required by esbuild; nothing is written
    format: "esm",
    platform: "browser",
    packages: "external",
    jsx: "automatic",
    loader: Object.fromEntries(ASSET_EXTENSIONS.map((ext) => [ext, "empty"])),
    // `?url` / `?raw` style Vite imports are not files esbuild can resolve.
    plugins: [
      {
        name: "vite-suffix",
        setup(b) {
          b.onResolve({ filter: /\?/ }, (args) => ({ path: args.path, external: true }));
        },
      },
    ],
    logLevel: "silent",
  });
  return Object.keys(result.metafile.inputs)
    .map((p) => relative(process.cwd(), resolve(p)).replaceAll("\\", "/"))
    .filter((p) => p.startsWith("src/") && p !== "src/routeTree.gen.ts");
}

/** loc -> lastmod from the currently committed sitemap (shallow-clone fallback). */
function previousLastmods() {
  if (!existsSync(OUTPUT)) return new Map();
  const xml = readFileSync(OUTPUT, "utf8");
  return new Map(
    [...xml.matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map((m) => [m[1], m[2]]),
  );
}

/* ------------------------------- build ---------------------------------- */

const slugs = await loadTs(`
  import { ARTICLES } from "@/lib/articles";
  import { US_ARTICLES } from "@/lib/articles.us";
  export const ca = ARTICLES.map((a) => [a.slug, a.updatedAt]);
  export const us = US_ARTICLES.map((a) => [a.slug, a.updatedAt]);
`);
const routes = collect(ROUTES_DIR);
const gitDates = gitLastCommitDates();
const previous = gitDates ? null : previousLastmods();
const rootFiles = gitDates ? await sourceFilesOf(ROOT_ROUTE) : [];

/**
 * Layout routes wrapping a file: src/routes/us/faq.tsx renders inside
 * src/routes/us.tsx when that file exists.
 */
function layoutsOf(file) {
  const dirs = relative(ROUTES_DIR, file).replaceAll("\\", "/").split("/").slice(0, -1);
  return dirs
    .map((_, i) => `${ROUTES_DIR}/${dirs.slice(0, i + 1).join("/")}.tsx`)
    .filter((f) => existsSync(f));
}

const pages = new Map(); // path -> lastmod | undefined
const pageFiles = new Map(); // path -> Set of route files (a layout and its index share a path)
for (const { path: route, file } of routes) {
  if (isExcluded(route)) continue;
  const region = ARTICLE_ROUTES[route];
  if (region) {
    for (const [slug, updatedAt] of slugs[region])
      pages.set(route.replace("$slug", slug), updatedAt);
    continue;
  }
  if (isDynamic(route)) continue;
  const files = pageFiles.get(route) ?? new Set();
  for (const f of [file, ...layoutsOf(file)]) files.add(f);
  pageFiles.set(route, files);
}

for (const [route, routeFiles] of pageFiles) {
  let lastmod;
  if (gitDates) {
    const files = new Set(rootFiles);
    for (const f of routeFiles) for (const s of await sourceFilesOf(f)) files.add(s);
    lastmod = [...files]
      .map((f) => gitDates.get(f))
      .filter(Boolean)
      .sort()
      .at(-1);
  } else {
    lastmod = previous.get(`${ORIGIN}${route}`);
  }
  pages.set(route, lastmod);
}

const urls = [...pages.keys()]
  .sort()
  .map((path) => {
    const meta = PRIORITY[path] ?? { p: "0.6", c: "monthly" };
    const lastmod = pages.get(path);
    return `  <url><loc>${ORIGIN}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>${meta.c}</changefreq><priority>${meta.p}</priority></url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
mkdirSync("public", { recursive: true });
writeFileSync(OUTPUT, xml);
console.log(
  `✓ wrote ${OUTPUT} (${pages.size} urls; ${slugs.ca.length} CA + ${slugs.us.length} US articles; ` +
    `page lastmod from ${gitDates ? "git history" : "previous sitemap (shallow clone)"})`,
);
