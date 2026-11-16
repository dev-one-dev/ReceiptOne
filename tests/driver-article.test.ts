import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { loadArticleRenderer, pageText, type Rendered } from "./lib/render-articles.ts";

/**
 * The rideshare and delivery drivers guide added on 2026-11-16 (CA only,
 * Mileage & Auto, src/lib/articles.drivers.ts). Same standard as the
 * Bookkeeping articles (tests/bookkeeping-articles.test.ts): Quick answer,
 * How ReceiptOne helps box with landing-site features only, 4-6 FAQ items
 * matching the FAQPage JSON-LD, internal links that resolve, canada.ca-only
 * sources with the disclaimer, no banned wording, its own image files and
 * credit. Plus its placement: /articles Part 04, one link from /ca/drivers,
 * one from the mileage pillar, and a sitemap entry dated 2026-11-16.
 */

type Block =
  | { type: "p"; text: string; link?: { label: string; href: string } }
  | { type: "faq"; q: string; a: string }
  | { type: "sources"; links: { label: string; href: string }[]; checked: string }
  | { type: string; text?: string; items?: string[] };
type ArticleLike = {
  slug: string;
  title: string;
  displayTitle?: string;
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
}>("driver-article-test");

const SLUG = "tax-deductions-rideshare-delivery-drivers-canada";
const PATH = `/articles/${SLUG}`;
const BY_SLUG = new Map(mod.ARTICLES.map((a) => [a.slug, a]));
const a = BY_SLUG.get(SLUG)!;
const page: Rendered = await mod.render("/articles/$slug", PATH, { slug: SLUG });

const articleHtml = (p: Rendered) => /<article[\s\S]*<\/article>/.exec(p.html)?.[0] ?? "";
const unescape = (s: string) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
const html = articleHtml(page);
const text = pageText(html);

function routeExists(path: string): boolean {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  const art = /^\/articles\/([a-z0-9-]+)$/.exec(clean);
  if (art) return BY_SLUG.has(art[1]);
  const base = resolve("src/routes", `.${clean}`);
  return existsSync(`${base}.tsx`) || existsSync(resolve(base, "index.tsx"));
}

test("driver guide: CA-only Mileage & Auto article dated 2026-11-16, year only in the SEO title", () => {
  assert.ok(a, "in ARTICLES");
  assert.equal(a.category, "Mileage & Auto");
  assert.equal(a.regions, undefined, "defaults to CA only");
  assert.equal(a.publishedAt, "2026-11-16");
  assert.equal(a.updatedAt, "2026-11-16");
  assert.ok(!mod.US_ARTICLES.some((u) => u.slug === SLUG), "not a US article");
  assert.ok(page.matched, "renders");
  assert.equal(a.displayTitle, "Tax Deductions for Rideshare and Delivery Drivers in Canada");
  assert.match(
    a.title,
    /^Tax Deductions for Rideshare and Delivery Drivers in Canada \(2026 Guide\)$/,
  );
});

test("driver guide: 1,400-2,000 words", () => {
  const words = mod.articleWordCount(a);
  assert.ok(words >= 1400 && words <= 2000, `${words} words`);
});

test("driver guide: Quick answer box of 2-4 sentences renders above the body", () => {
  const qa = a.quickAnswer ?? "";
  const sentences = qa.split(/(?<=[.?!])\s+/).filter(Boolean).length;
  assert.ok(sentences >= 2 && sentences <= 4, `${sentences} sentences`);
  const box = /<div data-quick-answer[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1] ?? "";
  assert.match(box, /Quick answer/);
  assert.equal(unescape(/<p class="mt-2[^"]*">([^<]*)<\/p>/.exec(box)?.[1] ?? ""), qa);
  assert.ok(html.indexOf("data-quick-answer") < html.indexOf("<h2"), "box is first");
});

test("driver guide: How ReceiptOne helps box, 3-5 landing-site features, before the FAQ", () => {
  const NOT_ON_SITE =
    /bank (sync|feed|connect)|sync(s|ing)? (with )?your bank|income tracking|track(s|ing)? (your )?income|invoic|profit and loss|P&L|share(s|d)? with your accountant|accountant access|payroll|files? your (return|taxes)|mileage rate|per-kilometre/i;
  const helps = a.receiptOneHelps!;
  assert.ok(helps, "has the box");
  assert.ok(helps.items.length >= 3 && helps.items.length <= 5, `${helps.items.length}`);
  for (const item of helps.items) assert.doesNotMatch(item, NOT_ON_SITE, item);
  assert.equal(helps.link.href, "/ca/drivers", "CTA goes to the drivers landing page");
  const at = html.indexOf("data-receiptone-helps");
  assert.ok(at > 0, "renders the box");
  assert.ok(at < html.indexOf("Frequently Asked Questions"), "box sits before the FAQ");
  const box = html.slice(at, html.indexOf("</aside>", at));
  for (const item of helps.items) assert.ok(unescape(box).includes(item), item);
  assert.ok(box.includes(`href="/ca/drivers"`), "box links to /ca/drivers");
});

test("driver guide: 4-6 FAQ items, FAQPage JSON-LD matches the visible text", () => {
  const faq = mod.articleFaq(a);
  assert.ok(faq.length >= 4 && faq.length <= 6, `${faq.length} FAQ items`);
  const ld = (page.head.scripts ?? [])
    .filter((s) => s.type === "application/ld+json")
    .map((s) => JSON.parse(s.children))
    .find((j) => j["@type"] === "FAQPage");
  assert.ok(ld, "emits FAQPage");
  const emitted = ld.mainEntity.map((e: { name: string; acceptedAnswer: { text: string } }) => ({
    q: e.name,
    a: e.acceptedAnswer.text,
  }));
  assert.deepEqual(emitted, faq);
  for (const { q, a: answer } of faq) assert.ok(text.includes(`${q} ${answer}`), q);
});

test("driver guide: links the mileage and deductions guides, the template and deadlines; all resolve", () => {
  const hrefs = [...html.matchAll(/<a\s[^>]*href="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const href of hrefs) assert.ok(routeExists(href), `${href} is a live route`);
  for (const want of [
    "/articles/mileage-deduction-canada-freelancers",
    "/articles/self-employed-tax-deductions-canada",
    "/articles/t2125-form-guide-canada",
    "/ca/mileage-log-template",
    "/ca/tax-deadlines",
  ])
    assert.ok(hrefs.includes(want), `links ${want}`);
});

test("driver guide: sources list canada.ca pages only, with the disclaimer", () => {
  const sources = a.body.filter((b) => b.type === "sources") as Extract<
    Block,
    { type: "sources" }
  >[];
  assert.equal(sources.length, 1);
  assert.equal(a.body.at(-1)?.type, "sources", "sources close the article");
  for (const { href } of sources[0].links) assert.match(href, /^https:\/\/www\.canada\.ca\//);
  assert.match(sources[0].checked, /This is general information, not tax advice\.$/);
  assert.match(html, /Sources:/);
  const external = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  for (const href of external) assert.match(href, /^https:\/\/www\.canada\.ca\//, href);
  // The ride-sharing GST/HST rule is sourced to the CRA pages that state it.
  const hrefs = sources[0].links.map((l) => l.href);
  assert.ok(
    hrefs.some((h) => h.includes("/gi-196/")),
    "cites GI-196",
  );
  assert.ok(
    hrefs.some((h) => h.endsWith("/sharing-economy.html")),
    "cites the sharing economy page",
  );
  assert.match(text, /\$30,000 does not apply/);
  assert.match(text, /\$20 × 13 ÷ 113/);
});

test("driver guide: no banned wording, emoji, US spelling or em-dash habit", () => {
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
    /\bmost (freelancers|self-employed|people|canadians|drivers)\b/i,
    /\bkilometer/i,
    /\bcheck(s)? (book|stub)/i,
    /\blicense\b/i,
    /\p{Extended_Pictographic}/u,
  ];
  const all = [a.title, a.excerpt, a.image.alt, text].join("\n");
  for (const re of BANNED) assert.doesNotMatch(all, re, String(re));
  const emDashes = (all.match(/—/g) ?? []).length;
  assert.ok(emDashes <= 2, `${emDashes} em-dashes`);
});

test("driver guide: own 1280x720 hero, card and og files, with alt text and credit", () => {
  assert.equal(a.image.path, `/articles/${SLUG}.webp`);
  assert.equal(a.image.width, 1280);
  assert.equal(a.image.height, 720);
  assert.ok(a.image.alt.length > 0 && a.image.alt.length < 120);
  for (const suffix of [".webp", "-card.webp", "-og.jpg"]) {
    const file = resolve("public/articles", `${SLUG}${suffix}`);
    assert.ok(existsSync(file) && statSync(file).size > 0, `${file} exists`);
  }
  const hero = /<img\s[^>]*src="\/articles\/[^"]+\.webp"[^>]*>/.exec(html)?.[0] ?? "";
  assert.match(hero, new RegExp(`src="/articles/${SLUG}\\.webp"`));
  assert.equal(unescape(/alt="([^"]*)"/.exec(hero)?.[1] ?? ""), a.image.alt);
  assert.doesNotMatch(page.html, /pixabay|picsum|unsplash/i);
  const others = mod.ARTICLES.filter((o) => o.slug !== SLUG).map((o) => o.image.path);
  assert.ok(!others.includes(a.image.path), "photo not shared with another article");
  const credits = readFileSync("docs/image-credits.md", "utf8");
  assert.match(
    credits,
    new RegExp(`^\\| ${SLUG} \\| .*pixabay\\.com/photos/.*\\| 2026-11-16 \\|$`, "m"),
  );
  const ids = [...credits.matchAll(/\| (\d+) \| [^|]+ \| \d{4}-\d{2}-\d{2} \|$/gm)].map(
    (m) => m[1],
  );
  assert.equal(new Set(ids).size, ids.length, "no Pixabay image used twice");
});

test("driver guide: in /articles Part 04, linked from /ca/drivers and the mileage pillar", async () => {
  const parts = readFileSync("src/lib/articles.parts.ts", "utf8");
  const mileage = /id: "mileage"[\s\S]*?slugs: \[([\s\S]*?)\]/.exec(parts)?.[1] ?? "";
  assert.ok(mileage.includes(`"${SLUG}"`), "listed in Part 04");

  const hub = await mod.render("/articles/", "/articles", {});
  const at = hub.html.indexOf('data-part="mileage"');
  const next = hub.html.indexOf('data-part="compare"');
  assert.ok(at > 0 && next > at);
  assert.ok(hub.html.slice(at, next).includes(`href="${PATH}"`), "card in Part 04 on /articles");

  const pillar = await mod.render(
    "/articles/$slug",
    "/articles/mileage-deduction-canada-freelancers",
    { slug: "mileage-deduction-canada-freelancers" },
  );
  const pillarLinks = articleHtml(pillar).split(`href="${PATH}"`).length - 1;
  assert.equal(pillarLinks, 1, "one link from the mileage pillar body");

  // /ca/drivers needs its server loader, which this renderer does not run, so
  // read the route source: exactly one typed Link to the article.
  const drivers = readFileSync("src/routes/ca/drivers.tsx", "utf8");
  assert.equal(drivers.split(`slug: "${SLUG}"`).length - 1, 1, "one link from /ca/drivers");
  assert.match(
    drivers,
    new RegExp(`<Link\\s+to="/articles/\\$slug"\\s+params=\\{\\{ slug: "${SLUG}" \\}\\}`),
  );
});

test("driver guide: sitemap lists it, /articles and /ca/drivers with lastmod 2026-11-16", () => {
  const xml = readFileSync("public/sitemap.xml", "utf8");
  for (const path of [PATH, "/articles", "/ca/drivers"])
    assert.match(
      xml,
      new RegExp(`<loc>https://receipt-one\\.com${path}</loc><lastmod>2026-11-16</lastmod>`),
      path,
    );
});
