import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Car, Home, Landmark, Receipt, Wallet, type LucideIcon } from "lucide-react";
import { ReceiptDetailDialog } from "@/components/dashboard/ReceiptDetailDialog";
import { HomeOfficeDetailDialog } from "@/components/dashboard/HomeOfficeDetailDialog";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
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
import { fetchTrips, tripDistance, type Trip } from "@/integrations/firebase/trips";
import {
  fetchVehicleExpensesRecords,
  type VehicleExpenses,
} from "@/integrations/firebase/vehicle-expenses";
import { formatCurrency, formatDate, formatDistance, money } from "@/lib/dashboard-format";
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
  /** The tax-deduction figures (GST/HST reclaim, home office, vehicle) -- grouped together and visually tinted since they're this product's whole point. */
  deductionStats: TaxStat[];
  /** Logging/activity figures (receipts scanned, mileage) -- informational, not deductions themselves. */
  activityStats: TaxStat[];
};

/**
 * Mock figures for the one thing still not wired to real data: the US
 * home office deduction, since that schema has no real US equivalent
 * (T777 is Canada-specific) -- dormant in practice, since ACCOUNT_REGION
 * is hardcoded to "ca". Total expenses scanned, the GST/HST reclaim, and
 * Mileage Logged are all real now (see `expensesStat`, `sumRefundableTax`,
 * and `mileageStat` in buildTaxContent), no longer part of this mock.
 */
type RegionMock = {
  homeOfficeAmount: number;
  homeOfficeSaving: number;
};

const REGION_MOCK: Record<DashboardRegion, RegionMock> = {
  ca: {
    homeOfficeAmount: 480,
    homeOfficeSaving: 134,
  },
  us: {
    homeOfficeAmount: 480,
    homeOfficeSaving: 115,
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
/** Splits a money()-formatted string like "$183.94" into its whole-dollar part ("$183") and cents part (".94"), for the hero stat's large/bold-plus-small/muted display -- matching mobile's own visual treatment of this figure. */
function splitMoney(formatted: string): { whole: string; cents: string } {
  const dotIndex = formatted.lastIndexOf(".");
  if (dotIndex === -1) return { whole: formatted, cents: "" };
  return { whole: formatted.slice(0, dotIndex), cents: formatted.slice(dotIndex) };
}

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
  distanceUnit: "km" | "mi",
  homeOffice: HomeOffice | null,
  homeOfficeLoading: boolean,
  onOpenHomeOffice: () => void,
  onGoToHomeOffice: () => void,
  receipts: ReceiptRecord[],
  receiptsLoading: boolean,
  trips: Trip[],
  tripsLoading: boolean,
  vehicleExpenses: VehicleExpenses[],
  vehicleExpensesLoading: boolean,
  onGoToVehicleExpenses: () => void,
): RegionTaxContent {
  const mock = REGION_MOCK[region];
  const taxReclaim = sumRefundableTax(receipts, taxList);
  const label = taxLabel(taxList);
  // Stat card label only -- reads "GST/HST" when the sole configured
  // tax is GST, since GST and HST are mutually exclusive per-province
  // equivalents in Canada. Display only: the sum above still only
  // includes tax_lists entries literally named "GST" (see
  // sumRefundableTax), and heroNote below still uses the raw label.
  const statLabel = label.trim().toLowerCase() === "gst" ? "GST/HST" : label;

  // Real per-trip data, same source and per-trip rate logic as the
  // Mileage page (tripDistance + totalPrice) -- not a recomputation
  // from Settings' current mileage rate, since each trip already
  // carries its own recorded rate from when it was logged.
  const mileageDistance = trips.reduce((sum, t) => sum + tripDistance(t, distanceUnit), 0);
  const mileageTotal = trips.reduce((sum, t) => sum + t.totalPrice, 0);
  const mileageCurrency = trips[0]?.currency ?? "CAD";
  const mileageStat: TaxStat = {
    label: "Mileage Logged",
    value: tripsLoading ? "…" : formatDistance(mileageDistance, distanceUnit),
    note: tripsLoading
      ? "Loading…"
      : trips.length > 0
        ? `${formatCurrency(mileageTotal, mileageCurrency)} at recorded rates — not the CRA deduction`
        : "No trips logged yet",
    icon: Car,
  };

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
      : "Not entered yet — add under Home Office";
  const homeOfficeOnClick = homeOffice ? onOpenHomeOffice : onGoToHomeOffice;

  // The real CRA vehicle deduction (T2125 line 9281, Chart A: actual
  // costs × business-use %) -- Canada-specific, like homeOffice above,
  // so it only ever applies on the "ca" branch. This, not mileageTotal
  // (mileage × recorded rate), is what actually feeds 9281; see
  // src/lib/t2125.ts. Same three-state honesty as homeOffice: loading,
  // a real (possibly $0) sum across the year's vehicleExpenses records,
  // or genuinely none entered yet -- a clear affordance to go add them,
  // never a fake zero.
  const vehicleDeductible = vehicleExpenses.reduce((sum, v) => sum + v.totalDeductible, 0);
  const vehicleDeductibleValue = vehicleExpensesLoading
    ? "…"
    : vehicleExpenses.length > 0
      ? money(vehicleDeductible)
      : "—";
  const vehicleDeductibleNote = vehicleExpensesLoading
    ? "Loading…"
    : vehicleExpenses.length > 0
      ? "CRA Chart A: actual vehicle costs × business-use %"
      : "Not entered yet — add under Mileage → Vehicle expenses";
  const vehicleDeductibleStat: TaxStat = {
    label: "Vehicle deduction (9281)",
    value: vehicleDeductibleValue,
    note: vehicleDeductibleNote,
    icon: Wallet,
    onClick: onGoToVehicleExpenses,
  };

  if (region === "ca") {
    return {
      heroLabel: "Estimated refundable taxes",
      heroTotal: money(taxReclaim + homeOfficeReclaim + vehicleDeductible),
      heroNote: `${label} reclaim plus estimated tax savings from home office and vehicle expenses`,
      deductionStats: [
        {
          label: `${statLabel} reclaim`,
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
        vehicleDeductibleStat,
      ],
      activityStats: [expensesStat, mileageStat],
    };
  }

  return {
    heroLabel: "Estimated tax savings",
    heroTotal: money(mock.homeOfficeSaving + mileageTotal),
    heroNote: "Estimated tax savings from home office and mileage deductions",
    deductionStats: [
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
    ],
    activityStats: [expensesStat, mileageStat],
  };
}

/**
 * The only visual difference between the two clusters: deduction cards
 * keep the orange icon chip (this app's brand accent, already used for
 * every stat-card icon before this change), activity cards get a
 * neutral gray chip -- subtle enough that it reads as "these are the
 * money ones" without shouting, no new colors introduced.
 */
function StatCard({
  stat: { label, value, note, icon: Icon, onClick },
  variant,
}: {
  stat: TaxStat;
  variant: "deduction" | "activity";
}) {
  return (
    <div
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
        <span
          className={[
            "flex size-8 items-center justify-center rounded-full",
            variant === "deduction"
              ? "bg-[#f97316]/10 text-[#f97316]"
              : "bg-black/[0.05] text-black/45",
          ].join(" ")}
        >
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{value}</p>
      <p className="mt-1 text-xs text-black/45">{note}</p>
    </div>
  );
}

function DashboardPage() {
  const { year, region, taxList, distanceUnit, dateFormat } = useDashboardContext();
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [homeOffice, setHomeOffice] = useState<HomeOffice | null>(null);
  const [homeOfficeLoading, setHomeOfficeLoading] = useState(true);
  const [homeOfficeDialogOpen, setHomeOfficeDialogOpen] = useState(false);

  const loadHomeOffice = (targetUid: string) => {
    setHomeOfficeLoading(true);
    return fetchHomeOffice(targetUid, year)
      .then((record) => setHomeOffice(record))
      .catch(() => setHomeOffice(null))
      .finally(() => setHomeOfficeLoading(false));
  };

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
    fetchReceipts(uid, year)
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
  }, [uid, year]);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setTripsLoading(true);
    fetchTrips(uid, year)
      .then((data) => {
        if (!cancelled) setTrips(data);
      })
      .catch(() => {
        if (!cancelled) setTrips([]);
      })
      .finally(() => {
        if (!cancelled) setTripsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, year]);

  // CRA Chart A vehicle deduction (T2125 line 9281) -- Canada-specific,
  // like homeOffice above, so only fetched on the "ca" branch.
  const [vehicleExpenses, setVehicleExpenses] = useState<VehicleExpenses[]>([]);
  const [vehicleExpensesLoading, setVehicleExpensesLoading] = useState(true);

  useEffect(() => {
    if (!uid || region !== "ca") {
      setVehicleExpenses([]);
      setVehicleExpensesLoading(false);
      return;
    }
    let cancelled = false;
    setVehicleExpensesLoading(true);
    fetchVehicleExpensesRecords(uid, year)
      .then((data) => {
        if (!cancelled) setVehicleExpenses(data);
      })
      .catch(() => {
        if (!cancelled) setVehicleExpenses([]);
      })
      .finally(() => {
        if (!cancelled) setVehicleExpensesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, year, region]);

  const navigate = useNavigate();

  const content = buildTaxContent(
    region,
    taxList,
    distanceUnit,
    homeOffice,
    homeOfficeLoading,
    () => setHomeOfficeDialogOpen(true),
    () => void navigate({ to: "/dashboard/home-office" }),
    receipts,
    receiptsLoading,
    trips,
    tripsLoading,
    vehicleExpenses,
    vehicleExpensesLoading,
    () => void navigate({ to: "/dashboard/mileage" }),
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

      {/* Hero — the #1 thing on this page, so it gets more presence than
          the stat cards below via size and breathing room alone: a
          bigger number and more padding, same plain white card style as
          every other panel on this page (no tinted background). */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-black/55">
          {content.heroLabel} for {year}
        </p>
        <p className="mt-3 text-5xl font-semibold tracking-tight text-emerald-600 sm:text-6xl">
          {splitMoney(content.heroTotal).whole}
          <span className="text-3xl text-emerald-600/60 sm:text-4xl">
            {splitMoney(content.heroTotal).cents}
          </span>
        </p>
        <p className="mt-2 text-sm text-black/45">{content.heroNote}</p>
      </div>

      {/* Tax-deduction cards -- the reason this product exists, so they're
          grouped first and get the same orange icon-chip treatment as the
          hero's accent, distinguishing them from the plain activity cards
          below. auto-fit fills the row exactly regardless of how many
          deduction cards this region has (3 for CA, 2 for US) -- no
          orphan card, no dead space on the right. */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-black">Tax deductions</h2>
        <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {content.deductionStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} variant="deduction" />
          ))}
        </div>
      </div>

      {/* Activity cards -- informational (billing/logbook reference), kept
          visually plain/neutral so they never read as another deduction
          figure. */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-black">Your activity</h2>
        <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {content.activityStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} variant="activity" />
          ))}
        </div>
      </div>

      <CategoryDonutChart receipts={receipts} year={year} loading={receiptsLoading} />

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
                    {`No receipts for ${year} yet — receipts scanned from the ReceiptOne mobile app will show up here.`}
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
        onChanged={() => uid && loadHomeOffice(uid)}
      />
    </div>
  );
}
