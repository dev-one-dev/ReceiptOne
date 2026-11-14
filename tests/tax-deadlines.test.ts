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
    const ds = lib.craDeadlinesForYear(y);
    assert.equal(ds.length, 6);
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

test("tax-deadlines: upcoming on 2026-11-14 is Q4, Q1, 2026 balance, 2026 return · Q2", () => {
  const rows = lib.getUpcomingCraDeadlines("2026-11-14");
  assert.deepEqual(
    rows.map((r) => [r.officialDate, lib.craRowLabel(r, "en"), r.shifted]),
    [
      ["2026-12-15", "Q4 instalment (if you pay by instalments)", false],
      ["2027-03-15", "Q1 instalment (if you pay by instalments)", false],
      ["2027-04-30", "Pay 2026 balance owing", false],
      [
        "2027-06-15",
        "File 2026 self-employed return · Q2 instalment (if you pay by instalments)",
        false,
      ],
    ],
  );
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
  assert.ok(lib.craRowLabel(rows[1], "en").includes("Pay 2026 balance owing"));
  assert.ok(lib.craRowLabel(rows[1], "fr").includes("Payer le solde de 2026"));
  assert.ok(lib.craRowLabel(rows[2], "en").startsWith("File 2026 self-employed return"));
});

/* ---------------------------- Labels and render ---------------------------- */

test("tax-deadlines: FR labels and the FR shifted note", () => {
  const rows = lib.getUpcomingCraDeadlines("2026-11-14");
  assert.deepEqual(
    rows.map((r) => lib.craRowLabel(r, "fr")),
    [
      "Acompte provisionnel du 4e trimestre (si vous payez par acomptes)",
      "Acompte provisionnel du 1er trimestre (si vous payez par acomptes)",
      "Payer le solde de 2026",
      "Produire la déclaration 2026 (travailleurs autonomes) · Acompte provisionnel du 2e trimestre (si vous payez par acomptes)",
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
