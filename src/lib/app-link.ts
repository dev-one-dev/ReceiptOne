import { APP_STORE_URL, PLAY_STORE_URL } from "./stores";

/**
 * The smart app link, /app (printed on the QR code). One URL for CA, FR and US
 * visitors: phones go straight to their store listing, everything else to the
 * pricing section with the store badges. Pure, so middleware.ts stays a thin
 * wrapper and the routing is unit-tested without a Request.
 */

export type AppLinkPlatform = "ios" | "android" | "other";

/**
 * iPhone / iPad / iPod first: no iOS UA contains "Android", but some Android
 * UAs mention other platforms. iPadOS 13+ Safari sends a Macintosh UA by
 * default, so those iPads land on the pricing page (which links the store).
 */
export function appLinkPlatform(userAgent: string | null): AppLinkPlatform {
  if (!userAgent) return "other";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "other";
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

/** Apple caps the campaign token (ct) at 40 characters. */
const APPLE_CT_MAX = 40;

/**
 * Where /app sends this visitor.
 * - iOS: the App Store listing (US storefront for US visitors, CA otherwise),
 *   with ct=<utm_source>-<utm_medium> for App Store Connect's campaign report.
 * - Android: the Play listing, with the UTMs URL-encoded into `referrer`
 *   (what the Play Console's acquisition report reads).
 * - Anything else: /us#pricing for US visitors, /ca#pricing otherwise, with
 *   the query string kept so the site's own attribution sees the UTMs.
 */
export function appLinkTarget({
  userAgent,
  search,
  country,
  origin,
}: {
  userAgent: string | null;
  /** The request's query string, with or without the leading "?". */
  search: string;
  /** x-vercel-ip-country, if known. */
  country: string | null;
  /** This site's origin, for the desktop fallback. */
  origin: string;
}): string {
  const params = new URLSearchParams(search);
  const utm = UTM_KEYS.flatMap((k) => {
    const v = params.get(k)?.trim();
    return v ? [[k, v]] : [];
  });
  const isUs = country === "US";

  switch (appLinkPlatform(userAgent)) {
    case "ios": {
      const url = new URL(APP_STORE_URL[isUs ? "us" : "ca"]);
      const ct = [params.get("utm_source")?.trim(), params.get("utm_medium")?.trim()]
        .filter(Boolean)
        .join("-")
        .slice(0, APPLE_CT_MAX);
      if (ct) url.searchParams.set("ct", ct);
      return url.toString();
    }
    case "android": {
      const url = new URL(PLAY_STORE_URL);
      if (utm.length) url.searchParams.set("referrer", new URLSearchParams(utm).toString());
      return url.toString();
    }
    default: {
      const url = new URL(isUs ? "/us" : "/ca", origin);
      url.search = params.toString();
      url.hash = "pricing";
      return url.toString();
    }
  }
}

/** The /app response: a temporary redirect that is never indexed. */
export function appLinkResponse(request: Request): Response {
  const url = new URL(request.url);
  const location = appLinkTarget({
    userAgent: request.headers.get("user-agent"),
    search: url.search,
    country: request.headers.get("x-vercel-ip-country"),
    origin: url.origin,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "X-Robots-Tag": "noindex",
      "Cache-Control": "private, no-store",
      Vary: "User-Agent, X-Vercel-IP-Country",
    },
  });
}
