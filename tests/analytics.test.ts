import { test } from "node:test";
import assert from "node:assert/strict";

import { classifyCta, createAnalytics, parseCtaLocation } from "../src/lib/analytics.ts";

const ID = "G-TEST123";
const APP = "https://app.receipt-one.com";

type Script = { async: boolean; src: string };

function fakeEnv(measurementId: string | null = ID) {
  const scripts: Script[] = [];
  const win: {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [gaDisable: `ga-disable-${string}`]: boolean | undefined;
  } = {};
  const doc = {
    createElement: () => ({ async: false, src: "" }),
    head: { appendChild: (node: unknown) => scripts.push(node as Script) },
  };
  const analytics = createAnalytics({ win, doc, measurementId: measurementId ?? undefined });
  /** dataLayer entries as plain arrays (gtag pushes Arguments objects). */
  const calls = () => (win.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
  const events = (name: string) =>
    calls()
      .filter((c) => c[0] === "event" && c[1] === name)
      .map((c) => c[2]);
  return { win, scripts, analytics, calls, events };
}

const ALL_DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

/** Accept grants analytics only; ad_* stay denied. */
const ANALYTICS_GRANTED = {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/* ----------------------------- Before consent ----------------------------- */

test("before consent: no gtag, no dataLayer, no script, nothing sent", () => {
  const env = fakeEnv();
  env.analytics.trackCtaClick("signup", "header");
  env.analytics.handleClick({ target: fakeAnchor(`${APP}/signup`, "header") });
  assert.equal(env.win.gtag, undefined);
  assert.equal(env.win.dataLayer, undefined);
  assert.equal(env.scripts.length, 0);
  assert.equal(env.analytics.loaded, false);
});

test("deny before any grant loads nothing", () => {
  const env = fakeEnv();
  env.analytics.deny();
  assert.equal(env.win.dataLayer, undefined);
  assert.equal(env.win.gtag, undefined);
  assert.equal(env.scripts.length, 0);
});

test("no Measurement ID: grant is a no-op", () => {
  const env = fakeEnv(null);
  env.analytics.grant();
  assert.equal(env.win.dataLayer, undefined);
  assert.equal(env.scripts.length, 0);
});

/* ------------------------------ After consent ----------------------------- */

test("grant: consent default (all denied) -> update (analytics only) -> signals off -> js -> config, then gtag.js", () => {
  const env = fakeEnv();
  env.analytics.grant();
  const calls = env.calls();
  assert.deepEqual(calls[0], ["consent", "default", ALL_DENIED]);
  assert.deepEqual(calls[1], ["consent", "update", ANALYTICS_GRANTED]);
  assert.deepEqual(calls[2], ["set", "allow_google_signals", false]);
  assert.deepEqual(calls[3], ["set", "allow_ad_personalization_signals", false]);
  assert.equal(calls[4][0], "js");
  assert.ok(calls[4][1] instanceof Date);
  // Bare config: default cookie_domain (auto) and gtag's own page_view.
  assert.deepEqual(calls[5], ["config", ID]);
  assert.equal(calls.length, 6);
  assert.equal(env.scripts.length, 1);
  assert.equal(env.scripts[0].src, `https://www.googletagmanager.com/gtag/js?id=${ID}`);
  assert.equal(env.scripts[0].async, true);
  assert.equal(env.win[`ga-disable-${ID}`], false);
});

test("no consent call ever grants ad_storage, ad_user_data or ad_personalization", () => {
  const env = fakeEnv();
  env.analytics.grant();
  env.analytics.deny();
  env.analytics.grant();
  const consent = env.calls().filter((c) => c[0] === "consent");
  assert.equal(consent.length, 4);
  for (const [, , state] of consent) {
    const s = state as Record<string, string>;
    assert.equal(s.ad_storage, "denied");
    assert.equal(s.ad_user_data, "denied");
    assert.equal(s.ad_personalization, "denied");
  }
});

test("page views: the app never sends its own page_view (gtag config + history events do)", () => {
  const env = fakeEnv();
  env.analytics.grant();
  env.analytics.grant();
  assert.deepEqual(env.events("page_view"), []);
});

test("grant twice never loads gtag.js or configures twice", () => {
  const env = fakeEnv();
  env.analytics.grant();
  env.analytics.grant();
  assert.equal(env.scripts.length, 1);
  assert.equal(env.calls().filter((c) => c[0] === "config").length, 1);
});

test("deny after grant: consent update all denied, ga-disable set, then nothing is sent", () => {
  const env = fakeEnv();
  env.analytics.grant();
  env.analytics.deny();
  assert.deepEqual(env.calls().at(-1), ["consent", "update", ALL_DENIED]);
  assert.equal(env.win[`ga-disable-${ID}`], true);
  const before = env.calls().length;
  env.analytics.trackCtaClick("signup", "hero");
  env.analytics.handleClick({ target: fakeAnchor(`${APP}/signup`, "hero") });
  assert.equal(env.calls().length, before);
});

test("re-grant after deny: consent update granted, ga-disable cleared, no second gtag.js", () => {
  const env = fakeEnv();
  env.analytics.grant();
  env.analytics.deny();
  env.analytics.grant();
  assert.deepEqual(env.calls().at(-1), ["consent", "update", ANALYTICS_GRANTED]);
  assert.equal(env.win[`ga-disable-${ID}`], false);
  assert.equal(env.scripts.length, 1);
});

/* -------------------------------- cta_click -------------------------------- */

test("classifyCta: each CTA type, and everything else is ignored", () => {
  assert.equal(classifyCta(`${APP}/signup`, APP), "signup");
  assert.equal(classifyCta(`${APP}/signup?ref=abc`, APP), "signup");
  assert.equal(classifyCta(`${APP}/login`, APP), "login");
  assert.equal(classifyCta(`${APP}/login/`, APP), "login");
  assert.equal(
    classifyCta("https://apps.apple.com/ca/app/receiptone-expense-tracker/id6755740822", APP),
    "app_store",
  );
  assert.equal(
    classifyCta("https://play.google.com/store/apps/details?id=com.appfyl.checkapp", APP),
    "google_play",
  );
  assert.equal(classifyCta(`${APP}/dashboard`, APP), null);
  assert.equal(classifyCta("https://evil.example/signup", APP), null);
  assert.equal(classifyCta("https://receipt-one.com/faq", APP), null);
  assert.equal(classifyCta("not a url", APP), null);
});

test("parseCtaLocation accepts only the known locations", () => {
  for (const loc of ["header", "top_banner", "hero", "pricing", "final_cta", "footer"]) {
    assert.equal(parseCtaLocation(loc), loc);
  }
  assert.equal(parseCtaLocation("sidebar"), null);
  assert.equal(parseCtaLocation(null), null);
});

/** A minimal anchor inside a [data-cta-location] ancestor. */
function fakeAnchor(href: string, location: string | null) {
  const section = { getAttribute: () => location };
  const anchor = {
    href,
    closest: (selector: string) =>
      selector === "a[href]" ? anchor : location !== null ? section : null,
  };
  // A child element (e.g. the arrow icon) whose closest("a[href]") is the anchor.
  return { closest: (selector: string) => (selector === "a[href]" ? anchor : null) };
}

const CASES: [string, string, string][] = [
  [`${APP}/signup`, "signup", "header"],
  [`${APP}/login`, "login", "header"],
  [`${APP}/signup`, "signup", "hero"],
  ["https://apps.apple.com/ca/app/x/id6755740822", "app_store", "hero"],
  ["https://play.google.com/store/apps/details?id=com.appfyl.checkapp", "google_play", "pricing"],
  [`${APP}/signup`, "signup", "final_cta"],
  [`${APP}/login`, "login", "footer"],
  ["https://apps.apple.com/us/app/x/id6755740822", "app_store", "footer"],
];

for (const [href, cta, location] of CASES) {
  test(`cta_click payload: ${cta} @ ${location}`, () => {
    const env = fakeEnv();
    env.analytics.grant();
    env.analytics.handleClick({ target: fakeAnchor(href, location) });
    assert.deepEqual(env.events("cta_click"), [{ cta, location, transport_type: "beacon" }]);
  });
}

test("cta_click: non-CTA links and CTAs outside a known location are ignored", () => {
  const env = fakeEnv();
  env.analytics.grant();
  env.analytics.handleClick({ target: fakeAnchor("https://receipt-one.com/faq", "header") });
  env.analytics.handleClick({ target: fakeAnchor(`${APP}/signup`, null) });
  env.analytics.handleClick({ target: { closest: () => null } });
  env.analytics.handleClick({ target: null });
  assert.deepEqual(env.events("cta_click"), []);
});
