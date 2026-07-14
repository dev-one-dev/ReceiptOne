import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

/**
 * Mirrors the real `vehicleExpenses` collection -- one document per
 * vehicle-use period per year (a user can have more than one in a
 * single tax year, e.g. after selling one vehicle and buying another),
 * same reasoning as home-office.ts's fetchHomeOfficeRecords. Shared
 * source of truth with the mobile app, which will also write this
 * collection once mobile development resumes on it -- computed totals
 * (business_use_percent, total_vehicle_expenses, total_deductible,
 * deductible_interest) are persisted as fields here, exactly like
 * homeOffice's total_employment_expenses, so neither client has to
 * recompute or duplicate the math to read the finished numbers.
 *
 * This exists for CRA T2125 line 9281 (Motor vehicle expenses), computed
 * via Chart A: actual vehicle costs x business-use percentage. That is
 * NOT the mileage x rate figure this app's Mileage page/report currently
 * use for that line -- the trips logbook (`routes`) establishes the
 * business-use PERCENTAGE Chart A needs, it is not the deduction figure
 * itself. (Wiring the real Chart A figure into the T2125 report is a
 * separate, later change -- this module only builds the data layer.)
 *
 * Unlike home-office.ts, web has full read/write access here (create,
 * update, delete) -- this is the web app's first write path for a
 * yearly-figures collection, so field mapping is spelled out carefully
 * below, the same way receipts.ts/trips.ts do it.
 */
export type VehicleExpenses = {
  id: string;
  createdBy: string;
  createdAt: Date;
  forYear: string;
  /** The period this vehicle was used for business -- may be a partial year if bought/sold mid-year. */
  startDate: Date | null;
  endDate: Date | null;
  /** Odometer total for the period -- all driving, business and personal. */
  totalKm: number;
  /** Pre-filled from the trips logbook but always editable -- see AddVehicleExpensesDialog. */
  businessKm: number;
  fuel: number;
  insurance: number;
  maintenance: number;
  licenceRegistration: number;
  /** Raw entered interest, before the CRA daily cap -- see deductibleInterest for the actually-deductible figure. */
  interest: number;
  /** interest after the CRA daily cap (min(interest, DAILY_INTEREST_LIMIT_ESTIMATE x days in period)) -- this, not `interest`, is what feeds totalVehicleExpenses. Stored (not just computed on read) so the user can always see what they entered vs what's deductible without recomputing. */
  deductibleInterest: number;
  /**
   * Leasing has its own, separate CRA limit (Chart C on the T2125),
   * which is a different calculation from the interest cap above and
   * additionally depends on the vehicle's manufacturer's list price --
   * a field this app doesn't collect. Deliberately left UNCAPPED here
   * rather than guessed at; the UI shows an explicit warning next to
   * this field so the raw figure is never mistaken for a verified one.
   */
  leasing: number;
  /** Deductible at 100%, deliberately excluded from total_vehicle_expenses -- see computeVehicleExpensesTotals. */
  parking: number;
  other: number;
  businessUsePercent: number;
  totalVehicleExpenses: number;
  totalDeductible: number;
};

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function num(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function toVehicleExpenses(id: string, data: Record<string, unknown>): VehicleExpenses {
  return {
    id,
    createdBy: typeof data.created_by === "string" ? data.created_by : "",
    createdAt: toDate(data.created_at) ?? new Date(0),
    forYear: typeof data.for_year === "string" ? data.for_year : "",
    startDate: toDate(data.start_date),
    endDate: toDate(data.end_date),
    totalKm: num(data.total_km),
    businessKm: num(data.business_km),
    fuel: num(data.fuel),
    insurance: num(data.insurance),
    maintenance: num(data.maintenance),
    licenceRegistration: num(data.licence_registration),
    // `interest`/`leasing`/`deductible_interest` replace the old combined
    // `interest_leasing` field. A document written before this split
    // simply has none of the three -- num() already falls back to 0 for
    // a missing field, so a legacy doc reads as $0 interest/leasing
    // rather than crashing. No migration of old documents: this
    // collection was created the same day as this schema change and
    // only ever held test data.
    interest: num(data.interest),
    deductibleInterest: num(data.deductible_interest),
    leasing: num(data.leasing),
    parking: num(data.parking),
    other: num(data.other),
    businessUsePercent: num(data.business_use_percent),
    totalVehicleExpenses: num(data.total_vehicle_expenses),
    totalDeductible: num(data.total_deductible),
  };
}

/**
 * Fetches the signed-in user's newest vehicle-expenses record for a
 * given tax year. Same fetch-all-then-filter-client-side pattern as
 * fetchHomeOffice -- see that function's doc comment for why (avoids a
 * string-vs-number for_year type mismatch silently matching nothing).
 */
export async function fetchVehicleExpenses(
  uid: string,
  year: string,
): Promise<VehicleExpenses | null> {
  const q = query(collection(db, "vehicleExpenses"), where("created_by", "==", uid));
  const snapshot = await getDocs(q);
  const records = snapshot.docs
    .map((doc) => toVehicleExpenses(doc.id, doc.data()))
    .filter((record) => String(record.forYear) === String(year));
  if (records.length === 0) return null;
  records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return records[0];
}

/**
 * Same query/filter shape as fetchVehicleExpenses, but returns every
 * matching record instead of collapsing to the newest one -- a user can
 * have more than one vehicle period in a single tax year.
 */
export async function fetchVehicleExpensesRecords(
  uid: string,
  year: string,
): Promise<VehicleExpenses[]> {
  const q = query(collection(db, "vehicleExpenses"), where("created_by", "==", uid));
  const snapshot = await getDocs(q);
  const records = snapshot.docs
    .map((doc) => toVehicleExpenses(doc.id, doc.data()))
    .filter((record) => String(record.forYear) === String(year));
  records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return records;
}

/**
 * CRA's daily cap on deductible interest for a loan used to buy a
 * passenger vehicle (T2125 motor vehicle expenses). This dollar figure
 * changes every tax year -- 2026's is approximately $11.67/day (~$350
 * per 30-day period), but this is OUR best-known estimate, not a
 * confirmed-current CRA figure. MUST be reviewed against the actual
 * published limit for each new tax year, and the UI presents it as
 * approximate ("verify the current limit") rather than asserted fact.
 */
export const DAILY_INTEREST_LIMIT_TAX_YEAR = 2026;
export const DAILY_INTEREST_LIMIT_ESTIMATE = 11.67;

/** Whole days in [startDate, endDate], inclusive of both ends -- 0 if either date is missing. */
export function daysInPeriod(startDate: Date | null, endDate: Date | null): number {
  if (!startDate || !endDate) return 0;
  const ms = endDate.getTime() - startDate.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

export type VehicleExpensesTotalsInput = {
  startDate: Date | null;
  endDate: Date | null;
  totalKm: number;
  businessKm: number;
  fuel: number;
  insurance: number;
  maintenance: number;
  licenceRegistration: number;
  interest: number;
  leasing: number;
  parking: number;
  other: number;
};

export type VehicleExpensesTotals = {
  businessUsePercent: number;
  /** interest after CRA's daily cap -- what actually feeds totalVehicleExpenses, not the raw `interest` input. */
  deductibleInterest: number;
  totalVehicleExpenses: number;
  totalDeductible: number;
};

/**
 * The Chart A math -- shared by createVehicleExpenses/
 * updateVehicleExpenses (so the two write paths can never drift apart)
 * and by the UI's live preview (so the number shown before saving is
 * guaranteed to match what actually gets stored).
 *
 * Interest is capped first (the LESSER of the amount actually paid and
 * DAILY_INTEREST_LIMIT_ESTIMATE x days in the period), and that capped figure --
 * not the raw entered interest -- is what gets prorated by business-use
 * % like every other expense line.
 *
 * Leasing has no cap applied here at all (see the `leasing` field's own
 * doc comment on VehicleExpenses for why) -- it goes into
 * totalVehicleExpenses at face value.
 *
 * Parking is deductible at 100% and is NOT included in
 * total_vehicle_expenses (which gets prorated by business-use %) -- it
 * is added back in afterward, unprorated. This is easy to get backwards,
 * so it's spelled out here rather than left to be inferred from the
 * formula alone.
 */
export function computeVehicleExpensesTotals(
  input: VehicleExpensesTotalsInput,
): VehicleExpensesTotals {
  const businessUsePercent = input.totalKm > 0 ? (input.businessKm / input.totalKm) * 100 : 0;

  const interestCap = DAILY_INTEREST_LIMIT_ESTIMATE * daysInPeriod(input.startDate, input.endDate);
  const deductibleInterest = Math.min(input.interest, interestCap);

  const totalVehicleExpenses =
    input.fuel +
    input.insurance +
    input.maintenance +
    input.licenceRegistration +
    deductibleInterest +
    input.leasing +
    input.other;
  const totalDeductible = totalVehicleExpenses * (businessUsePercent / 100) + input.parking;
  return { businessUsePercent, deductibleInterest, totalVehicleExpenses, totalDeductible };
}

export type VehicleExpensesInput = Omit<VehicleExpensesTotalsInput, "startDate" | "endDate"> & {
  uid: string;
  forYear: string;
  startDate: Date;
  endDate: Date;
};

/**
 * Creates a new document in `vehicleExpenses`, matching the shared
 * schema mobile will also write to. created_by is the signed-in user's
 * uid, matching the security rules' ownership check exactly (same
 * convention as createReceipt/createTrip).
 */
export async function createVehicleExpenses(input: VehicleExpensesInput): Promise<void> {
  const totals = computeVehicleExpensesTotals(input);
  await addDoc(collection(db, "vehicleExpenses"), {
    created_by: input.uid,
    created_at: serverTimestamp(),
    for_year: input.forYear,
    start_date: Timestamp.fromDate(input.startDate),
    end_date: Timestamp.fromDate(input.endDate),
    total_km: input.totalKm,
    business_km: input.businessKm,
    fuel: input.fuel,
    insurance: input.insurance,
    maintenance: input.maintenance,
    licence_registration: input.licenceRegistration,
    interest: input.interest,
    deductible_interest: totals.deductibleInterest,
    leasing: input.leasing,
    parking: input.parking,
    other: input.other,
    business_use_percent: totals.businessUsePercent,
    total_vehicle_expenses: totals.totalVehicleExpenses,
    total_deductible: totals.totalDeductible,
  });
}

export type VehicleExpensesUpdateInput = Omit<
  VehicleExpensesTotalsInput,
  "startDate" | "endDate"
> & {
  startDate: Date;
  endDate: Date;
};

/**
 * Updates an existing vehicle-expenses record -- only the fields the
 * edit form exposes. Deliberately never touches created_by, created_at,
 * or for_year (the record's tax year is fixed at creation, matching how
 * trips.ts's updateTrip never lets the recorded unit change after the
 * fact); recomputes the four derived totals every time, same as create.
 */
export async function updateVehicleExpenses(
  id: string,
  patch: VehicleExpensesUpdateInput,
): Promise<void> {
  const totals = computeVehicleExpensesTotals(patch);
  await updateDoc(doc(db, "vehicleExpenses", id), {
    start_date: Timestamp.fromDate(patch.startDate),
    end_date: Timestamp.fromDate(patch.endDate),
    total_km: patch.totalKm,
    business_km: patch.businessKm,
    fuel: patch.fuel,
    insurance: patch.insurance,
    maintenance: patch.maintenance,
    licence_registration: patch.licenceRegistration,
    interest: patch.interest,
    deductible_interest: totals.deductibleInterest,
    leasing: patch.leasing,
    parking: patch.parking,
    other: patch.other,
    business_use_percent: totals.businessUsePercent,
    total_vehicle_expenses: totals.totalVehicleExpenses,
    total_deductible: totals.totalDeductible,
  });
}

/**
 * A real, permanent hard delete -- not a soft-delete flag. Callers must
 * confirm with the user before calling this; nothing here prompts.
 */
export async function deleteVehicleExpenses(id: string): Promise<void> {
  await deleteDoc(doc(db, "vehicleExpenses", id));
}
