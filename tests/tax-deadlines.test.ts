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
type Row = { officialDate: string; effectiveDate: string; shifted: boolean; deadlines: Deadline[] };
const lib = (await import(pathToFileURL(OUT).href)) as {
  renderStrip: (lang: string, now: string) => string;
  renderFooter: (path: string, props: Record<string, unknown>) => Promise<string>;
  craDeadlinesForYear: (y: number) => Deadline[];
  gstAnnualDeadlinesForYear: (y: number) => Deadline[];
  gstQuarterlyDeadlines: (y: number) => Deadline[];
  getCraDeadlinesNext12Months: (today: string) => Row[];
  getUpcomingCraDeadlines: (today: string, count?: number) => Row[];
  craRowLabel: (row: Row, lang: string) => string;
  formatOnTimeUntil: (date: string, lang: string) => string;
  weekendShift: (date: string) => string;
};

const decode = (html: string) => html.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&");
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

/* -------------------------------- Upcoming -------------------------------- */

test("tax-deadlines: footer on 2026-11-14 is Q4, Q1, Apr 30, Jun 15 -- 4 rows, no GST/HST quarterly", () => {
  const rows = lib.getUpcomingCraDeadlines("2026-11-14");
  assert.deepEqual(
    rows.map((r) => [r.officialDate, lib.craRowLabel(r, "en"), r.shifted]),
    [
      ["2026-12-15", "Q4 instalment", false],
      ["2027-03-15", "Q1 instalment", false],
      ["2027-04-30", "Pay 2026 income tax and GST/HST balance", false],
      ["2027-06-15", "File 2026 self-employed and GST/HST returns · Q2 instalment", false],
    ],
  );
  assert.ok(
    rows.every((r) => r.deadlines.every((d) => d.kind !== "gst-quarterly")),
    "no rule-E rows in the footer",
  );
  // Jan 31 (GST/HST Q4) would fall between Dec 15 and Mar 15; it is not there.
  assert.ok(!rows.some((r) => r.officialDate === "2027-01-31"));
});

test("tax-deadlines: year rollover -- on 2026-12-16 the first row is Mar 15 2027", () => {
  assert.equal(lib.getUpcomingCraDeadlines("2026-12-16")[0].officialDate, "2027-03-15");
});

test("tax-deadlines: a deadline stays listed through its last on-time day", () => {
  // Jun 15 2025 was a Sunday: on time until Monday Jun 16.
  const on16 = lib.getUpcomingCraDeadlines("2025-06-16");
  assert.equal(on16[0].officialDate, "2025-06-15");
  assert.equal(on16[0].effectiveDate, "2025-06-16");
  assert.equal(on16[0].shifted, true);
  assert.ok(
    !lib.getUpcomingCraDeadlines("2025-06-17").some((r) => r.officialDate === "2025-06-15"),
  );
});

test("tax-deadlines: balance and return relate to tax year Y-1, instalments to Y", () => {
  for (const d of lib.craDeadlinesForYear(2027))
    assert.equal(d.taxYear, d.kind === "instalment" ? 2027 : 2026, `${d.kind} ${d.officialDate}`);
  const rows = lib.getUpcomingCraDeadlines("2027-01-01");
  assert.equal(lib.craRowLabel(rows[1], "en"), "Pay 2026 income tax and GST/HST balance");
  assert.equal(lib.craRowLabel(rows[1], "fr"), "Payer le solde 2026 d'impôt et de TPS/TVH");
  assert.ok(
    lib.craRowLabel(rows[2], "en").startsWith("File 2026 self-employed and GST/HST returns"),
  );
  for (const d of [...lib.gstAnnualDeadlinesForYear(2027)]) assert.equal(d.taxYear, 2026);
});

/* ---------------------------- Labels and render ---------------------------- */

test("tax-deadlines: FR labels and the FR shifted note", () => {
  const rows = lib.getUpcomingCraDeadlines("2026-11-14");
  assert.deepEqual(
    rows.map((r) => lib.craRowLabel(r, "fr")),
    [
      "Acompte provisionnel du 4e trimestre",
      "Acompte provisionnel du 1er trimestre",
      "Payer le solde 2026 d'impôt et de TPS/TVH",
      "Produire les déclarations 2026 (travailleurs autonomes et TPS/TVH) · Acompte provisionnel du 2e trimestre",
    ],
  );
  assert.equal(lib.formatOnTimeUntil("2025-06-16", "fr"), "à temps jusqu'au lun. 16 juin");
  assert.equal(lib.formatOnTimeUntil("2025-06-16", "en"), "on time until Mon, Jun 16");

  // Rendered: on 2025-06-16 (Pacific) the shifted Jun 15 row carries the note.
  const fr = decode(lib.renderStrip("fr", "2025-06-16T19:00:00Z"));
  assert.ok(fr.includes("Prochaines échéances de l'ARC"));
  assert.ok(fr.includes("15 juin 2025"));
  assert.ok(fr.includes("à temps jusqu'au lun. 16 juin"));
  const en = decode(lib.renderStrip("en", "2025-06-16T19:00:00Z"));
  assert.ok(en.includes("Upcoming CRA deadlines") && en.includes("on time until Mon, Jun 16"));
  // Nothing shifted in the 2026-11-14 window, so no note.
  assert.ok(!decode(lib.renderStrip("en", "2026-11-14T18:00:00Z")).includes("on time until"));
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

test("tax-deadlines: French '1er' on the first of the month; Jun 15 row order", () => {
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
  // The footer labels are unchanged by the reorder.
  const footer = lib.getUpcomingCraDeadlines("2026-11-14");
  assert.equal(
    lib.craRowLabel(footer[3], "en"),
    "File 2026 self-employed and GST/HST returns · Q2 instalment",
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
