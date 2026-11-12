#!/usr/bin/env node
/**
 * Renders public/og-image.png (1200x630) with Playwright.
 *
 * Fills scripts/og/og-template.html with the header's logo SVGs and the
 * beaver mascot (hero-beaver-poster.png, inlined as a data URI), then
 * screenshots the page at exactly 1200x630. The card carries no prices,
 * discounts or other figures, so it never goes stale against pricing.ts.
 *
 * After regenerating, bump OG_IMAGE_VERSION in src/lib/seo.ts so social
 * platforms refetch the image.
 *
 * Run with: npm run og
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const OUTPUT = "public/og-image.png";
const TEMPLATE = "scripts/og/og-template.html";
const MASCOT = "src/assets/figma/hero-beaver-poster.png";
const WIDTH = 1200;
const HEIGHT = 630;

function withClass(svg, className) {
  return svg.replace("<svg", `<svg class="${className}"`);
}

function buildHtml() {
  const mark = readFileSync("src/assets/figma/logo-mark.svg", "utf8");
  const word = readFileSync("src/assets/figma/logo-wordmark.svg", "utf8");
  const mascot = `data:image/png;base64,${readFileSync(MASCOT).toString("base64")}`;
  return readFileSync(TEMPLATE, "utf8")
    .replace("{{LOGO_MARK_SVG}}", withClass(mark, "mark"))
    .replace("{{LOGO_WORDMARK_SVG}}", withClass(word, "word"))
    .replace("{{MASCOT_SRC}}", mascot);
}

async function renderCard(browser, html) {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // Headline sizing: try for two lines stepping down from 64px; if that would
  // mean going below 56px, take the largest size (<= 60px) that fits three
  // lines instead. A big three-line headline beats a small two-line one.
  const { size, lines } = await page.evaluate(() => {
    const h = document.querySelector(".headline");
    const root = document.documentElement;
    const linesAt = (px) => {
      root.style.setProperty("--headline-size", `${px}px`);
      const lineHeight = parseFloat(getComputedStyle(h).lineHeight);
      return Math.round(h.getBoundingClientRect().height / lineHeight);
    };
    for (let px = 64; px >= 56; px -= 2) if (linesAt(px) <= 2) return { size: px, lines: 2 };
    for (let px = 60; px >= 44; px -= 2) if (linesAt(px) <= 3) return { size: px, lines: 3 };
    return { size: 44, lines: linesAt(44) };
  });

  const overflow = await page.evaluate(() => {
    const left = document.querySelector(".left").getBoundingClientRect();
    return Array.from(document.querySelectorAll(".left *"))
      .map((el) => el.getBoundingClientRect())
      .some((r) => r.right > left.right + 1 || r.bottom > left.bottom + 1);
  });
  if (overflow) throw new Error("Left column text overflows its box; check the template.");

  const png = await page.screenshot({
    type: "png",
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
  });
  await page.close();
  return { png, size, lines };
}

const browser = await chromium.launch();
try {
  const { png, size, lines } = await renderCard(browser, buildHtml());
  writeFileSync(OUTPUT, png);
  console.log(
    `✓ wrote ${OUTPUT} (${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB, headline ${size}px on ${lines} lines)`,
  );
} finally {
  await browser.close();
}
