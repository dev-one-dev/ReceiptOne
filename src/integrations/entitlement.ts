import type { UserProfile } from "@/integrations/firebase/user-profile";
import type {
  BillingHistory,
  BillingSubscription,
} from "@/integrations/revenuecat/get-billing-history";

/**
 * The subscription actively granting the "premium" RevenueCat
 * entitlement, if any -- confirmed identifier "premium" in RevenueCat's
 * Product catalog -> Entitlements, covering all of premium_year/
 * premium_month/premium_week. Shared here instead of duplicated inline
 * so billing.tsx and any other caller read the exact same check.
 */
export function findActiveSubscription(billing: BillingHistory | null): BillingSubscription | null {
  return billing?.subscriptions.find((s) => s.givesAccess === true) ?? null;
}

/**
 * True if the signed-in user currently has access to paid features --
 * either a still-active trial (profile.trialExpDate in the future) or
 * an active "premium" RevenueCat subscription.
 *
 * Brand-new app, zero real paying accounts yet, so this defaults
 * safely: a missing/null trialExpDate means NO access, not "expired
 * forever but still fine" -- there's nothing to grandfather in.
 *
 * Client-side only -- a UI gate, not a security boundary. Server-side
 * enforcement inside getTextFromImage is tracked as separate, follow-up
 * work, not done here.
 */
export function hasActiveAccess(
  profile: UserProfile | null,
  billing: BillingHistory | null,
): boolean {
  const trialActive = profile?.trialExpDate != null && profile.trialExpDate > new Date();
  return trialActive || findActiveSubscription(billing) !== null;
}
