import { useEffect, useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ReceiptEditFields,
  toDateInputValue,
  type ReviewForm,
  type ReviewTaxRow,
} from "@/components/dashboard/ReceiptEditFields";
import type { DateFormat } from "@/components/dashboard/DashboardContext";
import { useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";
import {
  deleteReceipt,
  updateReceipt,
  type Receipt,
  type TaxListEntry,
} from "@/integrations/firebase/receipts";
import { fetchUserProfile } from "@/integrations/firebase/user-profile";
import { getReceiptCategories } from "@/integrations/receipt-parsing/categories";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

/**
 * Read-only detail view, with an edit mode (same ReceiptEditFields set
 * Bulk Upload's review cards use) and a real, permanent delete. Both
 * mutations call `onChanged` on success so the caller (AllReceiptsTab)
 * refetches from Firestore -- this dialog never holds its own source of
 * truth beyond the `receipt` prop it's given.
 */
export function ReceiptDetailDialog({
  receipt,
  dateFormat,
  onOpenChange,
  onChanged,
}: {
  receipt: Receipt | null;
  dateFormat: DateFormat;
  onOpenChange: (open: boolean) => void;
  /** Omit to keep this dialog read-only (e.g. Dashboard's Recent receipts widget) -- edit/delete only render when this is provided. */
  onChanged?: () => void;
}) {
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [categories, setCategories] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [review, setReview] = useState<ReviewForm | null>(null);
  const [taxRows, setTaxRows] = useState<ReviewTaxRow[]>([]);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    fetchUserProfile(uid)
      .then((profile) => {
        if (!cancelled) setCategories(getReceiptCategories(profile?.countryCode || "us"));
      })
      .catch(() => {
        // Non-fatal -- edit mode falls back to US categories if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const handleEdit = () => {
    if (!receipt) return;
    setReview({
      merchantName: receipt.companyName,
      merchantCategory: receipt.companyCategory,
      date: toDateInputValue(receipt.date),
      price: receipt.price.toFixed(2),
      tax: receipt.tax.toFixed(2),
      paymentMethod: receipt.paymentMethod === "Card" ? "Card" : "Cash",
      typeOfTaxDeduction: receipt.typeOfTaxDeduction === "Business" ? "Business" : "Personal",
      comment: receipt.comment,
    });
    setTaxRows(
      receipt.taxLists.map((t) => ({
        taxName: t.taxName,
        taxPercent: t.taxPercent.toFixed(2),
        tax: t.tax.toFixed(2),
        isRefundable: t.isRefundable,
      })),
    );
    setEditing(true);
  };

  const handleSave = async () => {
    if (!receipt || !review) return;
    setSaving(true);
    try {
      const taxLists: TaxListEntry[] = taxRows.map((r) => ({
        taxName: r.taxName,
        tax: parseFloat(r.tax) || 0,
        taxPercent: parseFloat(r.taxPercent) || 0,
        isRefundable: r.isRefundable,
      }));
      await updateReceipt(receipt.id, {
        companyCategory: review.merchantCategory,
        companyName: review.merchantName,
        comment: review.comment,
        date: review.date ? new Date(`${review.date}T00:00:00`) : receipt.date,
        paymentMethod: review.paymentMethod,
        price: parseFloat(review.price) || 0,
        tax: parseFloat(review.tax) || 0,
        taxLists,
        typeOfTaxDeduction: review.typeOfTaxDeduction,
      });
      toast.success("Receipt updated.");
      setEditing(false);
      onOpenChange(false);
      onChanged?.();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't save changes."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!receipt) return;
    setDeleting(true);
    try {
      await deleteReceipt(receipt.id);
      toast.success("Receipt deleted.");
      setDeleteOpen(false);
      onOpenChange(false);
      onChanged?.();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't delete this receipt."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={receipt !== null}
      onOpenChange={(open) => {
        if (!open) setEditing(false);
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {receipt && (
          <>
            <DialogHeader>
              <DialogTitle>{receipt.companyName || "Receipt"}</DialogTitle>
              <DialogDescription>
                {formatDate(receipt.date, dateFormat)} ·{" "}
                {formatCurrency(receipt.price, receipt.currency)}
              </DialogDescription>
            </DialogHeader>

            {editing && review ? (
              <>
                <ReceiptEditFields
                  categories={categories}
                  review={review}
                  taxRows={taxRows}
                  onChangeField={(patch) => setReview({ ...review, ...patch })}
                  onChangeTaxRow={(index, patch) =>
                    setTaxRows((prev) =>
                      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
                    )
                  }
                  onAddTaxRow={() =>
                    setTaxRows((prev) => [
                      ...prev,
                      { taxName: "Tax", taxPercent: "0.00", tax: "0.00", isRefundable: false },
                    ])
                  }
                  onRemoveTaxRow={(index) =>
                    setTaxRows((prev) => prev.filter((_, i) => i !== index))
                  }
                />
                <DialogFooter className="gap-2 sm:gap-0">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="space-y-3 text-sm">
                  <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-black/55">Category</span>
                      <span className="font-medium text-black">
                        {receipt.companyCategory || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/55">Payment method</span>
                      <span className="font-medium text-black">{receipt.paymentMethod || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/55">Tax deduction type</span>
                      <span className="font-medium text-black">
                        {receipt.typeOfTaxDeduction || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/55">Tax</span>
                      <span className="font-medium text-black">
                        {formatCurrency(receipt.tax, receipt.currency)}
                      </span>
                    </div>
                  </div>

                  {(receipt.isReimbursable || receipt.isPreTax) && (
                    <div className="flex items-center gap-2">
                      {receipt.isReimbursable && (
                        <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-medium text-black/60">
                          Reimbursable
                        </span>
                      )}
                      {receipt.isPreTax && (
                        <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-medium text-black/60">
                          Pre-tax
                        </span>
                      )}
                    </div>
                  )}

                  {receipt.taxLists.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-black/[0.07]">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="text-black/45">
                            <th className="px-3 py-2 font-medium">Tax</th>
                            <th className="px-3 py-2 text-right font-medium">Rate</th>
                            <th className="px-3 py-2 text-right font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receipt.taxLists.map((t, i) => (
                            <tr key={`${t.taxName}-${i}`} className="border-t border-black/[0.05]">
                              <td className="px-3 py-2 text-black">{t.taxName || "—"}</td>
                              <td className="px-3 py-2 text-right tabular-nums text-black/60">
                                {t.taxPercent}%
                              </td>
                              <td className="px-3 py-2 text-right tabular-nums text-black">
                                {formatCurrency(t.tax, receipt.currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {receipt.comment && (
                    <p className="rounded-xl bg-black/[0.03] px-4 py-3 text-black/70">
                      {receipt.comment}
                    </p>
                  )}

                  {receipt.receiptImage && (
                    <a
                      href={receipt.receiptImage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-black underline underline-offset-4 transition-colors hover:text-[#f97316]"
                    >
                      View receipt image
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  )}
                </div>

                {onChanged && (
                  <DialogFooter className="gap-2 sm:justify-between sm:gap-0">
                    <button
                      type="button"
                      onClick={() => setDeleteOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      Edit
                    </button>
                  </DialogFooter>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this receipt?</DialogTitle>
            <DialogDescription>
              This permanently deletes the receipt from your account. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setDeleteOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete receipt"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
