import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Car,
  CheckCircle2,
  Home,
  Landmark,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { ReviewReceiptDialog, type ReceiptRow } from "@/components/dashboard/ReviewReceiptDialog";
import { useDashboardContext, type DashboardRegion } from "@/components/dashboard/DashboardContext";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

type TaxStat = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
};

type RegionTaxContent = {
  heroLabel: string;
  heroTotal: string;
  heroNote: string;
  stats: TaxStat[];
};

/**
 * CA and US deliberately aren't a find-and-replace of each other: Canadian
 * GST/HST input tax credits are a direct, refundable credit (the tracked
 * amount already IS the "saving" -- no separate tax-saving figure), but US
 * sales tax has no equivalent reclaim mechanism -- it's just folded into
 * the deductible expense total, per this site's own FAQ copy. So the US
 * card is "Sales tax tracked," not "reclaim," and the hero is framed as
 * "estimated tax savings" rather than "refundable taxes," since nothing
 * is actually refunded the way a GST/HST credit is.
 */
const TAX_CONTENT: Record<DashboardRegion, RegionTaxContent> = {
  ca: {
    heroLabel: "Estimated refundable taxes",
    heroTotal: "$422",
    heroNote: "GST/HST reclaim plus estimated tax savings from home office and mileage",
    stats: [
      { label: "Total expenses scanned", value: "24", note: "$1,842.50 tracked this year", icon: Receipt },
      { label: "GST/HST reclaim", value: "$215.40", note: "Input tax credit — already your refund amount", icon: Landmark },
      { label: "Home office reclaim", value: "$480.00", note: "≈ $134 estimated tax saving", icon: Home },
      { label: "Tracked mileage to reclaim", value: "342 km", note: "≈ $73 estimated tax saving", icon: Car },
    ],
  },
  us: {
    heroLabel: "Estimated tax savings",
    heroTotal: "$170",
    heroNote: "Estimated tax savings from home office and mileage deductions",
    stats: [
      { label: "Total expenses scanned", value: "24", note: "$1,842.50 tracked this year", icon: Receipt },
      { label: "Sales tax tracked", value: "$118.20", note: "Included in your deductible totals", icon: Landmark },
      { label: "Home office deduction", value: "$480.00", note: "≈ $115 estimated tax saving", icon: Home },
      { label: "Tracked mileage deduction", value: "342 mi", note: "≈ $55 estimated tax saving", icon: Car },
    ],
  },
};

const INITIAL_RECEIPTS: ReceiptRow[] = [
  { merchant: "Staples", category: "Office Supplies", date: "Jul 2", amount: "$84.20", status: "Categorized" },
  { merchant: "Uber", category: "Travel", date: "Jun 29", amount: "$23.50", status: "Categorized" },
  { merchant: "Shell", category: "Fuel", date: "Jun 27", amount: "$61.10", status: "Needs review" },
  { merchant: "Adobe", category: "Software", date: "Jun 24", amount: "$54.99", status: "Categorized" },
  { merchant: "WeWork", category: "Office Rent", date: "Jun 20", amount: "$320.00", status: "Categorized" },
  { merchant: "Home Depot", category: "Supplies", date: "Jun 18", amount: "$142.75", status: "Needs review" },
];

function DashboardPage() {
  const { year, region } = useDashboardContext();
  const content = TAX_CONTENT[region];
  const [receipts, setReceipts] = useState<ReceiptRow[]>(INITIAL_RECEIPTS);
  const [selected, setSelected] = useState<ReceiptRow | null>(null);

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-black">Dashboard</h1>
        <p className="mt-1 text-sm text-black/55">
          Here&apos;s what&apos;s happening with your receipts and expenses.
        </p>
      </div>

      {/* Hero — the one dark/ember moment on this page, mirroring the
          marketing site's own "one dramatic dark moment" convention
          rather than a generic gradient-accented metric card. */}
      <div className="mt-6 rounded-2xl bg-[#0d0d14] p-6 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-wide text-white/50">
          {content.heroLabel} for {year}
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-[#f97316] sm:text-5xl">
          {content.heroTotal}
        </p>
        <p className="mt-2 text-sm text-white/45">{content.heroNote}</p>
      </div>

      {/* Stat cards */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {content.stats.map(({ label, value, note, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-black/55">{label}</span>
              <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
                <Icon className="size-4" aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{value}</p>
            <p className="mt-1 text-xs text-black/45">{note}</p>
          </div>
        ))}
      </div>

      {/* Recent receipts */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold text-black">Recent receipts</h2>
          <Link
            to={"/dashboard/receipts" as any}
            className="inline-flex items-center gap-1 text-xs font-medium text-black/55 transition-colors hover:text-black"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-t border-black/[0.07] text-xs text-black/45">
                <th className="px-5 py-2 font-medium">Merchant</th>
                <th className="px-5 py-2 font-medium">Category</th>
                <th className="px-5 py-2 font-medium">Date</th>
                <th className="px-5 py-2 text-right font-medium">Amount</th>
                <th className="px-5 py-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((row) => (
                <tr key={row.merchant + row.date} className="border-t border-black/[0.05]">
                  <td className="px-5 py-3 font-medium text-black">{row.merchant}</td>
                  <td className="px-5 py-3 text-black/60">{row.category}</td>
                  <td className="px-5 py-3 text-black/60">{row.date}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-black">{row.amount}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(row)}
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f97316]/40",
                        row.status === "Categorized"
                          ? "bg-black/[0.05] text-black/60"
                          : "bg-[#f97316]/10 text-[#c2410c]",
                      ].join(" ")}
                    >
                      {row.status === "Categorized" ? (
                        <CheckCircle2 className="size-3" aria-hidden />
                      ) : (
                        <AlertCircle className="size-3" aria-hidden />
                      )}
                      {row.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReviewReceiptDialog
        receipt={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onSave={({ category, status }) => {
          setReceipts((prev) =>
            prev.map((r) => (r === selected ? { ...r, category, status } : r)),
          );
          setSelected(null);
        }}
      />
    </div>
  );
}
