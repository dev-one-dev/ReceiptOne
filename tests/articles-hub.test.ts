import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadArticleRenderer, pageText } from "./lib/render-articles.ts";

/**
 * The Canadian articles hub (/articles): five parts defined once in
 * src/lib/articles.parts.ts, each a section with an H2 anchor; a contents
 * sidebar whose links point at existing anchors and routes; and an ItemList
 * with every CA article in display order. Also checks that the five
 * Bookkeeping articles carry no 2025 example dates (2026-11-14 correction).
 */

type ArticleLike = {
  slug: string;
  title: string;
  regions?: string[];
  body: ({ type: string } & Record<string, unknown>)[];
  quickAnswer?: string;
  receiptOneHelps?: { items: string[] };
};
type Part = {
  id: string;
  number: string;
  title: string;
  slugs: string[];
  links?: { href: string }[];
};

const mod = await loadArticleRenderer<{
  ARTICLES: ArticleLike[];
  ARTICLE_PARTS: Part[];
  hubArticleOrder: () => ArticleLike[];
  getArticlesByRegion: (a: ArticleLike[], r: "ca" | "us") => ArticleLike[];
  articleFaq: (a: ArticleLike) => { q: string; a: string }[];
}>("articles-hub-test");
const { ARTICLE_PARTS, hubArticleOrder } = mod;

const page = await mod.render("/articles/", "/articles", {});
const html = page.html;

const EXPECTED = [
  ["filing", "01", "Filing and tax basics"],
  ["bookkeeping", "02", "Bookkeeping how-tos"],
  ["receipts", "03", "Receipts and CRA records"],
  ["mileage", "04", "Mileage and vehicle"],
  ["compare", "05", "Compare tools"],
] as const;

const parts = ARTICLE_PARTS!;
const CA = mod.getArticlesByRegion(mod.ARTICLES, "ca");

test("articles hub: parts data is exported", () => {
  assert.ok(Array.isArray(parts), "ARTICLE_PARTS is exported from the bundle");
  assert.equal(typeof hubArticleOrder, "function");
});

test("articles hub: every CA article appears in exactly one part", () => {
  const seen = new Map<string, string[]>();
  for (const p of parts) for (const s of p.slugs) seen.set(s, [...(seen.get(s) ?? []), p.id]);
  for (const a of CA)
    assert.deepEqual(
      seen.get(a.slug)?.length,
      1,
      `${a.slug} is in ${seen.get(a.slug) ?? "no part"}`,
    );
  const caSlugs = new Set(CA.map((a) => a.slug));
  for (const s of seen.keys()) assert.ok(caSlugs.has(s), `${s} is a CA article`);
  assert.equal(CA.length, 21);
});

test("articles hub: renders the H1 and five H2s with the part ids, in order", () => {
  assert.ok(page.matched, "/articles renders");
  assert.match(html, /<h1[^>]*>Tax guides for self-employed Canadians<\/h1>/);
  // The hub is everything before the dark CTA strip (the footer has its own H2).
  const hub = html.slice(0, html.indexOf('data-surface="void"'));
  const h2s = [...hub.matchAll(/<h2([^>]*)>([^<]*)<\/h2>/g)]
    .map((m) => ({ id: /id="([^"]+)"/.exec(m[1])?.[1], text: m[2] }))
    .filter((h) => h.id);
  assert.deepEqual(
    h2s.map((h) => [h.id, h.text]),
    EXPECTED.map(([id, , title]) => [id, title]),
  );
  const text = pageText(html);
  for (const [, n] of EXPECTED) assert.ok(text.includes(`Part ${n}`), `Part ${n} label`);
});

test("articles hub: each section shows its part's article cards and the deadlines link card", () => {
  for (const [i, p] of parts.entries()) {
    const start = html.indexOf(`data-part="${p.id}"`);
    const next = parts[i + 1] ? html.indexOf(`data-part="${parts[i + 1].id}"`) : html.length;
    assert.ok(start > 0, `section ${p.id}`);
    const section = html.slice(start, next);
    for (const s of p.slugs) assert.ok(section.includes(`href="/articles/${s}"`), `${p.id}: ${s}`);
    for (const l of p.links ?? [])
      assert.ok(section.includes(`href="${l.href}"`), `${p.id}: ${l.href}`);
  }
  assert.ok(parts[0].links?.some((l) => l.href === "/ca/tax-deadlines"));
});

test("articles hub: jump buttons and sidebar links point to existing anchors and routes", () => {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const routeExists = (path: string) => {
    const art = /^\/articles\/([a-z0-9-]+)$/.exec(path);
    if (art) return CA.some((a) => a.slug === art[1]);
    const base = resolve("src/routes", `.${path}`);
    return existsSync(`${base}.tsx`) || existsSync(resolve(base, "index.tsx"));
  };
  for (const label of ["Article parts", "Contents"]) {
    const at = html.indexOf(`aria-label="${label}"`);
    assert.ok(at > 0, `${label} nav renders`);
    const nav = html.slice(at, html.indexOf("</nav>", at));
    const hrefs = [...nav.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const anchors = hrefs.filter((h) => h.startsWith("#"));
    assert.deepEqual(
      anchors,
      EXPECTED.map(([id]) => `#${id}`),
      `${label} anchors`,
    );
    for (const a of anchors) assert.ok(ids.has(a.slice(1)), `${label}: ${a} exists`);
    for (const h of hrefs.filter((h) => !h.startsWith("#")))
      assert.ok(routeExists(h), `${label}: ${h} resolves`);
    if (label === "Contents")
      assert.equal(hrefs.filter((h) => h.startsWith("/articles/")).length, 21, "all 21 articles");
  }
});

test("articles hub: no part is highlighted in the server HTML (client-only, no hydration mismatch)", () => {
  assert.doesNotMatch(html, /aria-current="location"/);
});

test("articles hub: CollectionPage + ItemList of all 21 CA articles in display order", () => {
  const ld = (page.head.scripts ?? []).map((s) => JSON.parse(s.children));
  assert.ok(ld.some((j) => j["@type"] === "CollectionPage"));
  const list = ld.find((j) => j["@type"] === "ItemList");
  const order = parts.flatMap((p) => p.slugs);
  assert.equal(list.numberOfItems, 21);
  assert.deepEqual(
    list.itemListElement.map((e: { url: string }) => e.url.split("/articles/")[1]),
    order,
  );
  assert.deepEqual(
    list.itemListElement.map((e: { position: number }) => e.position),
    order.map((_, i) => i + 1),
  );
  assert.deepEqual(
    hubArticleOrder!().map((a) => a.slug),
    order,
  );
});

test("bookkeeping articles: no 2025 example dates in data or rendered page", async () => {
  const SLUGS = parts.find((p) => p.id === "bookkeeping")!.slugs;
  // The sources note names Guide T4002's edition; that is not an example date.
  const EDITION = "Guide T4002 is the 2025 edition";
  for (const slug of SLUGS) {
    const a = mod.ARTICLES.find((x) => x.slug === slug)!;
    const strings: string[] = [a.quickAnswer ?? "", ...(a.receiptOneHelps?.items ?? [])];
    for (const b of a.body)
      for (const v of Object.values(b))
        if (typeof v === "string") strings.push(v);
        else if (Array.isArray(v)) strings.push(...v.flat().filter((x) => typeof x === "string"));
    for (const s of strings)
      assert.doesNotMatch(s.replace(EDITION, ""), /2025/, `${slug}: ${s.slice(0, 80)}`);
    const rendered = pageText(
      (await mod.render("/articles/$slug", `/articles/${slug}`, { slug })).html,
    );
    assert.doesNotMatch(rendered.replace(EDITION, ""), /2025/, `${slug} page`);
  }
});

test("bookkeeping articles: corrected paragraphs state the rule and link the deadlines page", () => {
  const all = mod.ARTICLES.filter((a) =>
    parts.find((p) => p.id === "bookkeeping")!.slugs.includes(a.slug),
  );
  const text = (a: ArticleLike) => JSON.stringify(a.body);
  const withFiling = all.filter((a) => /until June 15 to file/.test(text(a)));
  assert.ok(withFiling.length >= 2);
  for (const a of withFiling) {
    assert.match(text(a), /April 30/);
    assert.match(text(a), /weekend or public holiday, it moves to the next business day/);
    assert.match(text(a), /\/ca\/tax-deadlines/);
  }
  for (const a of all.filter((x) => /instalments/.test(text(x))))
    assert.match(text(a), /\/ca\/tax-deadlines/, `${a.slug} links the deadlines page`);
});
