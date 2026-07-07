import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Car, Gauge, MapPin, Plus, Wallet } from "lucide-react";
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
import { TripDetailDialog } from "@/components/dashboard/TripDetailDialog";
import { useDashboardContext, type DistanceUnit } from "@/components/dashboard/DashboardContext";
import { useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";
import { fetchTrips, tripDistance, type Trip } from "@/integrations/firebase/trips";
import { formatCurrency, formatDate, formatDistance, money } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/mileage")({
  component: MileagePage,
});

/**
 * TODO(write-access): purely a UI demo -- doesn't write to Firestore, and
 * its output is intentionally never merged into the real fetched trips
 * list/stats (that would silently inflate a real user's mileage totals
 * with a trip that was never actually saved). Real trip creation would
 * need write access and likely matches the mobile app's GPS-tracking
 * flow -- out of scope for this read-only pass. See README's
 * "Known Limitations" section.
 */
function LogTripDialog({
  distanceUnit,
  mileageRate,
}: {
  distanceUnit: DistanceUnit;
  mileageRate: number;
}) {
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [distance, setDistance] = useState("");

  const reset = () => {
    setPurpose("");
    setFrom("");
    setTo("");
    setDistance("");
  };

  const handleSave = () => {
    const enteredDistance = parseFloat(distance);
    if (!purpose.trim() || !from.trim() || !to.trim() || !enteredDistance || enteredDistance <= 0) {
      toast.error("Fill in purpose, both locations, and a valid distance.");
      return;
    }
    toast.success("Trip logged (demo only — not saved to your account yet).");
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden />
          Log trip
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a trip</DialogTitle>
          <DialogDescription>
            Mileage is calculated at {money(mileageRate)}/{distanceUnit}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-black/55">Purpose</label>
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Client meeting"
              className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-black/55">From</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Home office"
                className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-black/55">To</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Client site"
                className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-black/55">
              Distance ({distanceUnit})
            </label>
            <input
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              inputMode="decimal"
              placeholder="18"
              className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            Save trip
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MileagePage() {
  const { distanceUnit, mileageRate, dateFormat } = useDashboardContext();
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTrips(uid)
      .then((data) => {
        if (!cancelled) setTrips(data);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, "Couldn't load trips."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const totalDistance = trips.reduce((sum, t) => sum + tripDistance(t, distanceUnit), 0);
  const totalAmount = trips.reduce((sum, t) => sum + t.totalPrice, 0);
  const summaryCurrency = trips[0]?.currency ?? "USD";

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">Mileage</h1>
          <p className="mt-1 text-sm text-black/55">Track trips and deductible mileage.</p>
        </div>
        <LogTripDialog distanceUnit={distanceUnit} mileageRate={mileageRate} />
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/55">Total mileage</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <Car className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">
            {formatDistance(totalDistance, distanceUnit)}
          </p>
          <p className="mt-1 text-xs text-black/45">across all trips</p>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/55">Deductible amount</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <Wallet className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">
            {formatCurrency(totalAmount, summaryCurrency)}
          </p>
          <p className="mt-1 text-xs text-black/45">from each trip's recorded rate</p>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/55">Trips logged</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <Gauge className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{trips.length}</p>
          <p className="mt-1 text-xs text-black/45">all time</p>
        </div>
      </div>

      {/* Trip log */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-black">Trip log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-t border-black/[0.07] text-xs text-black/45">
                <th className="px-5 py-2 font-medium">Date</th>
                <th className="px-5 py-2 font-medium">Note</th>
                <th className="px-5 py-2 font-medium">Route</th>
                <th className="px-5 py-2 text-right font-medium">Distance</th>
                <th className="px-5 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading trips…
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                trips.map((t) => (
                  <tr key={t.id} className="border-t border-black/[0.05]">
                    <td className="px-5 py-3 text-black/60">{formatDate(t.date, dateFormat)}</td>
                    <td className="px-5 py-3 font-medium text-black">{t.comment || "—"}</td>
                    <td className="px-5 py-3 text-black/60">
                      <button
                        type="button"
                        onClick={() => setSelectedTrip(t)}
                        className="inline-flex items-center gap-1 rounded-md text-black/60 underline-offset-2 transition-colors hover:text-[#f97316] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f97316]/40"
                      >
                        <MapPin className="size-3.5 text-black/35" aria-hidden />
                        {t.startRoute.name || "—"} → {t.endRoute.name || "—"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-black">
                      {formatDistance(tripDistance(t, distanceUnit), distanceUnit)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-black">
                      {formatCurrency(t.totalPrice, t.currency)}
                    </td>
                  </tr>
                ))}
              {!loading && !error && trips.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    No trips yet — trips logged from the ReceiptOne mobile app will show up here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TripDetailDialog
        trip={selectedTrip}
        distanceUnit={distanceUnit}
        dateFormat={dateFormat}
        onOpenChange={(open) => !open && setSelectedTrip(null)}
      />
    </div>
  );
}
