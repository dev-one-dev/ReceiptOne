import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Home, ListChecks } from "lucide-react";
import { AddHomeOfficeDialog } from "@/components/dashboard/AddHomeOfficeDialog";
import { HomeOfficeDetailDialog } from "@/components/dashboard/HomeOfficeDetailDialog";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";
import { fetchHomeOfficeRecords, type HomeOffice } from "@/integrations/firebase/home-office";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/home-office")({
  component: HomeOfficePage,
});

function formatUnit(unit: string): string {
  if (unit === "m2") return "m²";
  if (unit === "ft2") return "ft²";
  return unit;
}

function HomeOfficePage() {
  const { year, dateFormat, currency: regionCurrency } = useDashboardContext();
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [records, setRecords] = useState<HomeOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<HomeOffice | null>(null);

  const loadRecords = (targetUid: string) => {
    setLoading(true);
    setError(null);
    return fetchHomeOfficeRecords(targetUid, year)
      .then((data) => setRecords(data))
      .catch((e) => setError(errorMessage(e, "Couldn't load home office expenses.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchHomeOfficeRecords(uid, year)
      .then((data) => {
        if (!cancelled) setRecords(data);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, "Couldn't load home office expenses."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid, year]);

  const totalEmploymentExpenses = records.reduce((sum, r) => sum + r.totalEmploymentExpenses, 0);
  const summaryCurrency = records[0]?.currency ?? regionCurrency;

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">Home Office</h1>
          <p className="mt-1 text-sm text-black/55">
            Employment-use-of-home expenses for T2125 line 9945.
          </p>
        </div>
        <AddHomeOfficeDialog
          uid={uid}
          year={year}
          currency={summaryCurrency}
          onSaved={() => uid && loadRecords(uid)}
        />
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/55">Employment-use amount (9945)</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <Home className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">
            {formatCurrency(totalEmploymentExpenses, summaryCurrency)}
          </p>
          <p className="mt-1 text-xs text-black/45">for {year}, from actual costs × workspace %</p>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/55">Work periods logged</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <ListChecks className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{records.length}</p>
          <p className="mt-1 text-xs text-black/45">for {year}</p>
        </div>
      </div>

      {/* Home office periods */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-black">Home office periods</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-t border-black/[0.07] text-xs text-black/45">
                <th className="px-5 py-2 font-medium">Period</th>
                <th className="px-5 py-2 font-medium">Workspace</th>
                <th className="px-5 py-2 text-right font-medium">Workspace %</th>
                <th className="px-5 py-2 text-right font-medium">Employment-use amount</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading home office expenses…
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                records.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="cursor-pointer border-t border-black/[0.05] transition-colors hover:bg-black/[0.02]"
                  >
                    <td className="px-5 py-3 font-medium text-black">
                      {r.startWorkDate && r.endWorkDate
                        ? `${formatDate(r.startWorkDate, dateFormat)} – ${formatDate(r.endWorkDate, dateFormat)}`
                        : year}
                    </td>
                    <td className="px-5 py-3 text-black/60">
                      {r.workspaceType || "—"}
                      {r.workspaceSize > 0
                        ? ` · ${r.workspaceSize} ${formatUnit(r.workspaceUnit)}`
                        : ""}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-black">
                      {r.workspacePercent.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-black">
                      {formatCurrency(r.totalEmploymentExpenses, summaryCurrency)}
                    </td>
                  </tr>
                ))}
              {!loading && !error && records.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-black/45">
                    {`No home office expenses recorded for ${year} yet.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <HomeOfficeDetailDialog
        homeOffice={selected}
        dateFormat={dateFormat}
        onOpenChange={(open) => !open && setSelected(null)}
        onChanged={() => uid && loadRecords(uid)}
      />
    </div>
  );
}
