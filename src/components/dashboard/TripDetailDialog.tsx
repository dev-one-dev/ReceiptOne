import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RouteMap } from "@/components/dashboard/RouteMap";
import type { DateFormat, DistanceUnit } from "@/components/dashboard/DashboardContext";
import {
  formatLocation,
  recolorRouteMap,
  tripDistance,
  type Trip,
} from "@/integrations/firebase/trips";
import { formatCurrency, formatDate, formatDistance } from "@/lib/dashboard-format";

/**
 * Read-only -- Stage 4 wires real Firestore trips for display only, no
 * editing/deleting yet. Shows the fields without a slot in the main
 * table: full addresses, per-trip rate, round-trip/reimbursable flags,
 * comment, and the real route map (recolored to brand for display only).
 */
export function TripDetailDialog({
  trip,
  distanceUnit,
  dateFormat,
  onOpenChange,
}: {
  trip: Trip | null;
  distanceUnit: DistanceUnit;
  dateFormat: DateFormat;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={trip !== null} onOpenChange={onOpenChange}>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
