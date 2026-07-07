import { useState } from "react";
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
import { RouteMap } from "@/components/dashboard/RouteMap";
import { useDashboardContext, type DateFormat, type DistanceUnit } from "@/components/dashboard/DashboardContext";
import { distanceInUnit, formatDate, formatDistance, miToKm, mkDate, money } from "@/lib/dashboard-format";

export const Route = createFileRoute("/dashboard/mileage")({
  component: MileagePage,
});

// Distance is stored canonically in km; display converts to the unit
// selected in Settings so switching units re-renders every trip and total.
type Trip = {
  date: Date;
  purpose: string;
  from: string;
  to: string;
  distanceKm: number;
};

type TripDisplay = Trip & { distanceValue: number; amount: number };

const INITIAL_TRIPS: Trip[] = [
  { date: mkDate(2026, 7, 2), purpose: "Client meeting", from: "Home office", to: "Downtown office", distanceKm: 18 },
  { date: mkDate(2026, 6, 28), purpose: "Supply run", from: "Home office", to: "Staples", distanceKm: 9 },
  { date: mkDate(2026, 6, 24), purpose: "Client meeting", from: "Home office", to: "Client site", distanceKm: 32 },
  { date: mkDate(2026, 6, 20), purpose: "Bank deposit", from: "Home office", to: "Bank branch", distanceKm: 6 },
  { date: mkDate(2026, 6, 14), purpose: "Client meeting", from: "Home office", to: "Downtown office", distanceKm: 18 },
];

function toDisplay(trip: Trip, distanceUnit: DistanceUnit, mileageRate: number): TripDisplay {
  const distanceValue = distanceInUnit(trip.distanceKm, distanceUnit);
  return { ...trip, distanceValue, amount: distanceValue * mileageRate };
}

function LogTripDialog({
  distanceUnit,
  mileageRate,
  onAdd,
}: {
  distanceUnit: DistanceUnit;
  mileageRate: number;
  onAdd: (trip: Trip) => void;
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
    onAdd({
      date: new Date(),
      purpose: purpose.trim(),
      from: from.trim(),
      to: to.trim(),
      distanceKm: distanceUnit === "km" ? enteredDistance : miToKm(enteredDistance),
    });
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
          <DialogDescription>Mileage is calculated at {money(mileageRate)}/{distanceUnit}.</DialogDescription>
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
            <label className="block text-xs font-medium text-black/55">Distance ({distanceUnit})</label>
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

function RouteMapDialog({
  trip,
  distanceUnit,
  dateFormat,
  onOpenChange,
}: {
  trip: TripDisplay | null;
  distanceUnit: DistanceUnit;
  dateFormat: DateFormat;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={trip !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Trip route</DialogTitle>
          <DialogDescription>
            {trip ? `${trip.purpose} — ${formatDate(trip.date, dateFormat)}` : ""}
          </DialogDescription>
        </DialogHeader>
        {trip && (
          <>
            <RouteMap origin={trip.from} destination={trip.to} />
            <div className="flex items-center justify-between rounded-xl bg-black/[0.03] px-4 py-3 text-sm">
              <span className="inline-flex items-center gap-1.5 text-black/60">
                <MapPin className="size-3.5 text-black/35" aria-hidden />
                {trip.from} → {trip.to}
              </span>
              <span className="tabular-nums font-medium text-black">
                {formatDistance(trip.distanceValue, distanceUnit)} · {money(trip.amount)}
              </span>
            </div>
            <p className="text-xs text-black/40">
              Preview only — this will show your actual route once trips sync from the ReceiptOne mobile app.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MileagePage() {
  const { distanceUnit, mileageRate, dateFormat } = useDashboardContext();
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const displayTrips = trips.map((t) => toDisplay(t, distanceUnit, mileageRate));
  const selectedTripDisplay = selectedTrip ? toDisplay(selectedTrip, distanceUnit, mileageRate) : null;

  const totalDistance = displayTrips.reduce((sum, t) => sum + t.distanceValue, 0);
  const totalAmount = displayTrips.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">Mileage</h1>
          <p className="mt-1 text-sm text-black/55">Track trips and deductible mileage.</p>
        </div>
        <LogTripDialog
          distanceUnit={distanceUnit}
          mileageRate={mileageRate}
          onAdd={(trip) => setTrips((prev) => [trip, ...prev])}
        />
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
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{formatDistance(totalDistance, distanceUnit)}</p>
          <p className="mt-1 text-xs text-black/45">this year</p>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/55">Deductible amount</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <Wallet className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{money(totalAmount)}</p>
          <p className="mt-1 text-xs text-black/45">at {money(mileageRate)}/{distanceUnit}</p>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/55">Trips logged</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <Gauge className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{trips.length}</p>
          <p className="mt-1 text-xs text-black/45">this year</p>
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
                <th className="px-5 py-2 font-medium">Purpose</th>
                <th className="px-5 py-2 font-medium">Route</th>
                <th className="px-5 py-2 text-right font-medium">Distance</th>
                <th className="px-5 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {displayTrips.map((t, i) => (
                <tr key={`${t.date.toISOString()}-${t.purpose}-${i}`} className="border-t border-black/[0.05]">
                  <td className="px-5 py-3 text-black/60">{formatDate(t.date, dateFormat)}</td>
                  <td className="px-5 py-3 font-medium text-black">{t.purpose}</td>
                  <td className="px-5 py-3 text-black/60">
                    <button
                      type="button"
                      onClick={() => setSelectedTrip(trips[i])}
                      className="inline-flex items-center gap-1 rounded-md text-black/60 underline-offset-2 transition-colors hover:text-[#f97316] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f97316]/40"
                    >
                      <MapPin className="size-3.5 text-black/35" aria-hidden />
                      {t.from} → {t.to}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-black">{formatDistance(t.distanceValue, distanceUnit)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-black">{money(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RouteMapDialog
        trip={selectedTripDisplay}
        distanceUnit={distanceUnit}
        dateFormat={dateFormat}
        onOpenChange={(open) => !open && setSelectedTrip(null)}
      />
    </div>
  );
}
