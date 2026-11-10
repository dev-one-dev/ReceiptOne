import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CONTACT_EMAIL_RE,
  contactErrorMessage,
  isValidContactEmail,
} from "../src/lib/contact-form.ts";

// Server rule, copied verbatim from the portal's
// functions/src/support/validateContact.ts (validateContactInput). The server
// tests the trimmed, lower-cased address.
const SERVER_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const serverAccepts = (email: string) => SERVER_EMAIL_RE.test(email.trim().toLowerCase());

const fnError = (code: string, message: string) => ({ code: `functions/${code}`, message });
const silent = () => {};
const FALLBACK_EN = "Failed to send your message. Please try again.";
const FALLBACK_FR = "Impossible d'envoyer votre message. Veuillez réessayer.";

test("browser e-mail regex is the server's", () => {
  assert.equal(CONTACT_EMAIL_RE.source, SERVER_EMAIL_RE.source);
  assert.equal(CONTACT_EMAIL_RE.flags, SERVER_EMAIL_RE.flags);
});

test("e-mail rule: one-character TLD rejected, real addresses accepted", () => {
  assert.equal(isValidContactEmail("a@b.c"), false);
  assert.equal(isValidContactEmail("name@example.ca"), true);
  assert.equal(isValidContactEmail("  Name@Example.COM  "), true);
});

test("e-mail rule agrees with the server on edge cases", () => {
  const cases = [
    "a@b.c",
    "a@b.co",
    "name@example.ca",
    "first.last+tag@sub.example.co.uk",
    "a@b.c1",
    "a@b",
    "a@.ca",
    "@example.ca",
    "a b@example.ca",
    "a@@example.ca",
    "a@example.ca.",
    "a@example.c.",
    "",
    "   ",
  ];
  for (const email of cases) {
    assert.equal(isValidContactEmail(email), serverAccepts(email), email);
  }
});

test("invalid-argument shows localized generic text and logs the raw message", () => {
  const err = fnError("invalid-argument", "email is not a valid address");
  const logged: unknown[][] = [];
  const log = (...args: unknown[]) => logged.push(args);

  assert.equal(
    contactErrorMessage(err, "en", FALLBACK_EN, log),
    "Please check your details and try again.",
  );
  assert.equal(
    contactErrorMessage(err, "fr", FALLBACK_FR, log),
    "Veuillez vérifier vos informations et réessayer.",
  );
  assert.equal(logged.length, 2);
  assert.ok(logged.every((args) => args.includes("email is not a valid address")));
});

test("resource-exhausted names neither the hourly nor the daily limit", () => {
  const err = fnError("resource-exhausted", "Too many requests");
  assert.equal(
    contactErrorMessage(err, "en", FALLBACK_EN, silent),
    "You've sent several messages recently. Please try again later.",
  );
  assert.equal(
    contactErrorMessage(err, "fr", FALLBACK_FR, silent),
    "Vous avez envoyé plusieurs messages récemment. Veuillez réessayer plus tard.",
  );
});

test("other errors keep the existing handling", () => {
  for (const [lang, fallback] of [
    ["en", FALLBACK_EN],
    ["fr", FALLBACK_FR],
  ] as const) {
    // Generic transport codes fall back to the form's own text.
    assert.equal(contactErrorMessage(fnError("internal", "internal"), lang, fallback), fallback);
    assert.equal(contactErrorMessage(fnError("unavailable", "x"), lang, fallback), fallback);
    // Non-callable errors (e.g. network) fall back too.
    assert.equal(contactErrorMessage(new Error(""), lang, fallback), fallback);
    assert.equal(contactErrorMessage(null, lang, fallback), fallback);
    // Other server messages are passed through unchanged, as before.
    assert.equal(
      contactErrorMessage(fnError("failed-precondition", "Support is paused"), lang, fallback),
      "Support is paused",
    );
  }
});
