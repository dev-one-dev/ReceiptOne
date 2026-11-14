import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

/**
 * Footer tax deadlines (src/lib/tax-deadlines.ts, components/site/TaxDeadlines).
 * Renders the strip server-side with a fixed "now", the way the landing-page
 * loaders hand the server clock to the Footer.
 */

const DIR = resolve("node_modules/.cache/tax-deadlines-test");
const OUT = resolve(DIR, "render.mjs");
mkdirSync(DIR, { recursive: true });
await build({
  stdin: {
    contents: `
      import { renderToString } from "react-dom/server";
      import { createElement } from "react";
      import { TaxDeadlines } from "@/components/site/TaxDeadlines";
      export { upcomingTaxDeadlines, TAX_DEADLINES } from "@/lib/tax-deadlines";
      export const render = (region, lang, now) =>
        renderToString(createElement(TaxDeadlines, { region, lang, now }));
    `,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  alias: { "@": resolve("src") },
  bundle: true,
  packages: "external",
  jsx: "automatic",
  format: "esm",
  platform: "node",
  outfile: OUT,
  logLevel: "silent",
});

type Upcoming = {
  lang: string;
  title: string;
  sourceUrl: string;
  items: { date: string; display: string; label: string }[];
} | null;
const mod = (await import(pathToFileURL(OUT).href)) as {
  render: (region: string, lang: string, now: string) => string;
  upcomingTaxDeadlines: (region: string, lang: string, now: string) => Upcoming;
  TAX_DEADLINES: Record<string, { taxYear: number; deadlines: { date: string }[] }>;
};
const { render, upcomingTaxDeadlines, TAX_DEADLINES } = mod;

const dates = (u: Upcoming) => u?.items.map((i) => i.date) ?? [];
const decode = (html: string) => html.replace(/&#x27;|&#39;/g, "'");

test("tax-deadlines: data carries the 2026 tax year, dates sorted", () => {
  for (const set of Object.values(TAX_DEADLINES)) {
    assert.equal(set.taxYear, 2026);
    const d = set.deadlines.map((x) => x.date);
    assert.deepEqual([...d].sort(), d);
  }
});

test("tax-deadlines: only dates on or after today are listed", () => {
  // Mid-November 2026: all four CRA dates and both IRS dates are ahead.
  assert.deepEqual(dates(upcomingTaxDeadlines("ca", "en", "2026-11-14T18:00:00Z")), [
    "2026-12-15",
    "2027-03-15",
    "2027-04-30",
    "2027-06-15",
  ]);
  assert.deepEqual(dates(upcomingTaxDeadlines("us", "en", "2026-11-14T18:00:00Z")), [
    "2027-01-15",
    "2027-04-15",
  ]);
  // After the Q4 instalment: it drops off, the rest stay.
  assert.deepEqual(dates(upcomingTaxDeadlines("ca", "en", "2026-12-16T18:00:00Z")), [
    "2027-03-15",
    "2027-04-30",
    "2027-06-15",
  ]);
  // On the day itself (Pacific time) it is still listed.
  assert.deepEqual(dates(upcomingTaxDeadlines("ca", "en", "2027-06-16T05:00:00Z")), ["2027-06-15"]);
  assert.deepEqual(dates(upcomingTaxDeadlines("us", "en", "2027-01-16T06:00:00Z")), [
    "2027-01-15",
    "2027-04-15",
  ]);
  const html = render("ca", "en", "2027-04-01T12:00:00Z");
  assert.ok(!html.includes("Mar 15, 2027"), "past date not rendered");
  assert.ok(html.includes("Apr 30, 2027") && html.includes("Jun 15, 2027"));
});

test("tax-deadlines: the whole block is hidden once every date has passed", () => {
  assert.equal(upcomingTaxDeadlines("ca", "en", "2027-06-17T12:00:00Z"), null);
  assert.equal(upcomingTaxDeadlines("us", "en", "2027-04-17T12:00:00Z"), null);
  for (const [region, lang] of [
    ["ca", "en"],
    ["ca", "fr"],
    ["us", "en"],
  ])
    assert.equal(
      render(region, lang, "2027-07-01T12:00:00Z"),
      "",
      `${region}/${lang} renders nothing`,
    );
});

test("tax-deadlines: EN block shows title, dates, labels and the source link", () => {
  const html = decode(render("ca", "en", "2026-11-14T18:00:00Z"));
  assert.ok(html.includes("Key CRA dates — 2026 tax year"));
  assert.ok(html.includes("Dec 15, 2026") && html.includes("Q4 instalment"));
  assert.ok(html.includes("Self-employed return due"));
  assert.ok(
    html.includes(
      'href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/important-dates-individuals.html"',
    ),
  );
  assert.ok(html.includes('target="_blank"') && html.includes('rel="noopener"'));

  const us = decode(render("us", "en", "2026-11-14T18:00:00Z"));
  assert.ok(us.includes("Key IRS dates — 2026 tax year"));
  assert.ok(us.includes("Jan 15, 2027") && us.includes("Q4 estimated tax payment"));
  assert.ok(us.includes("Federal return and payment due"));
  assert.ok(us.includes('href="https://www.irs.gov/filing/individuals/when-to-file"'));
});

test("tax-deadlines: FR labels, French dates and the French source link", () => {
  const fr = upcomingTaxDeadlines("ca", "fr", "2026-11-14T18:00:00Z")!;
  assert.equal(fr.title, "Dates clés de l'ARC — année d'imposition 2026");
  assert.deepEqual(
    fr.items.map((i) => i.label),
    [
      "Versement du 4e trimestre",
      "Versement du 1er trimestre",
      "Paiement du solde dû",
      "Déclaration des travailleurs autonomes",
    ],
  );
  assert.equal(fr.items[0].display, "15 déc. 2026");
  assert.equal(
    fr.sourceUrl,
    "https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/dates-importantes-particuliers.html",
  );
  const html = decode(render("ca", "fr", "2026-11-14T18:00:00Z"));
  assert.ok(html.includes("Dates clés de l'ARC"));
  assert.ok(html.includes("Paiement du solde dû"));
  assert.ok(!html.includes("instalment"), "no English labels on the French block");
});
