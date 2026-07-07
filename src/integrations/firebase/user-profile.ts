import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

export type ProfileTaxEntry = {
  isRefundable: boolean;
  taxName: string;
  taxPercent: number;
};

/**
 * Mirrors the real `users` collection written by the mobile app -- this
 * doubles as both profile data AND the real Settings values (distance
 * unit/rate, language, tax list). Read-only: nothing in this module
 * writes to Firestore. Assumes the document ID is the uid (the standard
 * "users/{uid}" pattern); if a given account's profile doc uses a
 * different ID, this will need a `where("uid", "==", uid)` query instead.
 */
export type UserProfile = {
  uid: string;
  countryCode: string;
  createdAt: Date;
  /**
   * Raw enum value from Firestore -- meaning not yet confirmed (no docs/
   * pattern found for what each integer maps to). Don't infer a mapping;
   * surface the raw number so a future pass can wire it once confirmed
   * with the mobile team, rather than silently guessing a date format.
   */
  dateFormatType: number | null;
  distanceUnit: "km" | "mi";
  distanceRate: number;
  language: string;
  promo: string;
  stateCountry: string;
  stateState: string;
  taxList: ProfileTaxEntry[];
  trialExpDate: Date | null;
};

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function toTaxList(value: unknown): ProfileTaxEntry[] {
  if (!Array.isArray(value)) return [];
  return value.map((t) => ({
    isRefundable: Boolean(t?.isRefundable),
    taxName: typeof t?.taxName === "string" ? t.taxName : "",
    taxPercent: typeof t?.taxPercent === "number" ? t.taxPercent : 0,
  }));
}

function toProfile(uid: string, data: Record<string, unknown>): UserProfile {
  const state = (data.state ?? {}) as Record<string, unknown>;
  return {
    uid,
    countryCode: typeof data.country_code === "string" ? data.country_code : "",
    createdAt: toDate(data.created_time) ?? new Date(0),
    dateFormatType: typeof data.date_format_type === "number" ? data.date_format_type : null,
    distanceUnit: data.distance === "mi" ? "mi" : "km",
    distanceRate: typeof data.distance_rate === "number" ? data.distance_rate : 0,
    language: typeof data.language === "string" ? data.language : "en",
    promo: typeof data.promo === "string" ? data.promo : "",
    stateCountry: typeof state.country === "string" ? state.country : "",
    stateState: typeof state.state === "string" ? state.state : "",
    taxList: toTaxList(data.taxList),
    trialExpDate: toDate(data.trial_exp_date),
  };
}

/** Fetches the signed-in user's own profile/settings document. Returns null if it doesn't exist yet. */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return toProfile(snapshot.id, snapshot.data());
}
