import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadTs } from "../scripts/lib/load-ts.mjs";

/**
 * The smart app link /app (src/lib/app-link.ts, wired in middleware.ts):
 * iPhone/iPad -> App Store with ct, Android -> Google Play with referrer,
 * anything else -> the pricing section. 302 + X-Robots-Tag: noindex, never in
 * the sitemap, never disallowed in robots.txt.
 */

const { appLinkPlatform, appLinkTarget, middleware, matcher, APP_STORE_URL, PLAY_STORE_URL } =
  (await loadTs(`
    import middleware, { config } from "./middleware";
    export { appLinkPlatform, appLinkTarget } from "@/lib/app-link";
    export { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/stores";
    export const matcher = config.matcher;
    export { middleware };
  `)) as {
    appLinkPlatform: (ua: string | null) => "ios" | "android" | "other";
    appLinkTarget: (o: {
      userAgent: string | null;
      search: string;
      country: string | null;
      origin: string;
    }) => string;
    middleware: (r: Request) => Response;
    matcher: string[];
    APP_STORE_URL: { ca: string; us: string };
    PLAY_STORE_URL: string;
  };

const UA = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  ipad: "Mozilla/5.0 (iPad; CPU OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
  ipod: "Mozilla/5.0 (iPod touch; CPU iPhone OS 15_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
  androidTablet:
    "Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  linux: "Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0",
  bot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
};

const QR_QUERY = "?utm_source=site&utm_medium=qr&utm_campaign=app_qr";
const ORIGIN = "https://receipt-one.com";
const target = (userAgent: string | null, search = QR_QUERY, country: string | null = null) =>
  appLinkTarget({ userAgent, search, country, origin: ORIGIN });

test("app link: user agents route to the right platform", () => {
  assert.equal(appLinkPlatform(UA.iphone), "ios");
  assert.equal(appLinkPlatform(UA.ipad), "ios");
  assert.equal(appLinkPlatform(UA.ipod), "ios");
  assert.equal(appLinkPlatform(UA.android), "android");
  assert.equal(appLinkPlatform(UA.androidTablet), "android");
  for (const ua of [UA.mac, UA.windows, UA.linux, UA.bot, "", null])
    assert.equal(appLinkPlatform(ua), "other", String(ua));
});

test("app link: iOS -> App Store with ct=<utm_source>-<utm_medium>", () => {
  assert.equal(target(UA.iphone), `${APP_STORE_URL.ca}?ct=site-qr`);
  assert.equal(target(UA.ipad, QR_QUERY, "CA"), `${APP_STORE_URL.ca}?ct=site-qr`);
  // US visitors get the US storefront.
  assert.equal(target(UA.iphone, QR_QUERY, "US"), `${APP_STORE_URL.us}?ct=site-qr`);
  // Only one UTM present: ct is that one; none: the bare listing.
  assert.equal(target(UA.iphone, "?utm_source=flyer"), `${APP_STORE_URL.ca}?ct=flyer`);
  assert.equal(target(UA.iphone, ""), APP_STORE_URL.ca);
  // Apple caps ct at 40 characters.
  const long = target(UA.iphone, `?utm_source=${"a".repeat(30)}&utm_medium=${"b".repeat(30)}`);
  assert.equal(new URL(long).searchParams.get("ct")!.length, 40);
});

test("app link: Android -> Google Play with the UTMs in referrer", () => {
  const url = new URL(target(UA.android));
  assert.equal(`${url.origin}${url.pathname}`, "https://play.google.com/store/apps/details");
  assert.equal(url.searchParams.get("id"), new URL(PLAY_STORE_URL).searchParams.get("id"));
  assert.equal(
    url.searchParams.get("referrer"),
    "utm_source=site&utm_medium=qr&utm_campaign=app_qr",
  );
  // Encoded once, as Play expects: the referrer's own & and = are escaped.
  assert.match(url.search, /referrer=utm_source%3Dsite%26utm_medium%3Dqr%26utm_campaign%3Dapp_qr/);
  // Non-UTM params are not forwarded; no UTMs means no referrer.
  assert.equal(new URL(target(UA.android, "?foo=1")).searchParams.has("referrer"), false);
  assert.equal(target(UA.android, ""), PLAY_STORE_URL);
});

test("app link: everything else -> pricing, query string kept", () => {
  assert.equal(target(UA.windows), `${ORIGIN}/ca${QR_QUERY}#pricing`);
  assert.equal(target(UA.mac, QR_QUERY, "CA"), `${ORIGIN}/ca${QR_QUERY}#pricing`);
  assert.equal(target(UA.mac, QR_QUERY, "US"), `${ORIGIN}/us${QR_QUERY}#pricing`);
  assert.equal(target(null, ""), `${ORIGIN}/ca#pricing`);
});

test("app link: middleware answers /app with a 302, noindex, varying on UA", () => {
  assert.ok(matcher.includes("/app"), "/app is in the middleware matcher");
  const cases: [string, string][] = [
    [UA.iphone, `${APP_STORE_URL.ca}?ct=site-qr`],
    [
      UA.android,
      `${PLAY_STORE_URL}&referrer=utm_source%3Dsite%26utm_medium%3Dqr%26utm_campaign%3Dapp_qr`,
    ],
    [UA.windows, `${ORIGIN}/ca${QR_QUERY}#pricing`],
  ];
  for (const [ua, location] of cases) {
    const res = middleware(
      new Request(`${ORIGIN}/app${QR_QUERY}`, { headers: { "user-agent": ua } }),
    );
    assert.equal(res.status, 302, ua);
    assert.equal(res.headers.get("location"), location, ua);
    assert.equal(res.headers.get("x-robots-tag"), "noindex");
    assert.match(res.headers.get("vary") ?? "", /User-Agent/);
  }
});

test("app link: /app is not in the sitemap and not blocked in robots.txt", () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/app(\?[^<]*)?<\/loc>/);
  const robots = readFileSync("public/robots.txt", "utf8");
  assert.doesNotMatch(robots, /^\s*Disallow:\s*\/app\b/im);
});
