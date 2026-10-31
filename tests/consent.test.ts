import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CONSENT_MAX_AGE_SECONDS,
  buildAnalyticsCookieDeletions,
  buildConsentCookie,
  isGoogleAnalyticsCookie,
  parseConsent,
  readCookie,
} from "../src/lib/consent.ts";

test("consent cookie: shared parent domain on receipt-one.com", () => {
  for (const host of ["receipt-one.com", "www.receipt-one.com", "app.receipt-one.com"]) {
    assert.equal(
      buildConsentCookie("granted", host),
      "ro_consent=granted; Domain=.receipt-one.com; Path=/; Max-Age=31536000; SameSite=Lax; Secure",
    );
  }
});

test("consent cookie: host-only on localhost and vercel previews", () => {
  for (const host of ["localhost", "receipt-one-git-x.vercel.app", "evilreceipt-one.com"]) {
    const cookie = buildConsentCookie("denied", host);
    assert.equal(cookie, "ro_consent=denied; Path=/; Max-Age=31536000; SameSite=Lax; Secure");
    assert.ok(!cookie.includes("Domain="));
  }
});

test("consent cookie: one year", () => {
  assert.equal(CONSENT_MAX_AGE_SECONDS, 31536000);
});

test("parseConsent reads granted / denied and rejects anything else", () => {
  assert.equal(parseConsent("a=1; ro_consent=granted; b=2"), "granted");
  assert.equal(parseConsent("ro_consent=denied"), "denied");
  assert.equal(parseConsent(""), null);
  assert.equal(parseConsent("ro_consent="), null);
  assert.equal(parseConsent("ro_consent=yes"), null);
  assert.equal(parseConsent("xro_consent=granted"), null);
  assert.equal(parseConsent("ro_consent_old=granted"), null);
});

test("readCookie handles values containing '='", () => {
  assert.equal(readCookie("ro_attr=%7B%22a%22%3D1%7D=x; k=v", "ro_attr"), "%7B%22a%22%3D1%7D=x");
  assert.equal(readCookie("k=v", "missing"), undefined);
});

test("isGoogleAnalyticsCookie matches _ga and _ga_* only", () => {
  assert.ok(isGoogleAnalyticsCookie("_ga"));
  assert.ok(isGoogleAnalyticsCookie("_ga_HXWCRLCFFJ"));
  assert.ok(!isGoogleAnalyticsCookie("_gat"));
  assert.ok(!isGoogleAnalyticsCookie("_gid"));
  assert.ok(!isGoogleAnalyticsCookie("ro_attr"));
  assert.ok(!isGoogleAnalyticsCookie("ro_consent"));
});

test("analytics cookie deletion covers host-only and every parent domain", () => {
  const out = buildAnalyticsCookieDeletions(
    "_ga=GA1.1.1; ro_consent=granted; _ga_HXWCRLCFFJ=GS1; ro_attr=x",
    "www.receipt-one.com",
  );
  assert.deepEqual(out, [
    "_ga=; Path=/; Max-Age=0",
    "_ga=; Domain=.www.receipt-one.com; Path=/; Max-Age=0",
    "_ga=; Domain=.receipt-one.com; Path=/; Max-Age=0",
    "_ga_HXWCRLCFFJ=; Path=/; Max-Age=0",
    "_ga_HXWCRLCFFJ=; Domain=.www.receipt-one.com; Path=/; Max-Age=0",
    "_ga_HXWCRLCFFJ=; Domain=.receipt-one.com; Path=/; Max-Age=0",
  ]);
});

test("analytics cookie deletion on localhost is host-only, and never touches our cookies", () => {
  assert.deepEqual(buildAnalyticsCookieDeletions("_ga=1; ro_attr=x", "localhost"), [
    "_ga=; Path=/; Max-Age=0",
  ]);
  assert.deepEqual(buildAnalyticsCookieDeletions("ro_consent=granted", "receipt-one.com"), []);
});
