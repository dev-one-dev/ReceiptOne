#!/usr/bin/env node
/**
 * Writes the static QR codes for the smart app link (/app, see
 * src/lib/app-link.ts): src/assets/app-qr.svg (footer) and
 * src/assets/app-qr-hero.svg (landing hero). Same link and options; only
 * utm_campaign differs, so hero scans are distinguishable from footer scans.
 * Runs before `vite build` via `prebuild` and the output is committed, so
 * nothing generates a QR code at runtime. Deterministic: the same payload and
 * options always give the same bytes, which tests/app-qr.test.ts checks
 * against the committed files. Run manually with `npm run qr`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const APP_LINK = "https://receipt-one.com/app?utm_source=site&utm_medium=qr&utm_campaign=";

/** The URL the footer QR code encodes. UTMs identify QR installs in the store consoles. */
export const APP_QR_PAYLOAD = `${APP_LINK}app_qr`;
/** The URL the hero QR code encodes. */
export const APP_QR_HERO_PAYLOAD = `${APP_LINK}app_qr_hero`;

export const APP_QR_OPTIONS = {
  type: "svg",
  errorCorrectionLevel: "M",
  // Four modules of quiet zone, the spec minimum, inside the SVG itself.
  margin: 4,
  color: { dark: "#111111", light: "#ffffff" },
};

export const APP_QR_FILE = "src/assets/app-qr.svg";
export const APP_QR_HERO_FILE = "src/assets/app-qr-hero.svg";

export const APP_QR_TARGETS = [
  { file: APP_QR_FILE, payload: APP_QR_PAYLOAD },
  { file: APP_QR_HERO_FILE, payload: APP_QR_HERO_PAYLOAD },
];

export async function renderAppQr(payload = APP_QR_PAYLOAD) {
  return QRCode.toString(payload, APP_QR_OPTIONS);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const { file, payload } of APP_QR_TARGETS) {
    const svg = await renderAppQr(payload);
    let current = "";
    try {
      current = readFileSync(file, "utf8");
    } catch {}
    if (current === svg) {
      console.log(`[qr] ${file} up to date`);
    } else {
      writeFileSync(file, svg);
      console.log(`[qr] wrote ${file}`);
    }
  }
}
