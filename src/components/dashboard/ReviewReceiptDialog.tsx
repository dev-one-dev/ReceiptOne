import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { formatDate } from "@/lib/dashboard-format";

export type ReceiptStatus = "Categorized" | "Needs review";

export type ReceiptRow = {
  merchant: string;
  category: string;
  date: Date;
  amount: string;
  status: ReceiptStatus;
};

export const RECEIPT_CATEGORIES = ["Office Supplies", "Travel", "Fuel", "Software", "Office Rent", "Meals"];

function ReviewForm({
  receipt,
  onSave,
}: {
  receipt: ReceiptRow;
  onSave: (category: string) => void;
}) {
  const [category, setCategory] = useState(
    RECEIPT_CATEGORIES.includes(receipt.category) ? receipt.category : RECEIPT_CATEGORIES[0],
  );
  const { dateFormat } = useDashboardContext();

  return (
    <>
      <div className="rounded-xl bg-black/[0.03] px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-black">{receipt.merchant}</span>
          <span className="tabular-nums text-sm font-medium text-black">{receipt.amount}</span>
        </div>
        <p className="mt-0.5 text-xs text-black/50">{formatDate(receipt.date, dateFormat)}</p>
      </div>

      <div className="mt-4 space-y-1.5">
        <label className="block text-xs font-medium text-black/55">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RECEIPT_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="mt-5">
        <button
          type="button"
          onClick={() => onSave(category)}
          className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
        >
          Save & mark reviewed
        </button>
      </DialogFooter>
    </>
  );
}

/**
 * Shared between the Dashboard's Recent receipts table and the full
 * Receipts page -- same review/categorize flow, same mock/local-state
 * approach as Mileage's "Log trip" dialog.
 */
export function ReviewReceiptDialog({
  receipt,
  onOpenChange,
  onSave,
}: {
  receipt: ReceiptRow | null;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: { category: string; status: "Categorized" }) => void;
}) {
  return (
    <Dialog open={receipt !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Review receipt</DialogTitle>
          <DialogDescription>Confirm the category to mark this receipt reviewed.</DialogDescription>
        </DialogHeader>
        {receipt && (
          <ReviewForm
            key={receipt.merchant + receipt.date.toISOString()}
            receipt={receipt}
            onSave={(category) => {
              onSave({ category, status: "Categorized" });
              toast.success("Receipt updated (demo only — not saved to your account yet).");
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
