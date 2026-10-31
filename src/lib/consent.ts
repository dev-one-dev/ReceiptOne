/**
 * Cookie consent (Quebec Law 25 / basic consent mode).
 *
 * The visitor's choice lives in a first-party cookie, ro_consent=granted|denied,
 * on the shared parent domain (.receipt-one.com) so app.receipt-one.com can
 * honour the same choice. Same domain rule as ro_attr: host-only on localhost
 * and *.vercel.app previews.
 *
 * Pure helpers take everything as arguments so they can be tested without a
 * browser; the client entry points never throw.
 */
import { cookieDomainFor } from "./attribution.ts";

export const CONSENT_COOKIE = "ro_consent";
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type ConsentChoice = "granted" | "denied";

/** Fired on window when the visitor asks to change their choice (footer link). */
export const OPEN_CONSENT_EVENT = "ro:open-cookie-settings";
/** Fired on window after a choice is saved; detail is the ConsentChoice. */
export const CONSENT_CHANGED_EVENT = "ro:consent-changed";

/** Reads a cookie value from a document.cookie string. */
export function readCookie(cookieHeader: string, name: string): string | undefined {
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return undefined;
}

/** The stored choice, or null when the visitor has not chosen yet (or the value is junk). */
export function parseConsent(cookieHeader: string): ConsentChoice | null {
  const value = readCookie(cookieHeader, CONSENT_COOKIE);
  return value === "granted" || value === "denied" ? value : null;
}

/** The full document.cookie assignment string for a choice. */
export function buildConsentCookie(choice: ConsentChoice, hostname: string): string {
  const attributes = [`Path=/`, `Max-Age=${CONSENT_MAX_AGE_SECONDS}`, "SameSite=Lax", "Secure"];
  const domain = cookieDomainFor(hostname);
  if (domain) attributes.unshift(`Domain=${domain}`);
  return [`${CONSENT_COOKIE}=${choice}`, ...attributes].join("; ");
}

/** Google Analytics cookies: _ga and _ga_<container>. */
export function isGoogleAnalyticsCookie(name: string): boolean {
  return name === "_ga" || name.startsWith("_ga_");
}

/**
 * Expiry strings that remove every Google Analytics cookie in the header.
 * gtag's automatic cookie_domain picks the highest settable domain, so each
 * cookie is expired host-only and on every parent domain of the hostname
 * (e.g. .receipt-one.com) -- a cookie only goes away when the Domain matches.
 */
export function buildAnalyticsCookieDeletions(cookieHeader: string, hostname: string): string[] {
  const names = cookieHeader
    .split(";")
    .map((part) => part.split("=")[0].trim())
    .filter(isGoogleAnalyticsCookie);
  const labels = hostname.toLowerCase().split(".");
  const domains: (string | undefined)[] = [undefined];
  for (let i = 0; i < labels.length - 1; i++) domains.push(`.${labels.slice(i).join(".")}`);

  const out: string[] = [];
  for (const name of new Set(names)) {
    for (const domain of domains) {
      out.push(
        [`${name}=`, ...(domain ? [`Domain=${domain}`] : []), "Path=/", "Max-Age=0"].join("; "),
      );
    }
  }
  return out;
}

/* ------------------------------ Client helpers ----------------------------- */

export function getConsent(): ConsentChoice | null {
  try {
    if (typeof document === "undefined") return null;
    return parseConsent(document.cookie);
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    if (typeof document === "undefined") return;
    document.cookie = buildConsentCookie(choice, window.location.hostname);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: choice }));
  } catch {
    // Never break the page over the consent cookie.
  }
}

export function deleteAnalyticsCookies(): void {
  try {
    if (typeof document === "undefined") return;
    for (const cookie of buildAnalyticsCookieDeletions(document.cookie, window.location.hostname)) {
      document.cookie = cookie;
    }
  } catch {
    // Best effort.
  }
}

/** Reopens the consent banner (used by the footer "Cookie settings" link). */
export function openConsentSettings(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
