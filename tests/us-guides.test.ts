import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { loadArticleRenderer, pageText, type Rendered } from "./lib/render-articles.ts";
// @ts-expect-error -- plain .mjs build script, no type declarations
import { loadTs } from "../scripts/lib/load-ts.mjs";

/**
 * The three US guides rewritten on 2026-11-14 to the CA article template:
 * Quick answer box, H2/H3 body, How ReceiptOne helps box (landing-site
 * features only), 4-6 FAQ items matching the FAQPage JSON-LD, irs.gov-only
 * sources, and the US disclaimer and correction line once at the end. They
 * link to each other and to /us, never to the noindexed US articles. Two
 * slugs lost their year; the old paths 301 to the new ones.
 */

type Block =
  | { type: "p"; text: string; link?: { label: string; href: string } }
  | { type: "faq"; q: string; a: string }
  | { type: "sources"; links: { label: string; href: string }[]; checked: string }
  | { type: string; text?: string };
type ArticleLike = {
  slug: string;
  title: string;
  displayTitle?: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  indexable?: boolean;
  image: { path: string; width: number; height: number; alt: string };
  body: Block[];
  quickAnswer?: string;
  receiptOneHelps?: { items: string[]; link: { label: string; href: string } };
};

const mod = await loadArticleRenderer<{
  US_ARTICLES: ArticleLike[];
  articleFaq: (a: ArticleLike) => { q: string; a: string }[];
  articleWordCount: (a: ArticleLike) => number;
  articleDisplayTitle: (a: ArticleLike) => string;
}>("us-guides-test");

const GUIDES = [
  "irs-mileage-rate-self-employed",
  "quarterly-estimated-taxes-us-freelancers",
  "self-employed-tax-deductions-us",
];
const path = (slug: string) => `/us/articles/${slug}`;
const BY_SLUG = new Map(mod.US_ARTICLES.map((a) => [a.slug, a]));
const NEW = GUIDES.map((slug) => {
  const a = BY_SLUG.get(slug);
  assert.ok(a, `${slug} is in US_ARTICLES`);
  return a;
});
const NOINDEXED = mod.US_ARTICLES.filter((a) => a.indexable === false).map((a) => a.slug);

const pages = new Map<string, Rendered>();
for (const { slug } of NEW)
  pages.set(slug, await mod.render("/us/articles/$slug", path(slug), { slug }));

const articleHtml = (page: Rendered) => /<article[\s\S]*<\/article>/.exec(page.html)?.[0] ?? "";
const unescape = (s: string) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

const US_DISCLAIMER =
  "This article is general information, not tax advice. Tax rules and amounts change; check IRS.gov or a tax professional for your situation.";

test("us guides: render, indexable, dated, 1,400-2,000 words", () => {
  assert.equal(NOINDEXED.length, 6);
  for (const a of NEW) {
    assert.ok(pages.get(a.slug)!.matched, `${a.slug} renders`);
    assert.equal(a.indexable, true, `${a.slug} is indexable`);
    assert.equal(a.publishedAt, "2026-05-20", a.slug);
    assert.equal(a.updatedAt, "2026-11-14", a.slug);
    const words = mod.articleWordCount(a);
    assert.ok(words >= 1400 && words <= 2000, `${a.slug}: ${words} words`);
  }
});

test("us guides: display titles carry no year; only the mileage SEO title has one", () => {
  const YEAR = /\b20\d{2}\b/;
  for (const a of NEW) {
    assert.doesNotMatch(mod.articleDisplayTitle(a), YEAR, a.slug);
    if (a.slug === "irs-mileage-rate-self-employed") assert.match(a.title, /\b2026\b/);
    else assert.doesNotMatch(a.title, YEAR, a.slug);
  }
});

test("us guides: Quick answer box of 2-4 sentences renders above the body", () => {
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

test("us guides: How ReceiptOne helps box, 3-5 landing-site features, before the FAQ", () => {
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
    assert.equal(helps.link.href, "/us", `${a.slug} CTA goes to /us`);
    const html = articleHtml(pages.get(a.slug)!);
    const at = html.indexOf("data-receiptone-helps");
    assert.ok(at > 0, `${a.slug} renders the box`);
    assert.ok(at < html.indexOf("Frequently Asked Questions"), `${a.slug} box sits before the FAQ`);
    const box = unescape(html.slice(at, html.indexOf("</aside>", at)));
    for (const item of helps.items) assert.ok(box.includes(item), `${a.slug} shows ${item}`);
  }
});

test("us guides: H3 sub-headings render", () => {
  for (const a of NEW) {
    assert.ok(
      a.body.some((b) => b.type === "h3"),
      `${a.slug} uses h3 blocks`,
    );
    assert.match(articleHtml(pages.get(a.slug)!), /<h3 class="mb-3 mt-8/, `${a.slug} renders h3`);
  }
});

test("us guides: 4-6 FAQ items, FAQPage JSON-LD matches the visible text", () => {
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

test("us guides: sources list irs.gov pages only; every external link is irs.gov", () => {
  for (const a of NEW) {
    const sources = a.body.filter((b) => b.type === "sources") as Extract<
      Block,
      { type: "sources" }
    >[];
    assert.equal(sources.length, 1, `${a.slug} has one sources block`);
    assert.equal(a.body.at(-1)?.type, "sources", `${a.slug} sources close the body`);
    assert.ok(sources[0].links.length >= 5, `${a.slug} cites its rules`);
    for (const { href } of sources[0].links)
      assert.match(href, /^https:\/\/www\.irs\.gov\//, `${a.slug}: ${href}`);
    assert.ok(
      sources[0].checked.endsWith(US_DISCLAIMER),
      `${a.slug} checked line ends with the disclaimer`,
    );
    const html = articleHtml(pages.get(a.slug)!);
    assert.match(html, /Sources:/, `${a.slug} renders the sources`);
    const external = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
    for (const href of external)
      assert.match(href, /^https:\/\/www\.irs\.gov\//, `${a.slug}: external link ${href}`);
  }
});

test("us guides: disclaimer and correction line once each, disclaimer last before the correction", () => {
  for (const a of NEW) {
    const text = pageText(pages.get(a.slug)!.html);
    assert.equal(text.split(US_DISCLAIMER).length - 1, 1, `${a.slug} disclaimer once`);
    const correction = "Spotted an error or something out of date?";
    assert.equal(text.split(correction).length - 1, 1, `${a.slug} correction line once`);
    const at = text.indexOf(US_DISCLAIMER);
    assert.equal(text.slice(at + US_DISCLAIMER.length, text.indexOf(correction)).trim(), "");
  }
});

test("us guides: link each other and /us, never a noindexed article", () => {
  for (const a of NEW) {
    const page = pages.get(a.slug)!;
    const all = [...page.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].split(/[?#]/)[0]);
    for (const slug of NOINDEXED)
      assert.ok(!all.includes(path(slug)), `${a.slug} links noindexed ${slug}`);
    const inArticle = new Set(
      [...articleHtml(page).matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1].replace(/\/$/, "")),
    );
    const wanted = [...GUIDES.filter((s) => s !== a.slug).map(path), "/us"];
    for (const href of wanted) assert.ok(inArticle.has(href), `${a.slug} links ${href}`);
    const guideLinks = [...inArticle].filter(
      (h) => h === "/us" || GUIDES.some((g) => h === path(g)),
    );
    assert.ok(guideLinks.length >= 3 && guideLinks.length <= 5, `${a.slug}: ${guideLinks.length}`);
    // Related cards: only the other two guides.
    const related = page.html.slice(page.html.indexOf("More guides"));
    const cards = [...related.matchAll(/href="\/us\/articles\/([a-z0-9-]+)"/g)].map((m) => m[1]);
    assert.deepEqual([...new Set(cards)].sort(), GUIDES.filter((s) => s !== a.slug).sort());
  }
});

test("us guides: no banned wording, emoji, or em-dash habit", () => {
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
    /\bkilomet(er|re)/i,
    /\borganis(e|ing|ed)\b/i,
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

test("us guides: the mileage guide quotes both 2026 business rates", () => {
  const text = pageText(articleHtml(pages.get("irs-mileage-rate-self-employed")!));
  assert.match(text, /72\.5 cents/);
  assert.match(text, /76 cents/);
  assert.match(text, /Announcement 2026-11/);
});

test("us guides: own 1280x720 hero, card and og files, credited", () => {
  const credits = readFileSync("docs/image-credits.md", "utf8");
  for (const a of NEW) {
    assert.equal(a.image.path, `/articles/${a.slug}.webp`);
    assert.equal(a.image.width, 1280);
    assert.equal(a.image.height, 720);
    assert.ok(a.image.alt.length > 0);
    for (const suffix of [".webp", "-card.webp", "-og.jpg"]) {
      const file = resolve("public/articles", `${a.slug}${suffix}`);
      assert.ok(existsSync(file) && statSync(file).size > 0, `${file} exists`);
    }
    assert.match(
      credits,
      new RegExp(`^\\| ${a.slug} \\| \`public/articles/${a.slug}\\.webp\``, "m"),
    );
  }
  for (const old of [
    "irs-mileage-rate-2025-self-employed",
    "self-employed-tax-deductions-us-2025",
  ]) {
    assert.ok(!existsSync(resolve("public/articles", `${old}.webp`)), `${old}.webp renamed`);
    assert.doesNotMatch(credits, new RegExp(`\\| ${old} \\|`));
  }
});

test("us guides: old slugs 301 to the new ones, keeping the query string", async () => {
  const { middleware, matcher } = (await loadTs(`
    import middleware, { config } from "./middleware";
    export const matcher = config.matcher;
    export { middleware };
  `)) as { middleware: (r: Request) => Response; matcher: string[] };
  const moves = {
    "/us/articles/irs-mileage-rate-2025-self-employed":
      "/us/articles/irs-mileage-rate-self-employed",
    "/us/articles/self-employed-tax-deductions-us-2025":
      "/us/articles/self-employed-tax-deductions-us",
  };
  for (const [from, to] of Object.entries(moves)) {
    assert.ok(matcher.includes(from), `${from} is in the middleware matcher`);
    const res = middleware(new Request(`https://receipt-one.com${from}?utm_source=x`));
    assert.equal(res.status, 301, from);
    assert.equal(res.headers.get("location"), `https://receipt-one.com${to}?utm_source=x`);
    assert.ok(!BY_SLUG.has(from.split("/").at(-1)!), `${from} is no longer an article`);
  }
});

test("us guides: no source file still links an old slug", () => {
  const files = [
    "src/lib/articles.us.ts",
    "src/components/site/Faq.tsx",
    "src/lib/help-center.ts",
    "public/sitemap.xml",
    "public/llms.txt",
  ];
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    assert.doesNotMatch(
      src,
      /irs-mileage-rate-2025-self-employed|self-employed-tax-deductions-us-2025/,
      f,
    );
  }
});
