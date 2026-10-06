/**
 * Subscription plans per region -- the single source for prices. The Pricing
 * section renders these, and the SoftwareApplication JSON-LD offers, page
 * descriptions and public/llms.txt (scripts/generate-llms.mjs) read them, so
 * a price change here reaches all of them.
 *
 * No React imports -- pure data, so build scripts can bundle it.
 */
export type PricingRegion = "ca" | "us";

export interface Plan {
  id: "week" | "month" | "year";
  name: string;
  price: string;
  period: string;
  currency: "CAD" | "USD";
}

/** Free trial length, in days, on every plan. */
export const TRIAL_DAYS = 7;

export const CA_PLANS: Plan[] = [
  { id: "week", name: "Weekly", price: "4.99", period: "/ week", currency: "CAD" },
  { id: "month", name: "Monthly", price: "9.99", period: "/ month", currency: "CAD" },
  { id: "year", name: "Yearly", price: "129.99", period: "/ year", currency: "CAD" },
];

export const US_PLANS: Plan[] = [
  { id: "week", name: "Weekly", price: "3.99", period: "/ week", currency: "USD" },
  { id: "month", name: "Monthly", price: "9.99", period: "/ month", currency: "USD" },
  { id: "year", name: "Yearly", price: "99.99", period: "/ year", currency: "USD" },
];

export function getPlans(region: PricingRegion): Plan[] {
  return region === "us" ? US_PLANS : CA_PLANS;
}

export function getPlan(region: PricingRegion, id: Plan["id"]): Plan {
  return getPlans(region).find((p) => p.id === id)!;
}

/** "CAD 9.99" / "$9.99" -- the format the Pricing cards display. */
export function formatPrice(plan: Plan, price: string = plan.price): string {
  return plan.currency === "CAD" ? `CAD ${price}` : `$${price}`;
}

/**
 * All billing durations grant the same single "premium" RevenueCat
 * entitlement (see src/integrations/entitlement.ts) — Weekly, Monthly,
 * and Yearly are identical in features. Only price, period, and discount
 * differ, so the feature list is shared and shown once regardless of the
 * selected period.
 */
export const CA_FEATURES = [
  "Unlimited receipt scanning",
  "Expense & mileage tracking",
  "GST / HST / PST tracking",
  "CRA-ready expense reports",
  "Multi-device sync",
  "In-app support",
  "iOS, Android and web apps",
];

export const US_FEATURES = [
  "Unlimited receipt scanning",
  "Expense & mileage tracking",
  "Sales tax tracking",
  "IRS-ready expense reports",
  "Multi-device sync",
  "In-app support",
  "iOS, Android and web apps",
];

export function getPlanFeatures(region: PricingRegion): string[] {
  return region === "us" ? US_FEATURES : CA_FEATURES;
}

/** "CAD 9.99/month, 7 days free." -- the short price line in meta descriptions. */
export function priceSummary(region: PricingRegion): string {
  return `${formatPrice(getPlan(region, "month"))}/month, ${TRIAL_DAYS} days free.`;
}
