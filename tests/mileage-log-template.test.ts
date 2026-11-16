import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";
import ExcelJS from "exceljs";

/**
 * Free mileage log template (/ca/mileage-log-template, /fr/modele-registre-kilometrage):
 * the committed XLSX and PDF files (formulas, sheets, page count), both routes
 * rendered server-side through TanStack Router with their head (canonical,
 * hreflang pair, FAQPage JSON-LD against the visible FAQ), canada.ca-only
 * sources, and the links in from the articles hub, /ca/drivers and the
 * mileage-deduction article.
 */

const DIR = resolve("node_modules/.cache/mileage-log-template-test");
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
      import { Route as En } from "@/routes/ca/mileage-log-template";
      import { Route as Fr } from "@/routes/fr/modele-registre-kilometrage";
      import { Route as Drivers } from "@/routes/ca/drivers";
      export * from "@/lib/mileage-log-template";
      export { ARTICLES } from "@/lib/articles";
      export { ARTICLE_PARTS } from "@/lib/articles.parts";

      const ROUTES = {
        "/ca/mileage-log-template": En,
        "/fr/modele-registre-kilometrage": Fr,
        "/ca/drivers": Drivers,
      };

      export async function render(path, now) {
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
          status: router.state.status,
          matched: !!match && match.routeId === path && match.status === "success",
          html: renderToString(createElement(RouterProvider, { router })),
          head: ROUTES[path].options.head({ loaderData: { now } }),
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

type Lang = "en" | "fr";
type Head = {
  meta: Record<string, string>[];
  links: { rel: string; href: string; hrefLang?: string }[];
  scripts: { type: string; children: string }[];
};
type Labels = {
  tripsSheet: string;
  summarySheet: string;
  columns: string[];
  yes: string;
  no: string;
};
const mod = (await import(pathToFileURL(OUT).href)) as {
  render: (
    path: string,
    now: string,
  ) => Promise<{ status: string; matched: boolean; html: string; head: Head }>;
  TEMPLATE_FILES: Record<Lang, { xlsx: string; pdf: string }>;
  TEMPLATE_LABELS: Record<Lang, Labels>;
  SOURCES: Record<Lang, { label: string; url: string }[]>;
  PDF_PAGE_COUNT: number;
  PDF_ROWS_PER_PAGE: number;
  XLSX_TRIP_ROWS: number;
  ARTICLES: { slug: string; body: { type: string; link?: { label: string; href: string } }[] }[];
  ARTICLE_PARTS: { id: string; links?: { href: string; image: { path: string } }[] }[];
};

const NOW = "2026-11-16T18:00:00Z";
const ORIGIN = "https://receipt-one.com";
const PATHS: Record<Lang, string> = {
  en: "/ca/mileage-log-template",
  fr: "/fr/modele-registre-kilometrage",
};
const pages = {
  en: await mod.render(PATHS.en, NOW),
  fr: await mod.render(PATHS.fr, NOW),
};
const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
const jsonLd = (head: Head, type: string) =>
  head.scripts
    .filter((s) => s.type === "application/ld+json")
    .map((s) => JSON.parse(s.children))
    .find((j) => j["@type"] === type);
const LANGS: Lang[] = ["en", "fr"];
const download = (name: string) => resolve("public/downloads", name);

/* -------------------------------- files ---------------------------------- */

test("mileage template: the four committed files exist under the agreed names", () => {
  assert.deepEqual(mod.TEMPLATE_FILES, {
    en: {
      xlsx: "receiptone-mileage-log-template.xlsx",
      pdf: "receiptone-mileage-log-template.pdf",
    },
    fr: {
      xlsx: "receiptone-modele-registre-kilometrage.xlsx",
      pdf: "receiptone-modele-registre-kilometrage.pdf",
    },
  });
  for (const lang of LANGS)
    for (const name of Object.values(mod.TEMPLATE_FILES[lang])) {
      assert.ok(existsSync(download(name)), name);
      assert.ok(statSync(download(name)).size > 10_000, `${name} is not empty`);
    }
});

for (const lang of LANGS) {
  test(`mileage template (${lang}): XLSX opens, with the columns and the formulas`, async () => {
    const L = mod.TEMPLATE_LABELS[lang];
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(download(mod.TEMPLATE_FILES[lang].xlsx));
    assert.deepEqual(
      wb.worksheets.map((w) => w.name),
      [L.tripsSheet, L.summarySheet],
    );
    if (lang === "en") assert.deepEqual([L.tripsSheet, L.summarySheet], ["Trips", "Year summary"]);

    const trips = wb.getWorksheet(L.tripsSheet)!;
    const header = (trips.getRow(1).values as unknown[]).slice(1);
    assert.deepEqual(header, L.columns);
    if (lang === "en")
      assert.deepEqual(header, [
        "Date",
        "Start location",
        "Destination",
        "Business purpose",
        "Start odometer",
        "End odometer",
        "Kilometres",
        "Business? (Yes/No)",
      ]);
    // Frozen header row, header repeated on every printed page.
    assert.equal(trips.views[0]?.state, "frozen");
    assert.equal((trips.views[0] as { ySplit?: number }).ySplit, 1);
    assert.equal(trips.pageSetup.printTitlesRow, "1:1");
    assert.equal(trips.pageSetup.orientation, "landscape");

    const last = mod.XLSX_TRIP_ROWS + 1;
    const formula = (ws: ExcelJS.Worksheet, a1: string) =>
      (ws.getCell(a1).value as { formula?: string } | null)?.formula;
    for (const r of [2, 3, 250, last])
      assert.equal(
        formula(trips, `G${r}`),
        `IF(AND(ISNUMBER(E${r}),ISNUMBER(F${r})),F${r}-E${r},"")`,
        `Kilometres = end - start on row ${r}`,
      );
    assert.equal(formula(trips, `G${last + 1}`), undefined, "no formula past the last row");
    // Business? is a Yes/No list.
    const dv = trips.dataValidations.find(`H2`) as { type?: string; formulae?: string[] };
    assert.equal(dv?.type, "list");
    assert.deepEqual(dv?.formulae, [`"${L.yes},${L.no}"`]);

    const sum = wb.getWorksheet(L.summarySheet)!;
    const q = `'${L.tripsSheet}'`;
    assert.equal(formula(sum, "B8"), `IF(AND(ISNUMBER(B6),ISNUMBER(B7)),B7-B6,"")`, "total km");
    assert.equal(
      formula(sum, "B9"),
      `SUMIF(${q}!H2:H${last},"${L.yes}",${q}!G2:G${last})`,
      "business km",
    );
    assert.equal(formula(sum, "B10"), `IF(AND(ISNUMBER(B8),B8>0),B9/B8,"")`, "business-use %");
    assert.equal(sum.getCell("B10").numFmt, "0.0%");
    assert.equal(sum.getCell("B6").value, null, "odometer inputs are blank");
    assert.equal(sum.getCell("B7").value, null, "odometer inputs are blank");
  });

  test(`mileage template (${lang}): PDF has ${5} Letter-landscape pages`, () => {
    const pdf = readFileSync(download(mod.TEMPLATE_FILES[lang].pdf)).toString("latin1");
    assert.ok(pdf.startsWith("%PDF-"));
    assert.equal(mod.PDF_PAGE_COUNT, 5);
    assert.equal(mod.PDF_ROWS_PER_PAGE, 25);
    assert.equal(pdf.match(/\/Type\s*\/Page(?![s\w])/g)?.length, mod.PDF_PAGE_COUNT);
    assert.match(pdf, new RegExp(`/Type\\s*/Pages[\\s\\S]{0,200}?/Count ${mod.PDF_PAGE_COUNT}\\b`));
    // Letter landscape: 792 x 612 pt.
    const boxes = [...pdf.matchAll(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/g)];
    assert.equal(boxes.length, mod.PDF_PAGE_COUNT);
    for (const b of boxes) assert.deepEqual([Math.round(+b[1]), Math.round(+b[2])], [792, 612]);
  });
}

test("mileage template: the hub card image exists", () => {
  const card = mod.ARTICLE_PARTS.flatMap((p) => p.links ?? []).find(
    (l) => l.href === "/ca/mileage-log-template",
  );
  assert.equal(card?.image.path, "/articles/mileage-log-template-card.webp");
  assert.ok(statSync(resolve("public/articles/mileage-log-template-card.webp")).size > 1000);
});

/* --------------------------------- page ---------------------------------- */

test("mileage template page: both routes render with their h1 and downloads", () => {
  const h1 = {
    en: "Free CRA mileage log template",
    fr: "Modèle gratuit de registre de kilométrage pour l'ARC",
  };
  for (const lang of LANGS) {
    const p = pages[lang];
    assert.equal(p.status, "idle", lang);
    assert.ok(p.matched, `${lang} matches its own route`);
    assert.equal((p.html.match(/<h1[\s>]/g) ?? []).length, 1, `${lang} one h1`);
    assert.ok(text(p.html).includes(h1[lang]), `${lang} h1 text`);
    for (const name of Object.values(mod.TEMPLATE_FILES[lang]))
      assert.match(
        p.html,
        new RegExp(`href="/downloads/${name.replace(/\./g, "\\.")}" download="${name}"`),
        `${lang} links ${name}`,
      );
  }
  const en = text(pages.en.html);
  for (const h of [
    "What the CRA expects in a logbook",
    "How to calculate your business-use percentage",
    "Prefer not to fill it in by hand?",
    "27,000 ÷ 30,000 = 90%",
  ])
    assert.ok(en.includes(h), h);
  assert.ok(pages.en.html.includes('href="/ca"') && pages.en.html.includes('href="/ca/drivers"'));
  assert.ok(pages.fr.html.includes('href="/fr"') && pages.fr.html.includes('href="/ca/drivers"'));
});

test("mileage template page: FAQPage JSON-LD matches the visible FAQ exactly", () => {
  for (const lang of LANGS) {
    const p = pages[lang];
    const faq = jsonLd(p.head, "FAQPage");
    assert.ok(faq, `${lang} has FAQPage JSON-LD`);
    assert.ok(faq.mainEntity.length >= 4 && faq.mainEntity.length <= 5);
    const section = p.html.slice(p.html.indexOf('id="mileage-template-faq"'));
    const faqHtml = section.slice(0, section.indexOf("</section>"));
    const visible = text(faqHtml);
    const h3s = [...faqHtml.matchAll(/<h3[^>]*>([^<]+)</g)].map((m) => text(m[1]));
    assert.deepEqual(
      h3s,
      faq.mainEntity.map((q: { name: string }) => q.name),
    );
    for (const q of faq.mainEntity) {
      assert.equal(q["@type"], "Question");
      assert.ok(q.name.endsWith("?"), q.name);
      assert.ok(visible.includes(q.acceptedAnswer.text), `${lang}: answer visible: ${q.name}`);
    }
    assert.equal(jsonLd(p.head, "BreadcrumbList")?.itemListElement.length, 3);
  }
});

test("mileage template page: canonical, hreflang pair, title and OG", () => {
  const alternates = [
    `en-CA ${ORIGIN}/ca/mileage-log-template`,
    `fr-CA ${ORIGIN}/fr/modele-registre-kilometrage`,
    `x-default ${ORIGIN}/ca/mileage-log-template`,
  ];
  for (const lang of LANGS) {
    const { head } = pages[lang];
    const meta = (k: string) => head.meta.find((m) => m.property === k || m.name === k)?.content;
    assert.equal(head.links.find((l) => l.rel === "canonical")?.href, `${ORIGIN}${PATHS[lang]}`);
    assert.deepEqual(
      head.links.filter((l) => l.rel === "alternate").map((l) => `${l.hrefLang} ${l.href}`),
      alternates,
    );
    assert.equal(meta("og:url"), `${ORIGIN}${PATHS[lang]}`);
    assert.match(meta("og:image")!, /^https:\/\/receipt-one\.com\/og-image\.png(\?v=\d+)?$/);
    assert.match(head.meta.find((m) => "title" in m)!.title, / \| ReceiptOne$/);
    const description = meta("description")!;
    assert.ok(description.length > 100 && description.length <= 230, `${lang} description`);
  }
  assert.equal(
    pages.en.head.meta.find((m) => "title" in m)?.title,
    "Free CRA Mileage Log Template (Excel and PDF) | ReceiptOne",
  );
  assert.ok(pages.fr.head.meta.some((m) => m.property === "og:locale" && m.content === "fr_CA"));
});

test("mileage template page: sources are canada.ca only, in the page's language", () => {
  for (const lang of LANGS) {
    assert.ok(mod.SOURCES[lang].length >= 2);
    for (const s of mod.SOURCES[lang])
      assert.match(s.url, new RegExp(`^https://www\\.canada\\.ca/${lang}/`), s.url);
    const html = pages[lang].html;
    const list = html.slice(html.indexOf("data-sources"));
    const hrefs = [...list.slice(0, list.indexOf("</ul>")).matchAll(/href="([^"]+)"/g)].map(
      (m) => m[1],
    );
    assert.deepEqual(
      hrefs,
      mod.SOURCES[lang].map((s) => s.url),
    );
    // No other outbound link in the page content (header sign-in and footer aside).
    const body = html.slice(html.indexOf("data-downloads"), html.indexOf("<footer"));
    for (const [, href] of body.matchAll(/href="(https?:\/\/[^"]+)"/g))
      assert.match(href, /^https:\/\/www\.canada\.ca\//, `${lang} body links ${href}`);
  }
});

test("mileage template page: disclaimer, correction line, plain wording", () => {
  const BANNED = [
    /game[- ]changer/i,
    /seamless/i,
    /effortless/i,
    /hassle[- ]free/i,
    /stress[- ]free/i,
    /\bunlock/i,
    /supercharge/i,
    /let's dive in/i,
    /the bottom line/i,
    /say goodbye to/i,
    /\bkilometer/i,
    /\p{Extended_Pictographic}/u,
  ];
  for (const lang of LANGS) {
    const html = pages[lang].html;
    assert.ok(html.includes("data-correction-line"), `${lang} correction line`);
    const body = text(html.slice(html.indexOf("<main"), html.indexOf("<footer")));
    for (const re of BANNED) assert.doesNotMatch(body, re, `${lang}: ${re}`);
    assert.ok((body.match(/—/g) ?? []).length === 0, `${lang}: no em-dashes`);
  }
  assert.ok(text(pages.en.html).includes("general information, not tax advice"));
  assert.ok(text(pages.fr.html).includes("renseignements généraux et non des conseils fiscaux"));
});

/* ------------------------------- links in -------------------------------- */

test("mileage template: linked from hub Part 04, /ca/drivers and the mileage article", async () => {
  const mileage = mod.ARTICLE_PARTS.find((p) => p.id === "mileage");
  assert.ok(
    mileage?.links?.some((l) => l.href === "/ca/mileage-log-template"),
    "hub Part 04",
  );

  const drivers = await mod.render("/ca/drivers", NOW);
  assert.ok(drivers.matched);
  assert.match(
    drivers.html,
    /href="\/ca\/mileage-log-template"[^>]*>Download a free mileage log template</,
  );

  const article = mod.ARTICLES.find((a) => a.slug === "mileage-deduction-canada-freelancers")!;
  assert.ok(
    article.body.some(
      (b) =>
        b.link?.href === "/ca/mileage-log-template" &&
        b.link.label === "Download a free mileage log template",
    ),
  );
});

test("mileage template: pair registered for hreflang and the sitemap", () => {
  const locales = readFileSync("src/lib/locales.ts", "utf8");
  assert.ok(locales.includes('"/ca/mileage-log-template": "/fr/modele-registre-kilometrage"'));
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  for (const lang of LANGS)
    assert.ok(
      sitemap.includes(`<loc>${ORIGIN}${PATHS[lang]}</loc><lastmod>2026-11-16</lastmod>`),
      `${PATHS[lang]} in sitemap`,
    );
});
