#!/usr/bin/env node
/**
 * Writes src/assets/app-qr.svg: a static QR code for the smart app link
 * (/app, see src/lib/app-link.ts). Runs before `vite build` via `prebuild`
 * and the output is committed, so nothing generates a QR code at runtime.
 * Deterministic: the same payload and options always give the same bytes,
 * which tests/app-qr.test.ts checks against the committed file.
 * Run manually with `npm run qr`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

/** The URL the QR code encodes. UTMs identify QR installs in the store consoles. */
export const APP_QR_PAYLOAD =
  "https://receipt-one.com/app?utm_source=site&utm_medium=qr&utm_campaign=app_qr";

export const APP_QR_OPTIONS = {
  type: "svg",
  errorCorrectionLevel: "M",
  // Four modules of quiet zone, the spec minimum, inside the SVG itself.
  margin: 4,
  color: { dark: "#111111", light: "#ffffff" },
};

export const APP_QR_FILE = "src/assets/app-qr.svg";

export async function renderAppQr(payload = APP_QR_PAYLOAD) {
  return QRCode.toString(payload, APP_QR_OPTIONS);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const svg = await renderAppQr();
  let current = "";
  try {
    current = readFileSync(APP_QR_FILE, "utf8");
  } catch {}
  if (current === svg) {
    console.log(`[qr] ${APP_QR_FILE} up to date`);
  } else {
    writeFileSync(APP_QR_FILE, svg);
    console.log(`[qr] wrote ${APP_QR_FILE}`);
  }
}
