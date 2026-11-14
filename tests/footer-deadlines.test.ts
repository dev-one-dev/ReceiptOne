import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * The footer's CRA deadline strip only renders when the page passes the
 * server's clock (`now`, from getServerNow in the route loader). A Canadian or
 * French page that renders <Footer> without it silently loses the strip, so
 * every <Footer> on the landing site must either pass `now` or be a US footer
 * (region="us", where the strip never shows).
 */

/** <Footer> usages deliberately without `now`, with the reason. */
const EXEMPT: Record<string, string> = {
  // The root not-found page: the root route has no loader, and adding one
  // would run on every navigation for every route.
  "src/routes/__root.tsx": "root 404 page",
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : [];
  });
}

test("footer: every CA/FR <Footer> passes the server's now (deadline strip)", () => {
  const files = [...walk("src/routes"), ...walk("src/components/site")];
  const missing: string[] = [];
  let checked = 0;
  for (const file of files) {
    const rel = file.replaceAll("\\", "/");
    if (EXEMPT[rel]) continue;
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/<Footer\b[^>]*\/>/g)) {
      checked++;
      const tag = m[0];
      if (/region="us"/.test(tag) || /\bnow=\{/.test(tag)) continue;
      missing.push(`${rel}: ${tag}`);
    }
  }
  assert.ok(checked > 10, `expected to find the site's <Footer> usages, found ${checked}`);
  assert.deepEqual(missing, [], "CA/FR footers without now= (no deadline strip)");
});
