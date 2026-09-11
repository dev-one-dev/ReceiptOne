// Contact form -> the portal's `submitContactRequest` callable (Cloud
// Functions v2, us-central1). The function enforces App Check and a 5/hour/IP
// rate limit, then writes a `supportRequests` document with `source:
// "website"`. Contract: ReceiptOne-Web-Portal/functions/src/support/*.ts.
//
// `functions` is constructed in ./client after App Check is initialised, so
// every call here already carries an X-Firebase-AppCheck header.
import { httpsCallable } from "firebase/functions";
import { functions } from "@/integrations/firebase/client";

export interface ContactRequestPayload {
  name: string;
  email: string;
  message: string;
  /** BCP-47 tag, e.g. "en-CA". */
  locale: string | null;
  userAgent: string | null;
  subject?: string | null;
}

export interface ContactRequestResult {
  /** Id of the created `supportRequests` document. */
  id: string;
}

// Same caps as functions/src/support/validateContact.ts.
export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  subject: 200,
  message: 5000,
  userAgent: 512,
} as const;

const submitContactRequestCallable = httpsCallable<ContactRequestPayload, ContactRequestResult>(
  functions,
  "submitContactRequest",
);

export async function submitContactRequest(
  payload: ContactRequestPayload,
): Promise<ContactRequestResult> {
  const { data } = await submitContactRequestCallable(payload);
  return data;
}
