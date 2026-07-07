import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportPreviewDialog } from "@/components/dashboard/ReportPreviewDialog";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";
import { fetchReports, type Report } from "@/integrations/firebase/reports";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

// TODO(write-access): generating a NEW report needs whatever backend
// logic actually builds the PDF (a Cloud Function? untouched by this
// pass) -- this config + preview stays a mock. Real *past* reports below
// are live data with real, downloadable PDFs. See README's
// "Known Limitations" section.
const REPORT_TYPES = ["Expense Summary", "Tax Summary", "Mileage Report"];
const DATE_RANGES = ["This year", "Last year", "Last quarter", "Last 90 days"];
const FORMATS = ["PDF", "CSV"];

const COUNTRY_LABELS: Record<string, { flag: string; label: string }> = {
  ca: { flag: "🇨🇦", label: "CA" },
  us: { flag: "🇺🇸", label: "US" },
};

function formatRange(report: Report, dateFormat: Parameters<typeof formatDate>[1]): string {
  const { dateRangeStart, dateRangeEnd } = report.filters;
  if (!dateRangeStart && !dateRangeEnd) return "—";
  if (dateRangeStart && dateRangeEnd) {
    return `${formatDate(dateRangeStart, dateFormat)} – ${formatDate(dateRangeEnd, dateFormat)}`;
  }
  return formatDate((dateRangeStart ?? dateRangeEnd)!, dateFormat);
}

function ReportsPage() {
  const { dateFormat } = useDashboardContext();
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [type, setType] = useState(REPORT_TYPES[0]);
  const [range, setRange] = useState(DATE_RANGES[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchReports(uid)
      .then((data) => {
        if (!cancelled) setReports(data);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, "Couldn't load reports."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Reports</h1>
        <p className="mt-1 text-sm text-black/55">
          Generate tax-ready expense reports and export your records.
        </p>
      </div>

      {/* Generate report */}
      <div className="mt-5 rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h2 className="text-sm font-semibold text-black">Generate a report</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-black/55">Report type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-black/55">Date range</label>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-black/55">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Generate report
        </button>
      </div>

      <ReportPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        type={type}
        range={range}
        format={format}
      />

      {/* History */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-black">Report history</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-t border-black/[0.07] text-xs text-black/45">
                <th className="px-5 py-2 font-medium">Report</th>
                <th className="px-5 py-2 font-medium">Range</th>
                <th className="px-5 py-2 font-medium">Created</th>
                <th className="px-5 py-2 font-medium">Country</th>
                <th className="px-5 py-2 text-right font-medium">Amount</th>
                <th className="px-5 py-2 text-right font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading reports…
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                reports.map((r) => {
                  const country = COUNTRY_LABELS[r.countryCode];
                  return (
                    <tr key={r.id} className="border-t border-black/[0.05]">
                      <td className="flex items-center gap-2 px-5 py-3 font-medium text-black">
                        <FileText className="size-4 text-black/40" aria-hidden />
                        {r.title}
                      </td>
                      <td className="px-5 py-3 text-black/60">{formatRange(r, dateFormat)}</td>
                      <td className="px-5 py-3 text-black/60">
                        {formatDate(r.createdAt, dateFormat)}
                      </td>
                      <td className="px-5 py-3 text-black/60">
                        {country ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-medium text-black/60">
                            <span aria-hidden>{country.flag}</span>
                            {country.label}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-black">
                        {formatCurrency(r.totalAmount, r.currency)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {r.pdfUrl ? (
                          <a
                            href={r.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
                            aria-label={`Download ${r.title}`}
                          >
                            <Download className="size-4" aria-hidden />
                          </a>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 rounded-full p-1.5 text-black/20"
                            aria-label="No PDF available"
                          >
                            <Download className="size-4" aria-hidden />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              {!loading && !error && reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-black/45">
                    No reports yet — reports generated from the ReceiptOne mobile app will show up
                    here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
