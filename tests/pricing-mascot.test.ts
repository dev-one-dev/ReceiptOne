import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sharp from "sharp";

/**
 * The pricing card's peeking mascot must never cover feature-list text, at
 * any width from 375 to 1920. Checked in a headless browser when this landed
 * (2026-11-15: no text rect intersects the mascot's box on /ca, /fr, /us at
 * 375-1920); here the geometry that guarantees it is recomputed from the
 * classes in Pricing.tsx and the images' real proportions, so changing the
 * mascot's size or offset, the card's padding or the list's width without
 * redoing the maths fails.
 *
 * Coordinates are inside the card's border (its padding box, which is what the
 * absolutely positioned mascot is placed in).
 */

const SRC = readFileSync("src/components/site/Pricing.tsx", "utf8");
const REM = 16;

function num(re: RegExp, what: string): number {
  const m = re.exec(SRC);
  assert.ok(m, `${what} found in Pricing.tsx`);
  return Number(m[1]);
}

// The mascot <img>: bottom-0 -right-36 w-[28rem] ... sm:-right-40 sm:w-[30rem]
const mascotClass = /className=\{cn\(\s*"(pointer-events-none absolute bottom-0[^"]*)"/.exec(
  SRC,
)?.[1];
assert.ok(mascotClass, "mascot class string");
const pick = (re: RegExp) => Number(re.exec(mascotClass!)?.[1]);
// -right-n puts the image n * 4px past the card's right edge.
const MOBILE_OVERHANG = pick(/(?:^|\s)-right-(\d+)(?:\s|$)/) * 4;
const MOBILE_W = pick(/(?:^|\s)w-\[(\d+)rem\]/) * REM;
const SM_OVERHANG = pick(/sm:-right-(\d+)/) * 4;
const SM_W = pick(/sm:w-\[(\d+)rem\]/) * REM;

// The card: max-w-xl (576px) with a 1px border, p-7 / sm:p-9.
const CARD_MAX = 576;
assert.match(SRC, /relative mx-auto mt-8 w-full max-w-xl overflow-hidden rounded-card border/);
const PAD = num(/max-w-xl[^"]*\sp-(\d+)\s/, "card padding") * 4;
const SM_PAD = num(/max-w-xl[^"]*\ssm:p-(\d+)/, "card sm padding") * 4;

// The feature list's sm width: sm:max-w-[calc(100%-Npx)].
const SM_LIST_CUT = num(/<ul className="[^"]*sm:max-w-\[calc\(100%-(\d+)px\)\]/, "list sm width");

// The spacer under the list, below sm.
const spacer = /MASCOT_SPACER =\s*"([^"]+)"/.exec(SRC)?.[1] ?? "";
const sp = /pt-\[calc\(min\(100%_\+_(\d+)px,(\d+)px\)_\*_([\d.]+)_-_(\d+)px\)\]/.exec(spacer);
assert.ok(sp, "MASCOT_SPACER padding formula");
const [SP_ADD, SP_CAP, SP_RATIO, SP_SUB] = sp!.slice(1).map(Number);
assert.match(spacer, /\bsm:hidden\b/);
const CTA_MARGIN = 24; // mt-6 on the spacer/CTA cell
assert.match(SRC, /<div className="mt-6 grid">\s*<div aria-hidden className=\{MASCOT_SPACER\} \/>/);

const IMAGES = [
  "src/assets/figma/mileage-auto/Graphic-Small.webp",
  "src/assets/figma/mileage-auto/Graphic-Small2.webp",
  "src/assets/figma/mileage-auto/Graphic-Small3.webp",
  "src/assets/figma/mileage-auto/US/2.webp",
  "src/assets/figma/mileage-auto/US/3-removebg-preview.webp",
  "src/assets/figma/mileage-auto/US/1.webp",
];

test("pricing mascot: every mascot image is no taller than the spacer assumes", async () => {
  for (const file of IMAGES) {
    assert.ok(SRC.includes(file.replace("src/", "@/")), `${file} is a pricing mascot`);
    const { width, height } = await sharp(file).metadata();
    assert.ok(height! / width! <= SP_RATIO, `${file}: ${height}/${width} > ${SP_RATIO}`);
  }
});

test("pricing mascot: from sm, the feature list ends before the mascot's left edge", () => {
  // From sm (640px) the card is at its 576px max (640 - 2 * 24px page padding).
  const inner = CARD_MAX - 2;
  const imgW = Math.min(SM_W, inner); // img max-width: 100%
  const mascotLeft = inner - imgW + SM_OVERHANG;
  const listLeft = SM_PAD;
  const listRight = listLeft + (inner - 2 * SM_PAD - SM_LIST_CUT);
  assert.ok(listRight <= mascotLeft, `list right ${listRight} <= mascot left ${mascotLeft}`);
});

test("pricing mascot: below sm, the list ends above the mascot's top edge", () => {
  // Phones: card = viewport - 32px, from a 375px viewport up to 639px.
  for (let viewport = 320; viewport < 640; viewport++) {
    const inner = Math.min(viewport - 32, CARD_MAX) - 2;
    const imgW = Math.min(MOBILE_W, inner); // img max-width: 100%
    const mascotH = imgW * SP_RATIO; // bottom-anchored, so it covers this much of the card
    assert.ok(inner - imgW + MOBILE_OVERHANG >= 0, "mascot starts inside the card");
    const content = inner - 2 * PAD;
    const spacerH = Math.min(content + SP_ADD, SP_CAP) * SP_RATIO - SP_SUB;
    // List bottom -> card bottom: margin, the cell (>= spacer), padding, border.
    const below = CTA_MARGIN + spacerH + PAD + 1;
    assert.equal(SP_ADD, 2 * PAD, "spacer's % base adds the padding back to get the card width");
    assert.equal(SP_CAP, MOBILE_W, "spacer caps at the mascot's width");
    assert.ok(below >= mascotH, `${viewport}px: ${below.toFixed(1)} >= ${mascotH.toFixed(1)}`);
  }
});
