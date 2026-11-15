import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadArticleRenderer, pageText, type Head } from "./lib/render-articles.ts";

/**
 * Hyphenated form names in visible article titles (H1, card titles) are kept
 * on one line by a whitespace-nowrap span (2026-11-14), the same technique as
 * the footer deadline strip. Display only: the stored title, <title>,
 * og:title and JSON-LD headline are unchanged.
 */

type ArticleLike = { slug: string; title: string; displayTitle?: string };
const mod = await loadArticleRenderer<{
  US_ARTICLES: ArticleLike[];
  articleDisplayTitle: (a: ArticleLike) => string;
}>("form-name-nowrap-test");
const SEO: Record<string, Record<string, string>> = JSON.parse(
  readFileSync("tests/fixtures/article-seo-titles.json", "utf8"),
);

const SLUG = "1099-contractor-tax-guide-us";
const PATH = `/us/articles/${SLUG}`;
const TITLE = "Getting Paid as a 1099 Contractor: Forms 1099-NEC, 1099-K and W-9";

const h1Of = (html: string) => html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
const nowrap = (word: string) => `<span class="whitespace-nowrap">${word}</span>`;

test("form names: stored title unchanged", () => {
  const a = mod.US_ARTICLES.find((x) => x.slug === SLUG);
  assert.ok(a);
  assert.equal(a.title, TITLE);
});

test("form names: 1099 guide H1 wraps 1099-NEC, 1099-K and W-9 in nowrap spans", async () => {
  const page = await mod.render("/us/articles/$slug", PATH, { slug: SLUG });
  assert.ok(page.matched, `${PATH} renders`);
  const h1 = h1Of(page.html);
  assert.ok(h1.includes(nowrap("1099-NEC,")), `H1 has nowrap 1099-NEC: ${h1}`);
  assert.ok(h1.includes(nowrap("1099-K")), `H1 has nowrap 1099-K: ${h1}`);
  assert.ok(h1.includes(nowrap("W-9")), `H1 has nowrap W-9: ${h1}`);
  // "1099" with no hyphen and ordinary words are left as plain text.
  assert.ok(h1.includes("Getting Paid as a 1099 Contractor: Forms "), h1);
  assert.equal(pageText(h1), TITLE);
});

test("form names: <title>, og:title and JSON-LD headline unchanged", async () => {
  const page = await mod.render("/us/articles/$slug", PATH, { slug: SLUG });
  const head: Head = page.head;
  const meta = head.meta ?? [];
  const title = meta.find((x) => "title" in x)?.title;
  assert.equal(title, SEO[PATH].title);
  assert.ok(!String(title).includes("<span"), "no markup in <title>");
  assert.equal(meta.find((x) => x.property === "og:title")?.content, SEO[PATH].ogTitle);
  const ld = (head.scripts ?? []).map((s) => JSON.parse(s.children));
  assert.equal(ld.find((j) => j.headline)?.headline, SEO[PATH].headline);
});

test("form names: US index card title carries the nowrap spans", async () => {
  const page = await mod.render("/us/articles/", "/us/articles", {});
  assert.ok(page.matched);
  const card = page.html.match(
    new RegExp(`<a[^>]*href="${PATH}"[^>]*>[\\s\\S]*?<h3[^>]*>([\\s\\S]*?)</h3>`),
  )?.[1];
  assert.ok(card, "card renders");
  assert.ok(card.includes(nowrap("1099-K")), card);
  assert.ok(!/<span[^>]*>(Self-Employed|Getting)/.test(page.html), "plain words not wrapped");
});
