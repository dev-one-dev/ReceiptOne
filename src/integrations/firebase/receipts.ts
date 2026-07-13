import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

export type TaxListEntry = {
  isRefundable: boolean;
  tax: number;
  taxName: string;
  taxPercent: number;
};

/**
 * Mirrors the real `receipts` collection written by the mobile app --
 * field names kept as camelCase here, mapped from the Firestore
 * document's snake_case fields in `toReceipt` below. Mostly read-only,
 * except for `createReceipt` below, which is this app's second real
 * Firestore write (after createTrip in trips.ts).
 */
export type Receipt = {
  id: string;
  comment: string;
  companyCategory: string;
  companyImage: string;
  companyName: string;
  createdAt: Date;
  createdBy: string;
  currency: string;
  date: Date;
  isPreTax: boolean;
  isReimbursable: boolean;
  merchantId: string;
  paymentMethod: string;
  price: number;
  receiptFile: string;
  receiptImage: string;
  tax: number;
  taxLists: TaxListEntry[];
  typeOfTaxDeduction: string;
};

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date(0);
}

function toTaxList(value: unknown): TaxListEntry[] {
  if (!Array.isArray(value)) return [];
  return value.map((t) => ({
    isRefundable: Boolean(t?.isRefundable),
    tax: typeof t?.tax === "number" ? t.tax : 0,
    taxName: typeof t?.taxName === "string" ? t.taxName : "",
    taxPercent: typeof t?.taxPercent === "number" ? t.taxPercent : 0,
  }));
}

function toReceipt(id: string, data: Record<string, unknown>): Receipt {
  return {
    id,
    comment: typeof data.comment === "string" ? data.comment : "",
    companyCategory: typeof data.company_category === "string" ? data.company_category : "",
    companyImage: typeof data.company_image === "string" ? data.company_image : "",
    companyName: typeof data.company_name === "string" ? data.company_name : "",
    createdAt: toDate(data.created_at),
    createdBy: typeof data.created_by === "string" ? data.created_by : "",
    currency: typeof data.currency === "string" ? data.currency : "USD",
    date: toDate(data.date),
    isPreTax: Boolean(data.is_pre_tax),
    isReimbursable: Boolean(data.is_reimbursable),
    merchantId: typeof data.merchant_id === "string" ? data.merchant_id : "",
    paymentMethod: typeof data.payment_method === "string" ? data.payment_method : "",
    price: typeof data.price === "number" ? data.price : 0,
    receiptFile: typeof data.receipt_file === "string" ? data.receipt_file : "",
    receiptImage: typeof data.receipt_image === "string" ? data.receipt_image : "",
    tax: typeof data.tax === "number" ? data.tax : 0,
    taxLists: toTaxList(data.tax_lists),
    typeOfTaxDeduction:
      typeof data.type_of_tax_deduction === "string" ? data.type_of_tax_deduction : "",
  };
}

/**
 * Fetches the signed-in user's own receipts, newest first -- matches the
 * security rules' `created_by == request.auth.uid` scoping. `year`
 * (optional) filters client-side by each receipt's own `date` field,
 * same fetch-then-filter pattern as fetchHomeOffice's `forYear` match --
 * Firestore has no server-side index on a derived year here, and the
 * per-user document count is small enough that this is cheap. Omit
 * `year` for callers that intentionally want every receipt regardless
 * of date (Reports' own date-range picker, Bulk Upload's
 * most-recent-receipt currency default).
 */
export async function fetchReceipts(uid: string, year?: string): Promise<Receipt[]> {
  const q = query(
    collection(db, "receipts"),
    where("created_by", "==", uid),
    orderBy("date", "desc"),
  );
  const snapshot = await getDocs(q);
  const receipts = snapshot.docs.map((doc) => toReceipt(doc.id, doc.data()));
  if (!year) return receipts;
  return receipts.filter((r) => String(r.date.getFullYear()) === year);
}

/**
 * Counts the signed-in user's own receipts created today -- by
 * created_at (the real scan timestamp), NOT the receipt's own `date`
 * field, which can be backdated to a different day than when it was
 * actually scanned. Mirrors mobile's daily-cap check
 * (add_check_source_widget.dart): local calendar day boundaries
 * (midnight to midnight in the browser's own time zone), not a UTC
 * day. A real Firestore count() aggregate query, not a full fetch --
 * cheap regardless of how many receipts the user has in total.
 */
export async function countTodayReceipts(uid: string): Promise<number> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const q = query(
    collection(db, "receipts"),
    where("created_by", "==", uid),
    where("created_at", ">=", Timestamp.fromDate(startOfDay)),
    where("created_at", "<", Timestamp.fromDate(startOfTomorrow)),
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

export type NewReceiptInput = {
  uid: string;
  comment: string;
  companyCategory: string;
  companyName: string;
  currency: string;
  date: Date;
  isPreTax: boolean;
  paymentMethod: string;
  price: number;
  receiptFile: string;
  receiptImage: string;
  tax: number;
  taxLists: TaxListEntry[];
  typeOfTaxDeduction: string;
};

/**
 * Creates a new document in `receipts`, matching the real mobile-app
 * schema. created_by is the signed-in user's uid, matching the security
 * rules' ownership check exactly, same as createTrip.
 *
 * Known, deliberate gaps (not filled here):
 * - merchant_id: always "" -- there's no merchant-matching feature on
 *   web (the `merchants` collection and its merchantIdAdd trigger are a
 *   separate, unimplemented feature).
 * - company_image: always "" -- Gemini's own extraction schema doesn't
 *   return this field either (confirmed dead in the mobile source too).
 * - is_reimbursable: always false, no UI toggle -- same precedent set
 *   in createTrip (trips.ts), which also has no UI for this field.
 */
export async function createReceipt(input: NewReceiptInput): Promise<void> {
  await addDoc(collection(db, "receipts"), {
    comment: input.comment,
    company_category: input.companyCategory,
    company_image: "",
    company_name: input.companyName,
    created_at: serverTimestamp(),
    created_by: input.uid,
    currency: input.currency,
    date: Timestamp.fromDate(input.date),
    is_pre_tax: input.isPreTax,
    is_reimbursable: false,
    merchant_id: "",
    payment_method: input.paymentMethod,
    price: input.price,
    receipt_file: input.receiptFile,
    receipt_image: input.receiptImage,
    tax: input.tax,
    // tax_lists entries use camelCase sub-fields (isRefundable/taxName/
    // taxPercent), matching the real mobile-app schema and toTaxList's
    // read expectations above -- a genuine quirk where this one nested
    // array isn't snake_case like the rest of the document.
    tax_lists: input.taxLists.map((t) => ({
      isRefundable: t.isRefundable,
      tax: t.tax,
      taxName: t.taxName,
      taxPercent: t.taxPercent,
    })),
    type_of_tax_deduction: input.typeOfTaxDeduction,
  });
}

export type ReceiptUpdateInput = {
  companyCategory: string;
  companyName: string;
  comment: string;
  date: Date;
  paymentMethod: string;
  price: number;
  tax: number;
  taxLists: TaxListEntry[];
  typeOfTaxDeduction: string;
};

/**
 * Updates an existing receipt -- only the fields the edit form actually
 * exposes. Deliberately never touches created_by, created_at,
 * receipt_image, receipt_file, or merchant_id: those aren't part of the
 * edit UI and shouldn't be reassignable through this path.
 */
export async function updateReceipt(id: string, patch: ReceiptUpdateInput): Promise<void> {
  await updateDoc(doc(db, "receipts", id), {
    company_category: patch.companyCategory,
    company_name: patch.companyName,
    comment: patch.comment,
    date: Timestamp.fromDate(patch.date),
    payment_method: patch.paymentMethod,
    price: patch.price,
    tax: patch.tax,
    // Same camelCase-sub-field convention as createReceipt above --
    // matches the real mobile schema and toTaxList's read expectations.
    tax_lists: patch.taxLists.map((t) => ({
      isRefundable: t.isRefundable,
      tax: t.tax,
      taxName: t.taxName,
      taxPercent: t.taxPercent,
    })),
    type_of_tax_deduction: patch.typeOfTaxDeduction,
  });
}

/**
 * A real, permanent hard delete -- not a soft-delete flag. Security
 * rules already allow this for the document's own creator. Callers must
 * confirm with the user before calling this; nothing here prompts.
 */
export async function deleteReceipt(id: string): Promise<void> {
  await deleteDoc(doc(db, "receipts", id));
}
