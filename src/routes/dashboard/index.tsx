import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, Home, Landmark, Receipt, type LucideIcon } from "lucide-react";
import { ReceiptDetailDialog } from "@/components/dashboard/ReceiptDetailDialog";
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
  fetchReceipts,
  type Receipt as ReceiptRecord,
  type TaxListEntry as ReceiptTaxEntry,
} from "@/integrations/firebase/receipts";
import {
  distanceInUnit,
  formatCurrency,
  formatDate,
  formatDistance,
  money,
  moneyWhole,
} from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

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
 * Mock underlying figures for what's not wired to real data yet (US home
 * office has no real schema; mileage distance still needs a real
 * per-region source), but the mileage rate applied comes straight from
 * Settings, so the displayed total is genuinely reactive, not a
 * hardcoded string. Total expenses scanned and the GST/HST reclaim are
 * both real now (see `expensesStat` and `sumRefundableTax` in
 * buildTaxContent), no longer part of this mock.
 */
type RegionMock = {
  homeOfficeAmount: number;
  homeOfficeSaving: number;
  mileageKm: number;
};

const REGION_MOCK: Record<DashboardRegion, RegionMock> = {
  ca: {
    homeOfficeAmount: 480,
    homeOfficeSaving: 134,
    mileageKm: 342,
  },
  us: {
    homeOfficeAmount: 480,
    homeOfficeSaving: 115,
    mileageKm: 342,
  },
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

/**
 * The real GST/HST reclaim total: sums tax_lists[].tax across every one
 * of the user's receipts (not just the ones shown in the Recent
 * receipts table), counting only entries where isRefundable is true AND
 * the tax name matches one of the user's configured Settings tax names.
 * A receipt with both GST 5% and PST 7% recorded only contributes its
 * GST portion, even though both live in the same taxLists array --
 * never a subtotal x rate estimate.
 */
function sumRefundableTax(receipts: ReceiptRecord[], taxList: TaxListEntry[]): number {
  const configuredNames = new Set(
    taxList.map((t) => t.taxName.trim().toLowerCase()).filter(Boolean),
  );
  if (configuredNames.size === 0) return 0;
  return receipts.reduce((sum, receipt) => {
    const receiptTax = receipt.taxLists.reduce((s: number, entry: ReceiptTaxEntry) => {
      if (entry.isRefundable && configuredNames.has(entry.taxName.trim().toLowerCase())) {
        return s + entry.tax;
      }
      return s;
    }, 0);
    return sum + receiptTax;
  }, 0);
}

function buildTaxContent(
  region: DashboardRegion,
  taxList: TaxListEntry[],
  mileageRate: number,
  distanceUnit: "km" | "mi",
  homeOffice: HomeOffice | null,
  homeOfficeLoading: boolean,
  onOpenHomeOffice: () => void,
  receipts: ReceiptRecord[],
  receiptsLoading: boolean,
): RegionTaxContent {
  const mock = REGION_MOCK[region];
  const taxReclaim = sumRefundableTax(receipts, taxList);
  const label = taxLabel(taxList);
  const distanceValue = distanceInUnit(mock.mileageKm, distanceUnit);
  const mileageSaving = distanceValue * mileageRate;

  // Receipts apply the same way to both regions (unlike homeOffice, which
  // is a CRA-specific form) -- real count/sum for both branches, no mock
  // fallback, same "loading vs. real (even $0) vs. none" honesty as the
  // rest of this stage.
  const receiptsTotal = receipts.reduce((sum, r) => sum + r.price, 0);
  const receiptsCurrency = receipts[0]?.currency ?? "CAD";
  const expensesStat: TaxStat = {
    label: "Total expenses scanned",
    value: receiptsLoading ? "…" : String(receipts.length),
    note: receiptsLoading
      ? "Loading…"
      : receipts.length > 0
        ? `${formatCurrency(receiptsTotal, receiptsCurrency)} tracked this year`
        : "No receipts scanned yet",
    icon: Receipt,
  };

  // homeOffice is Canada-specific real data (T777 is a CRA form; a US
  // account would use a different IRS form/calc this schema doesn't
  // model), so it only ever applies on the "ca" branch below. Three
  // distinct states, none of which fall back to the old mock figure:
  // still loading (brief, avoids a flash of "no record" before the
  // fetch resolves), a real record (shown even if its total is
  // genuinely $0 -- a fetched record is never treated as "no data"
  // just because its value happens to be zero), or genuinely no record
  // for the selected year (a clear, actionable empty state instead of
  // a fake number).
  const homeOfficeReclaim = homeOffice?.totalEmploymentExpenses ?? 0;
  const homeOfficeValue = homeOfficeLoading ? "…" : homeOffice ? money(homeOfficeReclaim) : "—";
  const homeOfficeNote = homeOfficeLoading
    ? "Loading…"
    : homeOffice
      ? `${money(homeOffice.totalEmploymentHomeExpenses)} home + ${money(homeOffice.totalEmploymentWorkspaceExpenses)} workspace`
      : "No home office expenses recorded yet — add this in the mobile app";
  const homeOfficeOnClick = homeOffice ? onOpenHomeOffice : undefined;

  if (region === "ca") {
    return {
      heroLabel: "Estimated refundable taxes",
      heroTotal: moneyWhole(taxReclaim + homeOfficeReclaim + mileageSaving),
      heroNote: `${label} reclaim plus estimated tax savings from home office and mileage`,
      stats: [
        expensesStat,
        {
          label: `${label} reclaim`,
          value: receiptsLoading ? "…" : money(taxReclaim),
          note: receiptsLoading ? "Loading…" : "Sum of refundable tax recorded on your receipts",
          icon: Landmark,
        },
        {
          label: "Home office reclaim",
          value: homeOfficeValue,
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
      expensesStat,
      {
        label: "Sales tax tracked",
        value: receiptsLoading ? "…" : money(taxReclaim),
        note: receiptsLoading ? "Loading…" : "Included in your deductible totals",
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
  const [homeOfficeLoading, setHomeOfficeLoading] = useState(true);
  const [homeOfficeDialogOpen, setHomeOfficeDialogOpen] = useState(false);

  useEffect(() => {
    if (!uid || region !== "ca") {
      setHomeOffice(null);
      setHomeOfficeLoading(false);
      return;
    }
    let cancelled = false;
    setHomeOfficeLoading(true);
    fetchHomeOffice(uid, year)
      .then((record) => {
        if (!cancelled) setHomeOffice(record);
      })
      .catch(() => {
        if (!cancelled) setHomeOffice(null);
      })
      .finally(() => {
        if (!cancelled) setHomeOfficeLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, year, region]);

  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const [receiptsError, setReceiptsError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ReceiptRecord | null>(null);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setReceiptsLoading(true);
    setReceiptsError(null);
    fetchReceipts(uid)
      .then((data) => {
        if (!cancelled) setReceipts(data);
      })
      .catch((e) => {
        if (!cancelled) setReceiptsError(errorMessage(e, "Couldn't load receipts."));
      })
      .finally(() => {
        if (!cancelled) setReceiptsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const content = buildTaxContent(
    region,
    taxList,
    mileageRate,
    distanceUnit,
    homeOffice,
    homeOfficeLoading,
    () => setHomeOfficeDialogOpen(true),
    receipts,
    receiptsLoading,
  );
  const recentReceipts = receipts.slice(0, 6);

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
                <th className="px-5 py-2 text-right font-medium">Tax deduction</th>
              </tr>
            </thead>
            <tbody>
              {receiptsLoading && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading receipts…
                  </td>
                </tr>
              )}
              {!receiptsLoading && receiptsError && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-red-600">
                    {receiptsError}
                  </td>
                </tr>
              )}
              {!receiptsLoading &&
                !receiptsError &&
                recentReceipts.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelected(row)}
                    className="cursor-pointer border-t border-black/[0.05] transition-colors hover:bg-black/[0.02]"
                  >
                    <td className="px-5 py-3 font-medium text-black">{row.companyName || "—"}</td>
                    <td className="px-5 py-3 text-black/60">{row.companyCategory || "—"}</td>
                    <td className="px-5 py-3 text-black/60">{formatDate(row.date, dateFormat)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-black">
                      {formatCurrency(row.price, row.currency)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {row.typeOfTaxDeduction ? (
                        <span className="inline-flex items-center rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-medium text-black/60">
                          {row.typeOfTaxDeduction}
                        </span>
                      ) : (
                        <span className="text-black/30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              {!receiptsLoading && !receiptsError && recentReceipts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    No receipts yet — receipts scanned from the ReceiptOne mobile app will show up
                    here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptDetailDialog
        receipt={selected}
        dateFormat={dateFormat}
        onOpenChange={(open) => !open && setSelected(null)}
      />

      <HomeOfficeDetailDialog
        homeOffice={homeOfficeDialogOpen ? homeOffice : null}
        dateFormat={dateFormat}
        onOpenChange={(open) => setHomeOfficeDialogOpen(open)}
      />
    </div>
  );
}
