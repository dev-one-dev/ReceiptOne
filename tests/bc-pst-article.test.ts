import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { loadArticleRenderer, pageText, type Rendered } from "./lib/render-articles.ts";

/**
 * The B.C. PST guide added on 2026-11-16 (CA only, GST / HST,
 * src/lib/articles.bc-pst.ts). Same standard as the sales tax by province
 * guide (tests/sales-tax-article.test.ts): Quick answer, How ReceiptOne helps
 * box with landing-site features only, 4-6 FAQ items matching the FAQPage
 * JSON-LD, internal links that resolve, sources with the disclaimer, no banned
 * wording, its own image files and credit. Specific to this one: sources only
 * on www2.gov.bc.ca and www.canada.ca, and the small seller criteria from
 * Bulletin PST 003. Placement: /articles Part 01, one link from the sales tax
 * by province guide, sitemap entries dated 2026-11-16.
 */

type Block =
  | { type: "p"; text: string; link?: { label: string; href: string } }
  | { type: "faq"; q: string; a: string }
  | { type: "sources"; links: { label: string; href: string }[]; checked: string }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] }
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
}>("bc-pst-article-test");

const SLUG = "bc-pst-self-employed";
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

/** Official government sites only: B.C. (www2.gov.bc.ca) and the CRA (www.canada.ca). */
const OFFICIAL = /^https:\/\/(www2\.gov\.bc\.ca|www\.canada\.ca)\//;

function routeExists(path: string): boolean {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  const art = /^\/articles\/([a-z0-9-]+)$/.exec(clean);
  if (art) return BY_SLUG.has(art[1]);
  const base = resolve("src/routes", `.${clean}`);
  return existsSync(`${base}.tsx`) || existsSync(resolve(base, "index.tsx"));
}

test("B.C. PST guide: CA-only GST / HST article dated 2026-11-16, year only in the SEO title", () => {
  assert.ok(a, "in ARTICLES");
  assert.equal(a.category, "GST / HST");
  assert.equal(a.regions, undefined, "defaults to CA only");
  assert.equal(a.publishedAt, "2026-11-16");
  assert.equal(a.updatedAt, "2026-11-16");
  assert.ok(!mod.US_ARTICLES.some((u) => u.slug === SLUG), "not a US article");
  assert.ok(page.matched, "renders");
  assert.equal(
    a.displayTitle,
    "BC PST for the Self-Employed: When to Register and What to Charge",
  );
  assert.equal(
    a.title,
    "BC PST for the Self-Employed: When to Register and What to Charge (2026 Guide)",
  );
});

test("B.C. PST guide: 1,400-2,000 words", () => {
  assert.ok(!a.body.some((b) => b.type === "table"), "no table to discount");
  const words = mod.articleWordCount(a);
  assert.ok(words >= 1400 && words <= 2000, `${words} words`);
});

test("B.C. PST guide: Quick answer box of 2-4 sentences renders above the body", () => {
  const qa = a.quickAnswer ?? "";
  const sentences = qa.split(/(?<=[.?!])\s+/).filter(Boolean).length;
  assert.ok(sentences >= 2 && sentences <= 4, `${sentences} sentences`);
  const box = /<div data-quick-answer[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1] ?? "";
  assert.match(box, /Quick answer/);
  assert.equal(unescape(/<p class="mt-2[^"]*">([^<]*)<\/p>/.exec(box)?.[1] ?? ""), qa);
  assert.ok(html.indexOf("data-quick-answer") < html.indexOf("<h2"), "box is first");
});

test("B.C. PST guide: small seller criteria from Bulletin PST 003, rates and the paused expansion", () => {
  for (const re of [
    /\$10,000 or less in gross revenue from all retail sales of eligible goods, software and services in the previous 12 months/,
    /do not maintain established business premises and do not regularly make retail sales from established commercial premises/,
    /four or more times in 12 months/,
    /not sold goods at wholesale in the previous 12 months/,
    /The general rate is 7%/,
    /5% GST and 7% PST/,
    /is paused/,
    /September 21, 2026/,
    /Unlike the GST\/HST, there are no PST input tax credits provided on goods purchased by a business\./,
    /Casual Remittance Return \(FIN 405\)/,
    /eTaxBC/,
  ])
    assert.match(text, re, String(re));
  const sources = a.body.find((b) => b.type === "sources") as Extract<Block, { type: "sources" }>;
  assert.ok(sources.links.some((l) => l.href.endsWith("/pst-003-small-sellers.pdf")), "cites PST 003");
});

test("B.C. PST guide: How ReceiptOne helps box, 3-5 landing-site features, before the FAQ", () => {
  const NOT_ON_SITE =
    /bank (sync|feed|connect)|sync(s|ing)? (with )?your bank|income tracking|track(s|ing)? (your )?income|invoic|profit and loss|P&L|share(s|d)? with your accountant|accountant access|payroll|files? your (return|taxes)|charges? (the )?(right|correct) (tax|rate)/i;
  const helps = a.receiptOneHelps!;
  assert.ok(helps, "has the box");
  assert.ok(helps.items.length >= 3 && helps.items.length <= 5, `${helps.items.length}`);
  for (const item of helps.items) assert.doesNotMatch(item, NOT_ON_SITE, item);
  assert.equal(helps.link.href, "/ca", "CTA goes to the landing page");
  const at = html.indexOf("data-receiptone-helps");
  assert.ok(at > 0, "renders the box");
  assert.ok(at < html.indexOf("Frequently Asked Questions"), "box sits before the FAQ");
  const box = html.slice(at, html.indexOf("</aside>", at));
  for (const item of helps.items) assert.ok(unescape(box).includes(item), item);
});

test("B.C. PST guide: 4-6 FAQ items, FAQPage JSON-LD matches the visible text", () => {
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

test("B.C. PST guide: links the province, receipt-rules guides; all resolve", () => {
  const hrefs = [...html.matchAll(/<a\s[^>]*href="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const href of hrefs) assert.ok(routeExists(href), `${href} is a live route`);
  for (const want of [
    "/articles/sales-tax-by-province-self-employed-canada",
    "/articles/cra-receipt-rules-canada",
  ])
    assert.ok(hrefs.includes(want), `links ${want}`);
});

test("B.C. PST guide: sources on official government sites only, with the disclaimer", () => {
  const sources = a.body.filter((b) => b.type === "sources") as Extract<
    Block,
    { type: "sources" }
  >[];
  assert.equal(sources.length, 1);
  assert.equal(a.body.at(-1)?.type, "sources", "sources close the article");
  for (const { href } of sources[0].links) assert.match(href, OFFICIAL, href);
  assert.match(sources[0].checked, /This is general information, not tax advice\.$/);
  assert.match(html, /Sources:/);
  const external = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  for (const href of external) assert.match(href, OFFICIAL, href);
  const hosts = new Set(sources[0].links.map((l) => new URL(l.href).hostname));
  assert.deepEqual([...hosts].sort(), ["www.canada.ca", "www2.gov.bc.ca"]);
});

test("B.C. PST guide: no banned wording, emoji, US spelling or em-dash habit", () => {
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

test("B.C. PST guide: own 1280x720 hero, card and og files, with alt text and credit", () => {
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

test("B.C. PST guide: in /articles Part 01, linked once from the sales tax by province guide", async () => {
  const parts = readFileSync("src/lib/articles.parts.ts", "utf8");
  const filing = /id: "filing"[\s\S]*?slugs: \[([\s\S]*?)\]/.exec(parts)?.[1] ?? "";
  assert.ok(filing.includes(`"${SLUG}"`), "listed in Part 01");

  const hub = await mod.render("/articles/", "/articles", {});
  const at = hub.html.indexOf('data-part="filing"');
  const next = hub.html.indexOf('data-part="bookkeeping"');
  assert.ok(at > 0 && next > at);
  assert.ok(hub.html.slice(at, next).includes(`href="${PATH}"`), "card in Part 01 on /articles");

  const prov = await mod.render(
    "/articles/$slug",
    "/articles/sales-tax-by-province-self-employed-canada",
    { slug: "sales-tax-by-province-self-employed-canada" },
  );
  const provHtml = articleHtml(prov);
  assert.equal(provHtml.split(`href="${PATH}"`).length - 1, 1, "one link from the province guide");
  const bc = provHtml.slice(provHtml.indexOf("British Columbia PST"), provHtml.indexOf("Saskatchewan PST"));
  assert.ok(bc.includes(`href="${PATH}"`), "the link sits in the B.C. section");
});

test("B.C. PST guide: sitemap lists it, /articles and the province guide at 2026-11-16", () => {
  const xml = readFileSync("public/sitemap.xml", "utf8");
  for (const path of [PATH, "/articles", "/articles/sales-tax-by-province-self-employed-canada"])
    assert.match(
      xml,
      new RegExp(`<loc>https://receipt-one\\.com${path}</loc><lastmod>2026-11-16</lastmod>`),
      path,
    );
});
