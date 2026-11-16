#!/usr/bin/env node
/**
 * Writes the free mileage log templates served by /ca/mileage-log-template
 * and /fr/modele-registre-kilometrage:
 *
 *   public/downloads/receiptone-mileage-log-template.{xlsx,pdf}        (EN)
 *   public/downloads/receiptone-modele-registre-kilometrage.{xlsx,pdf} (FR)
 *
 * File names, sheet names, column headers and summary labels all come from
 * src/lib/mileage-log-template.ts, the same module the page renders from.
 *
 * The XLSX is written with exceljs: a "Trips" sheet whose Kilometres column is
 * a formula (end - start), and a "Year summary" sheet that totals the
 * kilometres from the odometer readings, sums the business kilometres with
 * SUMIF on Business = Yes, and divides the two. The PDF is an HTML template
 * printed by Playwright's Chromium: PDF_TRIP_PAGES pages of blank trip rows,
 * then a year-summary page.
 *
 * Run manually with `npm run templates` and commit the outputs. It is not part
 * of `prebuild`: the Vercel build has no Chromium, and the files only change
 * when the template does. tests/mileage-log-template.test.ts checks the
 * committed files.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ExcelJS from "exceljs";
import { chromium } from "playwright";
import { loadTs } from "./lib/load-ts.mjs";

const {
  TEMPLATE_LABELS,
  TEMPLATE_FILES,
  PDF_TRIP_PAGES,
  PDF_ROWS_PER_PAGE,
  PDF_PAGE_COUNT,
  XLSX_TRIP_ROWS,
} = await loadTs(`export * from "@/lib/mileage-log-template";`);

const OUT_DIR = resolve("public/downloads");
/** Fixed so regenerating an unchanged template gives the same workbook metadata. */
const STAMP = new Date("2026-11-16T00:00:00Z");

const INK = "FF0D0D14";
const HEADER_FILL = "FFEDECE7"; // paper, one step darker
const CALC_FILL = "FFF7F6F2";
const HAIRLINE = { style: "thin", color: { argb: "FFD9D8D3" } };
const BORDER = { top: HAIRLINE, left: HAIRLINE, bottom: HAIRLINE, right: HAIRLINE };

/* --------------------------------- XLSX ---------------------------------- */

/** 'Sheet name'!A1 reference, quoted (the FR sheet name has an accent). */
const ref = (sheet, range) => `'${sheet.replace(/'/g, "''")}'!${range}`;

export async function buildWorkbook(lang) {
  const L = TEMPLATE_LABELS[lang];
  const wb = new ExcelJS.Workbook();
  wb.creator = "ReceiptOne";
  wb.created = STAMP;
  wb.modified = STAMP;
  wb.calcProperties.fullCalcOnLoad = true;

  /* Trips */
  const trips = wb.addWorksheet(L.tripsSheet, {
    views: [{ state: "frozen", ySplit: 1 }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      horizontalCentered: true,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 },
    },
    headerFooter: { oddFooter: `&L${L.title}&R${L.page("&P", "&N")}` },
  });
  trips.columns = [
    { width: 12 }, // Date
    { width: 24 }, // Start location
    { width: 24 }, // Destination
    { width: 34 }, // Purpose
    { width: 15 }, // Start odometer
    { width: 15 }, // End odometer
    { width: 12 }, // Kilometres
    { width: 18 }, // Business?
  ];
  trips.pageSetup.printTitlesRow = "1:1";

  const header = trips.getRow(1);
  header.values = L.columns;
  header.height = 30;
  header.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: INK } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL } };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.border = BORDER;
  });

  const last = XLSX_TRIP_ROWS + 1;
  for (let r = 2; r <= last; r++) {
    const row = trips.getRow(r);
    row.getCell(1).numFmt = "yyyy-mm-dd";
    row.getCell(5).numFmt = "#,##0";
    row.getCell(6).numFmt = "#,##0";
    const km = row.getCell(7);
    km.value = { formula: `IF(AND(ISNUMBER(E${r}),ISNUMBER(F${r})),F${r}-E${r},"")` };
    km.numFmt = "#,##0";
    km.fill = { type: "pattern", pattern: "solid", fgColor: { argb: CALC_FILL } };
    for (let c = 1; c <= 8; c++) row.getCell(c).border = BORDER;
  }
  trips.dataValidations.add(`H2:H${last}`, {
    type: "list",
    allowBlank: true,
    formulae: [`"${L.yes},${L.no}"`],
    showErrorMessage: true,
    errorTitle: L.columns[7],
    error: `${L.yes} / ${L.no}`,
  });
  trips.autoFilter = { from: "A1", to: "H1" };

  /* Year summary */
  const sum = wb.addWorksheet(L.summarySheet, {
    pageSetup: {
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      margins: { left: 0.6, right: 0.6, top: 0.7, bottom: 0.7, header: 0.3, footer: 0.3 },
    },
  });
  sum.columns = [{ width: 52 }, { width: 22 }];
  sum.getCell("A1").value = L.title;
  sum.getCell("A1").font = { bold: true, size: 16, color: { argb: INK } };

  const labelRows = [
    [3, L.vehicle],
    [4, L.fiscalPeriod],
    [6, L.odometerStart],
    [7, L.odometerEnd],
    [8, L.totalKm],
    [9, L.businessKm],
    [10, L.businessUse],
  ];
  for (const [r, label] of labelRows) {
    const a = sum.getCell(`A${r}`);
    a.value = label;
    a.border = BORDER;
    a.alignment = { vertical: "middle", wrapText: true };
    sum.getCell(`B${r}`).border = BORDER;
    sum.getRow(r).height = 22;
  }
  for (const r of [6, 7]) sum.getCell(`B${r}`).numFmt = "#,##0";

  const kmRange = ref(L.tripsSheet, `G2:G${last}`);
  const flagRange = ref(L.tripsSheet, `H2:H${last}`);
  sum.getCell("B8").value = { formula: `IF(AND(ISNUMBER(B6),ISNUMBER(B7)),B7-B6,"")` };
  sum.getCell("B8").numFmt = "#,##0";
  sum.getCell("B9").value = { formula: `SUMIF(${flagRange},"${L.yes}",${kmRange})` };
  sum.getCell("B9").numFmt = "#,##0";
  sum.getCell("B10").value = { formula: `IF(AND(ISNUMBER(B8),B8>0),B9/B8,"")` };
  sum.getCell("B10").numFmt = "0.0%";
  for (const r of [8, 9, 10]) {
    sum.getCell(`B${r}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: CALC_FILL } };
    sum.getCell(`A${r}`).font = { bold: r === 10, color: { argb: INK } };
    sum.getCell(`B${r}`).font = { bold: r === 10, color: { argb: INK } };
  }

  L.notes.forEach((note, i) => {
    const cell = sum.getCell(`A${12 + i}`);
    sum.mergeCells(`A${12 + i}:B${12 + i}`);
    cell.value = note;
    cell.alignment = { wrapText: true, vertical: "top" };
    cell.font = { size: 10, color: { argb: "FF55555B" } };
    sum.getRow(12 + i).height = 30;
  });
  const foot = sum.getCell(`A${13 + L.notes.length}`);
  foot.value = L.footer;
  foot.font = { size: 9, color: { argb: "FF85858A" } };

  return wb;
}

/* ---------------------------------- PDF ---------------------------------- */

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const FONTS =
  "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Geist+Mono:wght@400&display=block";

const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: "Inter Tight", "Segoe UI", Arial, sans-serif; color: #0d0d14; }
  .mono { font-family: "Geist Mono", ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.025em; font-weight: 400; }
`;

/** One trip page: heading, vehicle line, 25 blank rows and a page total. */
function tripPage(L, n) {
  const rows = Array.from(
    { length: PDF_ROWS_PER_PAGE },
    () => `<tr>${"<td></td>".repeat(7)}<td class="yn">${esc(L.yes)} / ${esc(L.no)}</td></tr>`,
  ).join("");
  return `
  <section class="page">
    <header>
      <div><p class="mono eyebrow">ReceiptOne</p><h1>${esc(L.title)}</h1></div>
      <div class="fields">
        <p><span>${esc(L.vehicle)}</span><i></i></p>
        <p><span>${esc(L.fiscalPeriod)}</span><i></i></p>
      </div>
    </header>
    <table>
      <colgroup>
        <col style="width:9%"><col style="width:15%"><col style="width:15%"><col style="width:23%">
        <col style="width:10%"><col style="width:10%"><col style="width:8%"><col style="width:10%">
      </colgroup>
      <thead><tr>${L.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="6" class="total">${esc(L.pageTotal)}</td><td></td><td></td></tr></tfoot>
    </table>
    <footer><span>${esc(L.footer)}</span><span>${esc(L.page(n, PDF_PAGE_COUNT))}</span></footer>
  </section>`;
}

function summaryPage(L) {
  const line = (label, hint = "") =>
    `<tr><th>${esc(label)}</th><td>${hint ? `<span class="hint">${esc(hint)}</span>` : ""}</td></tr>`;
  return `
  <section class="page">
    <header>
      <div><p class="mono eyebrow">ReceiptOne</p><h1>${esc(L.title)} · ${esc(L.summarySheet)}</h1></div>
    </header>
    <table class="summary">
      ${line(L.vehicle)}
      ${line(L.fiscalPeriod)}
      ${line(L.odometerStart, "km")}
      ${line(L.odometerEnd, "km")}
      ${line(L.totalKm, "km")}
      ${line(L.businessKm, "km")}
      ${line(L.businessUse, "%")}
    </table>
    <ul class="notes">${L.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
    <footer><span>${esc(L.footer)}</span><span>${esc(L.page(PDF_PAGE_COUNT, PDF_PAGE_COUNT))}</span></footer>
  </section>`;
}

/**
 * Letter landscape with 12 mm margins. Every page's content sits inside a
 * 255 x 186 mm box, which also fits inside A4 landscape (297 x 210 mm) at
 * actual size, so the same file prints on both papers.
 */
export function pdfHtml(lang) {
  const L = TEMPLATE_LABELS[lang];
  const pages = Array.from({ length: PDF_TRIP_PAGES }, (_, i) => tripPage(L, i + 1)).join("");
  return `<!DOCTYPE html><html lang="${lang === "fr" ? "fr-CA" : "en-CA"}"><head><meta charset="utf-8">
  <title>${esc(L.title)}</title>
  <link rel="stylesheet" href="${FONTS}">
  <style>${BASE_CSS}
    .page { width: 255mm; height: 186mm; display: flex; flex-direction: column; break-after: page; overflow: hidden; }
    .page:last-child { break-after: auto; }
    header { display: flex; justify-content: space-between; align-items: flex-end; gap: 10mm; padding-bottom: 3mm; border-bottom: 0.4mm solid #0d0d14; }
    .eyebrow { font-size: 7.5pt; color: rgba(13,13,20,.6); }
    h1 { font-size: 17pt; font-weight: 600; letter-spacing: -0.025em; margin-top: 0.5mm; }
    .fields { display: flex; gap: 6mm; font-size: 8.5pt; color: rgba(13,13,20,.8); }
    .fields p { display: flex; align-items: flex-end; gap: 2mm; }
    .fields i { display: inline-block; width: 48mm; border-bottom: 0.25mm solid rgba(13,13,20,.4); height: 4mm; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-top: 3mm; }
    th, td { border: 0.25mm solid rgba(13,13,20,.25); }
    thead th { background: #edece7; font-size: 7.5pt; font-weight: 600; text-align: left; padding: 1.4mm 1.6mm; height: 9mm; vertical-align: bottom; line-height: 1.15; }
    tbody td { height: 5.75mm; }
    td.yn { font-size: 6.5pt; color: rgba(13,13,20,.35); text-align: center; }
    tfoot td { height: 6.5mm; background: #f7f6f2; }
    td.total { font-size: 7.5pt; font-weight: 600; text-align: right; padding-right: 2mm; }
    footer { margin-top: auto; display: flex; justify-content: space-between; font-size: 7pt; color: rgba(13,13,20,.6); padding-top: 2mm; }
    table.summary { width: 170mm; margin-top: 8mm; }
    table.summary th { width: 110mm; text-align: left; font-size: 10.5pt; font-weight: 500; padding: 0 3mm; background: #f7f6f2; }
    table.summary td { height: 13mm; position: relative; }
    .hint { position: absolute; right: 3mm; bottom: 2mm; font-size: 9pt; color: rgba(13,13,20,.4); }
    table.summary tr:last-child th { font-weight: 600; }
    .notes { margin-top: 8mm; width: 170mm; padding-left: 4mm; font-size: 9pt; line-height: 1.45; color: rgba(13,13,20,.8); }
    .notes li + li { margin-top: 1.5mm; }
  </style></head><body>${pages}${summaryPage(L)}</body></html>`;
}

/* --------------------------------- main ---------------------------------- */

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const lang of ["en", "fr"]) {
    const wb = await buildWorkbook(lang);
    const file = resolve(OUT_DIR, TEMPLATE_FILES[lang].xlsx);
    writeFileSync(file, Buffer.from(await wb.xlsx.writeBuffer()));
    console.log(`✓ wrote ${file}`);
  }

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const lang of ["en", "fr"]) {
      await page.setContent(pdfHtml(lang), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const pdf = await page.pdf({
        format: "Letter",
        landscape: true,
        margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
        printBackground: true,
      });
      const file = resolve(OUT_DIR, TEMPLATE_FILES[lang].pdf);
      writeFileSync(file, pdf);
      console.log(`✓ wrote ${file}`);
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  await main();
