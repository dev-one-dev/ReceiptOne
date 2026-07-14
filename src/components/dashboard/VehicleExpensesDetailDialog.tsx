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
  VehicleExpensesFields,
  parseVehicleExpensesForm,
  type VehicleExpensesForm,
} from "@/components/dashboard/VehicleExpensesFields";
import type { DateFormat } from "@/components/dashboard/DashboardContext";
import {
  computeVehicleExpensesTotals,
  deleteVehicleExpenses,
  updateVehicleExpenses,
  type VehicleExpenses,
} from "@/integrations/firebase/vehicle-expenses";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

function toForm(record: VehicleExpenses): VehicleExpensesForm {
  return {
    startDate: record.startDate ? toDateInputValue(record.startDate) : "",
    endDate: record.endDate ? toDateInputValue(record.endDate) : "",
    totalKm: record.totalKm ? String(record.totalKm) : "",
    businessKm: record.businessKm ? String(record.businessKm) : "",
    fuel: record.fuel.toFixed(2),
    insurance: record.insurance.toFixed(2),
    maintenance: record.maintenance.toFixed(2),
    licenceRegistration: record.licenceRegistration.toFixed(2),
    interestLeasing: record.interestLeasing.toFixed(2),
    parking: record.parking.toFixed(2),
    other: record.other.toFixed(2),
  };
}

/**
 * Read-only summary (mirrors HomeOfficeDetailDialog's own breakdown
 * style) with an edit mode exposing every field, plus a real, permanent
 * delete -- same confirm-dialog pattern ReceiptDetailDialog/
 * TripDetailDialog use.
 */
export function VehicleExpensesDetailDialog({
  record,
  businessKmHint,
  year,
  currency,
  dateFormat,
  onOpenChange,
  onChanged,
}: {
  record: VehicleExpenses | null;
  businessKmHint: number;
  year: string;
  currency: string;
  dateFormat: DateFormat;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<VehicleExpensesForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setEditing(false);
    setForm(record ? toForm(record) : null);
  }, [record]);

  const handleEdit = () => {
    if (record) setForm(toForm(record));
    setEditing(true);
  };

  const handleSave = async () => {
    if (!record || !form) return;
    if (!form.startDate || !form.endDate) {
      toast.error("Set a start and end date for this vehicle period.");
      return;
    }
    setSaving(true);
    try {
      await updateVehicleExpenses(record.id, {
        startDate: new Date(`${form.startDate}T00:00:00`),
        endDate: new Date(`${form.endDate}T00:00:00`),
        ...parseVehicleExpensesForm(form),
      });
      toast.success("Vehicle expenses updated.");
      setEditing(false);
      onOpenChange(false);
      onChanged();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't save changes."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!record) return;
    setDeleting(true);
    try {
      await deleteVehicleExpenses(record.id);
      toast.success("Vehicle expenses deleted.");
      setDeleteOpen(false);
      onOpenChange(false);
      onChanged();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't delete this record."));
    } finally {
      setDeleting(false);
    }
  };

  const liveTotals = form
    ? computeVehicleExpensesTotals(parseVehicleExpensesForm(form))
    : { businessUsePercent: 0, totalVehicleExpenses: 0, totalDeductible: 0 };

  return (
    <>
      <Dialog
        open={record !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(false);
          onOpenChange(open);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {record && (
            <>
              <DialogHeader>
                <DialogTitle>Vehicle expenses</DialogTitle>
                <DialogDescription>
                  {record.startDate && record.endDate
                    ? `${formatDate(record.startDate, dateFormat)} – ${formatDate(record.endDate, dateFormat)}`
                    : year}{" "}
                  · {formatCurrency(record.totalDeductible, currency)} deductible
                </DialogDescription>
              </DialogHeader>

              {editing && form ? (
                <>
                  <VehicleExpensesFields
                    form={form}
                    onChangeField={(patch) =>
                      setForm((prev) => (prev ? { ...prev, ...patch } : prev))
                    }
                    businessKmHint={businessKmHint}
                    year={year}
                    currency={currency}
                    totals={liveTotals}
                  />
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
                </>
              ) : (
                <>
                  <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-black/55">Total km</span>
                      <span className="font-medium text-black">
                        {record.totalKm.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/55">Business km</span>
                      <span className="font-medium text-black">
                        {record.businessKm.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-black/55">Business-use %</span>
                      <span className="font-medium text-black">
                        {record.businessUsePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
                    <div className="flex items-center justify-between text-xs text-black/55">
                      <span>
                        {formatCurrency(record.totalVehicleExpenses, currency)} vehicle expenses ×{" "}
                        {record.businessUsePercent.toFixed(1)}%
                      </span>
                      <span className="font-medium text-black">
                        {formatCurrency(
                          record.totalVehicleExpenses * (record.businessUsePercent / 100),
                          currency,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-black/55">
                      <span>+ Parking (100%, not prorated)</span>
                      <span className="font-medium text-black">
                        {formatCurrency(record.parking, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-black/[0.07] pt-2 text-sm">
                      <span className="font-semibold text-black">
                        Deductible amount (line 9281)
                      </span>
                      <span className="font-semibold text-black">
                        {formatCurrency(record.totalDeductible, currency)}
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
            <DialogTitle>Delete these vehicle expenses?</DialogTitle>
            <DialogDescription>
              This permanently deletes this vehicle expense record. This can't be undone.
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
