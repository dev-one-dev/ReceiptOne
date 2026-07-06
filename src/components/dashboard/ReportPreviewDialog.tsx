import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";

const CATEGORY_TOTALS = [
  { category: "Office Rent", amount: 1920.0 },
  { category: "Travel", amount: 612.5 },
  { category: "Office Supplies", amount: 458.2 },
  { category: "Fuel", amount: 340.75 },
  { category: "Software", amount: 289.99 },
  { category: "Meals", amount: 156.4 },
];

const MILEAGE_ROWS = [
  { date: "Jul 2", purpose: "Client meeting", distance: "18 mi", amount: "$11.34" },
  { date: "Jun 28", purpose: "Supply run", distance: "9 mi", amount: "$5.67" },
  { date: "Jun 24", purpose: "Client meeting", distance: "32 mi", amount: "$20.16" },
  { date: "Jun 20", purpose: "Bank deposit", distance: "6 mi", amount: "$3.78" },
  { date: "Jun 14", purpose: "Client meeting", distance: "18 mi", amount: "$11.34" },
];

const money = (n: number) => `$${n.toFixed(2)}`;

function ExpenseSummaryPreview({ label }: { label: string }) {
  const total = CATEGORY_TOTALS.reduce((sum, c) => sum + c.amount, 0);
  return (
    <div className="rounded-xl border border-black/[0.07]">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs text-black/45">
            <th className="px-4 py-2 font-medium">Category</th>
            <th className="px-4 py-2 text-right font-medium">{label}</th>
          </tr>
        </thead>
        <tbody>
          {CATEGORY_TOTALS.map((c) => (
            <tr key={c.category} className="border-t border-black/[0.05]">
              <td className="px-4 py-2.5 text-black/70">{c.category}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-black">{money(c.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-black/[0.1]">
            <td className="px-4 py-2.5 text-sm font-semibold text-black">Total</td>
            <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-black">{money(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function MileageReportPreview() {
  const totalMiles = MILEAGE_ROWS.reduce((sum, t) => sum + parseFloat(t.distance), 0);
  const totalAmount = MILEAGE_ROWS.reduce((sum, t) => sum + parseFloat(t.amount.replace("$", "")), 0);
  return (
    <div className="rounded-xl border border-black/[0.07]">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs text-black/45">
            <th className="px-4 py-2 font-medium">Date</th>
            <th className="px-4 py-2 font-medium">Purpose</th>
            <th className="px-4 py-2 text-right font-medium">Distance</th>
            <th className="px-4 py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {MILEAGE_ROWS.map((t, i) => (
            <tr key={t.date + i} className="border-t border-black/[0.05]">
              <td className="px-4 py-2.5 text-black/60">{t.date}</td>
              <td className="px-4 py-2.5 text-black/70">{t.purpose}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-black">{t.distance}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-black">{t.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-black/[0.1]">
            <td colSpan={2} className="px-4 py-2.5 text-sm font-semibold text-black">Total</td>
            <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-black">{totalMiles.toFixed(0)} mi</td>
            <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-black">{money(totalAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function ReportPreviewDialog({
  open,
  onOpenChange,
  type,
  range,
  format,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: string;
  range: string;
  format: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{type} preview</DialogTitle>
          <DialogDescription>{range} · {format}</DialogDescription>
        </DialogHeader>

        {type === "Mileage Report" ? (
          <MileageReportPreview />
        ) : (
          <ExpenseSummaryPreview label={type === "Tax Summary" ? "Deductible amount" : "Amount"} />
        )}

        <p className="text-xs text-black/40">
          Preview only — reflects mock data, not your actual records for this range.
        </p>

        <DialogFooter>
          <button
            type="button"
            onClick={() => {
              toast.info("Downloads aren't wired up yet — this is a static mockup.");
              onOpenChange(false);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            <Download className="size-4" aria-hidden />
            Download {format}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
