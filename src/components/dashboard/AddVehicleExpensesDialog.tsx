import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  VehicleExpensesFields,
  VehicleExpensesSummary,
  blankVehicleExpensesForm,
  parseVehicleExpensesForm,
  type VehicleExpensesForm,
} from "@/components/dashboard/VehicleExpensesFields";
import {
  computeVehicleExpensesTotals,
  createVehicleExpenses,
} from "@/integrations/firebase/vehicle-expenses";
import { errorMessage } from "@/lib/utils";

/**
 * Creates a new vehicleExpenses document for the selected tax year --
 * defaults the period to the full calendar year (editable, for a
 * partial-year vehicle) and pre-fills business km from the trips
 * logbook, per computeVehicleExpensesTotals' own doc comment: a hint,
 * never silently overwritten once the user has their own figure.
 */
export function AddVehicleExpensesDialog({
  uid,
  year,
  businessKmHint,
  currency,
  onSaved,
}: {
  uid: string | null;
  year: string;
  businessKmHint: number;
  currency: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<VehicleExpensesForm>(() =>
    blankVehicleExpensesForm(`${year}-01-01`, `${year}-12-31`, businessKmHint),
  );
  const [saving, setSaving] = useState(false);

  const totals = computeVehicleExpensesTotals(parseVehicleExpensesForm(form));

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setForm(blankVehicleExpensesForm(`${year}-01-01`, `${year}-12-31`, businessKmHint));
  };

  const handleSave = async () => {
    if (!uid) {
      toast.error("You need to be signed in to add vehicle expenses.");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Set a start and end date for this vehicle period.");
      return;
    }
    setSaving(true);
    try {
      await createVehicleExpenses({
        uid,
        forYear: year,
        ...parseVehicleExpensesForm(form),
        // Explicitly after the spread -- parseVehicleExpensesForm's own
        // startDate/endDate are `Date | null` (fine for the live
        // preview), but createVehicleExpenses requires real Dates, and
        // we've already validated both are set above.
        startDate: new Date(`${form.startDate}T00:00:00`),
        endDate: new Date(`${form.endDate}T00:00:00`),
      });
      toast.success("Vehicle expenses saved.");
      setOpen(false);
      onSaved();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't save vehicle expenses."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-black/5"
        >
          <Plus className="size-4" aria-hidden />
          Add vehicle period
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Add vehicle expenses</DialogTitle>
          <DialogDescription>
            CRA Chart A method — actual costs × business-use %, for {year}.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <VehicleExpensesFields
            form={form}
            onChangeField={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            businessKmHint={businessKmHint}
            year={year}
            currency={currency}
            totals={totals}
          />
        </div>
        <div className="shrink-0 space-y-4">
          <VehicleExpensesSummary form={form} totals={totals} currency={currency} />
          <DialogFooter>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Saving…" : "Save vehicle expenses"}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
