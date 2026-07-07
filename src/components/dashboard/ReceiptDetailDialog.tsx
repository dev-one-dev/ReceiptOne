import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DateFormat } from "@/components/dashboard/DashboardContext";
import type { Receipt } from "@/integrations/firebase/receipts";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";

/**
 * Read-only -- Stage 4 wires real Firestore receipts for display only, no
 * editing/deleting yet. This is the detail view for fields that don't have
 * a slot in the main table (tax breakdown, payment method, comment, the
 * scanned receipt image).
 */
export function ReceiptDetailDialog({
  receipt,
  dateFormat,
  onOpenChange,
}: {
  receipt: Receipt | null;
  dateFormat: DateFormat;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={receipt !== null} onOpenChange={onOpenChange}>
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

            <div className="space-y-3 text-sm">
              <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-black/55">Category</span>
                  <span className="font-medium text-black">{receipt.companyCategory || "—"}</span>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
