/**
 * External origins the marketing site links out to.
 *
 * The web app lives on a separate origin (app.receipt-one.com), so every
 * Log in / Sign up / trial CTA is a plain cross-origin <a href>, never a
 * router <Link>. This module is the single place those origins are read.
 *
 * Env is read from both `import.meta.env` (Vite client build) and
 * `process.env` (SSR / Vercel edge middleware) -- same dual-read pattern as
 * integrations/firebase/client.ts. Both reads are guarded so the module is
 * also safe inside the root-level middleware.ts, which Vercel bundles
 * outside of Vite (there `import.meta.env` is undefined).
 */

type EnvKey = "VITE_APP_URL" | "VITE_SITE_URL" | "VITE_APP_STORE_URL" | "VITE_PLAY_STORE_URL";

function readEnv(key: EnvKey): string | undefined {
  const viteEnv = import.meta.env as Record<string, string | undefined> | undefined;
  const nodeEnv =
    typeof process !== "undefined"
      ? (process.env as Record<string, string | undefined> | undefined)
      : undefined;
  const value = viteEnv?.[key] || nodeEnv?.[key];
  return value ? value.trim() : undefined;
}

/** Strip a trailing slash so `${ORIGIN}${path}` never doubles up. */
function origin(value: string): string {
  return value.replace(/\/+$/, "");
}

/** The web app origin (login, signup, dashboard). */
export const APP_URL = origin(readEnv("VITE_APP_URL") || "https://app.receipt-one.com");

/** This marketing site's canonical origin. */
export const SITE_URL = origin(readEnv("VITE_SITE_URL") || "https://receipt-one.com");

export const APP_STORE_URL =
  readEnv("VITE_APP_STORE_URL") ||
  "https://apps.apple.com/us/app/receiptone-expense-tracker/id6755740822";

export const PLAY_STORE_URL =
  readEnv("VITE_PLAY_STORE_URL") ||
  "https://play.google.com/store/apps/details?id=com.appfyl.checkapp&pli=1";

function join(base: string, path: string): string {
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute URL into the web app, e.g. appUrl("/signup") */
export function appUrl(path = ""): string {
  return join(APP_URL, path);
}

/** Absolute URL on this site, e.g. siteUrl("/og-image.png") */
export function siteUrl(path = ""): string {
  return join(SITE_URL, path);
}
