// Shared error handling for the portal's Cloud Functions (`https.onCall`).
// A failed callable rejects with a FirebaseError whose `code` is
// `functions/<status>` and whose `message` is the server's HttpsError text.

/** Strips the `functions/` prefix: "functions/resource-exhausted" -> "resource-exhausted". */
export function callableCode(e: unknown): string {
  if (typeof e === "object" && e !== null && "code" in e) {
    const code = (e as { code: unknown }).code;
    if (typeof code === "string") return code.replace(/^functions\//, "");
  }
  return "";
}

export function isRateLimited(e: unknown): boolean {
  return callableCode(e) === "resource-exhausted";
}

// Codes whose message is a bare transport/status word rather than something
// a visitor can act on; those fall through to the caller's fallback text.
const GENERIC_CODES = new Set([
  "internal",
  "unavailable",
  "deadline-exceeded",
  "unknown",
  "unauthenticated",
  "permission-denied",
]);

/**
 * Toast-friendly message for a failed callable. Validation failures and other
 * `invalid-argument` / `failed-precondition` errors carry a human-readable
 * server message, which is returned as-is; generic failures use `fallback`.
 */
export function callableErrorMessage(e: unknown, fallback: string): string {
  const code = callableCode(e);
  if (GENERIC_CODES.has(code)) return fallback;
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as { message: unknown }).message;
    if (typeof m === "string" && m.length > 0 && m.toLowerCase() !== code.toLowerCase()) {
      return m;
    }
  }
  return fallback;
}
