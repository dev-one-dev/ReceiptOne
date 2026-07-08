import { httpsCallable } from "firebase/functions";
import { functions } from "@/integrations/firebase/client";

export type BillingPurchase = {
  id: string | null;
  productId: string | null;
  purchasedAt: string | null;
  store: string | null;
  amount: number | null;
  currency: string | null;
};

export type BillingSubscription = {
  id: string | null;
  productId: string | null;
  status: string | null;
  givesAccess: boolean | null;
  autoRenewalStatus: string | null;
  currentPeriodStartsAt: string | null;
  currentPeriodEndsAt: string | null;
  store: string | null;
};

export type BillingHistory = {
  purchases: BillingPurchase[];
  subscriptions: BillingSubscription[];
  knownToRevenueCat: boolean;
};

/**
 * Wraps the real getBillingHistory Cloud Function -- web-only (mobile
 * has native store UI for this, doesn't need it). Requires the caller
 * to be signed in; throws "unauthenticated" otherwise. Called via
 * httpsCallable rather than the raw Cloud Run URL, matching the
 * getTextFromImage pattern already used elsewhere.
 *
 * In practice this very often returns empty arrays / knownToRevenueCat:
 * false today, since the project currently has zero real paying
 * RevenueCat subscribers -- everyone is on the app's own internal
 * Firestore trial, which RevenueCat has no knowledge of. That's an
 * expected "no billing history yet" result, not an error; callers
 * should treat it as a normal empty state.
 */
export async function fetchBillingHistory(): Promise<BillingHistory> {
  const getBillingHistory = httpsCallable<void, BillingHistory>(functions, "getBillingHistory");
  const result = await getBillingHistory();
  return result.data;
}
