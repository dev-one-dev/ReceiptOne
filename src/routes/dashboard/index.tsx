import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Car,
  Receipt,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

type Stat = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
};

const STATS: Stat[] = [
  { label: "Receipts this month", value: "24", note: "+6 from last month", icon: Receipt },
  { label: "Amount tracked", value: "$1,842.50", note: "this month", icon: Wallet },
  { label: "Mileage logged", value: "342 mi", note: "this month", icon: Car },
  { label: "Pending reports", value: "2", note: "awaiting export", icon: Clock },
];

type ReceiptRow = {
  merchant: string;
  category: string;
  date: string;
  amount: string;
  status: "Categorized" | "Needs review";
};

const RECENT_RECEIPTS: ReceiptRow[] = [
  { merchant: "Staples", category: "Office Supplies", date: "Jul 2", amount: "$84.20", status: "Categorized" },
  { merchant: "Uber", category: "Travel", date: "Jun 29", amount: "$23.50", status: "Categorized" },
  { merchant: "Shell", category: "Fuel", date: "Jun 27", amount: "$61.10", status: "Needs review" },
  { merchant: "Adobe", category: "Software", date: "Jun 24", amount: "$54.99", status: "Categorized" },
  { merchant: "WeWork", category: "Office Rent", date: "Jun 20", amount: "$320.00", status: "Categorized" },
  { merchant: "Home Depot", category: "Supplies", date: "Jun 18", amount: "$142.75", status: "Needs review" },
];

function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-black">Dashboard</h1>
        <p className="mt-1 text-sm text-black/55">
          Here&apos;s what&apos;s happening with your receipts and expenses.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, note, icon: Icon }) => (
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
              {RECENT_RECEIPTS.map((row) => (
                <tr key={row.merchant + row.date} className="border-t border-black/[0.05]">
                  <td className="px-5 py-3 font-medium text-black">{row.merchant}</td>
                  <td className="px-5 py-3 text-black/60">{row.category}</td>
                  <td className="px-5 py-3 text-black/60">{row.date}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-black">{row.amount}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={[
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
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
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
