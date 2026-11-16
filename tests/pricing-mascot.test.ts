import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sharp from "sharp";

/**
 * The pricing card's peeking mascot must never cover the plan title, price,
 * feature-list text or the buttons. Checked in a headless browser when this
 * landed (2026-11-15: sm+ — no feature text intersects the mascot's box on
 * /ca, /fr, /us at 640-1920; below sm — nothing in the card intersects it on
 * /ca, /fr, /us, /ca/drivers at 320, 375, 414, 480, 600, 639); here the
 * geometry that guarantees it is recomputed from the classes in Pricing.tsx
 * and the images' real proportions, so changing the mascot's size or offset,
 * the card's padding or the list's width without redoing the maths fails.
 *
 * Coordinates are inside the card's border (its padding box, which is what the
 * absolutely positioned mascot is placed in).
 */

const SRC = readFileSync("src/components/site/Pricing.tsx", "utf8");
const REM = 16;
/** Tallest mascot image, height per unit of width (checked below). */
const MAX_RATIO = 0.922;

function num(re: RegExp, what: string): number {
  const m = re.exec(SRC);
  assert.ok(m, `${what} found in Pricing.tsx`);
  return Number(m[1]);
}

// The mascot <img>: top-6 -right-3 w-[5.5rem] ... sm:top-auto sm:bottom-0 sm:-right-40 sm:w-[30rem]
const mascotClass = /className=\{cn\(\s*"(pointer-events-none absolute [^"]*)"/.exec(SRC)?.[1];
assert.ok(mascotClass, "mascot class string");
const pick = (re: RegExp) => {
  const m = re.exec(mascotClass!);
  assert.ok(m, `${re} in the mascot's classes`);
  return Number(m[1]);
};
// -right-n puts the image n * 4px past the card's right edge.
const MOBILE_TOP = pick(/(?:^|\s)top-(\d+)(?:\s|$)/) * 4;
const MOBILE_OVERHANG = pick(/(?:^|\s)-right-(\d+)(?:\s|$)/) * 4;
const MOBILE_W = pick(/(?:^|\s)w-\[([\d.]+)rem\]/) * REM;
const SM_OVERHANG = pick(/sm:-right-(\d+)/) * 4;
const SM_W = pick(/sm:w-\[(\d+)rem\]/) * REM;
assert.match(mascotClass!, /\bsm:top-auto sm:bottom-0\b/, "from sm the mascot is bottom-anchored");

// The card: max-w-xl (576px) with a 1px border, p-7 / sm:p-9.
const CARD_MAX = 576;
assert.match(SRC, /relative mx-auto mt-8 w-full max-w-xl overflow-hidden rounded-card border/);
const PAD = num(/max-w-xl[^"]*\sp-(\d+)\s/, "card padding") * 4;
const SM_PAD = num(/max-w-xl[^"]*\ssm:p-(\d+)/, "card sm padding") * 4;

// The feature list's sm width: sm:max-w-[calc(100%-Npx)].
const SM_LIST_CUT = num(/<ul className="[^"]*sm:max-w-\[calc\(100%-(\d+)px\)\]/, "list sm width");

// Below sm the title + price block reserves pr-N for the mascot.
const HEAD_PR =
  num(/<div className="pr-(\d+) sm:pr-0">\s*<h3 className="eyebrow">/, "title/price block") * 4;

const IMAGES = [
  "src/assets/figma/mileage-auto/Graphic-Small.webp",
  "src/assets/figma/mileage-auto/Graphic-Small2.webp",
  "src/assets/figma/mileage-auto/Graphic-Small3.webp",
  "src/assets/figma/mileage-auto/US/2.webp",
  "src/assets/figma/mileage-auto/US/3-removebg-preview.webp",
  "src/assets/figma/mileage-auto/US/1.webp",
];

test("pricing mascot: every mascot image is no taller than the layout assumes", async () => {
  for (const file of IMAGES) {
    assert.ok(SRC.includes(file.replace("src/", "@/")), `${file} is a pricing mascot`);
    const { width, height } = await sharp(file).metadata();
    assert.ok(height! / width! <= MAX_RATIO, `${file}: ${height}/${width} > ${MAX_RATIO}`);
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

test("pricing mascot: below sm, a small avatar beside the title and price", () => {
  // Rendered heights of the title/price block's rows (Inter Tight): eyebrow
  // 16px line + mt-3, price row 38px (text-h2 at 36px on phones).
  const EYEBROW = 16 + 12;
  const PRICE_ROW = 38;
  const DIVIDER = 24 + 1 + 24; // my-6 h-px
  const mascotH = MOBILE_W * MAX_RATIO;
  assert.ok(mascotH >= 80 && mascotH <= 96, `mascot ${mascotH.toFixed(1)}px tall, 80-96`);

  // Phones: card = viewport - 32px, 320px up to 639px.
  for (let viewport = 320; viewport < 640; viewport++) {
    const inner = Math.min(viewport - 32, CARD_MAX) - 2;
    const mascotLeft = inner + MOBILE_OVERHANG - MOBILE_W;
    // Title + price block: from the padding to the padding minus pr-N.
    const headRight = inner - PAD - HEAD_PR;
    assert.ok(headRight <= mascotLeft, `${viewport}px: title/price ${headRight} <= ${mascotLeft}`);
    // The widest price ("CAD 129.99", 177px) still fits in that block.
    assert.ok(headRight - PAD >= 177, `${viewport}px: price fits in ${headRight - PAD}px`);
    // The overhang crops at most the images' white side margin (~12%).
    assert.ok(MOBILE_OVERHANG <= MOBILE_W * 0.14, "overhang only crops the margin");
    // Everything below the title/price block (list, buttons) starts under the mascot.
    const listTop = PAD + EYEBROW + PRICE_ROW + DIVIDER;
    const mascotBottom = MOBILE_TOP + mascotH;
    assert.ok(mascotBottom <= listTop, `${viewport}px: mascot ${mascotBottom} <= list ${listTop}`);
  }
});

test("pricing mascot: below sm, the list and divider use the full width", () => {
  assert.match(SRC, /<ul className="flex flex-col gap-2\.5 sm:max-w-\[calc\(100%-\d+px\)\]">/);
  assert.match(SRC, /<div className="my-6 h-px bg-ink-05 sm:max-w-\[60%\]" \/>/);
  assert.doesNotMatch(SRC, /MASCOT_SPACER/, "no spacer under the list");
});
