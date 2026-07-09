import { auth } from "@/integrations/firebase/client";

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

const GET_BILLING_HISTORY_URL = "https://get-billing-history-899029916132.us-central1.run.app";

/**
 * Wraps the real getBillingHistory Cloud Function -- web-only (mobile
 * has native store UI for this, doesn't need it). Requires the caller
 * to be signed in; the deployed function returns a 200 response with an
 * {error: {message, status: "UNAUTHENTICATED"}} body otherwise (the
 * callable wire protocol reports auth failures in the body, not via
 * HTTP status).
 *
 * NOT called via httpsCallable: this function wasn't deployed through
 * `firebase deploy` (no matching Cloud Functions trigger), it's a
 * standalone Cloud Run service at its own URL -- httpsCallable
 * auto-constructs the standard
 * https://{region}-{project}.cloudfunctions.net/{name} URL, which
 * doesn't exist for this one and silently fails. Confirmed via direct
 * curl that the real Cloud Run URL correctly implements the same
 * callable wire protocol httpsCallable would otherwise handle
 * (POST, Bearer ID token, {"data": {...}} body, {"result": ...} or
 * {"error": {...}} response) -- reimplemented manually here instead.
 *
 * In practice this very often returns empty arrays / knownToRevenueCat:
 * false today, since the project currently has zero real paying
 * RevenueCat subscribers -- everyone is on the app's own internal
 * Firestore trial, which RevenueCat has no knowledge of. That's an
 * expected "no billing history yet" result, not an error; callers
 * should treat it as a normal empty state.
 */
export async function fetchBillingHistory(): Promise<BillingHistory> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  const idToken = await user.getIdToken();

  const response = await fetch(GET_BILLING_HISTORY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ data: {} }),
  });

  const json = await response.json();
  if (json.error) {
    throw new Error(json.error.message ?? "Failed to fetch billing history");
  }
  return json.result;
}
