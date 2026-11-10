// Pure helpers for components/site/ContactForm.tsx, kept free of React and
// Firebase so they can be unit-tested (tests/contact-form.test.ts).

import { callableCode, callableErrorMessage } from "../integrations/firebase/callable-error.ts";

export type ContactLang = "en" | "fr";

// Same rule as the server: validateContactInput in the portal repo
// (functions/src/support/validateContact.ts) tests the trimmed, lower-cased
// address against this exact pattern — the part after the last dot must be at
// least two characters, so `a@b.c` is rejected. Keep the two in sync.
export const CONTACT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidContactEmail(email: string): boolean {
  return CONTACT_EMAIL_RE.test(email.trim());
}

const ERROR_COPY: Record<ContactLang, { invalid: string; rate: string }> = {
  en: {
    invalid: "Please check your details and try again.",
    rate: "You've sent several messages recently. Please try again later.",
  },
  fr: {
    invalid: "Veuillez vérifier vos informations et réessayer.",
    rate: "Vous avez envoyé plusieurs messages récemment. Veuillez réessayer plus tard.",
  },
};

/**
 * Toast text for a failed submitContactRequest call. `invalid-argument`
 * carries raw English server text, so it is replaced by a localized generic
 * message (the raw text is logged for debugging). `resource-exhausted` covers
 * both the hourly and the daily limit, so the text names neither. Everything
 * else keeps the shared callable handling with `fallback`.
 */
export function contactErrorMessage(
  err: unknown,
  lang: ContactLang,
  fallback: string,
  log: (...args: unknown[]) => void = console.error,
): string {
  const code = callableCode(err);
  if (code === "invalid-argument") {
    log("submitContactRequest invalid-argument:", callableErrorMessage(err, ""));
    return ERROR_COPY[lang].invalid;
  }
  if (code === "resource-exhausted") return ERROR_COPY[lang].rate;
  return callableErrorMessage(err, fallback);
}
