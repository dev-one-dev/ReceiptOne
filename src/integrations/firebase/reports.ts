import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/integrations/firebase/client";

export type ReportFilters = {
  amountFrom: number | null;
  amountTo: number | null;
  dateRangeStart: Date | null;
  dateRangeEnd: Date | null;
};

/**
 * Mirrors the real `reports` collection written by the mobile app.
 * Read-only: nothing in this module writes to Firestore. `homeOfficeRefs`
 * and `routeRefs` are stored as Firestore document references, not
 * denormalized snapshots like `receipts` is -- resolving them would mean
 * an extra read per reference, so for now this only exposes their counts
 * and does NOT fold their amounts into `totalAmount` (see that field's
 * own comment).
 */
export type Report = {
  id: string;
  comment: string;
  countryCode: string;
  createdAt: Date;
  createdBy: string;
  currency: string;
  filters: ReportFilters;
  receiptCount: number;
  homeOfficeCount: number;
  routeCount: number;
  /**
   * Sum of the denormalized `receipts` snapshot's `price` fields only.
   * home_office/mileage amounts aren't included -- those refs aren't
   * denormalized on the report doc, so folding them in would need extra
   * per-reference reads this pass doesn't do. Treat this as "receipts
   * total for this report," not "the report's full deductible total."
   */
  totalAmount: number;
  pdfUrl: string;
  title: string;
};

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function toFilters(value: unknown): ReportFilters {
  const v = (value ?? {}) as Record<string, unknown>;
  return {
    amountFrom: typeof v.amountFrom === "number" ? v.amountFrom : null,
    amountTo: typeof v.amountTo === "number" ? v.amountTo : null,
    dateRangeStart: toDate(v.dateRangeStart),
    dateRangeEnd: toDate(v.dateRangeEnd),
  };
}

function sumReceiptPrices(value: unknown): number {
  if (!Array.isArray(value)) return 0;
  return value.reduce((sum: number, r) => {
    const price = (r as Record<string, unknown> | null)?.price;
    return sum + (typeof price === "number" ? price : 0);
  }, 0);
}

function toReport(id: string, data: Record<string, unknown>): Report {
  return {
    id,
    comment: typeof data.comment === "string" ? data.comment : "",
    countryCode: typeof data.country_code === "string" ? data.country_code : "",
    createdAt: toDate(data.created_at) ?? new Date(0),
    createdBy: typeof data.created_by === "string" ? data.created_by : "",
    currency: typeof data.currency === "string" ? data.currency : "USD",
    filters: toFilters(data.filters),
    receiptCount: Array.isArray(data.receipts) ? data.receipts.length : 0,
    homeOfficeCount: Array.isArray(data.homeOfficeRefs) ? data.homeOfficeRefs.length : 0,
    routeCount: Array.isArray(data.routeRefs) ? data.routeRefs.length : 0,
    totalAmount: sumReceiptPrices(data.receipts),
    pdfUrl: typeof data.pdfURL === "string" ? data.pdfURL : "",
    title: typeof data.title === "string" ? data.title : "Report",
  };
}

/** Fetches every report the signed-in user has generated, newest first -- not filtered by country_code (a user can have both CA and US reports), matches the security rules' `created_by == request.auth.uid` scoping. */
export async function fetchReports(uid: string): Promise<Report[]> {
  const q = query(
    collection(db, "reports"),
    where("created_by", "==", uid),
    orderBy("created_at", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => toReport(doc.id, doc.data()));
}

/**
 * A real, permanent hard delete -- not a soft-delete flag. Security rules
 * already allow this for the document's own creator. Callers must confirm
 * with the user before calling this; nothing here prompts.
 *
 * Also deletes the generated PDF from Storage so a removed report doesn't
 * leave an orphaned file behind. `ref(storage, url)` resolves a Storage
 * download URL straight to its object, so no separate path bookkeeping is
 * needed. If `pdfUrl` is missing or doesn't resolve to a Storage object (or
 * the delete itself fails, e.g. already gone), the Firestore doc is still
 * deleted -- Storage cleanup is best-effort and must never block removing
 * the report the user asked to delete.
 */
export async function deleteReport(report: Report): Promise<void> {
  if (report.pdfUrl) {
    try {
      await deleteObject(ref(storage, report.pdfUrl));
    } catch (e) {
      console.error("Couldn't delete report PDF from Storage:", e);
    }
  }
  await deleteDoc(doc(db, "reports", report.id));
}
