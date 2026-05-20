#!/usr/bin/env node
/**
 * Compares src/routes/*.tsx against src/routeTree.gen.ts and exits non-zero
 * on divergence. Runs automatically before `vite build` via the `prebuild`
 * npm script. Run manually with `bun run check:routes`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = "src/routes";
const TREE_FILE = "src/routeTree.gen.ts";

/** Convert a route filename like "posts.$postId.tsx" -> "/posts/$postId". */
function fileToRoutePath(name) {
  const base = name.replace(/\.(t|j)sx?$/, "");
  if (base === "index") return "/";
  if (base === "__root") return null;
  // Flat dot-separated → slash-separated; index suffix handled.
  const segments = base.split(".").filter((s) => s !== "index");
  if (segments.length === 0) return "/";
  return "/" + segments.join("/");
}

function collectRouteFiles(dir, prefix = "") {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      // Server-only API routes shouldn't appear in the page route tree.
      if (entry === "api") continue;
      out.push(...collectRouteFiles(full, prefix ? `${prefix}.${entry}` : entry));
    } else if (/\.(t|j)sx?$/.test(entry)) {
      const name = prefix ? `${prefix}.${entry}` : entry;
      const path = fileToRoutePath(name);
      if (path !== null) out.push(path);
    }
  }
  return out;
}

function extractTreeRoutes(source) {
  // Handles both single-line and multi-line fullPaths union formats that the
  // TanStack router plugin can emit depending on version.
  const block = source.match(/fullPaths:([\s\S]*?)(?=\s+fileRoutesByTo\s*:)/);
  if (!block) throw new Error(`Could not find fullPaths union in ${TREE_FILE}`);
  const paths = [];
  const re = /'([^']+)'/g;
  let m;
  while ((m = re.exec(block[1])) !== null) {
    // Normalize trailing slash so "articles/" and "articles" compare equal.
    const p = m[1] === "/" ? "/" : m[1].replace(/\/$/, "");
    paths.push(p);
  }
  return paths;
}

const fileRoutes = new Set(collectRouteFiles(ROUTES_DIR));
const treeRoutes = new Set(extractTreeRoutes(readFileSync(TREE_FILE, "utf8")));

const missingInTree = [...fileRoutes].filter((p) => !treeRoutes.has(p));
const orphanInTree = [...treeRoutes].filter((p) => !fileRoutes.has(p));

if (missingInTree.length === 0 && orphanInTree.length === 0) {
  console.log(`✓ routeTree.gen.ts is in sync (${fileRoutes.size} routes)`);
  process.exit(0);
}

console.error("✗ routeTree.gen.ts is out of sync with src/routes/");
if (missingInTree.length) {
  console.error("  Missing in routeTree.gen.ts:", missingInTree.join(", "));
}
if (orphanInTree.length) {
  console.error("  Stale entries in routeTree.gen.ts:", orphanInTree.join(", "));
}
console.error("\nFix: restart `vite dev` (the router plugin regenerates the tree).");
process.exit(1);
