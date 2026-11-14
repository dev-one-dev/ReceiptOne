import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadArticleRenderer, pageText, type Head } from "./lib/render-articles.ts";

/**
 * On-page article titles carry no year (2026-11-14): cards on the CA and US
 * indexes, the /articles contents sidebar, related-article cards, the
 * breadcrumb and the H1 read `displayTitle` through articleDisplayTitle().
 * The SEO title keeps its year: <title>, og:title, twitter:title and the
 * JSON-LD headline must equal tests/fixtures/article-seo-titles.json, which
 * was captured from the site before the change.
 */

type ArticleLike = { slug: string; title: string; displayTitle?: string };
const mod = await loadArticleRenderer<{
  ARTICLES: ArticleLike[];
  US_ARTICLES: ArticleLike[];
  getArticlesByRegion: (a: ArticleLike[], r: "ca" | "us") => ArticleLike[];
  articleDisplayTitle: (a: ArticleLike) => string;
}>("article-display-titles-test");
const SEO: Record<string, Record<string, string>> = JSON.parse(
  readFileSync("tests/fixtures/article-seo-titles.json", "utf8"),
);

const YEAR = /\b(19|20)\d{2}\b/;
const CA = mod.getArticlesByRegion(mod.ARTICLES, "ca");
const US = mod.US_ARTICLES;
const shown = mod.articleDisplayTitle;
const text = (html: string) => pageText(html);

/** Text of every element of `tag` whose class attribute includes `cls`. */
const tagTexts = (html: string, tag: string, cls = "") =>
  [...html.matchAll(new RegExp(`<${tag}(\\s[^>]*)?>([^]*?)</${tag}>`, "g"))]
    .filter((m) => (m[1] ?? "").includes(cls))
    .map((m) => text(m[2]));

/** Card titles: the h3 inside each article link card. */
const cardTitles = (html: string) =>
  [...html.matchAll(/<a[^>]*href="(?:\/us)?\/articles\/[a-z0-9-]+"[^>]*>([\s\S]*?)<\/a>/g)].flatMap(
    (m) => tagTexts(m[1], "h3"),
  );

function seoOf(head: Head) {
  const m = head.meta ?? [];
  const get = (k: string, v: string) => m.find((x) => x[k] === v)?.content;
  const ld = (head.scripts ?? []).map((s) => JSON.parse(s.children));
  return {
    title: m.find((x) => "title" in x)?.title,
    ogTitle: get("property", "og:title"),
    twitterTitle: get("name", "twitter:title"),
    headline: ld.find((j) => j.headline)?.headline,
  };
}

test("display titles: explicit, year-free, and only set where they differ", () => {
  const all = [...CA, ...US];
  for (const a of all) {
    assert.doesNotMatch(shown(a), YEAR, `${a.slug}: "${shown(a)}"`);
    if (a.displayTitle !== undefined)
      assert.notEqual(a.displayTitle, a.title, `${a.slug}: displayTitle repeats title`);
  }
  // The year stays in the SEO title of the articles that had one.
  assert.equal(all.filter((a) => YEAR.test(a.title)).length, 14);
});

for (const [region, list, route, base] of [
  ["CA", CA, "/articles/", "/articles"],
  ["US", US, "/us/articles/", "/us/articles"],
] as const) {
  test(`display titles: ${region} index cards${region === "CA" ? " and contents sidebar" : ""} show no year`, async () => {
    const page = await mod.render(route, base, {});
    assert.ok(page.matched, `${base} renders`);
    const cards = cardTitles(page.html);
    for (const a of list) assert.ok(cards.includes(shown(a)), `${base}: card for ${a.slug}`);
    for (const t of cards) assert.doesNotMatch(t, YEAR, `${base} card: "${t}"`);
    if (region === "CA") {
      const at = page.html.indexOf('aria-label="Contents"');
      assert.ok(at > 0, "contents sidebar renders");
      const nav = page.html.slice(at, page.html.indexOf("</nav>", at));
      const links = tagTexts(nav, "a").filter(Boolean);
      for (const a of list) assert.ok(links.includes(shown(a)), `sidebar: ${a.slug}`);
      for (const t of links) assert.doesNotMatch(t, YEAR, `sidebar: "${t}"`);
    }
  });

  test(`display titles: ${region} article H1, breadcrumb and related cards show no year; SEO title unchanged`, async () => {
    for (const a of list) {
      const path = `${base}/${a.slug}`;
      const page = await mod.render(`${base}/$slug`, path, { slug: a.slug });
      assert.ok(page.matched, `${path} renders`);
      const h1 = tagTexts(page.html, "h1");
      assert.deepEqual(h1, [shown(a)], `${path} H1`);
      for (const crumb of tagTexts(page.html, "nav", 'aria-label="breadcrumb"'))
        assert.doesNotMatch(crumb, YEAR, `${path} breadcrumb: "${crumb}"`);
      for (const t of cardTitles(page.html))
        assert.doesNotMatch(t, YEAR, `${path} related card: "${t}"`);
      assert.deepEqual(seoOf(page.head), SEO[path], `${path} SEO title`);
    }
    // The fixture covers exactly the articles rendered in this region.
    assert.deepEqual(
      Object.keys(SEO)
        .filter((p) => p.startsWith(`${base}/`))
        .sort(),
      list.map((a) => `${base}/${a.slug}`).sort(),
    );
  });
}
