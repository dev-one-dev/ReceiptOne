/**
 * Ad attribution capture.
 *
 * On the first client load, reads click IDs and UTM params from the URL and
 * stores them in a first-party cookie (ro_attr) that app.receipt-one.com can
 * read at sign-up. A visit without any of these params leaves an existing
 * cookie alone, so the last non-direct touch wins. No third-party tags.
 *
 * The pure helpers (buildAttributionCookie etc.) take everything as
 * arguments so they can be tested without a browser.
 */
export const ATTRIBUTION_COOKIE = "ro_attr";
export const ATTRIBUTION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;
export const ATTRIBUTION_MAX_VALUE_LENGTH = 200;
// Browsers cap name + value + attributes at roughly 4096 bytes.
export const ATTRIBUTION_MAX_COOKIE_LENGTH = 4000;

const SITE_DOMAIN = "receipt-one.com";

export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid"] as const;
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type AttributionKey = (typeof CLICK_ID_KEYS)[number] | (typeof UTM_KEYS)[number];
export type AttributionParams = Partial<Record<AttributionKey, string>>;

const CLICK_ID_PATTERN = /^[A-Za-z0-9._~-]+$/;
const UTM_PATTERN = /^[A-Za-z0-9 ._~+%-]+$/;

// If the encoded cookie would exceed the size cap, these are dropped in order
// until it fits. Click IDs are never dropped (they alone fit comfortably).
const DROP_ORDER = [
  "landing_path",
  "utm_content",
  "utm_term",
  "utm_campaign",
  "utm_medium",
  "utm_source",
] as const;

function cleanValue(raw: string | null, pattern: RegExp): string | undefined {
  if (raw == null) return undefined;
  const value = raw.trim();
  if (!value || value.length > ATTRIBUTION_MAX_VALUE_LENGTH) return undefined;
  return pattern.test(value) ? value : undefined;
}

/** Keeps only allowlisted keys with valid, non-empty values. */
export function parseAttributionParams(search: string): AttributionParams {
  const query = new URLSearchParams(search);
  const params: AttributionParams = {};
  for (const key of CLICK_ID_KEYS) {
    const value = cleanValue(query.get(key), CLICK_ID_PATTERN);
    if (value) params[key] = value;
  }
  for (const key of UTM_KEYS) {
    const value = cleanValue(query.get(key), UTM_PATTERN);
    if (value) params[key] = value;
  }
  return params;
}

/** Shared parent domain on receipt-one.com; host-only everywhere else. */
export function cookieDomainFor(hostname: string): string | undefined {
  const host = hostname.toLowerCase();
  return host === SITE_DOMAIN || host.endsWith(`.${SITE_DOMAIN}`) ? `.${SITE_DOMAIN}` : undefined;
}

/**
 * Returns the full document.cookie assignment string, or null when the URL
 * carries no attribution params (the existing cookie must not be touched).
 */
export function buildAttributionCookie(input: {
  search: string;
  pathname: string;
  hostname: string;
  now: Date;
}): string | null {
  const params = parseAttributionParams(input.search);
  if (Object.keys(params).length === 0) return null;

  const payload: Record<string, string> = {
    ...params,
    landing_path: input.pathname.slice(0, ATTRIBUTION_MAX_VALUE_LENGTH),
    captured_at: input.now.toISOString(),
  };

  const attributes = [`Path=/`, `Max-Age=${ATTRIBUTION_MAX_AGE_SECONDS}`, "SameSite=Lax", "Secure"];
  const domain = cookieDomainFor(input.hostname);
  if (domain) attributes.unshift(`Domain=${domain}`);

  const serialize = () =>
    [`${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}`, ...attributes].join(
      "; ",
    );

  let cookie = serialize();
  for (const key of DROP_ORDER) {
    if (cookie.length <= ATTRIBUTION_MAX_COOKIE_LENGTH) break;
    delete payload[key];
    cookie = serialize();
  }
  return cookie;
}

/** Client-only entry point. Safe to call anywhere; never throws. */
export function captureAttribution(): void {
  try {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const { search, pathname, hostname } = window.location;
    const cookie = buildAttributionCookie({ search, pathname, hostname, now: new Date() });
    if (cookie) document.cookie = cookie;
  } catch {
    // Attribution is best-effort; never break the page over it.
  }
}
