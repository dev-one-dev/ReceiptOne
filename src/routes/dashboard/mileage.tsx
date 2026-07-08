import { useEffect, useRef, useState } from "react";
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
import {
  buildStaticMapUrl,
  getDirections,
  loadGoogleMaps,
} from "@/integrations/google-maps/loader";
import {
  createTrip,
  fetchTrips,
  tripDistance,
  type RouteLocation,
  type Trip,
} from "@/integrations/firebase/trips";
import { formatCurrency, formatDate, formatDistance, kmToMi, money } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

const EMPTY_LOCATION: Omit<RouteLocation, "name"> = {
  address: "",
  city: "",
  country: "",
  state: "",
  zipCode: "",
  location: null,
};

/**
 * Maps a Places Autocomplete result to our RouteLocation shape. Only
 * requests the fields we actually use (address_components, geometry,
 * name, formatted_address) to keep each Autocomplete selection cheap.
 */
function placeToRouteLocation(place: google.maps.places.PlaceResult): RouteLocation {
  const components = place.address_components ?? [];
  const component = (type: string, useShortName = false) => {
    const match = components.find((c) => c.types.includes(type));
    if (!match) return "";
    return useShortName ? match.short_name : match.long_name;
  };
  const address = [component("street_number"), component("route")].filter(Boolean).join(" ");
  const lat = place.geometry?.location?.lat();
  const lng = place.geometry?.location?.lng();
  return {
    address,
    city: component("locality") || component("postal_town") || component("sublocality"),
    state: component("administrative_area_level_1", true),
    zipCode: component("postal_code"),
    country: component("country"),
    name: place.name || place.formatted_address || "",
    location: typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null,
  };
}

function todayInputValue(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const Route = createFileRoute("/dashboard/mileage")({
  component: MileagePage,
});

/**
 * Writes a real document to the `routes` collection. From/To are Places
 * Autocomplete-backed (uncontrolled inputs -- Autocomplete mutates the
 * DOM value directly when a suggestion is picked, so controlled React
 * state would fight it) with driving distance and a Static Maps route
 * image calculated automatically once both are selected. Any failure
 * along that path (script load, no place selected, no route found) is
 * non-fatal: distance stays a normal editable field and the trip still
 * saves with plain-text names and no map, exactly like before this
 * feature existed.
 */
function LogTripDialog({
  uid,
  distanceUnit,
  mileageRate,
  currency,
  onSaved,
}: {
  uid: string | null;
  distanceUnit: DistanceUnit;
  mileageRate: number;
  currency: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState(todayInputValue());
  const [roundTrip, setRoundTrip] = useState(false);
  const [saving, setSaving] = useState(false);

  const [mapsReady, setMapsReady] = useState(false);
  const [fromPlace, setFromPlace] = useState<RouteLocation | null>(null);
  const [toPlace, setToPlace] = useState<RouteLocation | null>(null);
  const [calculatingDistance, setCalculatingDistance] = useState(false);
  const [routeMapUrl, setRouteMapUrl] = useState("");

  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setPurpose("");
    setDistance("");
    setDate(todayInputValue());
    setRoundTrip(false);
    setFromPlace(null);
    setToPlace(null);
    setRouteMapUrl("");
    setCalculatingDistance(false);
    if (fromInputRef.current) fromInputRef.current.value = "";
    if (toInputRef.current) toInputRef.current.value = "";
  };

  // Loads the Maps script only while the dialog is open (no reason to
  // pay for it on every page load), and only once per dialog session.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (!cancelled) setMapsReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setMapsReady(false);
          toast.error("Address autocomplete unavailable — enter locations and distance manually.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Attaches Autocomplete once the script is ready and the dialog's
  // inputs exist in the DOM (Radix unmounts DialogContent while closed,
  // so this can't run until both open and mapsReady are true).
  useEffect(() => {
    if (!open || !mapsReady || !fromInputRef.current || !toInputRef.current) return;

    const fields = ["address_components", "geometry", "name", "formatted_address"];
    const fromAutocomplete = new google.maps.places.Autocomplete(fromInputRef.current, {
      fields,
    });
    const toAutocomplete = new google.maps.places.Autocomplete(toInputRef.current, { fields });

    fromAutocomplete.addListener("place_changed", () => {
      setFromPlace(placeToRouteLocation(fromAutocomplete.getPlace()));
    });
    toAutocomplete.addListener("place_changed", () => {
      setToPlace(placeToRouteLocation(toAutocomplete.getPlace()));
    });

    return () => {
      google.maps.event.clearInstanceListeners(fromAutocomplete);
      google.maps.event.clearInstanceListeners(toAutocomplete);
    };
  }, [open, mapsReady]);

  // Auto-calculates distance + route map the moment both ends resolve
  // to a real geocoded place. Never blocks: on any failure the distance
  // field just stays whatever the user last typed, editable as normal.
  useEffect(() => {
    const origin = fromPlace?.location;
    const destination = toPlace?.location;
    if (!origin || !destination) return;
    let cancelled = false;
    setCalculatingDistance(true);
    getDirections(origin, destination)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          toast.error("Couldn't calculate distance automatically — enter it manually.");
          return;
        }
        const km = result.distanceMeters / 1000;
        setDistance((distanceUnit === "km" ? km : kmToMi(km)).toFixed(1));
        const mapUrl = buildStaticMapUrl(origin, destination, result.encodedPolyline);
        if (mapUrl) setRouteMapUrl(mapUrl);
      })
      .finally(() => {
        if (!cancelled) setCalculatingDistance(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fromPlace, toPlace, distanceUnit]);

  const handleSave = async () => {
    const fromName = fromInputRef.current?.value.trim() ?? "";
    const toName = toInputRef.current?.value.trim() ?? "";
    const enteredDistance = parseFloat(distance);
    if (!purpose.trim() || !fromName || !toName || !enteredDistance || enteredDistance <= 0) {
      toast.error("Fill in purpose, both locations, and a valid distance.");
      return;
    }
    if (!uid) {
      toast.error("You need to be signed in to log a trip.");
      return;
    }
    const tripDate = date ? new Date(`${date}T00:00:00`) : new Date();
    const startRoute: RouteLocation = fromPlace ?? { ...EMPTY_LOCATION, name: fromName };
    const endRoute: RouteLocation = toPlace ?? { ...EMPTY_LOCATION, name: toName };
    setSaving(true);
    try {
      await createTrip({
        uid,
        comment: purpose.trim(),
        startRoute,
        endRoute,
        date: tripDate,
        distance: enteredDistance,
        unit: distanceUnit,
        roundTrip,
        rate: mileageRate,
        currency,
        routeMapUrl,
      });
      toast.success("Trip logged.");
      reset();
      setOpen(false);
      onSaved();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't save this trip."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
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
                ref={fromInputRef}
                placeholder="Start typing an address…"
                className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-black/55">To</label>
              <input
                ref={toInputRef}
                placeholder="Start typing an address…"
                className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-black/55">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-black/55">
                Distance ({distanceUnit}){calculatingDistance ? " — calculating…" : ""}
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
          <label className="flex items-center gap-2 text-xs font-medium text-black/55">
            <input
              type="checkbox"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
              className="size-3.5 rounded border-black/20"
            />
            Round trip (doubles the distance above)
          </label>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
          >
            {saving ? "Saving…" : "Save trip"}
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

  const loadTrips = (targetUid: string) => {
    setLoading(true);
    setError(null);
    return fetchTrips(targetUid)
      .then((data) => setTrips(data))
      .catch((e) => setError(errorMessage(e, "Couldn't load trips.")))
      .finally(() => setLoading(false));
  };

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
        <LogTripDialog
          uid={uid}
          distanceUnit={distanceUnit}
          mileageRate={mileageRate}
          currency={summaryCurrency}
          onSaved={() => uid && loadTrips(uid)}
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
