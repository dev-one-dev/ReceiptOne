import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

/**
 * Mirrors the real `homeOffice` collection written by the mobile app --
 * one record per tax year (a workspace configuration + its expenses),
 * not a list like receipts/trips. Read-only: nothing in this module
 * writes to Firestore.
 *
 * Confirmed against the mobile app's own "Summary of the employment-use
 * amount" screen (T777 line 48): the real deductible total is
 * `total_employment_expenses`, which is the sum of:
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
 * Pure equality filters only (created_by, for_year) -- deliberately no
 * orderBy, since there's normally exactly one record per year and adding
 * a sort would need a composite index for what should be a single-doc
 * case. If duplicates ever exist, the most recently created one wins,
 * sorted client-side.
 */
export async function fetchHomeOffice(uid: string, year: string): Promise<HomeOffice | null> {
  const q = query(
    collection(db, "homeOffice"),
    where("created_by", "==", uid),
    where("for_year", "==", year),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const records = snapshot.docs.map((doc) => toHomeOffice(doc.id, doc.data()));
  records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return records[0];
}
