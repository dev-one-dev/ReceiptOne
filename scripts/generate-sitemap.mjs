#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from src/routes/*.tsx so new pages are
 * indexed without manual edits. Runs in `prebuild`.
 */
import { readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ORIGIN = process.env.SITE_ORIGIN || "https://receipt-one.com";
const ROUTES_DIR = "src/routes";
const OUTPUT = "public/sitemap.xml";

const PRIORITY = {
  "/": { p: "1.0", c: "weekly" },
  "/ca": { p: "0.9", c: "weekly" },
  "/us": { p: "0.9", c: "weekly" },
  "/terms": { p: "0.3", c: "monthly" },
  "/privacy": { p: "0.3", c: "monthly" },
};

/** Routes excluded from sitemap (noindex or non-public). */
const EXCLUDE = new Set(["/login", "/signup"]);

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

const routes = collect(ROUTES_DIR);
const lastmod = new Date().toISOString().split("T")[0];
const urls = routes
  .filter((p) => !EXCLUDE.has(p))
  .sort()
  .map((path) => {
    const meta = PRIORITY[path] ?? { p: "0.6", c: "monthly" };
    return `  <url><loc>${ORIGIN}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${meta.c}</changefreq><priority>${meta.p}</priority></url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
mkdirSync("public", { recursive: true });
writeFileSync(OUTPUT, xml);
console.log(`✓ wrote ${OUTPUT} (${routes.length} routes)`);
