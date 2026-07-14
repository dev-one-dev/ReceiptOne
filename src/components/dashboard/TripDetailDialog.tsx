import { useState } from "react";
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
import { RouteMap } from "@/components/dashboard/RouteMap";
import type { DateFormat, DistanceUnit } from "@/components/dashboard/DashboardContext";
import {
  deleteTrip,
  formatLocation,
  recolorRouteMap,
  tripDistance,
  updateTrip,
  type Trip,
} from "@/integrations/firebase/trips";
import { formatCurrency, formatDate, formatDistance } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

type TripEditForm = {
  date: string;
  comment: string;
  /** One-way distance, in the trip's own recordedUnit -- never the current Settings display unit, since the unit a trip was recorded in is fixed. */
  distance: string;
  roundTrip: boolean;
  isReimbursable: boolean;
};

/**
 * Read-only detail view (route map, addresses, rate, currency -- never
 * editable through this dialog), with an edit mode for date, comment,
 * one-way distance, round trip, and reimbursable, plus a real,
 * permanent delete. Both mutations call `onChanged` on success so the
 * caller (Mileage page) refetches from Firestore -- this dialog never
 * holds its own source of truth beyond the `trip` prop it's given.
 */
export function TripDetailDialog({
  trip,
  distanceUnit,
  dateFormat,
  onOpenChange,
  onChanged,
}: {
  trip: Trip | null;
  distanceUnit: DistanceUnit;
  dateFormat: DateFormat;
  onOpenChange: (open: boolean) => void;
  /** Omit to keep this dialog read-only -- edit/delete only render when this is provided. */
  onChanged?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<TripEditForm | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    if (!trip) return;
    setEditForm({
      date: toDateInputValue(trip.date),
      comment: trip.comment,
      distance: String(trip.recordedUnit === "mi" ? trip.mileageMi : trip.mileageKm),
      roundTrip: trip.roundTrip,
      isReimbursable: trip.isReimbursable,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!trip || !editForm) return;
    setSaving(true);
    try {
      await updateTrip(trip.id, {
        date: editForm.date ? new Date(`${editForm.date}T00:00:00`) : trip.date,
        comment: editForm.comment,
        roundTrip: editForm.roundTrip,
        isReimbursable: editForm.isReimbursable,
        distance: parseFloat(editForm.distance) || 0,
        recordedUnit: trip.recordedUnit === "mi" ? "mi" : "km",
        rate: trip.rate,
      });
      toast.success("Trip updated.");
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
    if (!trip) return;
    setDeleting(true);
    try {
      await deleteTrip(trip.id);
      toast.success("Trip deleted.");
      setDeleteOpen(false);
      onOpenChange(false);
      onChanged?.();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't delete this trip."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={trip !== null}
      onOpenChange={(open) => {
        if (!open) setEditing(false);
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        {trip && (
          <>
            <DialogHeader>
              <DialogTitle>
                {trip.startRoute.name || "Start"} → {trip.endRoute.name || "End"}
              </DialogTitle>
              <DialogDescription>
                {formatDate(trip.date, dateFormat)} ·{" "}
                {formatDistance(tripDistance(trip, distanceUnit), distanceUnit)} ·{" "}
                {formatCurrency(trip.totalPrice, trip.currency)}
              </DialogDescription>
            </DialogHeader>

            {trip.routeMapUrl ? (
              <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-[#faf9f6]">
                <img
                  src={recolorRouteMap(trip.routeMapUrl)}
                  alt={`Route from ${trip.startRoute.name || "start"} to ${trip.endRoute.name || "end"}`}
                  className="block w-full"
                  loading="lazy"
                />
              </div>
            ) : (
              <RouteMap
                origin={trip.startRoute.name || "Start"}
                destination={trip.endRoute.name || "End"}
              />
            )}

            <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="shrink-0 text-black/55">From</span>
                <span className="text-right font-medium text-black">
                  {formatLocation(trip.startRoute) || "—"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="shrink-0 text-black/55">To</span>
                <span className="text-right font-medium text-black">
                  {formatLocation(trip.endRoute) || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/55">Rate</span>
                <span className="font-medium text-black">
                  {formatCurrency(trip.rate, trip.currency)}/{trip.recordedUnit}
                </span>
              </div>
            </div>
            <p className="text-xs text-black/40">
              Rate recorded when this trip was logged — not recalculated from your current Settings
              rate.
            </p>

            {editing && editForm ? (
              <>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-black/55">Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="h-9 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-black/55">
                      Distance ({trip.recordedUnit})
                    </label>
                    <input
                      value={editForm.distance}
                      onChange={(e) => setEditForm({ ...editForm, distance: e.target.value })}
                      inputMode="decimal"
                      className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-black/55">Comment</label>
                    <input
                      value={editForm.comment}
                      onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                      className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-black/70">
                    <input
                      type="checkbox"
                      checked={editForm.roundTrip}
                      onChange={(e) => setEditForm({ ...editForm, roundTrip: e.target.checked })}
                      className="size-3.5 rounded border-black/20"
                    />
                    Round trip
                  </label>
                  <label className="flex items-center gap-2 text-sm text-black/70">
                    <input
                      type="checkbox"
                      checked={editForm.isReimbursable}
                      onChange={(e) =>
                        setEditForm({ ...editForm, isReimbursable: e.target.checked })
                      }
                      className="size-3.5 rounded border-black/20"
                    />
                    Reimbursable
                  </label>
                </div>
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
                {(trip.roundTrip || trip.isReimbursable) && (
                  <div className="flex items-center gap-2">
                    {trip.roundTrip && (
                      <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-medium text-black/60">
                        Round trip
                      </span>
                    )}
                    {trip.isReimbursable && (
                      <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-medium text-black/60">
                        Reimbursable
                      </span>
                    )}
                  </div>
                )}

                {trip.comment && (
                  <p className="rounded-xl bg-black/[0.03] px-4 py-3 text-sm text-black/70">
                    {trip.comment}
                  </p>
                )}

                {onChanged && (
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
                )}
              </>
            )}
          </>
        )}
      </DialogContent>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this trip?</DialogTitle>
            <DialogDescription>
              This permanently deletes the trip from your account. This can't be undone.
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
              {deleting ? "Deleting…" : "Delete trip"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
