import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toDateInputValue } from "@/components/dashboard/ReceiptEditFields";
import {
  HomeOfficeFields,
  HomeOfficeSummary,
  parseHomeOfficeForm,
  type HomeOfficeForm,
} from "@/components/dashboard/HomeOfficeFields";
import type { DateFormat } from "@/components/dashboard/DashboardContext";
import {
  computeHomeOfficeTotals,
  deleteHomeOffice,
  updateHomeOffice,
  type HomeOffice,
} from "@/integrations/firebase/home-office";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

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
  if (type === "changed") return "Changed residence/workspace";
  return type || "—";
}

function formatWorkPeriod(start: Date | null, end: Date | null, dateFormat: DateFormat): string {
  if (!start && !end) return "—";
  if (start && end) return `${formatDate(start, dateFormat)} – ${formatDate(end, dateFormat)}`;
  return formatDate((start ?? end)!, dateFormat);
}

function toForm(record: HomeOffice): HomeOfficeForm {
  return {
    forYear: record.forYear,
    homeRentType: record.homeRentType || "rent",
    workspaceType: record.workspaceType || "designated",
    workspaceUnit: record.workspaceUnit || "m2",
    homeSize: record.homeSize ? String(record.homeSize) : "",
    workspaceSize: record.workspaceSize ? String(record.workspaceSize) : "",
    startWorkDate: record.startWorkDate ? toDateInputValue(record.startWorkDate) : "",
    endWorkDate: record.endWorkDate ? toDateInputValue(record.endWorkDate) : "",
    rentExpenses: record.rentExpenses.toFixed(2),
    electricity: record.electricity.toFixed(2),
    heat: record.heat.toFixed(2),
    insurance: record.insurance.toFixed(2),
    internet: record.internet.toFixed(2),
    maintenance: record.maintenance.toFixed(2),
    propertyTaxes: record.propertyTaxes.toFixed(2),
    other: record.other.toFixed(2),
    otherExpenses: record.otherExpenses.toFixed(2),
  };
}

/**
 * Read-only summary (the confirmed employment-use-amount math: home
 * expenses x workspace_percent + workspace expenses x 100% =
 * total_employment_expenses, which feeds T2125 line 9945) with an edit
 * mode exposing every field via the shared HomeOfficeFields, plus a
 * real, permanent delete -- mirrors VehicleExpensesDetailDialog's shape.
 */
export function HomeOfficeDetailDialog({
  homeOffice,
  dateFormat,
  onOpenChange,
  onChanged,
}: {
  homeOffice: HomeOffice | null;
  dateFormat: DateFormat;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<HomeOfficeForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setEditing(false);
    setForm(homeOffice ? toForm(homeOffice) : null);
  }, [homeOffice]);

  const handleEdit = () => {
    if (homeOffice) setForm(toForm(homeOffice));
    setEditing(true);
  };

  const handleSave = async () => {
    if (!homeOffice || !form) return;
    if (!form.startWorkDate || !form.endWorkDate) {
      toast.error("Set a start and finish date for this work period.");
      return;
    }
    setSaving(true);
    try {
      await updateHomeOffice(homeOffice.id, {
        currency: homeOffice.currency,
        ...parseHomeOfficeForm(form),
        // Explicitly after the spread -- parseHomeOfficeForm's own
        // startWorkDate/endWorkDate are `Date | null` (fine for the live
        // preview), but updateHomeOffice requires real Dates, and we've
        // already validated both are set above.
        startWorkDate: new Date(`${form.startWorkDate}T00:00:00`),
        endWorkDate: new Date(`${form.endWorkDate}T00:00:00`),
      });
      toast.success("Home office expenses updated.");
      setEditing(false);
      onOpenChange(false);
      onChanged?.();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't save changes."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!homeOffice) return;
    setDeleting(true);
    try {
      await deleteHomeOffice(homeOffice.id);
      toast.success("Home office expenses deleted.");
      setDeleteOpen(false);
      onOpenChange(false);
      onChanged?.();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't delete this record."));
    } finally {
      setDeleting(false);
    }
  };

  const liveTotals = form
    ? computeHomeOfficeTotals(parseHomeOfficeForm(form))
    : {
        workspacePercent: 0,
        totalHomeExpenses: 0,
        totalWorkspaceExpenses: 0,
        totalEmploymentHomeExpenses: 0,
        totalEmploymentWorkspaceExpenses: 0,
        totalEmploymentExpenses: 0,
      };

  return (
    <>
      <Dialog
        open={homeOffice !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(false);
          onOpenChange(open);
        }}
      >
        <DialogContent
          className={
            editing ? "flex max-h-[85vh] flex-col overflow-hidden sm:max-w-3xl" : "sm:max-w-lg"
          }
        >
          {homeOffice && (
            <>
              <DialogHeader className="shrink-0">
                <DialogTitle>{homeOffice.title}</DialogTitle>
                <DialogDescription>
                  {homeOffice.forYear} ·{" "}
                  {formatCurrency(homeOffice.totalEmploymentExpenses, homeOffice.currency)}
                </DialogDescription>
              </DialogHeader>

              {editing && form ? (
                <>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <HomeOfficeFields
                      form={form}
                      onChangeField={(patch) =>
                        setForm((prev) => (prev ? { ...prev, ...patch } : prev))
                      }
                      currency={homeOffice.currency}
                      totals={liveTotals}
                    />
                  </div>
                  <div className="shrink-0 space-y-4">
                    <HomeOfficeSummary totals={liveTotals} currency={homeOffice.currency} />
                    <DialogFooter className="gap-2 sm:gap-0">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleSave()}
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                    </DialogFooter>
                  </div>
                </>
              ) : (
                <>
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
                        {homeOffice.workspacePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/55">Work period</span>
                      <span className="font-medium text-black">
                        {formatWorkPeriod(
                          homeOffice.startWorkDate,
                          homeOffice.endWorkDate,
                          dateFormat,
                        )}
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
                        {formatCurrency(homeOffice.totalHomeExpenses, homeOffice.currency)} home
                        expenses × {homeOffice.workspacePercent.toFixed(2)}%
                      </span>
                      <span className="font-medium text-black">
                        {formatCurrency(
                          homeOffice.totalEmploymentHomeExpenses,
                          homeOffice.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-black/55">
                      <span>
                        {formatCurrency(homeOffice.totalWorkspaceExpenses, homeOffice.currency)}{" "}
                        workspace expenses × 100%
                      </span>
                      <span className="font-medium text-black">
                        {formatCurrency(
                          homeOffice.totalEmploymentWorkspaceExpenses,
                          homeOffice.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-black/[0.07] pt-2 text-sm">
                      <span className="font-semibold text-black">
                        Employment-use amount (line 9945)
                      </span>
                      <span className="font-semibold text-black">
                        {formatCurrency(homeOffice.totalEmploymentExpenses, homeOffice.currency)}
                      </span>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:justify-between sm:gap-0">
                    <button
                      type="button"
                      onClick={() => setDeleteOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      Edit
                    </button>
                  </DialogFooter>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete these home office expenses?</DialogTitle>
            <DialogDescription>
              This permanently deletes this home office record. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setDeleteOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete record"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
