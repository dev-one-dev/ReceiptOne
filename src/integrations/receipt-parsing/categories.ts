/**
 * Ported verbatim from getReceiptCategories in the mobile app's
 * custom_functions.dart. "ca" (case-insensitive) gets the CRA T2125
 * list, anything else defaults to the US Schedule C list -- matches
 * mobile's own fallback behavior.
 *
 * Known gap vs. mobile: the real function also merges in a per-user
 * custom category list (currentUserDocument?.categories) before
 * sorting. The web app's UserProfile (src/integrations/firebase/
 * user-profile.ts) has no such field today -- there's nothing to read,
 * so that merge step is skipped entirely rather than inventing a
 * Firestore field. Revisit if/when that field gets added.
 */
const CA_CATEGORIES = [
  "Advertising",
  "Meals and entertainment",
  "Bad debts",
  "Insurance",
  "Interest and bank charges",
  "Business taxes, licences and memberships",
  "Office expenses",
  "Office stationery and supplies",
  "Professional fees (includes legal and accounting fees)",
  "Management and administration fees",
  "Rent",
  "Repairs and maintenance",
  "Salaries, wages and benefits (including employer's contributions)",
  "Property taxes",
  "Travel expenses",
  "Utilities",
  "Fuel costs (except for motor vehicles)",
  "Delivery, freight and express",
  "Capital cost allowance (CCA)",
  "Capital cost allowance (CCA) for business-use-of-home expenses",
  "Other expenses (specify)",
];

const US_CATEGORIES = [
  "Advertising",
  "Commissions and Fees",
  "Contract Labor",
  "Depletion",
  "Depreciation",
  "Employee Benefit Programs",
  "Insurance (other than health)",
  "Interest — Mortgage",
  "Interest — Other",
  "Legal and Professional Services",
  "Office Expense",
  "Pension and Profit-Sharing Plans",
  "Rent — Vehicles, Machinery, Equipment",
  "Rent — Other Business Property",
  "Repairs and Maintenance",
  "Supplies",
  "Taxes and Licenses",
  "Travel",
  "Meals",
  "Utilities",
  "Wages",
  "Energy efficient commercial bldgs deduction (attach Form 7205)",
  "Other Expenses",
];

/** Sorted alphabetically, except these three (in this exact preference order) always sort to the end, ahead of each other in this order. */
const OTHER_PREFERENCE_ORDER = ["Other expenses (specify)", "Other Expenses", "Other"];

function categoryComparator(a: string, b: string): number {
  const aIndex = OTHER_PREFERENCE_ORDER.indexOf(a);
  const bIndex = OTHER_PREFERENCE_ORDER.indexOf(b);
  const aIsOther = aIndex !== -1;
  const bIsOther = bIndex !== -1;
  if (aIsOther && bIsOther) return aIndex - bIndex;
  if (aIsOther) return 1;
  if (bIsOther) return -1;
  return a.localeCompare(b);
}

export function getReceiptCategories(countryCode: string): string[] {
  const list = countryCode.trim().toLowerCase() === "ca" ? CA_CATEGORIES : US_CATEGORIES;
  return [...list].sort(categoryComparator);
}
