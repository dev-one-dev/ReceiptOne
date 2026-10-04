#!/usr/bin/env node
/**
 * Renders public/logo-512.png (512x512) from the header's logo mark. This is
 * the Organization logo in JSON-LD -- search engines want a raster image at
 * least 112px square, which the SVG favicon is not.
 *
 * Run with: node scripts/generate-logo.mjs
 * (sharp is not a direct dependency; it comes in transitively. Add it as a
 * devDependency if this import ever fails.)
 */
import { readFileSync } from "node:fs";
import sharp from "sharp";

const SOURCE = "src/assets/figma/logo-mark.svg";
const OUTPUT = "public/logo-512.png";
const SIZE = 512;

// The mark is drawn on a 40x40 viewBox; rasterize at a density that lands
// above 512px so the downscale stays sharp.
await sharp(readFileSync(SOURCE), { density: Math.ceil((72 * SIZE) / 40) * 2 })
  .resize(SIZE, SIZE)
  .png()
  .toFile(OUTPUT);

const meta = await sharp(OUTPUT).metadata();
console.log(`✓ wrote ${OUTPUT} (${meta.width}x${meta.height})`);
