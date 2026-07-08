import { isRefundableByName } from "@/integrations/receipt-parsing/tax-helpers";
import { findProvinceTaxInfo } from "@/integrations/receipt-parsing/province-tax-rates";

export type ParsedTaxItem = {
  taxName: string;
  tax: number;
  taxPercent: number;
  isRefundable: boolean;
};

export type ParsedReceipt = {
  merchantName: string | null;
  merchantCategory: string | null;
  date: Date | null;
  price: number;
  tax: number;
  isPreTax: boolean;
  isReimbursable: boolean;
  typeOfTaxDeduction: "Business" | "Personal";
  paymentMethod: "Cash" | "Card";
  comment: string | null;
  taxList: ParsedTaxItem[];
  /** True if the AI's own tax_items carried real, nonzero amounts (not all derived here from percentages) -- consulted by apply-tax-settings.ts to decide whether to treat those amounts as authoritative. */
  taxAmountsFromAi: boolean;
  /** The original raw model response, pre-parsing -- matches mobile's `description: originalResponseString`. In-memory only for this phase; not persisted (Phase 2 does no Firestore writes). */
  description: string;
};

function toNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return 0;
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Client's actual default is "Personal", NOT "Business" despite the system prompt's own stated default -- confirmed deliberately, not a typo. */
function normalizeTaxDeductionType(value: unknown): "Business" | "Personal" {
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "business") return "Business";
    if (trimmed === "personal") return "Personal";
  }
  return "Personal";
}

function normalizePaymentMethod(value: unknown): "Cash" | "Card" {
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "card") return "Card";
    if (trimmed === "cash") return "Cash";
  }
  return "Cash";
}

/* ---------------------------------------------------------------------
 * Date parsing: 7 formats tried in order, matching the mobile app's
 * DateFormat cascade. If the parsed time is exactly midnight, the time
 * portion is replaced with the current time (date kept as parsed).
 * ------------------------------------------------------------------- */

type DateFormatSpec = { regex: RegExp; build: (m: RegExpMatchArray) => Date };

const DATE_FORMATS: DateFormatSpec[] = [
  // yyyy-MM-dd HH:mm:ss
  {
    regex: /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2}):(\d{2})$/,
    build: (m) => new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]),
  },
  // dd-MM-yyyy HH:mm:ss
  {
    regex: /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/,
    build: (m) => new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +m[6]),
  },
  // dd.MM.yyyy HH:mm:ss
  {
    regex: /^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/,
    build: (m) => new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +m[6]),
  },
  // yyyy/MM/dd HH:mm:ss
  {
    regex: /^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{1,2}):(\d{2}):(\d{2})$/,
    build: (m) => new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]),
  },
  // MM/dd/yyyy HH:mm:ss
  {
    regex: /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/,
    build: (m) => new Date(+m[3], +m[1] - 1, +m[2], +m[4], +m[5], +m[6]),
  },
  // dd-MM-yyyy HH:mm
  {
    regex: /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2})$/,
    build: (m) => new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], 0),
  },
  // yyyy-MM-dd
  {
    regex: /^(\d{4})-(\d{2})-(\d{2})$/,
    build: (m) => new Date(+m[1], +m[2] - 1, +m[3]),
  },
];

function parseReceiptDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  for (const format of DATE_FORMATS) {
    const match = trimmed.match(format.regex);
    if (!match) continue;
    const parsed = format.build(match);
    if (Number.isNaN(parsed.getTime())) continue;
    if (parsed.getHours() === 0 && parsed.getMinutes() === 0 && parsed.getSeconds() === 0) {
      const now = new Date();
      parsed.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    }
    return parsed;
  }
  return null;
}

/* ---------------------------------------------------------------------
 * tax_items normalization
 * ------------------------------------------------------------------- */

type WorkingTaxItem = { taxName: string; tax: number | undefined; taxPercent: number | undefined };

function toWorkingNumber(value: unknown): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return undefined;
}

function toInitialWorkingTaxList(rawItems: unknown): WorkingTaxItem[] {
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map((item) => {
    const obj = (item ?? {}) as Record<string, unknown>;
    const rawName = typeof obj.tax_name === "string" ? obj.tax_name.trim() : "";
    return {
      taxName: rawName || "Tax",
      tax: toWorkingNumber(obj.tax),
      taxPercent: toWorkingNumber(obj.tax_percent),
    };
  });
}

// Same regex pattern used both for the "some items have no amount"
// salvage and the "tax_items completely missing" final rescue.
const TAX_AMOUNT_REGEX = /(PST\s+LIQUOR|PST\s+LIQ|PST|GST|HST|QST)\s*:?\s*\$?\s*([\d,]+\.?\d*)/gi;

function normalizeTaxNameFromMatch(rawName: string): string {
  const upper = rawName.toUpperCase();
  if (upper.includes("LIQUOR") || upper.includes("LIQ")) return "PST LIQUOR";
  if (upper.includes("PST")) return "PST";
  if (upper.includes("GST")) return "GST";
  if (upper.includes("HST")) return "HST";
  if (upper.includes("QST")) return "QST";
  return upper;
}

function salvageTaxAmountsFromText(rawText: string): Map<string, number> {
  const sums = new Map<string, number>();
  TAX_AMOUNT_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TAX_AMOUNT_REGEX.exec(rawText)) !== null) {
    const name = normalizeTaxNameFromMatch(match[1]);
    const amount = parseFloat(match[2].replace(/,/g, ""));
    if (!Number.isNaN(amount)) sums.set(name, (sums.get(name) ?? 0) + amount);
  }
  return sums;
}

/** Fuzzy PST/GST/HST/QST substring matching, per the spec -- exact match on the normalized bucket name first, else containment either direction. */
function matchSalvagedAmount(itemName: string, salvaged: Map<string, number>): number | undefined {
  const upper = itemName.toUpperCase();
  if (salvaged.has(upper)) return salvaged.get(upper);
  for (const [key, amount] of salvaged.entries()) {
    if (upper.includes(key) || key.includes(upper)) return amount;
  }
  return undefined;
}

const PST_QST_PATTERN = /pst|qst/i;

/**
 * Finalizes a working list into concrete ParsedTaxItems: scales amounts
 * proportionally to match rootTax if they're off by more than $0.01,
 * recomputes percentages from the (possibly scaled) amounts, then
 * applies the PST/QST-specific recompute: when a PST/QST item has a
 * nonzero amount, every OTHER item's percent is recomputed relative to
 * (price + pstAmount) instead of price alone.
 */
function finalizeTaxItems(
  items: WorkingTaxItem[],
  rootTax: number,
  price: number,
): ParsedTaxItem[] {
  let amounts = items.map((i) => i.tax ?? 0);
  const currentSum = amounts.reduce((sum, a) => sum + a, 0);

  if (currentSum > 0 && Math.abs(currentSum - rootTax) > 0.01) {
    const scale = rootTax / currentSum;
    amounts = amounts.map((a) => a * scale);
  }

  let percents = amounts.map((a) => (price > 0 ? (a / price) * 100 : 0));

  const pstIndex = items.findIndex(
    (item, idx) => PST_QST_PATTERN.test(item.taxName) && amounts[idx] > 0,
  );
  if (pstIndex !== -1) {
    const pstAmount = amounts[pstIndex];
    const base = price + pstAmount;
    percents = items.map((item, idx) => {
      if (idx === pstIndex || PST_QST_PATTERN.test(item.taxName)) return percents[idx];
      return base > 0 ? (amounts[idx] / base) * 100 : percents[idx];
    });
  }

  return items.map((item, idx) => ({
    taxName: item.taxName,
    tax: amounts[idx],
    taxPercent: percents[idx],
    isRefundable: isRefundableByName(item.taxName),
  }));
}

function normalizeTaxItems(
  items: WorkingTaxItem[],
  rootTax: number,
  price: number,
  rawResponseText: string,
): ParsedTaxItem[] {
  if (items.length === 0) {
    if (rootTax > 0 && price > 0) {
      const salvaged = salvageTaxAmountsFromText(rawResponseText);
      if (salvaged.size > 0) {
        const rescued: WorkingTaxItem[] = Array.from(salvaged.entries()).map(([name, amount]) => ({
          taxName: name,
          tax: amount,
          taxPercent: undefined,
        }));
        return finalizeTaxItems(rescued, rootTax, price);
      }
    }
    return [];
  }

  const hasAnyAmount = items.some((i) => (i.tax ?? 0) > 0);
  if (!hasAnyAmount && rootTax > 0) {
    const salvaged = salvageTaxAmountsFromText(rawResponseText);
    if (salvaged.size > 0) {
      for (const item of items) {
        const matched = matchSalvagedAmount(item.taxName, salvaged);
        if (matched !== undefined) item.tax = matched;
      }
    }
    const stillAllMissing = items.every((i) => !i.tax || i.tax === 0);
    if (stillAllMissing) {
      const even = rootTax / items.length;
      for (const item of items) item.tax = even;
    }
  }

  return finalizeTaxItems(items, rootTax, price);
}

/* ---------------------------------------------------------------------
 * State/province-based tax-name disambiguation
 * ------------------------------------------------------------------- */

const AMBIGUOUS_NAMES = new Set(["", "tax", "unknown"]);

function disambiguateTaxNames(
  taxList: ParsedTaxItem[],
  stateCountry: string,
  stateState: string,
): ParsedTaxItem[] {
  if (!taxList.some((t) => AMBIGUOUS_NAMES.has(t.taxName.trim().toLowerCase()))) return taxList;

  const provinceInfo = findProvinceTaxInfo(stateCountry, stateState);
  if (!provinceInfo) return taxList;

  return taxList.map((item, index) => {
    if (!AMBIGUOUS_NAMES.has(item.taxName.trim().toLowerCase())) return item;

    // (a) percentage match within 0.1 of a known tax's percentage
    const percentMatch = provinceInfo.taxes.find(
      (t) => Math.abs(t.taxPercent - item.taxPercent) <= 0.1,
    );
    if (percentMatch) {
      return {
        ...item,
        taxName: percentMatch.taxName,
        isRefundable: isRefundableByName(percentMatch.taxName),
      };
    }

    // (b) the state/province has exactly one tax type
    if (provinceInfo.taxes.length === 1) {
      const only = provinceInfo.taxes[0];
      return { ...item, taxName: only.taxName, isRefundable: isRefundableByName(only.taxName) };
    }

    // (c) count of taxList entries equals count of the state's known taxes -> match by position
    if (taxList.length === provinceInfo.taxes.length) {
      const byIndex = provinceInfo.taxes[index];
      return {
        ...item,
        taxName: byIndex.taxName,
        isRefundable: isRefundableByName(byIndex.taxName),
      };
    }

    return item;
  });
}

/* ---------------------------------------------------------------------
 * Main entry point
 * ------------------------------------------------------------------- */

export function parseReceiptFromJson(
  raw: unknown,
  rawResponseText: string,
  stateCountry: string,
  stateState: string,
): ParsedReceipt {
  const obj = (raw ?? {}) as Record<string, unknown>;

  const price = toNumber(obj.price);
  const tax = toNumber(obj.tax);

  const initialItems = toInitialWorkingTaxList(obj.tax_items);
  const taxAmountsFromAi = initialItems.some((i) => (i.tax ?? 0) > 0);

  let taxList: ParsedTaxItem[];
  if (price > 0) {
    taxList = normalizeTaxItems(initialItems, tax, price, rawResponseText);
  } else {
    taxList = initialItems.map((i) => ({
      taxName: i.taxName,
      tax: i.tax ?? 0,
      taxPercent: i.taxPercent ?? 0,
      isRefundable: isRefundableByName(i.taxName),
    }));
  }

  taxList = disambiguateTaxNames(taxList, stateCountry, stateState);

  // The single most consequential rule in this pipeline: isPreTax is
  // NOT taken from the AI's own is_pre_tax field at all -- it's fully
  // overridden based on whether any tax in the final list is
  // refundable. When it isn't pre-tax, price becomes the full total
  // (price + tax), not just the subtotal the AI extracted.
  const hasRefundableTax = taxList.some((t) => isRefundableByName(t.taxName));
  const isPreTax = !hasRefundableTax;
  const finalPrice = isPreTax ? price : price + tax;

  return {
    merchantName: toNullableString(obj.merchant_name),
    merchantCategory: toNullableString(obj.merchant_category),
    date: parseReceiptDate(typeof obj.date === "string" ? obj.date : null),
    price: finalPrice,
    tax,
    isPreTax,
    isReimbursable: obj.is_reimbursable === true,
    typeOfTaxDeduction: normalizeTaxDeductionType(obj.type_of_tax_deduction),
    paymentMethod: normalizePaymentMethod(obj.payment_method),
    comment: toNullableString(obj.comment),
    taxList,
    taxAmountsFromAi,
    description: rawResponseText,
  };
}
