import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
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

export type ProfileUpdateInput = {
  countryCode?: string;
  stateCountry?: string;
  stateState?: string;
};

/**
 * Updates only the Tax jurisdiction fields on the user's own profile
 * document -- country_code (top-level) and the nested state.country/
 * state.state fields, matching how toProfile above reads them (dot-
 * notation so only those two sub-fields of `state` are touched, not
 * the whole map). Deliberately narrow: never touches taxList,
 * distance_rate, language, or any other Settings-page field -- wiring
 * those up is a separate, not-yet-built task.
 */
export async function updateUserProfile(uid: string, patch: ProfileUpdateInput): Promise<void> {
  const updates: Record<string, unknown> = {};
  if (patch.countryCode !== undefined) updates.country_code = patch.countryCode;
  if (patch.stateCountry !== undefined) updates["state.country"] = patch.stateCountry;
  if (patch.stateState !== undefined) updates["state.state"] = patch.stateState;
  if (Object.keys(updates).length === 0) return;
  await updateDoc(doc(db, "users", uid), updates);
}

export type UserSettingsUpdateInput = {
  language?: string;
  distanceUnit?: "km" | "mi";
  distanceRate?: number;
  taxList?: ProfileTaxEntry[];
};

/**
 * Updates the real, confirmed Settings-page fields on the user's own
 * profile document -- language, distance (the unit string, NOT
 * "distance_unit"), distance_rate, and taxList (camelCase sub-fields,
 * same convention already handled correctly for receipts.tax_lists
 * elsewhere in this codebase). Deliberately narrow: never touches
 * `currency` (not a confirmed real field on this schema) or
 * date_format_type (enum mapping unconfirmed) -- both stay local-only/
 * cosmetic on the Settings page until those are resolved separately.
 */
export async function updateUserSettings(
  uid: string,
  patch: UserSettingsUpdateInput,
): Promise<void> {
  const updates: Record<string, unknown> = {};
  if (patch.language !== undefined) updates.language = patch.language;
  if (patch.distanceUnit !== undefined) updates.distance = patch.distanceUnit;
  if (patch.distanceRate !== undefined) updates.distance_rate = patch.distanceRate;
  if (patch.taxList !== undefined) {
    updates.taxList = patch.taxList.map((t) => ({
      isRefundable: t.isRefundable,
      taxName: t.taxName,
      taxPercent: t.taxPercent,
    }));
  }
  if (Object.keys(updates).length === 0) return;
  await updateDoc(doc(db, "users", uid), updates);
}
