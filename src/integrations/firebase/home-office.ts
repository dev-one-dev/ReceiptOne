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
 * Mirrors the real `homeOffice` collection -- one record per work-space
 * period per year (a user can have more than one in a single tax year,
 * e.g. after moving or resizing the workspace), same reasoning as
 * vehicle-expenses.ts. Historically written only by the mobile app;
 * this module now also writes it from the web dashboard, matching the
 * mobile wizard's fields/formulas exactly (see computeHomeOfficeTotals'
 * own doc comment) so a record created on web is indistinguishable from
 * one created on mobile.
 *
 * Confirmed against the mobile app's own "Summary of the employment-use
 * amount" screen: the real deductible total (T2125 line 9945 for a
 * self-employed filer -- mobile's own copy says "T777 line 48," which is
 * the EMPLOYMENT-expenses form, not T2125; this app is for self-employed
 * users, so all user-facing copy in HomeOfficeFields.tsx says 9945/T2125
 * instead) is `total_employment_expenses`, the sum of:
 *   total_home_expenses      x workspace_percent  = total_employment_home_expenses
 *   total_workspace_expenses x 100%                = total_employment_workspace_expenses
 * `total_employment_home_expenses` alone is NOT the full reclaim figure.
 */
export type HomeOffice = {
  id: string;
  createdAt: Date;
  createdBy: string;
  currency: string;
  forYear: string;
  title: string;
  homeRentType: string;
  homeSize: number;
  workspaceType: string;
  workspaceSize: number;
  workspaceUnit: string;
  workspacePercent: number;
  startWorkDate: Date | null;
  endWorkDate: Date | null;
  rentExpenses: number;
  electricity: number;
  heat: number;
  insurance: number;
  internet: number;
  maintenance: number;
  propertyTaxes: number;
  other: number;
  otherExpenses: number;
  totalHomeExpenses: number;
  totalWorkspaceExpenses: number;
  totalHomeServicesExpenses: number;
  totalEmploymentExpenses: number;
  totalEmploymentHomeExpenses: number;
  totalEmploymentWorkspaceExpenses: number;
};

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function num(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function toHomeOffice(id: string, data: Record<string, unknown>): HomeOffice {
  return {
    id,
    createdAt: toDate(data.created_at) ?? new Date(0),
    createdBy: typeof data.created_by === "string" ? data.created_by : "",
    currency: typeof data.currency === "string" ? data.currency : "USD",
    forYear: typeof data.for_year === "string" ? data.for_year : "",
    title: typeof data.title === "string" ? data.title : "Home office record",
    homeRentType: typeof data.home_rent_type === "string" ? data.home_rent_type : "",
    homeSize: num(data.home_size),
    workspaceType: typeof data.workspace_type === "string" ? data.workspace_type : "",
    workspaceSize: num(data.workspace_size),
    workspaceUnit: typeof data.workspace_unit === "string" ? data.workspace_unit : "",
    workspacePercent: num(data.workspace_percent),
    startWorkDate: toDate(data.start_work_date),
    endWorkDate: toDate(data.end_work_date),
    rentExpenses: num(data.rent_expenses),
    electricity: num(data.electricity),
    heat: num(data.heat),
    insurance: num(data.insurance),
    internet: num(data.internet),
    maintenance: num(data.maintenance),
    propertyTaxes: num(data.property_taxes),
    other: num(data.other),
    otherExpenses: num(data.other_expenses),
    totalHomeExpenses: num(data.total_home_expenses),
    totalWorkspaceExpenses: num(data.total_workspace_expenses),
    totalHomeServicesExpenses: num(data.total_home_services_expenses),
    totalEmploymentExpenses: num(data.total_employment_expenses),
    totalEmploymentHomeExpenses: num(data.total_employment_home_expenses),
    totalEmploymentWorkspaceExpenses: num(data.total_employment_workspace_expenses),
  };
}

/**
 * Fetches the signed-in user's home office record for a given tax year.
 * Filters by created_by server-side only, then matches for_year
 * client-side with a lenient String() coercion -- deliberately NOT a
 * server-side `where("for_year", "==", year)`, since Firestore equality
 * is type-strict and a record where for_year was ever written as a
 * number (2026) instead of a string ("2026") would silently never match
 * a string-typed query, making a real record look like "none exists"
 * rather than surfacing a type mismatch. A user has at most a handful of
 * these records (one per tax year), so fetching all of them and matching
 * client-side is cheap and removes that whole failure mode.
 */
export async function fetchHomeOffice(uid: string, year: string): Promise<HomeOffice | null> {
  const q = query(collection(db, "homeOffice"), where("created_by", "==", uid));
  const snapshot = await getDocs(q);
  const records = snapshot.docs
    .map((doc) => toHomeOffice(doc.id, doc.data()))
    .filter((record) => String(record.forYear) === String(year));
  if (records.length === 0) return null;
  records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return records[0];
}

/**
 * Same query/filter shape as fetchHomeOffice above, but returns every
 * matching record instead of collapsing to the newest one -- a tax form
 * (T2125) needs to sum ALL of a user's home office records for the
 * year, since a user can have more than one in a single tax year (e.g.
 * after moving or resizing the workspace partway through the year).
 */
export async function fetchHomeOfficeRecords(uid: string, year: string): Promise<HomeOffice[]> {
  const q = query(collection(db, "homeOffice"), where("created_by", "==", uid));
  const snapshot = await getDocs(q);
  const records = snapshot.docs
    .map((doc) => toHomeOffice(doc.id, doc.data()))
    .filter((record) => String(record.forYear) === String(year));
  records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return records;
}

export type HomeOfficeTotalsInput = {
  homeSize: number;
  workspaceSize: number;
  rentExpenses: number;
  electricity: number;
  heat: number;
  insurance: number;
  internet: number;
  maintenance: number;
  propertyTaxes: number;
  /** Maintenance-style cost for the entire home + workspace -- prorated by workspace_percent like the rest of total_home_expenses. */
  other: number;
  /** Maintenance-style cost for the workspace only -- 100% deductible, not prorated. Feeds total_workspace_expenses, not total_home_expenses. */
  otherExpenses: number;
};

export type HomeOfficeTotals = {
  workspacePercent: number;
  totalHomeExpenses: number;
  totalWorkspaceExpenses: number;
  totalEmploymentHomeExpenses: number;
  totalEmploymentWorkspaceExpenses: number;
  totalEmploymentExpenses: number;
};

/**
 * The mobile wizard's own math (custom_functions.dart), ported verbatim --
 * shared by createHomeOffice/updateHomeOffice (so the two write paths can
 * never drift apart) and the UI's live preview.
 *
 * workspace_percent is workspace_size / home_size (0 if home_size is 0,
 * matching vehicle-expenses.ts's businessUsePercent guard). Every home
 * cost (rent, electricity, heat, insurance, internet, maintenance,
 * property taxes, and the home-wide "other") is prorated by that
 * percent; the workspace-only "other_expenses" line is added back at
 * 100%, unprorated -- easy to get backwards, so it's spelled out here
 * rather than left to be inferred from the formula alone.
 */
export function computeHomeOfficeTotals(input: HomeOfficeTotalsInput): HomeOfficeTotals {
  const workspacePercent = input.homeSize > 0 ? (input.workspaceSize / input.homeSize) * 100 : 0;

  const totalHomeExpenses =
    input.rentExpenses +
    input.electricity +
    input.heat +
    input.insurance +
    input.internet +
    input.maintenance +
    input.propertyTaxes +
    input.other;
  const totalWorkspaceExpenses = input.otherExpenses;

  const totalEmploymentHomeExpenses = totalHomeExpenses * (workspacePercent / 100);
  const totalEmploymentWorkspaceExpenses = totalWorkspaceExpenses;
  const totalEmploymentExpenses = totalEmploymentHomeExpenses + totalEmploymentWorkspaceExpenses;

  return {
    workspacePercent,
    totalHomeExpenses,
    totalWorkspaceExpenses,
    totalEmploymentHomeExpenses,
    totalEmploymentWorkspaceExpenses,
    totalEmploymentExpenses,
  };
}

export type HomeOfficeInput = HomeOfficeTotalsInput & {
  uid: string;
  forYear: string;
  currency: string;
  homeRentType: string;
  workspaceType: string;
  workspaceUnit: string;
  startWorkDate: Date;
  endWorkDate: Date;
};

/**
 * Creates a new document in `homeOffice`, matching the schema mobile
 * already writes -- this is the web app's first write path for this
 * collection. created_by is the signed-in user's uid, matching the
 * security rules' ownership check (already in place; no rule change
 * needed), same convention as createTrip/createVehicleExpenses.
 *
 * `title` isn't a field the wizard ever asks the user to type -- mobile
 * auto-generates it, so web does the same. `total_home_services_expenses`
 * is read by toHomeOffice() but has no formula in the mobile spec (it
 * isn't one of the six persisted derived fields the spec defines), so
 * it's deliberately left unwritten here rather than guessed at -- a
 * missing field already reads back as 0 via toHomeOffice's num() helper.
 */
export async function createHomeOffice(input: HomeOfficeInput): Promise<void> {
  const totals = computeHomeOfficeTotals(input);
  await addDoc(collection(db, "homeOffice"), {
    created_by: input.uid,
    created_at: serverTimestamp(),
    currency: input.currency,
    for_year: input.forYear,
    title: `Home office ${input.forYear}`,
    home_rent_type: input.homeRentType,
    home_size: input.homeSize,
    workspace_type: input.workspaceType,
    workspace_size: input.workspaceSize,
    workspace_unit: input.workspaceUnit,
    workspace_percent: totals.workspacePercent,
    start_work_date: Timestamp.fromDate(input.startWorkDate),
    end_work_date: Timestamp.fromDate(input.endWorkDate),
    rent_expenses: input.rentExpenses,
    electricity: input.electricity,
    heat: input.heat,
    insurance: input.insurance,
    internet: input.internet,
    maintenance: input.maintenance,
    property_taxes: input.propertyTaxes,
    other: input.other,
    other_expenses: input.otherExpenses,
    total_home_expenses: totals.totalHomeExpenses,
    total_workspace_expenses: totals.totalWorkspaceExpenses,
    total_employment_expenses: totals.totalEmploymentExpenses,
    total_employment_home_expenses: totals.totalEmploymentHomeExpenses,
    total_employment_workspace_expenses: totals.totalEmploymentWorkspaceExpenses,
  });
}

export type HomeOfficeUpdateInput = HomeOfficeTotalsInput & {
  currency: string;
  homeRentType: string;
  workspaceType: string;
  workspaceUnit: string;
  startWorkDate: Date;
  endWorkDate: Date;
};

/**
 * Updates an existing home-office record -- only the fields the edit
 * form exposes. Deliberately never touches created_by, created_at,
 * for_year, or title (the record's tax year is fixed at creation, same
 * as trips.ts/vehicle-expenses.ts's own update functions); recomputes
 * every derived total every time, same as create.
 */
export async function updateHomeOffice(id: string, patch: HomeOfficeUpdateInput): Promise<void> {
  const totals = computeHomeOfficeTotals(patch);
  await updateDoc(doc(db, "homeOffice", id), {
    currency: patch.currency,
    home_rent_type: patch.homeRentType,
    home_size: patch.homeSize,
    workspace_type: patch.workspaceType,
    workspace_size: patch.workspaceSize,
    workspace_unit: patch.workspaceUnit,
    workspace_percent: totals.workspacePercent,
    start_work_date: Timestamp.fromDate(patch.startWorkDate),
    end_work_date: Timestamp.fromDate(patch.endWorkDate),
    rent_expenses: patch.rentExpenses,
    electricity: patch.electricity,
    heat: patch.heat,
    insurance: patch.insurance,
    internet: patch.internet,
    maintenance: patch.maintenance,
    property_taxes: patch.propertyTaxes,
    other: patch.other,
    other_expenses: patch.otherExpenses,
    total_home_expenses: totals.totalHomeExpenses,
    total_workspace_expenses: totals.totalWorkspaceExpenses,
    total_employment_expenses: totals.totalEmploymentExpenses,
    total_employment_home_expenses: totals.totalEmploymentHomeExpenses,
    total_employment_workspace_expenses: totals.totalEmploymentWorkspaceExpenses,
  });
}

/**
 * A real, permanent hard delete -- not a soft-delete flag. Callers must
 * confirm with the user before calling this; nothing here prompts.
 */
export async function deleteHomeOffice(id: string): Promise<void> {
  await deleteDoc(doc(db, "homeOffice", id));
}
