import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ATTRIBUTION_MAX_COOKIE_LENGTH,
  buildAttributionCookie,
  cookieDomainFor,
  parseAttributionParams,
} from "../src/lib/attribution.ts";

const NOW = new Date("2026-10-28T12:00:00.000Z");

function build(search: string, hostname = "receipt-one.com", pathname = "/") {
  return buildAttributionCookie({ search, pathname, hostname, now: NOW });
}

function payloadOf(cookie: string): Record<string, string> {
  const value = cookie.split("; ")[0].slice("ro_attr=".length);
  return JSON.parse(decodeURIComponent(value));
}

test("keeps only allowlisted keys", () => {
  assert.deepEqual(
    parseAttributionParams("?utm_source=google&foo=bar&gclid=abc&ref=x&UTM_SOURCE=y"),
    {
      gclid: "abc",
      utm_source: "google",
    },
  );
});

test("reads every supported key", () => {
  const keys = [
    "gclid",
    "gbraid",
    "wbraid",
    "fbclid",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];
  const parsed = parseAttributionParams("?" + keys.map((k) => `${k}=v`).join("&"));
  assert.deepEqual(Object.keys(parsed).sort(), [...keys].sort());
});

test("trims and drops empty values", () => {
  assert.deepEqual(parseAttributionParams("?utm_source=%20%20google%20&utm_medium=&gclid=%20%20"), {
    utm_source: "google",
  });
});

test("drops values over 200 chars", () => {
  assert.deepEqual(parseAttributionParams(`?gclid=${"a".repeat(201)}&utm_source=x`), {
    utm_source: "x",
  });
  assert.equal(parseAttributionParams(`?gclid=${"a".repeat(200)}`).gclid?.length, 200);
});

test("click IDs allow only [A-Za-z0-9._~-]", () => {
  assert.deepEqual(parseAttributionParams("?gclid=Ab0._~-z"), { gclid: "Ab0._~-z" });
  for (const bad of ["a%20b", "a+b", "a%25b", "a<b", "a%22b", "a/b"]) {
    assert.deepEqual(parseAttributionParams(`?gclid=${bad}`), {}, bad);
  }
});

test("utm values allow [A-Za-z0-9 ._~+%-] and drop anything else", () => {
  // "+" in a query string decodes to a space; %2B is a literal "+", %25 a literal "%".
  assert.deepEqual(parseAttributionParams("?utm_term=tax+app%2B%25x._~-"), {
    utm_term: "tax app+%x._~-",
  });
  for (const bad of ["%3Cscript%3E", "a%22b", "a%3Bb", "a/b", "%C3%A9t%C3%A9"]) {
    assert.deepEqual(parseAttributionParams(`?utm_source=${bad}`), {}, bad);
  }
});

test("no params: returns null so the existing cookie is not touched", () => {
  assert.equal(build(""), null);
  assert.equal(build("?foo=bar&ref=abc"), null);
  assert.equal(build("?utm_source=&gclid=bad%20id"), null);
});

test("cookie payload, attributes and encoding", () => {
  const cookie = build("?utm_source=test&gclid=TEST123", "receipt-one.com", "/ca");
  assert.ok(cookie);
  const [pair, ...attrs] = cookie.split("; ");
  assert.ok(pair.startsWith("ro_attr="));
  assert.equal(pair, `ro_attr=${encodeURIComponent(JSON.stringify(payloadOf(cookie)))}`);
  assert.deepEqual(payloadOf(cookie), {
    gclid: "TEST123",
    utm_source: "test",
    landing_path: "/ca",
    captured_at: "2026-10-28T12:00:00.000Z",
  });
  assert.deepEqual(attrs, [
    "Domain=.receipt-one.com",
    "Path=/",
    "Max-Age=7776000",
    "SameSite=Lax",
    "Secure",
  ]);
});

test("landing_path is capped at 200 chars", () => {
  const cookie = build("?gclid=x", "receipt-one.com", "/" + "p".repeat(400));
  assert.equal(payloadOf(cookie!).landing_path.length, 200);
});

test("domain selection by hostname", () => {
  assert.equal(cookieDomainFor("receipt-one.com"), ".receipt-one.com");
  assert.equal(cookieDomainFor("www.receipt-one.com"), ".receipt-one.com");
  assert.equal(cookieDomainFor("app.receipt-one.com"), ".receipt-one.com");
  assert.equal(cookieDomainFor("localhost"), undefined);
  assert.equal(cookieDomainFor("receipt-one.vercel.app"), undefined);
  assert.equal(cookieDomainFor("evilreceipt-one.com"), undefined);
  assert.equal(cookieDomainFor("receipt-one.com.evil.io"), undefined);

  assert.ok(!build("?gclid=x", "localhost")!.includes("Domain="));
  assert.ok(!build("?gclid=x", "figma-craft-39.vercel.app")!.includes("Domain="));
  assert.ok(build("?gclid=x", "www.receipt-one.com")!.includes("; Domain=.receipt-one.com;"));
});

test("cookie stays under 4 KB with max-length values", () => {
  const clickId = "a".repeat(200);
  const plainUtm = "u".repeat(200);
  const longPath = "/" + "p".repeat(400);

  const plain = build(
    `?gclid=${clickId}&gbraid=${clickId}&wbraid=${clickId}&fbclid=${clickId}` +
      `&utm_source=${plainUtm}&utm_medium=${plainUtm}&utm_campaign=${plainUtm}` +
      `&utm_term=${plainUtm}&utm_content=${plainUtm}`,
    "receipt-one.com",
    longPath,
  )!;
  assert.ok(plain.length <= ATTRIBUTION_MAX_COOKIE_LENGTH, `plain: ${plain.length}`);
  assert.equal(Object.keys(payloadOf(plain)).length, 11);

  // Worst case: every utm char is "%" (3 bytes once encoded) and the path is all
  // characters encodeURIComponent expands. Lower-priority fields are dropped to fit.
  const worstUtm = "%25".repeat(200);
  const worst = build(
    `?gclid=${clickId}&gbraid=${clickId}&wbraid=${clickId}&fbclid=${clickId}` +
      `&utm_source=${worstUtm}&utm_medium=${worstUtm}&utm_campaign=${worstUtm}` +
      `&utm_term=${worstUtm}&utm_content=${worstUtm}`,
    "receipt-one.com",
    "/".repeat(200),
  )!;
  assert.ok(worst.length <= ATTRIBUTION_MAX_COOKIE_LENGTH, `worst: ${worst.length}`);
  const payload = payloadOf(worst);
  for (const k of ["gclid", "gbraid", "wbraid", "fbclid", "utm_source", "captured_at"]) {
    assert.ok(k in payload, k);
  }
});
