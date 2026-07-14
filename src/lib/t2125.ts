import type { Receipt } from "@/integrations/firebase/receipts";
import type { Trip } from "@/integrations/firebase/trips";
import type { HomeOffice } from "@/integrations/firebase/home-office";

/**
 * Pure aggregation for CRA T2125 (Statement of Business or Professional
 * Activities), Part 4 expenses -- no Firestore reads here. Callers pass
 * already-fetched receipts/trips/homeOffice records, all pre-scoped to
 * the selected tax year (via fetchReceipts/fetchTrips/
 * fetchHomeOfficeRecords' own `year` filter).
 *
 * Step 1 of 2: this builds the on-screen preview only. PDF generation
 * is a separate, later piece.
 */

export type T2125LineNumber =
  | "8521"
  | "8523"
  | "8590"
  | "8690"
  | "8710"
  | "8760"
  | "8810"
  | "8811"
  | "8860"
  | "8871"
  | "8910"
  | "8960"
  | "9060"
  | "9180"
  | "9200"
  | "9220"
  | "9224"
  | "9275"
  | "9270"
  | "9936"
  | "9281"
  | "9945";

export type T2125LineItem = {
  lineNumber: T2125LineNumber;
  label: string;
  amount: number;
  /** Only set on 8523 (Meals and entertainment): the full, actual (100%) figure. `amount` above is already the CRA-allowable 50% figure that feeds totalExpenses. */
  actual?: number;
};

export type T2125Summary = {
  lines: T2125LineItem[];
  /** Line 9368 -- sum of every line above (8523 contributing its allowable 50% figure). */
  totalExpenses: number;
  /** Memo only -- the user's total recoverable GST/HST (Input Tax Credits) across the year's receipts. Not part of totalExpenses. */
  totalRefundableTax: number;
};

/**
 * Exact-match mapping from this app's CA receipt categories (see
 * categories.ts's CA_CATEGORIES, deliberately designed 1:1 onto these
 * T2125 lines) to their CRA line numbers. Any category not in this map
 * (blank/Uncategorized, or a US-list category) falls into 9270. The
 * home-office CCA category is handled separately below -- it rolls into
 * 9945, not its own line.
 */
const CATEGORY_LINE_MAP: Record<string, T2125LineNumber> = {
  Advertising: "8521",
  "Meals and entertainment": "8523",
  "Bad debts": "8590",
  Insurance: "8690",
  "Interest and bank charges": "8710",
  "Business taxes, licences and memberships": "8760",
  "Office expenses": "8810",
  "Office stationery and supplies": "8811",
  "Professional fees (includes legal and accounting fees)": "8860",
  "Management and administration fees": "8871",
  Rent: "8910",
  "Repairs and maintenance": "8960",
  "Salaries, wages and benefits (including employer's contributions)": "9060",
  "Property taxes": "9180",
  "Travel expenses": "9200",
  Utilities: "9220",
  "Fuel costs (except for motor vehicles)": "9224",
  "Delivery, freight and express": "9275",
  "Other expenses (specify)": "9270",
  "Capital cost allowance (CCA)": "9936",
};

/** Has no line of its own -- folds into 9945 alongside the homeOffice records' totalEmploymentExpenses. */
const HOME_OFFICE_CCA_CATEGORY = "Capital cost allowance (CCA) for business-use-of-home expenses";

const LINE_LABELS: Record<T2125LineNumber, string> = {
  "8521": "Advertising",
  "8523": "Meals and entertainment",
  "8590": "Bad debts",
  "8690": "Insurance",
  "8710": "Interest and bank charges",
  "8760": "Business taxes, licences and memberships",
  "8810": "Office expenses",
  "8811": "Office stationery and supplies",
  "8860": "Professional fees (includes legal and accounting fees)",
  "8871": "Management and administration fees",
  "8910": "Rent",
  "8960": "Repairs and maintenance",
  "9060": "Salaries, wages and benefits (including employer's contributions)",
  "9180": "Property taxes",
  "9200": "Travel expenses",
  "9220": "Utilities",
  "9224": "Fuel costs (except for motor vehicles)",
  "9275": "Delivery, freight and express",
  "9270": "Other expenses (specify)",
  "9936": "Capital cost allowance (CCA)",
  "9281": "Motor vehicle expenses (not including CCA)",
  "9945": "Business-use-of-home expenses",
};

/** Form order -- the order T2125LineItem[] is always returned in. */
const LINE_ORDER: T2125LineNumber[] = [
  "8521",
  "8523",
  "8590",
  "8690",
  "8710",
  "8760",
  "8810",
  "8811",
  "8860",
  "8871",
  "8910",
  "8960",
  "9060",
  "9180",
  "9200",
  "9220",
  "9224",
  "9275",
  "9270",
  "9936",
  "9281",
  "9945",
];

function refundableTaxOf(receipt: Receipt): number {
  return receipt.taxLists.filter((t) => t.isRefundable).reduce((sum, t) => sum + t.tax, 0);
}

/**
 * price is the pre-tax subtotal; tax is total tax. With ITC claimed,
 * the recoverable (refundable) portion of that tax is excluded from the
 * expense line -- the user recovers it separately as an Input Tax
 * Credit, so including it here would double-count the deduction.
 */
function receiptContribution(receipt: Receipt, claimsITC: boolean): number {
  if (!claimsITC) return receipt.price + receipt.tax;
  return receipt.price + (receipt.tax - refundableTaxOf(receipt));
}

/**
 * Mirrors mobile's homeOfficeSumServicesYtd overlap test: a record
 * counts toward the reporting year if its work period overlaps that
 * year's [periodStart, periodEnd) window -- started before the period
 * ends, and (still open, or) ended after the period started.
 */
function homeOfficeOverlapsPeriod(record: HomeOffice, periodStart: Date, periodEnd: Date): boolean {
  if (!record.startWorkDate) return false;
  const startsBeforeEnd = record.startWorkDate < periodEnd;
  const endsAfterStart = record.endWorkDate === null || record.endWorkDate > periodStart;
  return startsBeforeEnd && endsAfterStart;
}

export function buildT2125Summary(
  receipts: Receipt[],
  trips: Trip[],
  homeOfficeRecords: HomeOffice[],
  year: string,
  claimsITC: boolean,
): T2125Summary {
  const amounts = new Map<T2125LineNumber, number>(LINE_ORDER.map((ln) => [ln, 0]));

  let mealsActual = 0;
  let homeOfficeCcaFromReceipts = 0;
  let totalRefundableTax = 0;

  for (const receipt of receipts) {
    totalRefundableTax += refundableTaxOf(receipt);
    const contribution = receiptContribution(receipt, claimsITC);
    const category = receipt.companyCategory;

    if (category === "Meals and entertainment") {
      mealsActual += contribution;
      continue;
    }
    if (category === HOME_OFFICE_CCA_CATEGORY) {
      homeOfficeCcaFromReceipts += contribution;
      continue;
    }
    const lineNumber = CATEGORY_LINE_MAP[category] ?? "9270";
    amounts.set(lineNumber, (amounts.get(lineNumber) ?? 0) + contribution);
  }

  amounts.set("8523", mealsActual * 0.5);

  amounts.set(
    "9281",
    trips.reduce((sum, t) => sum + t.totalPrice, 0),
  );

  const periodStart = new Date(Number(year), 0, 1);
  const periodEnd = new Date(Number(year) + 1, 0, 1);
  const homeOfficeTotal = homeOfficeRecords
    .filter((record) => homeOfficeOverlapsPeriod(record, periodStart, periodEnd))
    .reduce((sum, record) => sum + record.totalEmploymentExpenses, 0);
  amounts.set("9945", homeOfficeTotal + homeOfficeCcaFromReceipts);

  const lines: T2125LineItem[] = LINE_ORDER.map((lineNumber) => {
    const amount = amounts.get(lineNumber) ?? 0;
    return lineNumber === "8523"
      ? { lineNumber, label: LINE_LABELS[lineNumber], amount, actual: mealsActual }
      : { lineNumber, label: LINE_LABELS[lineNumber], amount };
  });

  const totalExpenses = lines.reduce((sum, li) => sum + li.amount, 0);

  return { lines, totalExpenses, totalRefundableTax };
}
