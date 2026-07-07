import { useEffect, useState } from "react";
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
import { HomeOfficeDetailDialog } from "@/components/dashboard/HomeOfficeDetailDialog";
import {
  useDashboardContext,
  type DashboardRegion,
  type TaxListEntry,
} from "@/components/dashboard/DashboardContext";
import { useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";
import { fetchHomeOffice, type HomeOffice } from "@/integrations/firebase/home-office";
import {
  distanceInUnit,
  formatDate,
  formatDistance,
  mkDate,
  money,
  moneyWhole,
} from "@/lib/dashboard-format";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

type TaxStat = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  onClick?: () => void;
};

type RegionTaxContent = {
  heroLabel: string;
  heroTotal: string;
  heroNote: string;
  stats: TaxStat[];
};

/**
 * Mock underlying figures the reclaim/mileage math is built from -- these
 * stand in for the user's real scanned expenses, but the tax rate and
 * mileage rate applied to them come straight from Settings, so the
 * displayed totals are genuinely reactive, not hardcoded strings.
 */
type RegionMock = {
  expensesCount: number;
  expensesAmount: number;
  taxEligibleSubtotal: number;
  homeOfficeAmount: number;
  homeOfficeSaving: number;
  mileageKm: number;
};

const REGION_MOCK: Record<DashboardRegion, RegionMock> = {
  ca: {
    expensesCount: 24,
    expensesAmount: 1842.5,
    taxEligibleSubtotal: 4308,
    homeOfficeAmount: 480,
    homeOfficeSaving: 134,
    mileageKm: 342,
  },
  us: {
    expensesCount: 24,
    expensesAmount: 1842.5,
    taxEligibleSubtotal: 2364,
    homeOfficeAmount: 480,
    homeOfficeSaving: 115,
    mileageKm: 342,
  },
};

const INITIAL_RECEIPTS: ReceiptRow[] = [
  {
    merchant: "Staples",
    category: "Office Supplies",
    date: mkDate(2026, 7, 2),
    amount: "$84.20",
    status: "Categorized",
  },
  {
    merchant: "Uber",
    category: "Travel",
    date: mkDate(2026, 6, 29),
    amount: "$23.50",
    status: "Categorized",
  },
  {
    merchant: "Shell",
    category: "Fuel",
    date: mkDate(2026, 6, 27),
    amount: "$61.10",
    status: "Needs review",
  },
  {
    merchant: "Adobe",
    category: "Software",
    date: mkDate(2026, 6, 24),
    amount: "$54.99",
    status: "Categorized",
  },
  {
    merchant: "WeWork",
    category: "Office Rent",
    date: mkDate(2026, 6, 20),
    amount: "$320.00",
    status: "Categorized",
  },
  {
    merchant: "Home Depot",
    category: "Supplies",
    date: mkDate(2026, 6, 18),
    amount: "$142.75",
    status: "Needs review",
  },
];

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
/** Real accounts can have more than one active tax (e.g. GST + PST in BC) -- sums them for the reclaim total and picks a label that reads naturally for either one tax or several. */
function taxLabel(taxList: TaxListEntry[]): string {
  if (taxList.length === 0) return "Sales tax";
  if (taxList.length === 1) return taxList[0].taxName || "Sales tax";
  return (
    taxList
      .map((t) => t.taxName)
      .filter(Boolean)
      .join(" + ") || "Sales tax"
  );
}

function buildTaxContent(
  region: DashboardRegion,
  taxList: TaxListEntry[],
  mileageRate: number,
  distanceUnit: "km" | "mi",
  homeOffice: HomeOffice | null,
  onOpenHomeOffice: () => void,
): RegionTaxContent {
  const mock = REGION_MOCK[region];
  const taxPercentTotal = taxList.reduce((sum, t) => sum + t.taxPercent, 0);
  const taxReclaim = mock.taxEligibleSubtotal * (taxPercentTotal / 100);
  const label = taxLabel(taxList);
  const distanceValue = distanceInUnit(mock.mileageKm, distanceUnit);
  const mileageSaving = distanceValue * mileageRate;

  // homeOffice is Canada-specific real data (T777 is a CRA form; a US
  // account would use a different IRS form/calc this schema doesn't
  // model), so it only ever applies on the "ca" branch below. Falls back
  // to the existing mock figure when there's no real record for the
  // selected year, keeping the hero/stats section visually consistent
  // rather than showing an empty-looking card.
  const homeOfficeReclaim =
    region === "ca" && homeOffice ? homeOffice.totalEmploymentExpenses : mock.homeOfficeSaving;
  const homeOfficeNote =
    region === "ca" && homeOffice
      ? `${money(homeOffice.totalEmploymentHomeExpenses)} home + ${money(homeOffice.totalEmploymentWorkspaceExpenses)} workspace`
      : `≈ ${moneyWhole(mock.homeOfficeSaving)} estimated tax saving`;
  const homeOfficeOnClick = region === "ca" && homeOffice ? onOpenHomeOffice : undefined;

  if (region === "ca") {
    return {
      heroLabel: "Estimated refundable taxes",
      heroTotal: moneyWhole(taxReclaim + homeOfficeReclaim + mileageSaving),
      heroNote: `${label} reclaim plus estimated tax savings from home office and mileage`,
      stats: [
        {
          label: "Total expenses scanned",
          value: String(mock.expensesCount),
          note: `${money(mock.expensesAmount)} tracked this year`,
          icon: Receipt,
        },
        {
          label: `${label} reclaim`,
          value: money(taxReclaim),
          note: "This is your exact refund amount",
          icon: Landmark,
        },
        {
          label: "Home office reclaim",
          value: money(homeOfficeReclaim),
          note: homeOfficeNote,
          icon: Home,
          onClick: homeOfficeOnClick,
        },
        {
          label: "Mileage Logged",
          value: formatDistance(distanceValue, distanceUnit),
          note: `≈ ${moneyWhole(mileageSaving)} estimated tax saving`,
          icon: Car,
        },
      ],
    };
  }

  return {
    heroLabel: "Estimated tax savings",
    heroTotal: moneyWhole(mock.homeOfficeSaving + mileageSaving),
    heroNote: "Estimated tax savings from home office and mileage deductions",
    stats: [
      {
        label: "Total expenses scanned",
        value: String(mock.expensesCount),
        note: `${money(mock.expensesAmount)} tracked this year`,
        icon: Receipt,
      },
      {
        label: "Sales tax tracked",
        value: money(taxReclaim),
        note: "Included in your deductible totals",
        icon: Landmark,
      },
      {
        label: "Home office deduction",
        value: money(mock.homeOfficeAmount),
        note: `≈ ${money(mock.homeOfficeSaving)} estimated tax saving`,
        icon: Home,
      },
      {
        label: "Mileage Logged",
        value: formatDistance(distanceValue, distanceUnit),
        note: `≈ ${money(mileageSaving)} estimated tax saving`,
        icon: Car,
      },
    ],
  };
}

function DashboardPage() {
  const { year, region, taxList, mileageRate, distanceUnit, dateFormat } = useDashboardContext();
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [homeOffice, setHomeOffice] = useState<HomeOffice | null>(null);
  const [homeOfficeDialogOpen, setHomeOfficeDialogOpen] = useState(false);

  useEffect(() => {
    if (!uid || region !== "ca") {
      setHomeOffice(null);
      return;
    }
    let cancelled = false;
    fetchHomeOffice(uid, year)
      .then((record) => {
        if (!cancelled) setHomeOffice(record);
      })
      .catch(() => {
        if (!cancelled) setHomeOffice(null);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, year, region]);

  const content = buildTaxContent(region, taxList, mileageRate, distanceUnit, homeOffice, () =>
    setHomeOfficeDialogOpen(true),
  );
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

      {/* Hero — same light card style as the stat cards below, not a
          standalone dark block. */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-7">
        <p className="text-xs font-medium uppercase tracking-wide text-black/55">
          {content.heroLabel} for {year}
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-emerald-600 sm:text-5xl">
          {content.heroTotal}
        </p>
        <p className="mt-2 text-sm text-black/45">{content.heroNote}</p>
      </div>

      {/* Stat cards */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {content.stats.map(({ label, value, note, icon: Icon, onClick }) => (
          <div
            key={label}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
              onClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") onClick();
                  }
                : undefined
            }
            className={[
              "rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
              onClick
                ? "cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f97316]/40"
                : "",
            ].join(" ")}
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
                <tr
                  key={row.merchant + row.date.toISOString()}
                  className="border-t border-black/[0.05]"
                >
                  <td className="px-5 py-3 font-medium text-black">{row.merchant}</td>
                  <td className="px-5 py-3 text-black/60">{row.category}</td>
                  <td className="px-5 py-3 text-black/60">{formatDate(row.date, dateFormat)}</td>
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
          setReceipts((prev) => prev.map((r) => (r === selected ? { ...r, category, status } : r)));
          setSelected(null);
        }}
      />

      <HomeOfficeDetailDialog
        homeOffice={homeOfficeDialogOpen ? homeOffice : null}
        dateFormat={dateFormat}
        onOpenChange={(open) => setHomeOfficeDialogOpen(open)}
      />
    </div>
  );
}
