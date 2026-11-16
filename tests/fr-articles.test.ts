import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * French articles (/fr/articles, /fr/articles/$slug): the routes render
 * server-side through TanStack Router; hreflang pairs with the English
 * articles are reciprocal and canonicals self-reference; the FAQPage JSON-LD
 * matches the visible French FAQ; sources are French government pages only;
 * no marketing fluff or emoji; each article reuses its English image with a
 * French alt; and each translation keeps the English article's structure and
 * every figure in it.
 */

const DIR = resolve("node_modules/.cache/fr-articles-test");
const OUT = resolve(DIR, "render.mjs");
mkdirSync(DIR, { recursive: true });

const rawImports: Plugin = {
  name: "raw",
  setup(b) {
    b.onResolve({ filter: /\?raw$/ }, (args) => ({
      path: args.path.startsWith("@/")
        ? resolve("src", args.path.slice(2).replace(/\?raw$/, ""))
        : resolve(args.resolveDir, args.path.replace(/\?raw$/, "")),
      namespace: "raw",
    }));
    b.onLoad({ filter: /.*/, namespace: "raw" }, (args) => ({
      contents: readFileSync(args.path, "utf8"),
      loader: "text",
    }));
  },
};

await build({
  stdin: {
    contents: `
      import { renderToString } from "react-dom/server";
      import { createElement } from "react";
      import {
        RouterProvider, createMemoryHistory, createRootRoute, createRouter,
      } from "@tanstack/react-router";
      import { Route as CaIndex } from "@/routes/articles/index";
      import { Route as CaArticle } from "@/routes/articles/$slug";
      import { Route as FrIndex } from "@/routes/fr/articles/index";
      import { Route as FrArticle } from "@/routes/fr/articles/$slug";
      export { ARTICLES } from "@/lib/articles";
      export { FR_ARTICLES, FR_ARTICLES_INDEX, frenchTypography } from "@/lib/articles.fr";
      export { FRENCH_ARTICLE_SLUGS, FRENCH_PAGES } from "@/lib/locales";

      const ROUTES = {
        "/articles/": CaIndex,
        "/articles/$slug": CaArticle,
        "/fr/articles/": FrIndex,
        "/fr/articles/$slug": FrArticle,
      };

      export async function render(routeId, path, params) {
        const now = "2026-11-16T18:00:00Z";
        const root = createRootRoute();
        const children = Object.entries(ROUTES).map(([p, r]) =>
          r.update({ id: p, path: p, getParentRoute: () => root, loader: () => ({ now }) }));
        const router = createRouter({
          routeTree: root.addChildren(children),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        const match = router.state.matches.at(-1);
        return {
          matched: !!match && match.routeId === routeId && match.status === "success",
          html: renderToString(createElement(RouterProvider, { router })),
          head: ROUTES[routeId].options.head({ params, loaderData: { now } }),
        };
      }
    `,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  alias: { "@": resolve("src") },
  plugins: [rawImports],
  bundle: true,
  packages: "external",
  jsx: "automatic",
  loader: { ".svg": "dataurl", ".png": "dataurl", ".webp": "dataurl" },
  format: "esm",
  platform: "node",
  outfile: OUT,
  logLevel: "silent",
});

type Block = {
  type: string;
  text?: string;
  items?: string[];
  q?: string;
  a?: string;
  caption?: string;
  headers?: string[];
  rows?: string[][];
  links?: Link[];
  link?: Link;
  checked?: string;
};
type Link = { label: string; href: string; hrefLang?: string };
type Art = {
  slug: string;
  title: string;
  displayTitle?: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  image: { path: string; width: number; height: number; alt: string };
  tags: string[];
  body: Block[];
  quickAnswer?: string;
  receiptOneHelps?: { items: string[]; link: Link };
};
type FrArt = Art & { enSlug: string };
type Head = {
  meta: Record<string, string>[];
  links: { rel: string; href: string; hrefLang?: string }[];
  scripts: { type: string; children: string }[];
};
const mod = (await import(pathToFileURL(OUT).href)) as {
  render: (
    routeId: string,
    path: string,
    params: Record<string, string>,
  ) => Promise<{ matched: boolean; html: string; head: Head }>;
  ARTICLES: Art[];
  FR_ARTICLES: FrArt[];
  FR_ARTICLES_INDEX: { heading: string; subheading: string };
  FRENCH_ARTICLE_SLUGS: Record<string, string>;
  FRENCH_PAGES: Record<string, string>;
  frenchTypography: (s: string) => string;
};

const ORIGIN = "https://receipt-one.com";
const EXPECTED_SLUGS: Record<string, string> = {
  "t2125-form-guide-canada": "guide-formulaire-t2125",
  "self-employed-tax-deductions-canada": "deductions-travailleurs-autonomes-canada",
  "cra-receipt-rules-canada": "regles-recus-arc",
  "track-gst-hst-business-expenses": "tps-tvh-travailleurs-autonomes",
  "mileage-deduction-canada-freelancers": "deduction-frais-vehicule-kilometrage",
  "sales-tax-by-province-self-employed-canada":
    "taxes-de-vente-par-province-travailleurs-autonomes",
};
/** French pages that translate an English, non-article page (internal links must use them). */
const FR_TWINS: Record<string, string> = {
  "/ca": "/fr",
  "/ca/tax-deadlines": "/fr/echeances-fiscales",
  "/ca/mileage-log-template": "/fr/modele-registre-kilometrage",
};
const EN_ONLY = "(en anglais)";
const en = (slug: string) => mod.ARTICLES.find((a) => a.slug === slug)!;

const text = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const jsonLd = (head: Head, type: string) =>
  head.scripts
    .filter((s) => s.type === "application/ld+json")
    .map((s) => JSON.parse(s.children))
    .find((j) => j["@type"] === type);
const alternates = (head: Head) =>
  head.links.filter((l) => l.rel === "alternate").map((l) => `${l.hrefLang} ${l.href}`);
const canonical = (head: Head) => head.links.find((l) => l.rel === "canonical")?.href;

/** Every string a reader sees in an article. */
function strings(a: Art): string[] {
  const out = [a.title, a.displayTitle ?? "", a.excerpt, a.category, a.image.alt, ...a.tags];
  if (a.quickAnswer) out.push(a.quickAnswer);
  if (a.receiptOneHelps) out.push(...a.receiptOneHelps.items, a.receiptOneHelps.link.label);
  for (const b of a.body) {
    out.push(b.text ?? "", ...(b.items ?? []), b.q ?? "", b.a ?? "", b.caption ?? "");
    out.push(...(b.headers ?? []), ...(b.rows ?? []).flat(), b.checked ?? "");
    out.push(...(b.links ?? []).map((l) => l.label), b.link?.label ?? "");
  }
  return out.filter(Boolean);
}

/** Every link inside an article: paragraph links, the helps box link and sources. */
function articleLinks(a: Art): (Link & { source: boolean })[] {
  const out: (Link & { source: boolean })[] = [];
  if (a.receiptOneHelps) out.push({ ...a.receiptOneHelps.link, source: false });
  for (const b of a.body) {
    if (b.link) out.push({ ...b.link, source: false });
    for (const l of b.links ?? []) out.push({ ...l, source: true });
  }
  return out;
}

const pages = new Map<string, Awaited<ReturnType<typeof mod.render>>>();
for (const a of mod.FR_ARTICLES)
  pages.set(
    a.slug,
    await mod.render("/fr/articles/$slug", `/fr/articles/${a.slug}`, { slug: a.slug }),
  );
const frIndex = await mod.render("/fr/articles/", "/fr/articles", {});
const enIndex = await mod.render("/articles/", "/articles", {});

/* --------------------------------- Routes -------------------------------- */

test("fr articles: slugs are the natural French ones and each declares its English counterpart", () => {
  assert.deepEqual(mod.FRENCH_ARTICLE_SLUGS, EXPECTED_SLUGS);
  assert.equal(mod.FR_ARTICLES.length, 6);
  for (const a of mod.FR_ARTICLES) {
    assert.equal(EXPECTED_SLUGS[a.enSlug], a.slug, a.slug);
    assert.ok(en(a.enSlug), `English counterpart exists: ${a.enSlug}`);
    assert.equal(mod.FRENCH_PAGES[`/articles/${a.enSlug}`], `/fr/articles/${a.slug}`);
  }
  assert.equal(mod.FRENCH_PAGES["/articles"], "/fr/articles");
});

test("fr articles: index and every article render; an unknown slug does not", async () => {
  assert.ok(frIndex.matched, "/fr/articles renders");
  assert.match(
    frIndex.html,
    /<h1[^>]*>Guides fiscaux pour les travailleurs autonomes au Canada<\/h1>/,
  );
  assert.ok(text(frIndex.html).includes(mod.FR_ARTICLES_INDEX.subheading));
  for (const a of mod.FR_ARTICLES) {
    assert.ok(text(frIndex.html).includes(a.displayTitle!), `card on index: ${a.slug}`);
    assert.ok(frIndex.html.includes(`href="/fr/articles/${a.slug}"`), `card links: ${a.slug}`);
    const page = pages.get(a.slug)!;
    assert.ok(page.matched, `${a.slug} renders`);
    const h1 = page.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
    assert.equal(text(h1), a.displayTitle, `${a.slug} h1`);
    assert.ok(text(page.html).includes("min de lecture"));
    assert.ok(text(page.html).includes("Foire aux questions"));
    assert.ok(text(page.html).includes("Sources\u00a0:"));
    // The French correction line, as on the other /fr pages.
    assert.ok(page.html.includes("data-correction-line"));
    assert.ok(text(page.html).includes("Vous avez repéré une erreur ou une information périmée?"));
    assert.ok(page.html.includes(encodeURIComponent(`${ORIGIN}/fr/articles/${a.slug}`)));
    // Disclaimer in the closing sources block.
    assert.ok(
      text(page.html).includes("ne constituent pas des conseils fiscaux"),
      `${a.slug} disclaimer`,
    );
  }
  const missing = await mod.render("/fr/articles/$slug", "/fr/articles/nope", { slug: "nope" });
  // The harness stubs the loader, so check the page and head the 404 serves.
  assert.ok(text(missing.html).includes("Article introuvable"));
  assert.ok(missing.head.meta.some((m) => m.name === "robots" && m.content === "noindex,nofollow"));
  const src = readFileSync("src/routes/fr/articles/$slug.tsx", "utf8");
  assert.ok(src.includes("if (!getFrArticle(params.slug)) throw notFound("), "real loader 404s");
});

test("fr articles: index and articles lay out with French category labels and no parts sidebar", () => {
  const categories = mod.FR_ARTICLES.map((a) => a.category).sort();
  assert.deepEqual(categories, [
    "Conformité fiscale",
    "Déductions fiscales",
    "Kilométrage et automobile",
    "Notions fiscales de base",
    "TPS/TVH",
    "TPS/TVH",
  ]);
  // The index shows all six, one card each.
  const cards = frIndex.html.match(/href="\/fr\/articles\/[^"]+"/g) ?? [];
  assert.equal(new Set(cards).size, 6);
  for (const c of categories) assert.ok(text(frIndex.html).includes(c));
  assert.ok(!frIndex.html.includes("data-part"), "no parts sidebar on /fr/articles");
});

/* -------------------------------- hreflang -------------------------------- */

test("fr articles: canonical self-references and hreflang en-CA <-> fr-CA is reciprocal", async () => {
  for (const a of mod.FR_ARTICLES) {
    const fr = pages.get(a.slug)!.head;
    const enPage = await mod.render("/articles/$slug", `/articles/${a.enSlug}`, { slug: a.enSlug });
    const expected = [
      `en-CA ${ORIGIN}/articles/${a.enSlug}`,
      `fr-CA ${ORIGIN}/fr/articles/${a.slug}`,
      `x-default ${ORIGIN}/articles/${a.enSlug}`,
    ];
    assert.equal(canonical(fr), `${ORIGIN}/fr/articles/${a.slug}`);
    assert.equal(canonical(enPage.head), `${ORIGIN}/articles/${a.enSlug}`);
    assert.deepEqual(alternates(fr), expected, `${a.slug} alternates`);
    assert.deepEqual(alternates(enPage.head), expected, `${a.enSlug} alternates`);
    assert.ok(fr.meta.some((m) => m.property === "og:locale" && m.content === "fr_CA"));
    assert.equal(jsonLd(fr, "Article")?.inLanguage, "fr-CA");
    assert.equal(jsonLd(fr, "Article")?.mainEntityOfPage["@id"], `${ORIGIN}/fr/articles/${a.slug}`);
  }
  assert.equal(canonical(frIndex.head), `${ORIGIN}/fr/articles`);
  assert.deepEqual(alternates(frIndex.head), alternates(enIndex.head));
  assert.ok(alternates(enIndex.head).includes(`fr-CA ${ORIGIN}/fr/articles`));
});

test("fr articles: an English article without a translation still emits no hreflang", async () => {
  const other = mod.ARTICLES.find((a) => !(a.slug in EXPECTED_SLUGS))!;
  const page = await mod.render("/articles/$slug", `/articles/${other.slug}`, { slug: other.slug });
  assert.ok(!alternates(page.head).some((a) => a.startsWith("fr-CA")));
});

test("fr articles: language toggle switches between an article and its counterpart", async () => {
  for (const a of mod.FR_ARTICLES) {
    const enPage = await mod.render("/articles/$slug", `/articles/${a.enSlug}`, { slug: a.enSlug });
    assert.match(
      enPage.html,
      new RegExp(
        `href="/fr/articles/${a.slug}"[^>]*hrefLang="fr-CA"|hrefLang="fr-CA"[^>]*href="/fr/articles/${a.slug}"`,
        "i",
      ),
    );
    assert.match(
      pages.get(a.slug)!.html,
      new RegExp(
        `href="/articles/${a.enSlug}"[^>]*hrefLang="en-CA"|hrefLang="en-CA"[^>]*href="/articles/${a.enSlug}"`,
        "i",
      ),
    );
  }
  assert.match(
    frIndex.html,
    /href="\/articles"[^>]*hrefLang="en-CA"|hrefLang="en-CA"[^>]*href="\/articles"/i,
  );
});

test("fr articles: the French footer's Articles link points to /fr/articles", () => {
  for (const html of [frIndex.html, pages.get("regles-recus-arc")!.html]) {
    assert.match(html, /<a[^>]*href="\/fr\/articles"[^>]*>Articles<\/a>/);
    assert.ok(!text(html).includes("Articles (en anglais)"));
  }
});

/* ---------------------------------- FAQ ---------------------------------- */

test("fr articles: FAQPage JSON-LD matches the visible French FAQ", () => {
  for (const a of mod.FR_ARTICLES) {
    const page = pages.get(a.slug)!;
    const visible = text(page.html);
    const faq = jsonLd(page.head, "FAQPage");
    const blocks = a.body.filter((b) => b.type === "faq");
    assert.equal(faq.mainEntity.length, blocks.length, `${a.slug} question count`);
    assert.equal(blocks.length, en(a.enSlug).body.filter((b) => b.type === "faq").length);
    faq.mainEntity.forEach((q: { name: string; acceptedAnswer: { text: string } }, i: number) => {
      assert.equal(q.name, blocks[i].q);
      assert.equal(q.acceptedAnswer.text, blocks[i].a);
      assert.ok(q.name.endsWith("?"), q.name);
      assert.ok(visible.includes(q.name), `visible question: ${q.name}`);
      assert.ok(visible.includes(q.acceptedAnswer.text), `visible answer: ${q.name}`);
    });
    assert.deepEqual(
      jsonLd(page.head, "BreadcrumbList").itemListElement.map((i: { item: string }) => i.item),
      [`${ORIGIN}/fr`, `${ORIGIN}/fr/articles`, `${ORIGIN}/fr/articles/${a.slug}`],
    );
  }
});

/* -------------------------------- Sources -------------------------------- */

/** French versions of official pages: canada.ca (pages and the French T2125 PDF), Justice Laws, Revenu Québec, Manitoba. */
const FRENCH_SOURCE =
  /^https:\/\/(www\.canada\.ca\/fr\/|www\.canada\.ca\/content\/dam\/cra-arc\/formspubs\/pbg\/[a-z0-9]+\/[a-z0-9]+-\d+f\.pdf$|laws-lois\.justice\.gc\.ca\/fra\/lois\/|www\.revenuquebec\.ca\/fr\/|www\.gov\.mb\.ca\/finance\/taxation\/[\w/]+\.fr\.html$)/;
/** Official pages with no French version: B.C. and Saskatchewan PST, Manitoba's PDF bulletins. */
const ENGLISH_ONLY_SOURCE =
  /^https:\/\/(www2\.gov\.bc\.ca\/|www\.saskatchewan\.ca\/business\/|www\.gov\.mb\.ca\/finance\/taxation\/pubs\/bulletins\/[\w-]+\.pdf$)/;

test("fr articles: sources are the French official pages; English-only ones are marked", () => {
  for (const a of mod.FR_ARTICLES) {
    const sources = a.body.filter((b) => b.type === "sources");
    assert.equal(sources.length, 1, `${a.slug}: one sources block`);
    assert.equal(a.body.at(-1)!.type, "sources", `${a.slug}: sources close the article`);
    const links = sources[0].links!;
    assert.ok(links.length >= 3);
    for (const l of links) {
      if (FRENCH_SOURCE.test(l.href)) {
        assert.ok(!l.label.endsWith(EN_ONLY) && !l.hrefLang, `${a.slug}: ${l.href} is French`);
        continue;
      }
      assert.match(l.href, ENGLISH_ONLY_SOURCE, `${a.slug}: ${l.href} is not an allowed source`);
      assert.ok(l.label.endsWith(EN_ONLY), `${a.slug}: ${l.label} marked (en anglais)`);
      assert.equal(l.hrefLang, "en", `${a.slug}: ${l.href} hrefLang`);
    }
    // English sources only where the English article cites the same English-only site.
    const enHrefs = new Set(articleLinks(en(a.enSlug)).map((l) => l.href));
    for (const l of links.filter((x) => x.hrefLang === "en"))
      assert.ok(enHrefs.has(l.href), `${a.slug}: ${l.href} is the English article's own source`);
    // Same number of sources as the English article where it has a sources block.
    const enSources = en(a.enSlug).body.find((b) => b.type === "sources");
    if (enSources) assert.equal(links.length, enSources.links!.length, `${a.slug}: source count`);
    assert.ok(links.some((l) => l.href.startsWith("https://www.canada.ca/fr/")));
    assert.ok(new Set(links.map((l) => l.href)).size === links.length, `${a.slug}: no duplicates`);
    // No English page linked from anywhere in the article.
    assert.ok(!JSON.stringify(a.body).includes("/en/"), `${a.slug}: no /en/ link`);
    assert.ok(!JSON.stringify(a.body).includes("/eng/"), `${a.slug}: no /eng/ link`);
    for (const l of links)
      assert.ok(pages.get(a.slug)!.html.includes(`href="${l.href}"`), `rendered: ${l.href}`);
  }
});

test("fr articles: internal links go to the French counterpart where one exists, otherwise to English", () => {
  const frBySlug = new Map(mod.FR_ARTICLES.map((a) => [a.enSlug, a.slug]));
  for (const a of mod.FR_ARTICLES) {
    const enLinks = articleLinks(en(a.enSlug)).filter((l) => !l.source && l.href.startsWith("/"));
    const frLinks = articleLinks(a).filter((l) => !l.source && l.href.startsWith("/"));
    assert.equal(frLinks.length, enLinks.length, `${a.slug}: same internal links`);
    enLinks.forEach((e, i) => {
      const f = frLinks[i];
      const enSlug = e.href.match(/^\/articles\/([^/]+)$/)?.[1];
      const twin = enSlug
        ? frBySlug.get(enSlug) && `/fr/articles/${frBySlug.get(enSlug)}`
        : FR_TWINS[e.href];
      if (twin) {
        assert.equal(f.href, twin, `${a.slug}: ${e.href} -> ${twin}`);
        assert.ok(!f.label.endsWith(EN_ONLY) && !f.hrefLang);
      } else {
        assert.equal(f.href, e.href, `${a.slug}: ${e.href} stays English`);
        assert.ok(f.label.endsWith(EN_ONLY), `${a.slug}: ${f.label} marked (en anglais)`);
        assert.equal(f.hrefLang, "en");
        assert.match(pages.get(a.slug)!.html, new RegExp(`href="${e.href}" hrefLang="en"`));
      }
    });
    // A canada.ca link inside the text points to the French page, like the sources.
    for (const l of articleLinks(a).filter((x) => !x.source && x.href.startsWith("http")))
      assert.match(l.href, FRENCH_SOURCE, `${a.slug}: ${l.href}`);
  }
});

test("fr articles: Quick answer and How ReceiptOne helps appear in French where the English has them", () => {
  for (const a of mod.FR_ARTICLES) {
    const e = en(a.enSlug);
    assert.equal(!!a.quickAnswer, !!e.quickAnswer, `${a.slug}: quick answer`);
    assert.equal(!!a.receiptOneHelps, !!e.receiptOneHelps, `${a.slug}: helps box`);
    const html = pages.get(a.slug)!.html;
    if (a.quickAnswer) {
      assert.ok(html.includes("Réponse rapide"));
      assert.ok(text(html).includes(a.quickAnswer));
    }
    if (a.receiptOneHelps) {
      assert.equal(a.receiptOneHelps.items.length, e.receiptOneHelps!.items.length);
      assert.ok(html.includes('aria-label="Comment ReceiptOne vous aide"'));
      for (const item of a.receiptOneHelps.items) assert.ok(text(html).includes(item), item);
    }
  }
});

test("fr articles: the province rates table has 13 rows with French province names", () => {
  const a = mod.FR_ARTICLES.find((x) => x.enSlug === "sales-tax-by-province-self-employed-canada")!;
  const table = a.body.find((b) => b.type === "table")!;
  assert.deepEqual(
    table.rows!.map((r) => r[0]),
    [
      "Alberta",
      "Colombie-Britannique",
      "Manitoba",
      "Nouveau-Brunswick",
      "Terre-Neuve-et-Labrador",
      "Territoires du Nord-Ouest",
      "Nouvelle-Écosse",
      "Nunavut",
      "Ontario",
      "Île-du-Prince-Édouard",
      "Québec",
      "Saskatchewan",
      "Yukon",
    ],
  );
});

/* ------------------------------ Banned words ------------------------------ */

test("fr articles: no marketing fluff and no emoji", () => {
  const banned = [
    /révolutionnaire/i,
    /sans effort/i,
    /sans tracas/i,
    /(?![©®™])\p{Extended_Pictographic}/u,
  ];
  for (const a of mod.FR_ARTICLES) {
    const all = [...strings(a), text(pages.get(a.slug)!.html)].join("\n");
    for (const re of banned) assert.ok(!re.test(all), `${a.slug}: ${re}`);
  }
  assert.ok(!banned.some((re) => re.test(text(frIndex.html))), "/fr/articles");
});

/* --------------------------------- Images -------------------------------- */

test("fr articles: reuse the English image files with a French alt", () => {
  for (const a of mod.FR_ARTICLES) {
    const e = en(a.enSlug);
    assert.deepEqual(
      { path: a.image.path, width: a.image.width, height: a.image.height },
      { path: e.image.path, width: e.image.width, height: e.image.height },
    );
    for (const suffix of [".webp", "-card.webp", "-og.jpg"])
      assert.ok(
        existsSync(resolve("public", a.image.path.slice(1).replace(/\.webp$/, suffix))),
        `${a.slug}${suffix}`,
      );
    assert.ok(a.image.alt.length > 20 && a.image.alt.length <= 140, `${a.slug} alt length`);
    assert.notEqual(a.image.alt, e.image.alt);
    assert.match(
      a.image.alt,
      /[éèàçù]|\b(de|du|des|une|un|au|sur|avec)\b/,
      `${a.slug}: French alt`,
    );
    const html = pages.get(a.slug)!.html;
    assert.ok(html.includes(`src="${a.image.path}"`), `${a.slug} hero image`);
    assert.ok(html.includes(`alt="${a.image.alt.replace(/'/g, "&#x27;")}"`), `${a.slug} hero alt`);
  }
});

/* ------------------------------ Titles, dates ----------------------------- */

test("fr articles: displayTitle has no year; the SEO title carries it like the English one", () => {
  for (const a of mod.FR_ARTICLES) {
    const e = en(a.enSlug);
    assert.ok(a.displayTitle && !/\b20\d\d\b/.test(a.displayTitle), `${a.slug} displayTitle`);
    assert.equal(/\(2026\)/.test(a.title), /\(2026\)/.test(e.title), `${a.slug} year in title`);
    const title = pages.get(a.slug)!.head.meta.find((m) => "title" in m)!.title;
    assert.equal(title, a.title);
    assert.equal(a.publishedAt, "2026-11-16");
    assert.equal(a.updatedAt, "2026-11-16");
  }
});

/* ------------------------- Parity with the English ------------------------ */

/** Block types in order, without sources (the French articles close on a sources block). */
function shape(a: Art): string[] {
  const body = [...a.body];
  // T2125 (EN) ends with an h2 "Sources" and a plain paragraph instead of a sources block.
  const at = body.findIndex((b) => b.type === "h2" && b.text === "Sources");
  if (at !== -1) body.splice(at);
  return body.filter((b) => b.type !== "sources").map((b) => b.type);
}

/** Figures in an article's body (not its sources), thousands joined and decimals as ".", phone numbers removed. */
function figures(a: Art, lang: "en" | "fr"): string[] {
  const body = [...a.body];
  const at = body.findIndex((b) => b.type === "h2" && b.text === "Sources");
  if (at !== -1) body.splice(at);
  const boxes = [a.quickAnswer ?? "", ...(a.receiptOneHelps?.items ?? [])];
  const all = body
    .filter((b) => b.type !== "sources")
    .flatMap((b) => [
      ...boxes.splice(0),
      b.text ?? "",
      ...(b.items ?? []),
      b.q ?? "",
      b.a ?? "",
      b.caption ?? "",
      ...(b.headers ?? []),
      ...(b.rows ?? []).flat(),
    ])
    .join("\n")
    .replace(/1-800-\d{3}-\d{4}/g, "");
  const joined =
    lang === "en"
      ? all.replace(/(\d),(?=\d{3}\b)/g, "$1")
      : all.replace(/(\d)[\u00a0\u202f ](?=\d{3}\b)/g, "$1").replace(/(\d),(\d)/g, "$1.$2");
  return (joined.match(/\d+(?:\.\d+)?/g) ?? []).sort();
}

test("fr articles: same structure and the same figures as the English article", () => {
  for (const a of mod.FR_ARTICLES) {
    const e = en(a.enSlug);
    assert.deepEqual(shape(a), shape(e), `${a.slug} block structure`);
    a.body.forEach((b, i) => {
      if (b.type !== "table") return;
      const eb = e.body[i];
      assert.equal(eb.type, "table");
      assert.equal(b.headers!.length, eb.headers!.length);
      assert.deepEqual(
        b.rows!.map((r) => r.length),
        eb.rows!.map((r) => r.length),
      );
    });
    assert.deepEqual(figures(a, "fr"), figures(e, "en"), `${a.slug} figures`);
  }
});

test("fr articles: numbers use Canadian French formatting (1 500 $, 13 %)", () => {
  for (const a of mod.FR_ARTICLES)
    for (const s of strings(a)) {
      assert.ok(!/\$\s?\d/.test(s), `${a.slug}: dollar sign before the amount: ${s}`);
      // A decimal comma before a percentage (9,975 %) is not a thousands separator.
      assert.ok(!/\d,\d{3}\b(?! %)/.test(s), `${a.slug}: comma thousands separator: ${s}`);
      assert.ok(!/\d\.\d{2} ?\$/.test(s), `${a.slug}: decimal point in an amount: ${s}`);
      assert.ok(!/\d \d{3}(?!\d)/.test(s), `${a.slug}: breaking space in a number: ${s}`);
      assert.ok(!/\d( |)[$%]/.test(s), `${a.slug}: $ or % without a non-breaking space: ${s}`);
      assert.equal(mod.frenchTypography(s), s, `${a.slug}: typography applied: ${s}`);
    }
  const all = mod.FR_ARTICLES.flatMap(strings).join("\n");
  assert.ok(all.includes("1\u00a0500\u00a0$"));
  assert.ok(all.includes("13\u00a0%"));
});

test("fr articles: CRA's official French terms are used", () => {
  const all = mod.FR_ARTICLES.flatMap(strings).join("\n");
  for (const term of [
    "État des résultats des activités d'une entreprise ou d'une profession libérale",
    "crédits de taxe sur les intrants (CTI)",
    "déduction pour amortissement (DPA)",
    "travailleur autonome",
    "registre",
    "ARC",
    "Frais d'utilisation de la résidence aux fins de l'entreprise",
    "Repas et frais de représentation",
  ])
    assert.ok(all.includes(term), term);
  // Where the English article covers GST/HST only, at most one added Québec
  // sentence, naming Revenu Québec. Articles whose English already covers the
  // QST translate it instead.
  for (const a of mod.FR_ARTICLES) {
    if (/\bQST\b/.test(JSON.stringify(en(a.enSlug)))) continue;
    const qst =
      strings(a)
        .join("\n")
        .match(/[^.]*\bTVQ\b[^.]*\./g) ?? [];
    assert.ok(qst.length <= 1, `${a.slug}: QST sentences`);
    for (const s of qst) assert.ok(s.includes("Revenu Québec"));
  }
});

/* -------------------------------- Sitemap -------------------------------- */

test("fr articles: sitemap lists the French pages with today's lastmod and their alternates", () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  const entry = (path: string) =>
    sitemap.split("\n").find((l) => l.includes(`<loc>${ORIGIN}${path}</loc>`)) ?? "";
  assert.ok(entry("/fr/articles").includes("<lastmod>2026-11-16</lastmod>"));
  for (const a of mod.FR_ARTICLES) {
    const fr = entry(`/fr/articles/${a.slug}`);
    const enLine = entry(`/articles/${a.enSlug}`);
    assert.ok(fr.includes("<lastmod>2026-11-16</lastmod>"), `${a.slug} lastmod`);
    for (const line of [fr, enLine]) {
      assert.ok(line.includes(`hreflang="en-CA" href="${ORIGIN}/articles/${a.enSlug}"`));
      assert.ok(line.includes(`hreflang="fr-CA" href="${ORIGIN}/fr/articles/${a.slug}"`));
    }
  }
});
