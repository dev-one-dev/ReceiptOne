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
 */
export function errorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as { message: unknown }).message;
    if (typeof m === "string" && m.length > 0) return m;
  }
  return fallback;
}
