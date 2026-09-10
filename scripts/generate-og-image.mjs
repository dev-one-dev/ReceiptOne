#!/usr/bin/env node
/**
 * Renders public/og-image.png (1200x630): the logo lockup centred on the
 * paper background. A placeholder until a designed social card exists.
 * Run with: node scripts/generate-og-image.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const W = 1200;
const H = 630;
const PAPER = "#f5f4f0";
// logo-mark.svg is 40x40 and logo-wordmark.svg is 120x24; one scale keeps
// the same proportions the header uses.
const SCALE = 3.8;
const GAP = 32;

function raster(svgPath, width, height) {
  const svg = readFileSync(svgPath);
  return sharp(svg, { density: 72 * SCALE })
    .resize(width, height)
    .png()
    .toBuffer();
}

const markSize = Math.round(40 * SCALE);
const wordW = Math.round(120 * SCALE);
const wordH = Math.round(24 * SCALE);

const mark = await raster("src/assets/figma/logo-mark.svg", markSize, markSize);
const word = await raster("src/assets/figma/logo-wordmark.svg", wordW, wordH);

const totalW = markSize + GAP + wordW;
const left = Math.round((W - totalW) / 2);

const png = await sharp({
  create: { width: W, height: H, channels: 4, background: PAPER },
})
  .composite([
    { input: mark, left, top: Math.round((H - markSize) / 2) },
    { input: word, left: left + markSize + GAP, top: Math.round((H - wordH) / 2) },
  ])
  .png()
  .toBuffer();

writeFileSync("public/og-image.png", png);
console.log(`✓ wrote public/og-image.png (${W}x${H}, ${(png.length / 1024).toFixed(1)} KB)`);
