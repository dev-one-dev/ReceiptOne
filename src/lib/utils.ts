import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Relative timestamp, e.g. "2 hours ago" -- accepts an ISO string (as Supabase rows carry) or a Date. */
export function timeAgo(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Supabase/Postgrest errors are plain objects with a `.message` string, not
 * `Error` instances -- `e instanceof Error` misses them entirely and falls
 * through to a generic fallback, hiding the actual database error (e.g. a
 * CHECK constraint or RLS violation) from the user and from debugging.
 *
 * TEMPORARY DEBUGGING CHANGE (tracking down the /helpdesk "swallowed
 * error" bug): the `e instanceof Error` branch used to return `e.message`
 * unconditionally, including an empty string -- callers that do
 * `errorMessage(e, fallback) ?? fallback` never catch that case, since
 * `??` only substitutes on null/undefined, not "", so an empty-message
 * error rendered as a blank error with no text anywhere. This now
 * surfaces something diagnostic instead of a blank string whenever the
 * message is empty, so the real failure is visible. Revert to plain
 * fallback-on-empty once the underlying bug is found.
 */
export function errorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) {
    if (e.message) return e.message;
    return `[empty error message] name=${e.name || "Error"} stack=${e.stack ?? "no stack"}`;
  }
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as { message: unknown }).message;
    if (typeof m === "string" && m.length > 0) return m;
  }
  try {
    return `${fallback} — raw error: ${JSON.stringify(e)}`;
  } catch {
    return fallback;
  }
}
