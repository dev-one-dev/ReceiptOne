import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * Footer CRA deadlines, computed by rule (src/lib/tax-deadlines.ts) and drawn
 * by components/site/TaxDeadlines. The strip and the full Footer are rendered
 * server-side with a fixed "now", the way the landing-page loaders hand the
 * server clock to the Footer.
 */

const DIR = resolve("node_modules/.cache/tax-deadlines-test");
const OUT = resolve(DIR, "render.mjs");
mkdirSync(DIR, { recursive: true });

// The Footer imports the wordmark as "?raw" text; esbuild has no query loaders.
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
        RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter,
      } from "@tanstack/react-router";
      import { TaxDeadlines } from "@/components/site/TaxDeadlines";
      import { Footer } from "@/components/site/Footer";
      export * from "@/lib/tax-deadlines";

      export const renderStrip = (lang, now) =>
        renderToString(createElement(TaxDeadlines, { lang, now }));

      /** The whole Footer at a path, as each landing page mounts it. */
      export async function renderFooter(path, props) {
        const root = createRootRoute();
        const page = createRoute({
          getParentRoute: () => root,
          path,
          component: () => createElement(Footer, props),
        });
        const router = createRouter({
          routeTree: root.addChildren([page]),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        return renderToString(createElement(RouterProvider, { router }));
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

type Deadline = {
  kind: string;
  quarter?: number;
  officialDate: string;
  effectiveDate: string;
  taxYear: number;
  shifted: boolean;
};
type FooterRow = { type: string; deadline?: Deadline };
type Row = { officialDate: string; effectiveDate: string; shifted: boolean; deadlines: Deadline[] };
const lib = (await import(pathToFileURL(OUT).href)) as {
  renderStrip: (lang: string, now: string) => string;
  renderFooter: (path: string, props: Record<string, unknown>) => Promise<string>;
  craDeadlinesForYear: (y: number) => Deadline[];
  gstAnnualDeadlinesForYear: (y: number) => Deadline[];
  gstQuarterlyDeadlines: (y: number) => Deadline[];
  getCraDeadlinesNext12Months: (today: string) => Row[];
  getFooterDeadlineRows: (today: string) => FooterRow[];
  footerRowLabel: (row: FooterRow, lang: string) => string;
  T2_DATE_TEXT: Record<string, string>;
  formatDeadlineDate: (date: string, lang: string) => string;
  formatOnTimeUntil: (date: string, lang: string) => string;
  weekendShift: (date: string) => string;
};

// Also unwraps the strip's no-break spans (TaxDeadlines' NoBreak), so text checks read plain.
const decode = (html: string) =>
  html
    .replace(/<span class="whitespace-nowrap">([^<]*)<\/span>/g, "$1")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&");
const find = (year: number, official: string) =>
  lib.craDeadlinesForYear(year).filter((d) => d.officialDate === official);
const dow = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();
const daysBetween = (a: string, b: string) =>
  (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000;

/* ------------------------------ Weekend shift ------------------------------ */

test("tax-deadlines: weekend dates shift to the following Monday", () => {
  const cases: [number, string, string][] = [
    [2025, "2025-03-15", "2025-03-17"], // Sat -> Mon
    [2025, "2025-06-15", "2025-06-16"], // Sun -> Mon
    [2022, "2022-04-30", "2022-05-02"], // Sat -> Mon
    [2024, "2024-12-15", "2024-12-16"], // Sun -> Mon
  ];
  for (const [year, official, effective] of cases) {
    const ds = find(year, official);
    assert.ok(ds.length > 0, `${official} is generated`);
    for (const d of ds) {
      assert.equal(d.effectiveDate, effective, `${official} -> ${effective}`);
      assert.equal(d.shifted, true);
    }
  }
  const [q4] = find(2026, "2026-12-15"); // Tuesday
  assert.equal(q4.effectiveDate, "2026-12-15");
  assert.equal(q4.shifted, false);
});

test("tax-deadlines: rule holds 2025-2040 (never a weekend, at most 2 days late)", () => {
  for (let y = 2025; y <= 2040; y++) {
    assert.equal(lib.craDeadlinesForYear(y).length, 6);
    const ds = [
      ...lib.craDeadlinesForYear(y),
      ...lib.gstAnnualDeadlinesForYear(y),
      ...lib.gstQuarterlyDeadlines(y),
    ];
    assert.equal(ds.length, 12);
    for (const d of ds) {
      const day = dow(d.effectiveDate);
      assert.ok(
        day !== 0 && day !== 6,
        `${d.officialDate} effective ${d.effectiveDate} is a weekend`,
      );
      const lag = daysBetween(d.officialDate, d.effectiveDate);
      assert.ok(lag >= 0 && lag <= 2, `${d.officialDate} shifted ${lag} days`);
      assert.equal(d.shifted, lag > 0);
    }
  }
});

/* ------------------------- Footer: one row per type ------------------------- */

/** The footer rows as [official date or rule text, label]: no weekend-shift note. */
const footer = (today: string, lang: "en" | "fr") =>
  lib
    .getFooterDeadlineRows(today)
    .map((r) =>
      r.deadline
        ? [lib.formatDeadlineDate(r.deadline.officialDate, lang), lib.footerRowLabel(r, lang)]
        : [lib.T2_DATE_TEXT[lang], lib.footerRowLabel(r, lang)],
    );

test("tax-deadlines: footer on 2026-11-14 -- the 5 expected rows, EN and FR", () => {
  assert.deepEqual(footer("2026-11-14", "en"), [
    ["Dec 15, 2026", "Income tax instalment (Q4)"],
    ["Jan 31, 2027", "GST/HST quarterly filers (Q4 2026)"],
    ["Apr 30, 2027", "2026 income tax and GST/HST balance"],
    ["Jun 15, 2027", "2026 self-employed and GST/HST returns"],
    ["6 months after fiscal year-end", "T2 corporate return"],
  ]);
  assert.deepEqual(footer("2026-11-14", "fr"), [
    ["15 déc. 2026", "Acompte provisionnel d'impôt (4e trimestre)"],
    ["31 janv. 2027", "Déclarants trimestriels de TPS/TVH (4e trimestre 2026)"],
    ["30 avr. 2027", "Solde 2026 d'impôt et de TPS/TVH"],
    ["15 juin 2027", "Déclarations 2026 (travailleurs autonomes et TPS/TVH)"],
    ["6 mois après la fin de l'exercice", "Déclaration T2 des sociétés"],
  ]);
});

test("tax-deadlines: footer rows roll over per type", () => {
  const row = (today: string, type: string) =>
    lib.getFooterDeadlineRows(today).find((r) => r.type === type)!;
  const q1 = row("2026-12-16", "instalment");
  assert.equal(q1.deadline!.officialDate, "2027-03-15");
  assert.equal(lib.footerRowLabel(q1, "en"), "Income tax instalment (Q1)");

  const gst = row("2027-02-02", "gst-quarterly");
  assert.equal(gst.deadline!.officialDate, "2027-04-30");
  assert.equal(lib.footerRowLabel(gst, "en"), "GST/HST quarterly filers (Q1 2027)");

  const bal = row("2027-05-01", "balance");
  assert.equal(bal.deadline!.officialDate, "2028-04-30");
  assert.equal(lib.footerRowLabel(bal, "en"), "2027 income tax and GST/HST balance");

  const ret = row("2027-06-16", "return");
  assert.equal(ret.deadline!.officialDate, "2028-06-15");
  assert.equal(lib.footerRowLabel(ret, "en"), "2027 self-employed and GST/HST returns");
});

test("tax-deadlines: a footer row stays through its last on-time day", () => {
  const gst = (today: string) =>
    lib.getFooterDeadlineRows(today).find((r) => r.type === "gst-quarterly")!.deadline!;
  // Jan 31, 2027 is a Sunday: on time until Monday Feb 1.
  assert.equal(gst("2027-02-01").officialDate, "2027-01-31");
  assert.equal(gst("2027-02-02").officialDate, "2027-04-30");
  // Same for the income tax rows: Jun 15, 2025 (Sunday) is listed on Jun 16.
  const ret = lib.getFooterDeadlineRows("2025-06-16").find((r) => r.type === "return")!;
  assert.equal(ret.deadline!.officialDate, "2025-06-15");
  assert.equal(
    lib.getFooterDeadlineRows("2025-06-17").find((r) => r.type === "return")!.deadline!
      .officialDate,
    "2026-06-15",
  );
});

test("tax-deadlines: footer rows sorted by date, ties in type order, T2 last; no merging", () => {
  const rows = lib.getFooterDeadlineRows("2027-03-16");
  assert.deepEqual(
    rows.map((r) => [r.type, r.deadline?.officialDate ?? null]),
    [
      ["gst-quarterly", "2027-04-30"],
      ["balance", "2027-04-30"],
      ["instalment", "2027-06-15"],
      ["return", "2027-06-15"],
      ["t2", null],
    ],
  );
  // Every date checked over 16 years: always 5 rows, one per type, T2 last.
  for (let y = 2025; y <= 2040; y++)
    for (const md of ["01-01", "02-01", "04-30", "06-16", "10-31", "12-31"]) {
      const r = lib.getFooterDeadlineRows(`${y}-${md}`);
      assert.equal(r.length, 5);
      assert.equal(new Set(r.map((x) => x.type)).size, 5);
      assert.equal(r.at(-1)!.type, "t2");
      const dates = r.slice(0, 4).map((x) => x.deadline!.officialDate);
      assert.deepEqual([...dates].sort(), dates);
    }
});

test("tax-deadlines: balance and return relate to tax year Y-1, instalments to Y", () => {
  for (const d of lib.craDeadlinesForYear(2027))
    assert.equal(d.taxYear, d.kind === "instalment" ? 2027 : 2026, `${d.kind} ${d.officialDate}`);
  for (const d of lib.gstAnnualDeadlinesForYear(2027)) assert.equal(d.taxYear, 2026);
});

/* ---------------------------- Labels and render ---------------------------- */

test("tax-deadlines: rendered strip -- 5 rows, no shifted notes, T2 rule text", () => {
  assert.equal(lib.formatOnTimeUntil("2025-06-16", "fr"), "à temps jusqu'au lun. 16 juin");
  assert.equal(lib.formatOnTimeUntil("2025-06-16", "en"), "on time until Mon, Jun 16");

  const en = decode(lib.renderStrip("en", "2026-11-14T18:00:00Z"));
  assert.equal((en.match(/<li/g) ?? []).length, 5);
  assert.ok(en.includes("Upcoming CRA deadlines"));
  // Jan 31, 2027 is a Sunday: the strip shows the official date only.
  assert.ok(en.includes("Jan 31, 2027"));
  assert.ok(!en.includes("on time until"));
  assert.ok(en.includes("6 months after fiscal year-end") && en.includes("T2 corporate return"));
  const fr = decode(lib.renderStrip("fr", "2026-11-14T18:00:00Z"));
  assert.equal((fr.match(/<li/g) ?? []).length, 5);
  assert.ok(fr.includes("Prochaines échéances de l'ARC"));
  assert.ok(fr.includes("31 janv. 2027"));
  assert.ok(!fr.includes("à temps jusqu'au"));
  assert.ok(fr.includes("6 mois après la fin de l'exercice"));
  // On 2025-06-16 (Pacific) the shifted Jun 15 rows are still listed, without a note.
  const jun16 = decode(lib.renderStrip("fr", "2025-06-16T19:00:00Z"));
  assert.ok(jun16.includes("15 juin 2025") && !jun16.includes("à temps jusqu'au"));
});

test("tax-deadlines: heading has no tax-year wording; source links open canada.ca in a new tab", () => {
  const en = decode(lib.renderStrip("en", "2026-11-14T18:00:00Z"));
  const fr = decode(lib.renderStrip("fr", "2026-11-14T18:00:00Z"));
  assert.ok(!/tax year|année d'imposition/.test(en + fr));
  assert.ok(
    en.includes(
      'href="https://www.canada.ca/en/revenue-agency/services/payments-cra/individual-payments/income-tax-instalments/due-dates.html"',
    ),
  );
  assert.ok(
    fr.includes(
      'href="https://www.canada.ca/fr/agence-revenu/services/paiements/paiements-arc/paiements-particuliers/impots-acomptes-provisionnels/dates-limites.html"',
    ),
  );
  for (const html of [en, fr])
    assert.ok(html.includes('target="_blank"') && html.includes('rel="noopener"'));
});

test("tax-deadlines: /ca and /fr footers show the strip; /us renders none", async () => {
  const now = "2026-11-14T18:00:00Z";
  const ca = decode(await lib.renderFooter("/ca", { now }));
  const fr = decode(await lib.renderFooter("/fr", { now }));
  assert.ok(ca.includes("Upcoming CRA deadlines") && ca.includes("Dec 15, 2026"));
  assert.ok(fr.includes("Prochaines échéances de l'ARC") && fr.includes("15 déc. 2026"));
  // The shifted Jan 31, 2027 row: official date and label only, no "on time until" note.
  assert.ok(ca.includes("Jan 31, 2027") && !ca.includes("on time until"));
  assert.ok(fr.includes("31 janv. 2027") && !fr.includes("à temps jusqu'au"));

  // Even if a clock were passed, the US footer has no strip; /us passes none.
  for (const props of [{ region: "us" }, { region: "us", now }]) {
    const us = decode(await lib.renderFooter("/us", props));
    assert.ok(us.includes("<footer"), "US footer renders");
    assert.ok(
      !us.includes("tax-deadlines-title") && !/deadlines|Key IRS dates/.test(us),
      "no deadline strip",
    );
  }
  const usRoute = readFileSync("src/routes/us/index.tsx", "utf8");
  assert.ok(usRoute.includes('<Footer region="us" />'));
  assert.ok(!usRoute.includes("getServerNow"));
});

/* ------------------------- GST/HST and next 12 months ------------------------- */

test("tax-deadlines: rule E -- quarterly dates for a year, Q4 rolls into Jan 31 of the next", () => {
  const q = lib.gstQuarterlyDeadlines(2027);
  assert.deepEqual(
    q.map((d) => [d.kind, d.quarter, d.officialDate, d.taxYear]),
    [
      ["gst-quarterly", 1, "2027-04-30", 2027],
      ["gst-quarterly", 2, "2027-07-31", 2027],
      ["gst-quarterly", 3, "2027-10-31", 2027],
      ["gst-quarterly", 4, "2028-01-31", 2027],
    ],
  );
  assert.deepEqual(
    lib.gstAnnualDeadlinesForYear(2027).map((d) => [d.kind, d.officialDate, d.taxYear]),
    [
      ["gst-annual-payment", "2027-04-30", 2026],
      ["gst-annual-return", "2027-06-15", 2026],
    ],
  );
});

test("tax-deadlines: weekend shifts on the new GST/HST dates", () => {
  const all = [2025, 2026, 2027].flatMap((y) => lib.gstQuarterlyDeadlines(y));
  for (const [official, effective] of [
    ["2026-01-31", "2026-02-02"], // Sat -> Mon
    ["2027-07-31", "2027-08-02"], // Sat -> Mon
    ["2027-10-31", "2027-11-01"], // Sun -> Mon
  ]) {
    const d = all.find((x) => x.officialDate === official)!;
    assert.ok(d, `${official} is generated`);
    assert.equal(d.effectiveDate, effective, `${official} -> ${effective}`);
    assert.equal(d.shifted, true);
  }
});

test("tax-deadlines: next 12 months on 2026-11-14", () => {
  const rows = lib.getCraDeadlinesNext12Months("2026-11-14");
  assert.equal(rows[0].officialDate, "2026-12-15");
  assert.ok(rows.at(-1)!.officialDate <= "2027-11-14", "ends within 12 months");
  const sorted = rows.map((r) => r.officialDate);
  assert.deepEqual([...sorted].sort(), sorted);
  assert.equal(new Set(sorted).size, sorted.length, "one row per official date");

  const jan31 = rows.find((r) => r.officialDate === "2027-01-31")!;
  assert.ok(jan31, "Jan 31 2027 (GST/HST Q4 2026) is listed");
  assert.equal(jan31.effectiveDate, "2027-02-01"); // Sunday -> Monday
  assert.equal(jan31.shifted, true);
  assert.equal(lib.formatOnTimeUntil(jan31.effectiveDate, "en"), "on time until Mon, Feb 1");

  const apr30 = rows.find((r) => r.officialDate === "2027-04-30")!;
  assert.deepEqual(
    apr30.deadlines.map((d) => d.kind),
    ["balance", "gst-annual-payment", "gst-quarterly"],
    "Apr 30 merges the income tax balance and GST/HST",
  );
  assert.deepEqual(
    rows.map((r) => r.officialDate),
    [
      "2026-12-15",
      "2027-01-31",
      "2027-03-15",
      "2027-04-30",
      "2027-06-15",
      "2027-07-31",
      "2027-09-15",
      "2027-10-31",
    ],
  );
});

test("tax-deadlines: the footer links to the deadlines page per locale", () => {
  const en = decode(lib.renderStrip("en", "2026-11-14T18:00:00Z"));
  const fr = decode(lib.renderStrip("fr", "2026-11-14T18:00:00Z"));
  assert.ok(en.includes('href="/ca/tax-deadlines"') && en.includes("All tax deadlines →"));
  assert.ok(fr.includes('href="/fr/echeances-fiscales"') && fr.includes("Toutes les échéances →"));
});

test("tax-deadlines: French '1er' on the first of the month; Jun 15 page-row order", () => {
  const rows = lib.getCraDeadlinesNext12Months("2026-11-14");
  const jan31 = rows.find((r) => r.officialDate === "2027-01-31")!;
  assert.equal(
    lib.formatOnTimeUntil(jan31.effectiveDate, "fr"),
    "à temps jusqu'au lun. 1er février",
  );
  assert.equal(lib.formatOnTimeUntil(jan31.effectiveDate, "en"), "on time until Mon, Feb 1");
  assert.equal(lib.formatOnTimeUntil("2025-06-16", "fr"), "à temps jusqu'au lun. 16 juin");

  const jun15 = rows.find((r) => r.officialDate === "2027-06-15")!;
  assert.deepEqual(
    jun15.deadlines.map((d) => d.kind),
    ["return", "gst-annual-return", "instalment"],
    "returns, then payments, then instalments",
  );
});

test("tax-deadlines: footer link hidden on both deadline pages, present on /ca and /fr", async () => {
  const now = "2026-11-14T18:00:00Z";
  const ca = decode(await lib.renderFooter("/ca", { now }));
  const fr = decode(await lib.renderFooter("/fr", { now }));
  assert.ok(ca.includes('href="/ca/tax-deadlines"') && ca.includes("All tax deadlines →"));
  assert.ok(fr.includes('href="/fr/echeances-fiscales"') && fr.includes("Toutes les échéances →"));
  for (const path of ["/ca/tax-deadlines", "/fr/echeances-fiscales"]) {
    const html = decode(await lib.renderFooter(path, { now }));
    assert.ok(html.includes("tax-deadlines-title"), `${path}: strip still shown`);
    assert.ok(
      !html.includes("All tax deadlines") && !html.includes("Toutes les échéances"),
      `${path}: link hidden`,
    );
  }
});
