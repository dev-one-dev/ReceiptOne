import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

/**
 * Counts how many people have redeemed the signed-in user's own referral
 * code. `userPromo` documents are activation records: `user_referral_id`
 * is whose code was used, `is_used` marks a completed redemption (not
 * just a started one). Uses an aggregate count query so this never
 * downloads the actual documents, just the number. Read-only: this
 * module never writes to Firestore.
 *
 * Deliberately doesn't touch `promoCodes` -- that's a separate, unrelated
 * concept (site-wide marketing codes like "WELCOME30"), out of scope for
 * a personal referral count.
 */
export async function fetchReferralCount(uid: string): Promise<number> {
  const q = query(
    collection(db, "userPromo"),
    where("user_referral_id", "==", uid),
    where("is_used", "==", true),
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}
