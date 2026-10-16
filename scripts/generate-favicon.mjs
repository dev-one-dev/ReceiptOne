#!/usr/bin/env node
/**
 * Renders public/favicon.ico (16, 32 and 48px) from the header's logo mark.
 * The SVG favicon stays primary; this file exists for browsers and crawlers
 * that request /favicon.ico by convention.
 *
 * Run with: node scripts/generate-favicon.mjs
 * (sharp is not a direct dependency; it comes in transitively. Add it as a
 * devDependency if this import ever fails.)
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const SOURCE = "src/assets/figma/logo-mark.svg";
const OUTPUT = "public/favicon.ico";
const SIZES = [16, 32, 48];

const svg = readFileSync(SOURCE);

// The mark is drawn on a 40x40 viewBox; rasterize well above each target size
// so the downscale stays sharp.
const images = await Promise.all(
  SIZES.map((size) =>
    sharp(svg, { density: Math.ceil((72 * size) / 40) * 4 })
      .resize(size, size)
      .png()
      .toBuffer(),
  ),
);

// ICO container: 6-byte header, a 16-byte directory entry per image, then the
// PNG payloads (PNG-in-ICO is supported by every current browser).
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);

let offset = 6 + 16 * images.length;
const entries = images.map((png, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(SIZES[i] % 256, 0); // width (0 means 256)
  entry.writeUInt8(SIZES[i] % 256, 1); // height
  entry.writeUInt8(0, 2); // palette colours
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});

writeFileSync(OUTPUT, Buffer.concat([header, ...entries, ...images]));
console.log(`✓ wrote ${OUTPUT} (${SIZES.join(", ")}px)`);
