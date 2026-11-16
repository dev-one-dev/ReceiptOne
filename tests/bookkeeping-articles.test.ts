import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { loadArticleRenderer, pageText, type Rendered } from "./lib/render-articles.ts";

/**
 * The five Bookkeeping articles added on 2026-11-14 (CA only), and the
 * template fields they introduced (quickAnswer, receiptOneHelps, h3 blocks).
 *
 * Each new article must render a Quick answer box, a How ReceiptOne helps box,
 * 4-6 FAQ items whose FAQPage JSON-LD matches the visible text, at least three
 * internal links that resolve to existing routes, a sources list of canada.ca
 * links only, its own three image files with alt text, and none of the banned
 * marketing phrases. The 15 existing article pages must render exactly the
 * text and head they did before the change (hashes in
 * tests/fixtures/existing-article-text.json, taken at commit 33fb4fd). The
 * 15 CA text hashes were retaken when the footer deadline strip dropped its
 * "on time until …" note: verified as the only difference on those pages.
 * The 9 US hashes were retaken when the US articles gained the closing
 * "not tax advice" line and the noindex, follow robots meta: verified as the
 * only differences, plus the reading time of irs-mileage-rate-2025-self-employed
 * (2 -> 3 min, on its page and its related card), which the added words tip over.
 * On 2026-11-14 three US guides were rewritten (tests/us-guides.test.ts) and
 * dropped from the fixture (24 -> 21). Five of the remaining US text hashes
 * were retaken: their related cards now show the rewritten guides' titles and
 * reading times, verified as the only difference; their heads are unchanged.
 * Later the same day three more US guides were rewritten and dropped (21 -> 18),
 * and the hashes of the three still-noindexed US articles were retaken: only
 * their related cards changed (new titles and reading times); heads unchanged.
 * Then the last three US guides were rewritten and dropped too (18 -> 15); the
 * 15 CA hashes that remain are unchanged.
 * On 2026-11-16 the text hash of /articles/mileage-deduction-canada-freelancers
 * was retaken after it gained one paragraph linking the free mileage log
 * template (/ca/mileage-log-template): verified as the only difference by
 * reverting that block, which restores the old hash; its head is unchanged.
 * Later on 2026-11-16 it was retaken again when the same article gained one
 * paragraph linking the rideshare and delivery drivers guide
 * (tests/driver-article.test.ts): verified the same way, head unchanged.
 * Also on 2026-11-16, track-gst-hst-business-expenses gained one paragraph
 * linking the sales tax by province guide (tests/sales-tax-article.test.ts)
 * and its updatedAt moved to 2026-11-16 so its sitemap lastmod follows; both
 * hashes retaken. Verified by reverting those two changes, which restores
 * both old hashes exactly.
 */

type Block =
  | { type: "p"; text: string; link?: { label: string; href: string } }
  | { type: "faq"; q: string; a: string }
  | { type: "sources"; links: { label: string; href: string }[]; checked: string }
  | { type: string; text?: string; items?: string[] };
type ArticleLike = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  regions?: string[];
  publishedAt: string;
  updatedAt: string;
  image: { path: string; width: number; height: number; alt: string };
  tags: string[];
  body: Block[];
  quickAnswer?: string;
  receiptOneHelps?: { items: string[]; link: { label: string; href: string } };
};

const mod = await loadArticleRenderer<{
  ARTICLES: ArticleLike[];
  US_ARTICLES: ArticleLike[];
  articleFaq: (a: ArticleLike) => { q: string; a: string }[];
  articleWordCount: (a: ArticleLike) => number;
}>("bookkeeping-articles-test");

const NEW_SLUGS = [
  "bookkeeping-self-employed-canada",
  "daily-receipt-routine",
  "month-end-bookkeeping-checklist-canada",
  "separate-business-personal-finances-canada",
  "year-end-checklist-accountant-canada",
];
const BY_SLUG = new Map(mod.ARTICLES.map((a) => [a.slug, a]));
const NEW = NEW_SLUGS.map((slug) => {
  const a = BY_SLUG.get(slug);
  assert.ok(a, `${slug} is in ARTICLES`);
  return a;
});

const pages = new Map<string, Rendered>();
for (const { slug } of NEW)
  pages.set(slug, await mod.render("/articles/$slug", `/articles/${slug}`, { slug }));

/** The <article> element of a rendered article page. */
const articleHtml = (page: Rendered) => /<article[\s\S]*<\/article>/.exec(page.html)?.[0] ?? "";
const unescape = (s: string) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

/** Page routes that exist as files, e.g. "/ca/tax-deadlines". */
function routeExists(path: string): boolean {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  const article = /^\/articles\/([a-z0-9-]+)$/.exec(clean);
  if (article) return BY_SLUG.has(article[1]);
  const base = resolve("src/routes", `.${clean}`);
  return existsSync(`${base}.tsx`) || existsSync(resolve(base, "index.tsx"));
}

test("bookkeeping articles: all five are CA-only Bookkeeping articles dated 2026-11-14", () => {
  for (const a of NEW) {
    assert.equal(a.category, "Bookkeeping", a.slug);
    assert.equal(a.regions, undefined, `${a.slug} defaults to CA only`);
    assert.equal(a.publishedAt, "2026-11-14", a.slug);
    assert.equal(a.updatedAt, "2026-11-14", a.slug);
    assert.ok(!mod.US_ARTICLES.some((u) => u.slug === a.slug), `${a.slug} is not a US article`);
    assert.ok(pages.get(a.slug)!.matched, `${a.slug} renders`);
  }
});

test("bookkeeping articles: 1,400-2,000 words each", () => {
  for (const a of NEW) {
    const words = mod.articleWordCount(a);
    assert.ok(words >= 1400 && words <= 2000, `${a.slug}: ${words} words`);
  }
});

test("bookkeeping articles: Quick answer box of 2-4 sentences renders above the body", () => {
  for (const a of NEW) {
    const qa = a.quickAnswer ?? "";
    const sentences = qa.split(/(?<=[.?!])\s+/).filter(Boolean).length;
    assert.ok(sentences >= 2 && sentences <= 4, `${a.slug}: ${sentences} sentences`);
    const html = articleHtml(pages.get(a.slug)!);
    const box = /<div data-quick-answer[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1] ?? "";
    assert.match(box, /Quick answer/, `${a.slug} labels the box`);
    assert.equal(unescape(/<p class="mt-2[^"]*">([^<]*)<\/p>/.exec(box)?.[1] ?? ""), qa);
    assert.ok(html.indexOf("data-quick-answer") < html.indexOf("<h2"), `${a.slug} box is first`);
  }
});

test("bookkeeping articles: How ReceiptOne helps box, 3-5 landing-site features, before the FAQ", () => {
  // Capabilities the landing site does not claim.
  const NOT_ON_SITE =
    /bank (sync|feed|connect)|sync(s|ing)? (with )?your bank|income tracking|track(s|ing)? (your )?income|invoic|profit and loss|P&L|share(s|d)? with your accountant|accountant access|payroll|files? your (return|taxes)/i;
  for (const a of NEW) {
    const helps = a.receiptOneHelps;
    assert.ok(helps, `${a.slug} has the box`);
    assert.ok(
      helps.items.length >= 3 && helps.items.length <= 5,
      `${a.slug}: ${helps.items.length}`,
    );
    for (const item of helps.items) assert.doesNotMatch(item, NOT_ON_SITE, `${a.slug}: ${item}`);
    assert.equal(helps.link.href, "/ca", `${a.slug} CTA goes to the landing page`);
    const html = articleHtml(pages.get(a.slug)!);
    const at = html.indexOf("data-receiptone-helps");
    assert.ok(at > 0, `${a.slug} renders the box`);
    assert.ok(at < html.indexOf("Frequently Asked Questions"), `${a.slug} box sits before the FAQ`);
    const box = html.slice(at, html.indexOf("</aside>", at));
    for (const item of helps.items)
      assert.ok(unescape(box).includes(item), `${a.slug} shows ${item}`);
    assert.ok(box.includes(`href="/ca"`), `${a.slug} box links to /ca`);
  }
});

test("bookkeeping articles: 4-6 FAQ items, FAQPage JSON-LD matches the visible text", () => {
  for (const a of NEW) {
    const faq = mod.articleFaq(a);
    assert.ok(faq.length >= 4 && faq.length <= 6, `${a.slug}: ${faq.length} FAQ items`);
    const page = pages.get(a.slug)!;
    const ld = (page.head.scripts ?? [])
      .filter((s) => s.type === "application/ld+json")
      .map((s) => JSON.parse(s.children))
      .find((j) => j["@type"] === "FAQPage");
    assert.ok(ld, `${a.slug} emits FAQPage`);
    const emitted = ld.mainEntity.map((e: { name: string; acceptedAnswer: { text: string } }) => ({
      q: e.name,
      a: e.acceptedAnswer.text,
    }));
    assert.deepEqual(emitted, faq, `${a.slug} JSON-LD equals the faq blocks`);
    const text = pageText(articleHtml(page));
    for (const { q, a: answer } of faq)
      assert.ok(text.includes(`${q} ${answer}`), `${a.slug}: ${q}`);
  }
});

test("bookkeeping articles: at least three internal links, all resolving to existing routes", () => {
  for (const a of NEW) {
    const html = articleHtml(pages.get(a.slug)!);
    const hrefs = [...html.matchAll(/<a\s[^>]*href="(\/[^"]*)"/g)].map((m) => m[1]);
    for (const href of hrefs) assert.ok(routeExists(href), `${a.slug}: ${href} is a live route`);
    const guides = new Set(hrefs.filter((h) => h !== "/ca" && h !== `/articles/${a.slug}`));
    assert.ok(guides.size >= 3, `${a.slug}: ${guides.size} internal guide links`);
    assert.ok(
      [...guides].some((h) => h.startsWith("/articles/") && !NEW_SLUGS.includes(h.slice(10))),
      `${a.slug} links an existing guide`,
    );
  }
});

test("bookkeeping articles: sources list canada.ca pages only, with the disclaimer", () => {
  for (const a of NEW) {
    const sources = a.body.filter((b) => b.type === "sources") as Extract<
      Block,
      { type: "sources" }
    >[];
    assert.equal(sources.length, 1, `${a.slug} has one sources block`);
    assert.equal(a.body.at(-1)?.type, "sources", `${a.slug} sources close the article`);
    assert.ok(sources[0].links.length > 0);
    for (const { href } of sources[0].links)
      assert.match(href, /^https:\/\/www\.canada\.ca\//, `${a.slug}: ${href}`);
    assert.match(sources[0].checked, /This is general information, not tax advice\.$/);
    const html = articleHtml(pages.get(a.slug)!);
    assert.match(html, /Sources:/, `${a.slug} renders the sources`);
    const external = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
    for (const href of external)
      assert.match(href, /^https:\/\/www\.canada\.ca\//, `${a.slug}: external link ${href}`);
  }
});

test("bookkeeping articles: no banned wording, emoji, US spelling or em-dash habit", () => {
  const BANNED = [
    /game[- ]changer/i,
    /seamless/i,
    /effortless/i,
    /hassle[- ]free/i,
    /stress[- ]free/i,
    /\bunlock/i,
    /supercharge/i,
    /in today's fast-paced world/i,
    /let's dive in/i,
    /the bottom line/i,
    /say goodbye to/i,
    /\bmost (freelancers|self-employed|people|canadians)\b/i,
    /\bkilometer/i,
    /\bcheck(s)? (book|stub)/i,
    /\p{Extended_Pictographic}/u,
  ];
  for (const a of NEW) {
    const text = [a.title, a.excerpt, a.image.alt, pageText(articleHtml(pages.get(a.slug)!))].join(
      "\n",
    );
    for (const re of BANNED) assert.doesNotMatch(text, re, `${a.slug}: ${re}`);
    const emDashes = (text.match(/—/g) ?? []).length;
    assert.ok(emDashes <= 2, `${a.slug}: ${emDashes} em-dashes`);
  }
});

test("bookkeeping articles: own 1280x720 hero, card and og files, with alt text", () => {
  for (const a of NEW) {
    assert.equal(a.image.path, `/articles/${a.slug}.webp`);
    assert.equal(a.image.width, 1280);
    assert.equal(a.image.height, 720);
    assert.ok(a.image.alt.length > 0 && a.image.alt.length < 120, `${a.slug} alt`);
    for (const suffix of [".webp", "-card.webp", "-og.jpg"]) {
      const file = resolve("public/articles", `${a.slug}${suffix}`);
      assert.ok(existsSync(file) && statSync(file).size > 0, `${file} exists`);
    }
    const html = articleHtml(pages.get(a.slug)!);
    const hero = /<img\s[^>]*src="\/articles\/[^"]+\.webp"[^>]*>/.exec(html)?.[0] ?? "";
    assert.match(hero, new RegExp(`src="/articles/${a.slug}\\.webp"`));
    assert.equal(unescape(/alt="([^"]*)"/.exec(hero)?.[1] ?? ""), a.image.alt);
    assert.doesNotMatch(pages.get(a.slug)!.html, /pixabay|picsum|unsplash/i);
  }
});

test("bookkeeping articles: listed in docs/image-credits.md", () => {
  const credits = readFileSync("docs/image-credits.md", "utf8");
  for (const slug of NEW_SLUGS)
    assert.match(
      credits,
      new RegExp(`^\\| ${slug} \\| .*pixabay\\.com/photos/.*\\| 2026-11-14 \\|$`, "m"),
    );
});

test("existing articles: rendered text and head unchanged", async () => {
  const fixture = JSON.parse(
    readFileSync("tests/fixtures/existing-article-text.json", "utf8"),
  ) as Record<string, { text: string; head: string }>;
  const sha = (s: string) => createHash("sha256").update(s).digest("hex");
  assert.equal(Object.keys(fixture).length, 15);
  // The "Spotted an error?" line (tests/correction-line.test.ts) was added to
  // every article after this fixture was taken; drop it so the hash still
  // guards the article's own text. Same for the footer's app QR block
  // (tests/app-qr.test.ts), added later still.
  const withoutCorrection = (html: string) =>
    html
      .replace(/<p[^>]*data-correction-line[^>]*>[\s\S]*?<\/p>/, "")
      .replace(/<div data-app-qr[^>]*>[\s\S]*?<\/div>/g, "");
  // Articles translated into French later gained hreflang alternates (en-CA,
  // fr-CA, x-default) in <head> only; tests/fr-articles.test.ts asserts that
  // exact set. Drop them so the hash still guards the rest of the head.
  const TRANSLATED = new Set([
    "/articles/t2125-form-guide-canada",
    "/articles/self-employed-tax-deductions-canada",
    "/articles/cra-receipt-rules-canada",
    "/articles/track-gst-hst-business-expenses",
    "/articles/mileage-deduction-canada-freelancers",
  ]);
  const withoutFrAlternates = (path: string, head: { links?: { rel: string }[] }) =>
    TRANSLATED.has(path)
      ? { ...head, links: head.links?.filter((l) => l.rel !== "alternate") }
      : head;
  for (const [path, want] of Object.entries(fixture)) {
    const us = path.startsWith("/us/");
    const slug = path.split("/").at(-1)!;
    const page = await mod.render(us ? "/us/articles/$slug" : "/articles/$slug", path, { slug });
    assert.ok(page.matched, `${path} renders`);
    assert.equal(sha(pageText(withoutCorrection(page.html))), want.text, `${path} text unchanged`);
    assert.equal(
      sha(JSON.stringify(withoutFrAlternates(path, page.head))),
      want.head,
      `${path} head unchanged`,
    );
  }
});
