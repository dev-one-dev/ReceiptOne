import { collection, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore";
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
 * document's snake_case fields in `toReceipt` below. This is
 * read-only: nothing in this module writes to Firestore.
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

/** Fetches the signed-in user's own receipts, newest first -- matches the security rules' `created_by == request.auth.uid` scoping. */
export async function fetchReceipts(uid: string): Promise<Receipt[]> {
  const q = query(
    collection(db, "receipts"),
    where("created_by", "==", uid),
    orderBy("date", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => toReceipt(doc.id, doc.data()));
}
