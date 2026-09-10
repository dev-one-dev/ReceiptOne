#!/usr/bin/env node
/**
 * Renders public/og-image.png (1200x630) with Playwright.
 *
 * 1. Starts the Vite dev server (or uses OG_BASE_URL if set), opens /ca and
 *    screenshots the first Pricing card at 2x. The hero's own visual is the
 *    mascot video, so the pricing card stands in as the product visual.
 * 2. Injects that screenshot plus the header's logo SVGs into
 *    scripts/og/og-template.html and screenshots the page at exactly 1200x630.
 *
 * Run with: npm run og
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const OUTPUT = "public/og-image.png";
const TEMPLATE = "scripts/og/og-template.html";
const WIDTH = 1200;
const HEIGHT = 630;
const PORT = 5199;
const CARD_SELECTOR = "#pricing .max-w-xl";

/* ----------------------------- dev server ------------------------------ */

async function waitForServer(url, timeoutMs = 90_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Dev server did not respond at ${url} within ${timeoutMs}ms`);
}

function startDevServer() {
  const child = spawn(
    "npx",
    ["vite", "dev", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
    { shell: true, stdio: ["ignore", "ignore", "pipe"] },
  );
  child.stderr.on("data", (d) => process.stderr.write(d));
  return child;
}

function stopDevServer(child) {
  if (!child) return;
  if (process.platform === "win32") {
    // shell:true means child.pid is the cmd.exe wrapper; kill the whole tree.
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
}

/* ------------------------------ screenshot ----------------------------- */

async function screenshotPricingCard(browser, baseUrl) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2,
  });
  await page.goto(`${baseUrl}/ca`, { waitUntil: "networkidle" });
  // The fixed header would otherwise overlap whatever scrolls under it, and
  // the store-badge row is dropped so the card ends cleanly on the trial CTA
  // instead of the canvas edge slicing through the badges.
  await page.addStyleTag({
    content: [
      "header { visibility: hidden !important; }",
      `${CARD_SELECTOR} a[aria-label^="Download ReceiptOne"],`,
      `${CARD_SELECTOR} a[aria-label^="Get ReceiptOne"] { display: none !important; }`,
    ].join("\n"),
  });

  const card = page.locator(CARD_SELECTOR).first();
  await card.waitFor({ state: "visible" });
  await card.scrollIntoViewIfNeeded();
  // Lazy-loaded mascot art inside the card; wait for every <img> to settle.
  await card.evaluate((el) =>
    Promise.all(
      Array.from(el.querySelectorAll("img")).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            }),
      ),
    ),
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400); // let the card's crossfade finish

  const png = await card.screenshot({ type: "png" });
  await page.close();
  return `data:image/png;base64,${png.toString("base64")}`;
}

/* -------------------------------- render ------------------------------- */

function withClass(svg, className) {
  return svg.replace("<svg", `<svg class="${className}"`);
}

function buildHtml(screenshotSrc) {
  const mark = readFileSync("src/assets/figma/logo-mark.svg", "utf8");
  const word = readFileSync("src/assets/figma/logo-wordmark.svg", "utf8");
  return readFileSync(TEMPLATE, "utf8")
    .replace("{{LOGO_MARK_SVG}}", withClass(mark, "mark"))
    .replace("{{LOGO_WORDMARK_SVG}}", withClass(word, "word"))
    .replace("{{SCREENSHOT_SRC}}", screenshotSrc);
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

/* --------------------------------- main -------------------------------- */

let devServer;
const browser = await chromium.launch();
try {
  let baseUrl = process.env.OG_BASE_URL;
  if (!baseUrl) {
    baseUrl = `http://127.0.0.1:${PORT}`;
    devServer = startDevServer();
    await waitForServer(`${baseUrl}/ca`);
  }
  const shot = await screenshotPricingCard(browser, baseUrl);
  const { png, size, lines } = await renderCard(browser, buildHtml(shot));
  writeFileSync(OUTPUT, png);
  console.log(
    `✓ wrote ${OUTPUT} (${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} KB, headline ${size}px on ${lines} lines)`,
  );
} finally {
  await browser.close();
  stopDevServer(devServer);
}
