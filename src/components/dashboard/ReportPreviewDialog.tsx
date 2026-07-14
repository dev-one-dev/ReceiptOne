import { useEffect, useState } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import {
  useDashboardContext,
  type DateFormat,
  type DistanceUnit,
} from "@/components/dashboard/DashboardContext";
import { fetchReceipts, type Receipt } from "@/integrations/firebase/receipts";
import { fetchTrips, tripDistance, type Trip } from "@/integrations/firebase/trips";
import { fetchHomeOfficeRecords, type HomeOffice } from "@/integrations/firebase/home-office";
import { buildT2125Summary, type T2125Summary } from "@/lib/t2125";
import { formatCurrency, formatDate, formatDistance, money } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

/**
 * Real CRA T2125 Part 4 preview -- step 1 of 2. All aggregation lives in
 * src/lib/t2125.ts (pure, no Firestore calls); this just renders it.
 * PDF generation is a separate, later piece: the Download button stays
 * disabled for this report type (see handleDownload/isRealType below).
 */
function TaxSummaryPreview({
  summary,
  currency,
  claimsITC,
  onClaimsITCChange,
  year,
}: {
  summary: T2125Summary;
  currency: string;
  claimsITC: boolean;
  onClaimsITCChange: (value: boolean) => void;
  year: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <label className="flex shrink-0 items-start gap-2 rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
        <input
          type="checkbox"
          checked={claimsITC}
          onChange={(e) => onClaimsITCChange(e.target.checked)}
          className="mt-0.5 size-3.5 shrink-0 rounded border-black/20"
        />
        <span>
          <span className="font-medium text-black">I claim GST/HST input tax credits (ITC)</span>
          <span className="mt-0.5 block text-xs text-black/50">
            When on, the recoverable GST/HST on your receipts is excluded from the expense lines
            below, since you reclaim it separately as an ITC rather than as a deduction.
          </span>
        </span>
      </label>

      {/* Only this table scrolls -- the header row stays sticky, and the
          9368 total / ITC memo / download button below stay pinned. */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-black/[0.07]">
        <div className="h-full overflow-y-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs text-black/45">
                <th className="sticky top-0 z-10 bg-white px-4 py-2 font-medium">Line</th>
                <th className="sticky top-0 z-10 bg-white px-4 py-2 font-medium">Description</th>
                <th className="sticky top-0 z-10 bg-white px-4 py-2 text-right font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.lines.map((li) => {
                const isZero = li.amount === 0 && li.actual === undefined;
                return (
                  <tr key={li.lineNumber} className="border-t border-black/[0.05]">
                    <td
                      className={`px-4 py-2.5 tabular-nums ${isZero ? "text-black/30" : "text-black/55"}`}
                    >
                      {li.lineNumber}
                    </td>
                    <td className={`px-4 py-2.5 ${isZero ? "text-black/30" : "text-black/70"}`}>
                      {li.label}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right tabular-nums ${isZero ? "text-black/30" : "text-black"}`}
                    >
                      <div>{formatCurrency(li.amount, currency)}</div>
                      {li.actual !== undefined && (
                        <div className="text-xs font-normal text-black/40">
                          50% of {formatCurrency(li.actual, currency)}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="space-y-1.5 border-t border-black/[0.05] px-4 py-3">
            <p className="text-xs text-black/40">
              Line 9281 is computed from your logged mileage (distance × the rate recorded on each
              trip). If you deduct actual vehicle expenses instead of a per-distance rate, fill that
              line in yourself.
            </p>
            <p className="text-xs text-black/40">
              Reflects your real records for tax year {year}. PDF/CSV export is coming next.
            </p>
          </div>
        </div>
      </div>

      <div className="shrink-0 space-y-1 rounded-xl border border-black/[0.07] bg-black/[0.02] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-black">9368 Total expenses</span>
          <span className="text-right text-base font-semibold tabular-nums text-black">
            {formatCurrency(summary.totalExpenses, currency)}
          </span>
        </div>
        <p className="text-xs text-black/50">
          GST/HST reclaim (ITC): {formatCurrency(summary.totalRefundableTax, currency)} — not an
          expense; recovered separately.
        </p>
      </div>
    </div>
  );
}

/**
 * Independent of the Dashboard header's own "tax year" selector --
 * these ranges are always relative to today's real calendar date.
 * "Last 90 days" is a rolling window (today minus 89 days through
 * today); the other three are calendar-aligned periods.
 */
function resolveDateRange(range: string, now: Date = new Date()): { start: Date; end: Date } {
  const year = now.getFullYear();
  const month = now.getMonth();

  if (range === "Last year") {
    return {
      start: new Date(year - 1, 0, 1, 0, 0, 0, 0),
      end: new Date(year - 1, 11, 31, 23, 59, 59, 999),
    };
  }

  if (range === "Last quarter") {
    const currentQuarter = Math.floor(month / 3);
    let quarter = currentQuarter - 1;
    let quarterYear = year;
    if (quarter < 0) {
      quarter = 3;
      quarterYear -= 1;
    }
    const startMonth = quarter * 3;
    return {
      start: new Date(quarterYear, startMonth, 1, 0, 0, 0, 0),
      end: new Date(quarterYear, startMonth + 3, 0, 23, 59, 59, 999),
    };
  }

  if (range === "Last 90 days") {
    const end = new Date(year, month, now.getDate(), 23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 89);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }

  // "This year"
  return {
    start: new Date(year, 0, 1, 0, 0, 0, 0),
    end: new Date(year, 11, 31, 23, 59, 59, 999),
  };
}

type CategoryTotal = { category: string; amount: number };

function groupReceiptsByCategory(receipts: Receipt[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const r of receipts) {
    const key = r.companyCategory || "Uncategorized";
    totals.set(key, (totals.get(key) ?? 0) + r.price);
  }
  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

type TaxTotal = { taxName: string; totalTax: number; refundableTax: number };

/**
 * Same aggregation as sumRefundableTax() in dashboard/index.tsx (raw
 * entry.tax sums, isRefundable as the refundable filter -- never
 * recomputed from taxPercent) with one deliberate difference: that
 * function only sums tax names matching the user's configured Settings
 * tax list, since it needs one clean reclaim number. This report shows
 * every distinct tax name that actually appears on the receipts in
 * range (GST, PST, HST, VAT, whatever's really there), not just
 * configured ones. Tax names are grouped case-insensitively (so "GST"
 * and "gst" merge) but displayed using the first-seen original casing.
 */
function groupReceiptsByTax(receipts: Receipt[]): TaxTotal[] {
  const totals = new Map<
    string,
    { displayName: string; totalTax: number; refundableTax: number }
  >();
  for (const r of receipts) {
    for (const entry of r.taxLists) {
      const displayName = entry.taxName.trim() || "Unspecified";
      const key = displayName.toLowerCase();
      const existing = totals.get(key) ?? { displayName, totalTax: 0, refundableTax: 0 };
      existing.totalTax += entry.tax;
      if (entry.isRefundable) existing.refundableTax += entry.tax;
      totals.set(key, existing);
    }
  }
  return Array.from(totals.values())
    .map((v) => ({ taxName: v.displayName, totalTax: v.totalTax, refundableTax: v.refundableTax }))
    .sort((a, b) => b.totalTax - a.totalTax);
}

function RealExpenseSummaryPreview({
  categories,
  taxTotals,
  currency,
}: {
  categories: CategoryTotal[];
  taxTotals: TaxTotal[];
  currency: string;
}) {
  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const totalTax = taxTotals.reduce((sum, t) => sum + t.totalTax, 0);
  const totalRefundable = taxTotals.reduce((sum, t) => sum + t.refundableTax, 0);
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-black/[0.07]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs text-black/45">
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.category} className="border-t border-black/[0.05]">
                <td className="px-4 py-2.5 text-black/70">{c.category}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-black">
                  {formatCurrency(c.amount, currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black/[0.1]">
              <td className="px-4 py-2.5 text-sm font-semibold text-black">Total</td>
              <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-black">
                {formatCurrency(total, currency)}
              </td>
            </tr>
            {taxTotals.length > 0 && (
              <tr className="border-t border-black/[0.05]">
                <td className="px-4 py-2 text-xs text-black/55">Total refundable tax</td>
                <td className="px-4 py-2 text-right text-xs font-medium tabular-nums text-black/70">
                  {formatCurrency(totalRefundable, currency)}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>

      {taxTotals.length > 0 && (
        <div className="rounded-xl border border-black/[0.07]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs text-black/45">
                <th className="px-4 py-2 font-medium">Tax type</th>
                <th className="px-4 py-2 text-right font-medium">Total tax</th>
                <th className="px-4 py-2 text-right font-medium">Refundable amount</th>
              </tr>
            </thead>
            <tbody>
              {taxTotals.map((t) => (
                <tr key={t.taxName} className="border-t border-black/[0.05]">
                  <td className="px-4 py-2.5 text-black/70">{t.taxName}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-black">
                    {formatCurrency(t.totalTax, currency)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-black">
                    {formatCurrency(t.refundableTax, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-black/[0.1]">
                <td className="px-4 py-2.5 text-sm font-semibold text-black">Total</td>
                <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-black">
                  {formatCurrency(totalTax, currency)}
                </td>
                <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-black">
                  {formatCurrency(totalRefundable, currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

type MileageRow = { date: Date; purpose: string; distanceValue: number; amount: number };

/** amount is each trip's own real, recorded totalPrice (its rate at the time it was logged) -- not recomputed from Settings' current mileage rate. */
function buildMileageRows(trips: Trip[], distanceUnit: DistanceUnit): MileageRow[] {
  return trips.map((t) => ({
    date: t.date,
    purpose: t.comment || "—",
    distanceValue: tripDistance(t, distanceUnit),
    amount: t.totalPrice,
  }));
}

function RealMileageReportPreview({
  rows,
  distanceUnit,
  dateFormat,
  currency,
  mileageRate,
}: {
  rows: MileageRow[];
  distanceUnit: DistanceUnit;
  dateFormat: DateFormat;
  currency: string;
  mileageRate: number;
}) {
  const totalDistance = rows.reduce((sum, r) => sum + r.distanceValue, 0);
  const totalAmount = rows.reduce((sum, r) => sum + r.amount, 0);
  return (
    <div>
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
            {rows.map((r, i) => (
              <tr key={r.date.toISOString() + i} className="border-t border-black/[0.05]">
                <td className="px-4 py-2.5 text-black/60">{formatDate(r.date, dateFormat)}</td>
                <td className="px-4 py-2.5 text-black/70">{r.purpose}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-black">
                  {formatDistance(r.distanceValue, distanceUnit)}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-black">
                  {formatCurrency(r.amount, currency)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black/[0.1]">
              <td colSpan={2} className="px-4 py-2.5 text-sm font-semibold text-black">
                Total
              </td>
              <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-black">
                {formatDistance(totalDistance, distanceUnit)}
              </td>
              <td className="px-4 py-2.5 text-right text-sm font-semibold tabular-nums text-black">
                {formatCurrency(totalAmount, currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-2 text-xs text-black/40">
        Amounts reflect each trip's rate at the time it was logged, which may differ from your
        current Settings rate ({money(mileageRate)}/{distanceUnit}).
      </p>
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function csvCell(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers: string[], rows: (string | number)[][]): string {
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function downloadBlob(content: string, mimeType: string, filename: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadExpenseSummary(
  format: string,
  categories: CategoryTotal[],
  taxTotals: TaxTotal[],
  range: string,
  currency: string,
) {
  const filename = slugify(`expense-summary-${range}`);
  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const totalTax = taxTotals.reduce((sum, t) => sum + t.totalTax, 0);
  const totalRefundable = taxTotals.reduce((sum, t) => sum + t.refundableTax, 0);

  if (format === "PDF") {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Expense Summary", 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${range} · Generated ${new Date().toLocaleDateString()}`, 14, 25);
    autoTable(doc, {
      startY: 32,
      head: [["Category", "Amount"]],
      body: categories.map((c) => [c.category, formatCurrency(c.amount, currency)]),
      foot: [["Total", formatCurrency(total, currency)]],
      headStyles: { fillColor: [0, 0, 0] },
      footStyles: { fillColor: [245, 244, 240], textColor: [0, 0, 0], fontStyle: "bold" },
    });

    if (taxTotals.length > 0) {
      const afterCategoryTable = (doc as unknown as { lastAutoTable: { finalY: number } })
        .lastAutoTable.finalY;
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(
        `Total refundable tax: ${formatCurrency(totalRefundable, currency)}`,
        14,
        afterCategoryTable + 8,
      );
      autoTable(doc, {
        startY: afterCategoryTable + 14,
        head: [["Tax type", "Total tax", "Refundable amount"]],
        body: taxTotals.map((t) => [
          t.taxName,
          formatCurrency(t.totalTax, currency),
          formatCurrency(t.refundableTax, currency),
        ]),
        foot: [
          ["Total", formatCurrency(totalTax, currency), formatCurrency(totalRefundable, currency)],
        ],
        headStyles: { fillColor: [0, 0, 0] },
        footStyles: { fillColor: [245, 244, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      });
    }

    doc.save(`${filename}.pdf`);
    return;
  }

  const csvSections = [
    toCsv(
      ["Category", "Amount"],
      [...categories.map((c) => [c.category, c.amount.toFixed(2)]), ["Total", total.toFixed(2)]],
    ),
  ];
  if (taxTotals.length > 0) {
    csvSections.push(`Total refundable tax,${totalRefundable.toFixed(2)}`);
    csvSections.push(
      toCsv(
        ["Tax type", "Total tax", "Refundable amount"],
        [
          ...taxTotals.map((t) => [t.taxName, t.totalTax.toFixed(2), t.refundableTax.toFixed(2)]),
          ["Total", totalTax.toFixed(2), totalRefundable.toFixed(2)],
        ],
      ),
    );
  }
  downloadBlob(csvSections.join("\r\n\r\n"), "text/csv;charset=utf-8;", `${filename}.csv`);
}

function downloadMileageReport(
  format: string,
  rows: MileageRow[],
  range: string,
  distanceUnit: DistanceUnit,
  dateFormat: DateFormat,
  currency: string,
) {
  const filename = slugify(`mileage-report-${range}`);
  const totalDistance = rows.reduce((sum, r) => sum + r.distanceValue, 0);
  const totalAmount = rows.reduce((sum, r) => sum + r.amount, 0);

  if (format === "PDF") {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Mileage Report", 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${range} · Generated ${new Date().toLocaleDateString()}`, 14, 25);
    autoTable(doc, {
      startY: 32,
      head: [["Date", "Purpose", "Distance", "Amount"]],
      body: rows.map((r) => [
        formatDate(r.date, dateFormat),
        r.purpose,
        formatDistance(r.distanceValue, distanceUnit),
        formatCurrency(r.amount, currency),
      ]),
      foot: [
        [
          "Total",
          "",
          formatDistance(totalDistance, distanceUnit),
          formatCurrency(totalAmount, currency),
        ],
      ],
      headStyles: { fillColor: [0, 0, 0] },
      footStyles: { fillColor: [245, 244, 240], textColor: [0, 0, 0], fontStyle: "bold" },
    });
    doc.save(`${filename}.pdf`);
    return;
  }

  const csv = toCsv(
    ["Date", "Purpose", "Distance", "Amount"],
    [
      ...rows.map((r) => [
        formatDate(r.date, dateFormat),
        r.purpose,
        r.distanceValue.toFixed(1),
        r.amount.toFixed(2),
      ]),
      ["Total", "", totalDistance.toFixed(1), totalAmount.toFixed(2)],
    ],
  );
  downloadBlob(csv, "text/csv;charset=utf-8;", `${filename}.csv`);
}

export function ReportPreviewDialog({
  open,
  onOpenChange,
  type,
  range,
  format,
  uid,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: string;
  range: string;
  format: string;
  uid: string | null;
}) {
  const { distanceUnit, dateFormat, mileageRate, year } = useDashboardContext();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [homeOfficeRecords, setHomeOfficeRecords] = useState<HomeOffice[]>([]);
  const [claimsITC, setClaimsITC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !uid) return;
    let cancelled = false;

    if (type === "Expense Summary") {
      setLoading(true);
      setError(null);
      fetchReceipts(uid)
        .then((data) => {
          if (!cancelled) setReceipts(data);
        })
        .catch((e) => {
          if (!cancelled) setError(errorMessage(e, "Couldn't load your receipts."));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else if (type === "Mileage Report") {
      setLoading(true);
      setError(null);
      fetchTrips(uid)
        .then((data) => {
          if (!cancelled) setTrips(data);
        })
        .catch((e) => {
          if (!cancelled) setError(errorMessage(e, "Couldn't load your trips."));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else if (type === "Tax Summary") {
      setLoading(true);
      setError(null);
      Promise.all([
        fetchReceipts(uid, year),
        fetchTrips(uid, year),
        fetchHomeOfficeRecords(uid, year),
      ])
        .then(([receiptsData, tripsData, homeOfficeData]) => {
          if (!cancelled) {
            setReceipts(receiptsData);
            setTrips(tripsData);
            setHomeOfficeRecords(homeOfficeData);
          }
        })
        .catch((e) => {
          if (!cancelled) setError(errorMessage(e, "Couldn't load your tax summary data."));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [open, type, uid, year]);

  const { start, end } = resolveDateRange(range);

  const filteredReceipts = receipts.filter((r) => r.date >= start && r.date <= end);
  const categories = groupReceiptsByCategory(filteredReceipts);
  const taxTotals = groupReceiptsByTax(filteredReceipts);
  const receiptsCurrency = filteredReceipts[0]?.currency ?? "CAD";

  const filteredTrips = trips.filter((t) => t.date >= start && t.date <= end);
  const mileageRows = buildMileageRows(filteredTrips, distanceUnit);
  const tripsCurrency = filteredTrips[0]?.currency ?? "CAD";

  const taxSummary = buildT2125Summary(receipts, trips, homeOfficeRecords, year, claimsITC);
  const taxSummaryCurrency = receipts[0]?.currency ?? trips[0]?.currency ?? "CAD";
  const taxSummaryHasData = receipts.length > 0 || trips.length > 0 || homeOfficeRecords.length > 0;

  const isRealType = type === "Expense Summary" || type === "Mileage Report";
  const hasData =
    type === "Expense Summary"
      ? categories.length > 0
      : type === "Mileage Report"
        ? mileageRows.length > 0
        : true;

  const handleDownload = () => {
    if (type === "Tax Summary") {
      toast.info(
        "PDF/CSV export for Tax Summary is coming next — this preview reflects your real records.",
      );
      return;
    }
    if (!hasData) {
      toast.error(
        `No ${type === "Mileage Report" ? "trips" : "receipts"} in this date range — nothing to download.`,
      );
      return;
    }
    try {
      if (type === "Expense Summary") {
        downloadExpenseSummary(format, categories, taxTotals, range, receiptsCurrency);
      } else {
        downloadMileageReport(format, mileageRows, range, distanceUnit, dateFormat, tripsCurrency);
      }
      toast.success(`${type} downloaded.`);
      onOpenChange(false);
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't generate this file."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle>{type} preview</DialogTitle>
          <DialogDescription>
            {type === "Tax Summary" ? `Tax year ${year}` : range} · {format}
          </DialogDescription>
        </DialogHeader>

        {type === "Tax Summary" &&
          (loading ? (
            <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/45">
              Loading your tax summary…
            </p>
          ) : error ? (
            <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-red-600">
              {error}
            </p>
          ) : !taxSummaryHasData ? (
            <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/45">
              No receipts, trips, or home office records for {year}.
            </p>
          ) : (
            <TaxSummaryPreview
              summary={taxSummary}
              currency={taxSummaryCurrency}
              claimsITC={claimsITC}
              onClaimsITCChange={setClaimsITC}
              year={year}
            />
          ))}

        {type !== "Tax Summary" && (
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {type === "Expense Summary" &&
              (loading ? (
                <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/45">
                  Loading your receipts…
                </p>
              ) : error ? (
                <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-red-600">
                  {error}
                </p>
              ) : categories.length === 0 ? (
                <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/45">
                  No receipts in this date range.
                </p>
              ) : (
                <RealExpenseSummaryPreview
                  categories={categories}
                  taxTotals={taxTotals}
                  currency={receiptsCurrency}
                />
              ))}

            {type === "Mileage Report" &&
              (loading ? (
                <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/45">
                  Loading your trips…
                </p>
              ) : error ? (
                <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-red-600">
                  {error}
                </p>
              ) : mileageRows.length === 0 ? (
                <p className="rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/45">
                  No trips in this date range.
                </p>
              ) : (
                <RealMileageReportPreview
                  rows={mileageRows}
                  distanceUnit={distanceUnit}
                  dateFormat={dateFormat}
                  currency={tripsCurrency}
                  mileageRate={mileageRate}
                />
              ))}

            <p className="text-xs text-black/40">Reflects your real records for this range.</p>
          </div>
        )}

        <DialogFooter className="shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={
              type === "Tax Summary" ? true : isRealType && (loading || Boolean(error) || !hasData)
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Download className="size-4" aria-hidden />
            {type === "Tax Summary" ? "Download — coming next" : `Download ${format}`}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
