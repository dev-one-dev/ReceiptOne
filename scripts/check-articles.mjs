#!/usr/bin/env node
/**
 * Build-time checks on the article data (CA and US). Runs before `vite build`
 * via the `prebuild` npm script; run manually with `npm run check:articles`.
 *
 * FAQ: every article must emit exactly one FAQPage Question per FAQ item it
 * renders. An item is a faq block; the FAQ section (the "Frequently Asked
 * Questions" h2 up to the next h2) may hold only faq blocks, callouts and a
 * closing sources block, so nothing renders there that the schema would miss.
 *
 * Redirects: every retired /articles/ path in the middleware matcher must 301
 * to a live article and carry the query string across.
 */
import { loadTs } from "./lib/load-ts.mjs";

const { articles, FAQ_HEADING, articleFaq, faqJsonLd, middleware, matcher } = await loadTs(`
  import { ARTICLES, FAQ_HEADING, articleFaq } from "@/lib/articles";
  import { US_ARTICLES } from "@/lib/articles.us";
  import { faqJsonLd } from "@/lib/seo";
  import middleware, { config } from "./middleware";
  export const articles = [
    ...ARTICLES.map((a) => ({ region: "ca", article: a })),
    ...US_ARTICLES.map((a) => ({ region: "us", article: a })),
  ];
  export const matcher = config.matcher;
  export { FAQ_HEADING, articleFaq, faqJsonLd, middleware };
`);

const errors = [];

/* ---------------------------------- FAQ ---------------------------------- */

let faqArticles = 0;
let faqQuestions = 0;
for (const { region, article } of articles) {
  const id = `${region}/${article.slug}`;
  const body = article.body;
  const start = body.findIndex((b) => b.type === "h2" && b.text === FAQ_HEADING);
  const next = start === -1 ? -1 : body.findIndex((b, i) => i > start && b.type === "h2");
  const end = next === -1 ? body.length : next;

  body.forEach((b, i) => {
    if (b.type === "faq" && (start === -1 || i < start || i >= end))
      errors.push(`${id}: faq block at body[${i}] is outside the "${FAQ_HEADING}" section`);
  });
  if (start === -1) continue;

  const section = body.slice(start + 1, end);
  section.forEach((b, i) => {
    // A callout renders as a boxed note, not as a Q&A item; sources close the article.
    const allowed = b.type === "callout" || (b.type === "sources" && i === section.length - 1);
    if (b.type !== "faq" && !allowed)
      errors.push(
        `${id}: "${b.type}" block at body[${start + 1 + i}] inside the FAQ section; use a faq block`,
      );
    if (b.type === "faq") {
      if (!b.q.trim().endsWith("?")) errors.push(`${id}: FAQ question does not end in "?": ${b.q}`);
      if (!b.a.trim()) errors.push(`${id}: FAQ answer is empty: ${b.q}`);
    }
  });

  const rendered = body.filter((b) => b.type === "faq").length;
  const emitted = faqJsonLd(articleFaq(article)).mainEntity.filter(
    (e) => e["@type"] === "Question",
  ).length;
  if (rendered === 0) errors.push(`${id}: "${FAQ_HEADING}" section has no faq blocks`);
  if (emitted !== rendered)
    errors.push(`${id}: FAQPage emits ${emitted} Questions but the page renders ${rendered}`);
  faqArticles++;
  faqQuestions += emitted;
}

/* ------------------------------- Redirects -------------------------------- */

const ORIGIN = "https://receipt-one.com";
const live = new Set(articles.filter((a) => a.region === "ca").map((a) => a.article.slug));
let redirects = 0;
for (const path of matcher.filter((p) => p.startsWith("/articles/"))) {
  const slug = path.slice("/articles/".length);
  if (live.has(slug)) errors.push(`${path}: redirected by middleware but still a live article`);
  const res = middleware(new Request(`${ORIGIN}${path}?utm_source=check&x=1`));
  const location = res.headers.get("location") ?? "";
  const target = new URL(location, ORIGIN);
  const targetSlug = target.pathname.replace(/^\/articles\//, "");
  if (res.status !== 301) errors.push(`${path}: expected 301, got ${res.status}`);
  else if (!target.pathname.startsWith("/articles/") || !live.has(targetSlug))
    errors.push(`${path}: redirects to ${location}, which is not a live CA article`);
  else if (target.search !== "?utm_source=check&x=1")
    errors.push(`${path}: query string dropped (got ${location})`);
  redirects++;
}

if (errors.length) {
  console.error(`✗ article checks failed:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(
  `✓ articles: ${faqQuestions} FAQ Questions across ${faqArticles} articles match rendered items; ` +
    `${redirects} retired article paths 301 with query strings`,
);
