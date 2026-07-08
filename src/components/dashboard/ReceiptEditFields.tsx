import { X } from "lucide-react";

export type ReviewTaxRow = {
  taxName: string;
  taxPercent: string;
  tax: string;
  isRefundable: boolean;
};

export type ReviewForm = {
  merchantName: string;
  merchantCategory: string;
  date: string;
  price: string;
  tax: string;
  paymentMethod: "Cash" | "Card";
  typeOfTaxDeduction: "Business" | "Personal";
  comment: string;
};

export function toDateInputValue(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * The editable receipt field-set shared by Bulk Upload's per-card review
 * form and ReceiptDetailDialog's edit mode -- same fields, same layout,
 * one place to change either instead of two slightly-different copies.
 * Renders only the fields themselves, no action buttons -- callers
 * render their own Save/Cancel/Retry around it since that differs by
 * context (a new unsaved card vs. editing an existing receipt).
 */
export function ReceiptEditFields({
  categories,
  review,
  taxRows,
  onChangeField,
  onChangeTaxRow,
  onAddTaxRow,
  onRemoveTaxRow,
}: {
  categories: string[];
  review: ReviewForm;
  taxRows: ReviewTaxRow[];
  onChangeField: (patch: Partial<ReviewForm>) => void;
  onChangeTaxRow: (index: number, patch: Partial<ReviewTaxRow>) => void;
  onAddTaxRow: () => void;
  onRemoveTaxRow: (index: number) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Merchant name</label>
          <input
            value={review.merchantName}
            onChange={(e) => onChangeField({ merchantName: e.target.value })}
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Category</label>
          <select
            value={review.merchantCategory}
            onChange={(e) => onChangeField({ merchantCategory: e.target.value })}
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Date</label>
          <input
            type="date"
            value={review.date}
            onChange={(e) => onChangeField({ date: e.target.value })}
            className="h-9 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Price</label>
          <input
            value={review.price}
            onChange={(e) => onChangeField({ price: e.target.value })}
            inputMode="decimal"
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Tax (total)</label>
          <input
            value={review.tax}
            onChange={(e) => onChangeField({ tax: e.target.value })}
            inputMode="decimal"
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Payment method</label>
          <select
            value={review.paymentMethod}
            onChange={(e) => onChangeField({ paymentMethod: e.target.value as "Cash" | "Card" })}
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-black/55">Business or personal</label>
          <select
            value={review.typeOfTaxDeduction}
            onChange={(e) =>
              onChangeField({ typeOfTaxDeduction: e.target.value as "Business" | "Personal" })
            }
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          >
            <option value="Business">Business</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="block text-xs font-medium text-black/55">Comment</label>
          <input
            value={review.comment}
            onChange={(e) => onChangeField({ comment: e.target.value })}
            className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-black/55">Tax breakdown</p>
        <div className="mt-2 overflow-hidden rounded-xl border border-black/[0.07]">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="text-black/45">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Percent</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Refundable</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {taxRows.map((row, i) => (
                <tr key={i} className="border-t border-black/[0.05]">
                  <td className="px-3 py-2">
                    <input
                      value={row.taxName}
                      onChange={(e) => onChangeTaxRow(i, { taxName: e.target.value })}
                      className="h-8 w-full rounded-lg border border-black/10 bg-white px-2 text-xs outline-none focus:border-black/25"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={row.taxPercent}
                      onChange={(e) => onChangeTaxRow(i, { taxPercent: e.target.value })}
                      inputMode="decimal"
                      className="h-8 w-20 rounded-lg border border-black/10 bg-white px-2 text-xs outline-none focus:border-black/25"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={row.tax}
                      onChange={(e) => onChangeTaxRow(i, { tax: e.target.value })}
                      inputMode="decimal"
                      className="h-8 w-24 rounded-lg border border-black/10 bg-white px-2 text-xs outline-none focus:border-black/25"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={row.isRefundable}
                      onChange={(e) => onChangeTaxRow(i, { isRefundable: e.target.checked })}
                      className="size-3.5 rounded border-black/20"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRemoveTaxRow(i)}
                      aria-label="Remove tax row"
                      className="text-black/40 transition-colors hover:text-black"
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
              {taxRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-black/40">
                    No tax breakdown
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={onAddTaxRow}
          className="mt-2 text-xs font-medium text-black/55 transition-colors hover:text-black"
        >
          + Add tax row
        </button>
      </div>
    </div>
  );
}
