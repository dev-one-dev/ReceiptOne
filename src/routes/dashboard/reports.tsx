import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportPreviewDialog } from "@/components/dashboard/ReportPreviewDialog";

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

const REPORT_TYPES = ["Expense Summary", "Tax Summary", "Mileage Report"];
const DATE_RANGES = ["This year", "Last year", "Last quarter", "Last 90 days"];
const FORMATS = ["PDF", "CSV"];

type ReportRow = {
  name: string;
  range: string;
  format: "PDF" | "CSV";
  createdAt: string;
};

const HISTORY: ReportRow[] = [
  { name: "Expense Summary", range: "Jan – Jun 2026", format: "PDF", createdAt: "Jul 1, 2026" },
  { name: "Tax Summary", range: "2025", format: "PDF", createdAt: "Apr 12, 2026" },
  { name: "Mileage Report", range: "Q1 2026", format: "CSV", createdAt: "Apr 2, 2026" },
  { name: "Expense Summary", range: "2025", format: "CSV", createdAt: "Jan 8, 2026" },
];

function ReportsPage() {
  const [type, setType] = useState(REPORT_TYPES[0]);
  const [range, setRange] = useState(DATE_RANGES[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Reports</h1>
        <p className="mt-1 text-sm text-black/55">Generate tax-ready expense reports and export your records.</p>
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
                  <SelectItem key={t} value={t}>{t}</SelectItem>
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
                  <SelectItem key={r} value={r}>{r}</SelectItem>
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
                  <SelectItem key={f} value={f}>{f}</SelectItem>
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
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-t border-black/[0.07] text-xs text-black/45">
                <th className="px-5 py-2 font-medium">Report</th>
                <th className="px-5 py-2 font-medium">Range</th>
                <th className="px-5 py-2 font-medium">Format</th>
                <th className="px-5 py-2 font-medium">Created</th>
                <th className="px-5 py-2 text-right font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((r) => (
                <tr key={r.name + r.createdAt} className="border-t border-black/[0.05]">
                  <td className="flex items-center gap-2 px-5 py-3 font-medium text-black">
                    {r.format === "PDF" ? (
                      <FileText className="size-4 text-black/40" aria-hidden />
                    ) : (
                      <FileSpreadsheet className="size-4 text-black/40" aria-hidden />
                    )}
                    {r.name}
                  </td>
                  <td className="px-5 py-3 text-black/60">{r.range}</td>
                  <td className="px-5 py-3 text-black/60">{r.format}</td>
                  <td className="px-5 py-3 text-black/60">{r.createdAt}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toast.info("Downloads aren't wired up yet — this is a static mockup.")}
                      className="inline-flex items-center gap-1 rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
                      aria-label={`Download ${r.name}`}
                    >
                      <Download className="size-4" aria-hidden />
                    </button>
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
