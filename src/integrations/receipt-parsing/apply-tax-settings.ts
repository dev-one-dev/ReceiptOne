import { isRefundableByName } from "@/integrations/receipt-parsing/tax-helpers";
import type { ParsedReceipt, ParsedTaxItem } from "@/integrations/receipt-parsing/parse-receipt";
import type { ProfileTaxEntry } from "@/integrations/firebase/user-profile";

export type TaxSettingsResult = { taxList: ParsedTaxItem[]; tax: number };

const PST_QST_PATTERN = /pst|qst/i;

/** Federal (GST/HST/etc, or a PST/QST-named item that's actually a liquor tax) vs provincial (real PST/QST, non-liquor) -- provincial taxes are computed on top of the federal base, not the pre-tax amount directly. */
function isProvincial(taxName: string): boolean {
  return PST_QST_PATTERN.test(taxName) && !taxName.toUpperCase().includes("LIQUOR");
}

/**
 * Ported from the mobile app's taxListUpdate -- a second pass applied
 * after parseReceiptFromJson, using the user's own saved Settings tax
 * rates (profile.taxList) to fill in or reconcile the tax breakdown.
 */
export function applyTaxListUpdate(
  receipt: ParsedReceipt,
  userTaxList: ProfileTaxEntry[],
): TaxSettingsResult {
  const { price, isPreTax, tax, taxList } = receipt;

  if (taxList.length === 0) {
    return applyScenarioA(userTaxList, price, isPreTax, tax);
  }
  return applyScenarioB(receipt);
}

function applyScenarioA(
  userTaxList: ProfileTaxEntry[],
  price: number,
  isPreTax: boolean,
  tax: number,
): TaxSettingsResult {
  if (userTaxList.length > 0 && price > 0) {
    const sumRates = userTaxList.reduce((sum, t) => sum + t.taxPercent / 100, 0);
    let netAmount: number;
    let totalTax: number;
    if (isPreTax) {
      netAmount = price;
      totalTax = netAmount * sumRates;
    } else {
      netAmount = price / (1 + sumRates);
      totalTax = price - netAmount;
    }
    const newTaxList: ParsedTaxItem[] = userTaxList.map((t) => ({
      taxName: t.taxName,
      tax: netAmount * (t.taxPercent / 100),
      taxPercent: t.taxPercent,
      isRefundable: isRefundableByName(t.taxName),
    }));
    return { taxList: newTaxList, tax: totalTax };
  }

  // No user tax settings (or price/tax are 0): fall back to guessing a
  // single tax from the tax/price ratio. isRefundable is deliberately
  // hardcoded here (GST true, everything else false) rather than routed
  // through the shared isRefundableByName helper -- confirmed: this one
  // last-resort fallback branch intentionally diverges from the shared
  // rule (which would otherwise mark HST refundable too), matching this
  // section's own literal "(not refundable)" annotations exactly.
  if (price > 0 && tax > 0) {
    const ratio = (tax / price) * 100;
    let guessed: ParsedTaxItem;
    if (ratio >= 4.5 && ratio <= 5.5) {
      guessed = { taxName: "GST", tax, taxPercent: 5, isRefundable: true };
    } else if (ratio >= 12 && ratio <= 16) {
      guessed = { taxName: "HST", tax, taxPercent: ratio, isRefundable: false };
    } else if (ratio >= 6.5 && ratio <= 10.5) {
      guessed = { taxName: "PST", tax, taxPercent: ratio, isRefundable: false };
    } else {
      guessed = { taxName: "Tax", tax, taxPercent: ratio, isRefundable: false };
    }
    return { taxList: [guessed], tax };
  }

  return { taxList: [], tax };
}

function applyScenarioB(receipt: ParsedReceipt): TaxSettingsResult {
  const { price, isPreTax, taxList, taxAmountsFromAi } = receipt;

  const sumRates = taxList.reduce((sum, t) => sum + t.taxPercent / 100, 0);
  const baseAmount = isPreTax ? price : sumRates > 0 ? price / (1 + sumRates) : price;

  // Federal items first (their amounts may be needed to compute the
  // provincial base), then provincial items on top of baseAmount + federalTotal.
  const federalTotal = taxList.reduce((sum, item) => {
    if (isProvincial(item.taxName)) return sum;
    const amount =
      item.tax > 0 ? item.tax : item.taxPercent > 0 ? baseAmount * (item.taxPercent / 100) : 0;
    return sum + amount;
  }, 0);
  const provincialBase = baseAmount + federalTotal;

  let recomputed = taxList.map((item) => {
    const base = isProvincial(item.taxName) ? provincialBase : baseAmount;
    let amount = item.tax;
    let percent = item.taxPercent;
    const hasAmount = amount > 0;
    const hasPercent = percent > 0;
    if (hasAmount && !hasPercent) {
      percent = base > 0 ? (amount / base) * 100 : 0;
    } else if (hasPercent && !hasAmount) {
      amount = base * (percent / 100);
    }
    return {
      taxName: item.taxName,
      tax: amount,
      taxPercent: percent,
      isRefundable: isRefundableByName(item.taxName),
      base,
    };
  });

  let totalTax: number;
  if (taxAmountsFromAi) {
    // The AI gave real amounts -- preserve them as the source of truth,
    // percentages were already recomputed from them above where needed.
    // Don't let the base-amount math override amounts the AI actually gave.
    totalTax = recomputed.reduce((sum, t) => sum + t.tax, 0);
  } else {
    // Amounts were derived from percentages, not given directly --
    // normalize so they sum to the receipt's own total tax.
    const sum = recomputed.reduce((s, t) => s + t.tax, 0);
    const targetTotal = receipt.tax;
    if (sum > 0 && Math.abs(sum - targetTotal) > 0.01) {
      const scale = targetTotal / sum;
      recomputed = recomputed.map((t) => {
        const scaledTax = t.tax * scale;
        return {
          ...t,
          tax: scaledTax,
          taxPercent: t.base > 0 ? (scaledTax / t.base) * 100 : t.taxPercent,
        };
      });
    }
    totalTax = recomputed.reduce((sum, t) => sum + t.tax, 0);
  }

  if (totalTax === 0 && recomputed.length > 0) {
    totalTax = recomputed.reduce((sum, t) => sum + t.tax, 0);
  }

  const finalTaxList: ParsedTaxItem[] = recomputed.map(
    ({ taxName, tax: t, taxPercent, isRefundable }) => ({
      taxName,
      tax: t,
      taxPercent,
      isRefundable,
    }),
  );

  return { taxList: finalTaxList, tax: totalTax };
}
