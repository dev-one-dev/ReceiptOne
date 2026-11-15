import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { loadArticleRenderer, pageText, type Head } from "./lib/render-articles.ts";
// @ts-expect-error -- plain .mjs build script, no type declarations
import { generateSitemap, OUTPUT } from "../scripts/generate-sitemap.mjs";

/**
 * Most US articles are kept out of search for now: six US article pages and
 * /us/articles emit <meta name="robots" content="noindex, follow">
 * (per-article `indexable: false` and US_ARTICLES_INDEX_INDEXABLE in
 * src/lib/articles.us.ts), and none of them is in the sitemap or llms.txt.
 * The three guides rewritten on 2026-11-14 (INDEXABLE_US below) are indexable
 * and listed in the sitemap. CA articles and every other page stay indexable. Each US article ends with
 * the US "not tax advice" line, once, before the correction line.
 */

type Article = { slug: string; indexable?: boolean };
const mod = await loadArticleRenderer<{
  ARTICLES: Article[];
  US_ARTICLES: Article[];
}>("us-noindex-test");

const US_DISCLAIMER =
  "This article is general information, not tax advice. Tax rules and amounts change; check IRS.gov or a tax professional for your situation.";

/** US articles returned to the index after their rewrite. */
const INDEXABLE_US = [
  "irs-mileage-rate-self-employed",
  "quarterly-estimated-taxes-us-freelancers",
  "self-employed-tax-deductions-us",
];

const robots = (head: Head) => (head.meta ?? []).filter((m) => m.name === "robots");

test("noindex: six US articles and /us/articles are noindex, follow; the three guides are not", async () => {
  assert.equal(mod.US_ARTICLES.length, 9);
  for (const a of mod.US_ARTICLES) {
    const indexable = INDEXABLE_US.includes(a.slug);
    assert.equal(a.indexable, indexable, `${a.slug} carries indexable: ${indexable}`);
    const path = `/us/articles/${a.slug}`;
    const page = await mod.render("/us/articles/$slug", path, { slug: a.slug });
    assert.ok(page.matched, `${path} renders`);
    assert.deepEqual(
      robots(page.head),
      indexable ? [] : [{ name: "robots", content: "noindex, follow" }],
      path,
    );
    assert.ok(
      (page.head.links ?? []).some(
        (l) => l.rel === "canonical" && l.href === `https://receipt-one.com${path}`,
      ),
      `${path} keeps its self canonical`,
    );
  }
  const index = await mod.render("/us/articles/", "/us/articles", {});
  assert.ok(index.matched);
  assert.deepEqual(robots(index.head), [{ name: "robots", content: "noindex, follow" }]);
  assert.ok(
    (index.head.links ?? []).some(
      (l) => l.rel === "canonical" && l.href === "https://receipt-one.com/us/articles",
    ),
  );
});

test("noindex: no CA article or the CA articles index carries a robots meta", async () => {
  assert.ok(mod.ARTICLES.length > 0);
  for (const a of mod.ARTICLES) {
    assert.notEqual(a.indexable, false, `${a.slug} is indexable`);
    const path = `/articles/${a.slug}`;
    const page = await mod.render("/articles/$slug", path, { slug: a.slug });
    assert.ok(page.matched, `${path} renders`);
    assert.deepEqual(robots(page.head), [], path);
  }
  const index = await mod.render("/articles/", "/articles", {});
  assert.ok(index.matched);
  assert.deepEqual(robots(index.head), []);
});

test("noindex: no other route emits noindex", () => {
  // Allowed: the US article routes (flag-driven), the article 404 branches,
  // and the /r referral redirect.
  const allowed = new Set([
    "src/routes/us/articles/$slug.tsx",
    "src/routes/us/articles/index.tsx",
    "src/routes/articles/$slug.tsx",
    "src/routes/r/$code.tsx",
  ]);
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      const full = join(dir, e);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(e)) files.push(full.replaceAll("\\", "/"));
    }
  };
  walk("src/routes");
  for (const f of files) {
    if (allowed.has(f)) continue;
    const src = readFileSync(f, "utf8");
    assert.doesNotMatch(src, /noindex|NOINDEX_FOLLOW|noIndex:\s*true/i, `${f} emits no noindex`);
  }
  // The CA article route only uses noindex on its 404 branch.
  const ca = readFileSync("src/routes/articles/$slug.tsx", "utf8");
  assert.equal(ca.match(/noindex/gi)?.length, 1);
  assert.doesNotMatch(ca, /NOINDEX_FOLLOW/);
});

test("noindex: sitemap has no noindexed URL, every CA article and the three US guides", async () => {
  const { xml } = await generateSitemap();
  const committed = readFileSync(OUTPUT, "utf8").replaceAll("\r\n", "\n");
  assert.equal(committed, xml);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(!locs.includes("https://receipt-one.com/us/articles"), "/us/articles left out");
  for (const a of mod.US_ARTICLES)
    assert.equal(
      locs.includes(`https://receipt-one.com/us/articles/${a.slug}`),
      INDEXABLE_US.includes(a.slug),
      `${a.slug} listed only if indexable`,
    );
  assert.equal(locs.filter((l) => l.includes("/us/articles")).length, INDEXABLE_US.length);
  for (const a of mod.ARTICLES)
    assert.ok(locs.includes(`https://receipt-one.com/articles/${a.slug}`), `${a.slug} listed`);
  assert.ok(locs.includes("https://receipt-one.com/articles"));
});

test("noindex: llms.txt does not list /us/articles", () => {
  const llms = readFileSync("public/llms.txt", "utf8");
  assert.doesNotMatch(llms, /\/us\/articles/);
  assert.match(llms, /https:\/\/receipt-one\.com\/articles\)/);
});

test("disclaimer: every US article ends with the US line once, before the correction line", async () => {
  for (const a of mod.US_ARTICLES) {
    const path = `/us/articles/${a.slug}`;
    const page = await mod.render("/us/articles/$slug", path, { slug: a.slug });
    const text = pageText(page.html);
    assert.equal(text.split(US_DISCLAIMER).length - 1, 1, `${path} shows the disclaimer once`);
    const at = text.indexOf(US_DISCLAIMER);
    const correction = text.indexOf("Spotted an error or something out of date?");
    assert.ok(correction > at, `${path}: correction line follows the disclaimer`);
    assert.ok(
      text.slice(at + US_DISCLAIMER.length, correction).trim() === "",
      `${path}: nothing between the disclaimer and the correction line`,
    );
  }
  for (const a of mod.ARTICLES.slice(0, 3)) {
    const path = `/articles/${a.slug}`;
    const page = await mod.render("/articles/$slug", path, { slug: a.slug });
    assert.ok(!pageText(page.html).includes(US_DISCLAIMER), `${path} has no US disclaimer`);
  }
});
