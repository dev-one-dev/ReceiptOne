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

export const Route = createFileRoute("/dashboard/mileage")({
  component: MileagePage,
});

type Trip = {
  date: string;
  purpose: string;
  from: string;
  to: string;
  distance: string;
  amount: string;
};

const INITIAL_TRIPS: Trip[] = [
  { date: "Jul 2", purpose: "Client meeting", from: "Home office", to: "Downtown office", distance: "18 mi", amount: "$11.34" },
  { date: "Jun 28", purpose: "Supply run", from: "Home office", to: "Staples", distance: "9 mi", amount: "$5.67" },
  { date: "Jun 24", purpose: "Client meeting", from: "Home office", to: "Client site", distance: "32 mi", amount: "$20.16" },
  { date: "Jun 20", purpose: "Bank deposit", from: "Home office", to: "Bank branch", distance: "6 mi", amount: "$3.78" },
  { date: "Jun 14", purpose: "Client meeting", from: "Home office", to: "Downtown office", distance: "18 mi", amount: "$11.34" },
];

const RATE_PER_MILE = 0.63;

function LogTripDialog({ onAdd }: { onAdd: (trip: Trip) => void }) {
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
    const miles = parseFloat(distance);
    if (!purpose.trim() || !from.trim() || !to.trim() || !miles || miles <= 0) {
      toast.error("Fill in purpose, both locations, and a valid distance.");
      return;
    }
    onAdd({
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      purpose: purpose.trim(),
      from: from.trim(),
      to: to.trim(),
      distance: `${miles} mi`,
      amount: `$${(miles * RATE_PER_MILE).toFixed(2)}`,
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
          <DialogDescription>Mileage is calculated at ${RATE_PER_MILE.toFixed(2)}/mile.</DialogDescription>
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
            <label className="block text-xs font-medium text-black/55">Distance (miles)</label>
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
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);

  const totalMiles = trips.reduce((sum, t) => sum + parseFloat(t.distance), 0);
  const totalAmount = trips.reduce((sum, t) => sum + parseFloat(t.amount.replace("$", "")), 0);

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">Mileage</h1>
          <p className="mt-1 text-sm text-black/55">Track trips and deductible mileage.</p>
        </div>
        <LogTripDialog onAdd={(trip) => setTrips((prev) => [trip, ...prev])} />
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
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{totalMiles.toFixed(0)} mi</p>
          <p className="mt-1 text-xs text-black/45">this year</p>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-black/55">Deductible amount</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <Wallet className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">${totalAmount.toFixed(2)}</p>
          <p className="mt-1 text-xs text-black/45">at ${RATE_PER_MILE.toFixed(2)}/mile</p>
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
              {trips.map((t, i) => (
                <tr key={`${t.date}-${t.purpose}-${i}`} className="border-t border-black/[0.05]">
                  <td className="px-5 py-3 text-black/60">{t.date}</td>
                  <td className="px-5 py-3 font-medium text-black">{t.purpose}</td>
                  <td className="px-5 py-3 text-black/60">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-black/35" aria-hidden />
                      {t.from} → {t.to}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-black">{t.distance}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-black">{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
