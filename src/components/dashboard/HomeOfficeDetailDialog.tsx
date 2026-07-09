import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DateFormat } from "@/components/dashboard/DashboardContext";
import type { HomeOffice } from "@/integrations/firebase/home-office";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";

type ExpenseKey =
  | "rentExpenses"
  | "electricity"
  | "heat"
  | "insurance"
  | "internet"
  | "maintenance"
  | "propertyTaxes"
  | "other"
  | "otherExpenses";

const EXPENSE_LINES: { label: string; key: ExpenseKey }[] = [
  { label: "Rent", key: "rentExpenses" },
  { label: "Electricity", key: "electricity" },
  { label: "Heat", key: "heat" },
  { label: "Insurance", key: "insurance" },
  { label: "Internet", key: "internet" },
  { label: "Maintenance", key: "maintenance" },
  { label: "Property taxes", key: "propertyTaxes" },
  { label: "Other", key: "other" },
  { label: "Other expenses", key: "otherExpenses" },
];

function formatUnit(unit: string): string {
  if (unit === "m2") return "m²";
  if (unit === "ft2") return "ft²";
  return unit;
}

function formatHomeType(type: string): string {
  if (type === "rent") return "Renting";
  if (type === "own") return "Owns home";
  return type || "—";
}

function formatWorkPeriod(start: Date | null, end: Date | null, dateFormat: DateFormat): string {
  if (!start && !end) return "—";
  if (start && end) return `${formatDate(start, dateFormat)} – ${formatDate(end, dateFormat)}`;
  return formatDate((start ?? end)!, dateFormat);
}

/**
 * Read-only -- shows the confirmed T777-line-48 math (home_expenses x
 * workspace_percent + workspace_expenses x 100% = the real employment-use
 * total) rather than just a single number, since that breakdown is what
 * the mobile app itself shows on its summary screen.
 */
export function HomeOfficeDetailDialog({
  homeOffice,
  dateFormat,
  onOpenChange,
}: {
  homeOffice: HomeOffice | null;
  dateFormat: DateFormat;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={homeOffice !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {homeOffice && (
          <>
            <DialogHeader>
              <DialogTitle>{homeOffice.title}</DialogTitle>
              <DialogDescription>
                {homeOffice.forYear} ·{" "}
                {formatCurrency(homeOffice.totalEmploymentExpenses, homeOffice.currency)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-black/55">Home</span>
                <span className="font-medium text-black">
                  {formatHomeType(homeOffice.homeRentType)}
                  {homeOffice.homeSize > 0
                    ? ` · ${homeOffice.homeSize} ${formatUnit(homeOffice.workspaceUnit)}`
                    : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/55">Workspace</span>
                <span className="font-medium text-black">
                  {homeOffice.workspaceType || "—"}
                  {homeOffice.workspaceSize > 0
                    ? ` · ${homeOffice.workspaceSize} ${formatUnit(homeOffice.workspaceUnit)}`
                    : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/55">% of home used for work</span>
                <span className="font-medium text-black">
                  {homeOffice.workspacePercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/55">Work period</span>
                <span className="font-medium text-black">
                  {formatWorkPeriod(homeOffice.startWorkDate, homeOffice.endWorkDate, dateFormat)}
                </span>
              </div>
            </div>

            {EXPENSE_LINES.some((line) => homeOffice[line.key] > 0) && (
              <div className="overflow-hidden rounded-xl border border-black/[0.07]">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="text-black/45">
                      <th className="px-3 py-2 font-medium">Expense</th>
                      <th className="px-3 py-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXPENSE_LINES.filter((line) => homeOffice[line.key] > 0).map((line) => (
                      <tr key={line.key} className="border-t border-black/[0.05]">
                        <td className="px-3 py-2 text-black">{line.label}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-black">
                          {formatCurrency(homeOffice[line.key], homeOffice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
              <div className="flex items-center justify-between text-xs text-black/55">
                <span>
                  {formatCurrency(homeOffice.totalHomeExpenses, homeOffice.currency)} home expenses
                  × {homeOffice.workspacePercent}%
                </span>
                <span className="font-medium text-black">
                  {formatCurrency(homeOffice.totalEmploymentHomeExpenses, homeOffice.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-black/55">
                <span>
                  {formatCurrency(homeOffice.totalWorkspaceExpenses, homeOffice.currency)} workspace
                  expenses × 100%
                </span>
                <span className="font-medium text-black">
                  {formatCurrency(homeOffice.totalEmploymentWorkspaceExpenses, homeOffice.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-black/[0.07] pt-2 text-sm">
                <span className="font-semibold text-black">Total employment-use amount</span>
                <span className="font-semibold text-black">
                  {formatCurrency(homeOffice.totalEmploymentExpenses, homeOffice.currency)}
                </span>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
