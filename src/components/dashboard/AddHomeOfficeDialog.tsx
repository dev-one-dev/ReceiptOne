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
  HomeOfficeFields,
  HomeOfficeSummary,
  blankHomeOfficeForm,
  parseHomeOfficeForm,
  type HomeOfficeForm,
} from "@/components/dashboard/HomeOfficeFields";
import { computeHomeOfficeTotals, createHomeOffice } from "@/integrations/firebase/home-office";
import { errorMessage } from "@/lib/utils";

/**
 * Creates a new homeOffice document for the selected tax year -- mirrors
 * AddVehicleExpensesDialog's shape (wide dialog, fixed header, scrollable
 * fields, pinned summary + Save footer).
 */
export function AddHomeOfficeDialog({
  uid,
  year,
  currency,
  onSaved,
}: {
  uid: string | null;
  year: string;
  currency: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<HomeOfficeForm>(() => blankHomeOfficeForm(year));
  const [saving, setSaving] = useState(false);

  const totals = computeHomeOfficeTotals(parseHomeOfficeForm(form));

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setForm(blankHomeOfficeForm(year));
  };

  const handleSave = async () => {
    if (!uid) {
      toast.error("You need to be signed in to add home office expenses.");
      return;
    }
    if (!form.startWorkDate || !form.endWorkDate) {
      toast.error("Set a start and finish date for this work period.");
      return;
    }
    setSaving(true);
    try {
      await createHomeOffice({
        uid,
        currency,
        ...parseHomeOfficeForm(form),
        // Explicitly after the spread -- parseHomeOfficeForm's own
        // startWorkDate/endWorkDate are `Date | null` (fine for the live
        // preview), but createHomeOffice requires real Dates, and we've
        // already validated both are set above.
        startWorkDate: new Date(`${form.startWorkDate}T00:00:00`),
        endWorkDate: new Date(`${form.endWorkDate}T00:00:00`),
      });
      toast.success("Home office expenses saved.");
      setOpen(false);
      onSaved();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't save home office expenses."));
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
          Add home office period
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-3xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Add home office expenses</DialogTitle>
          <DialogDescription>CRA employment-use-of-home method, for {year}.</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <HomeOfficeFields
            form={form}
            onChangeField={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
            currency={currency}
            totals={totals}
          />
        </div>
        <div className="shrink-0 space-y-4">
          <HomeOfficeSummary totals={totals} currency={currency} />
          <DialogFooter>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Saving…" : "Save home office expenses"}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
