import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Car,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Gauge,
  MapPin,
  Plus,
  Wallet,
} from "lucide-react";
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
  getAutocompletePredictions,
  getDirections,
  getPlaceDetails,
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

/**
 * Drives one From/To field: a debounced AutocompleteService predictions
 * fetch as the user types, a manually-rendered predictions list (a
 * normal sibling in the component tree, never portaled to
 * document.body), and its own click-outside/Escape handling done in
 * plain React/DOM -- deliberately not the google.maps.places.Autocomplete
 * widget, whose body-appended dropdown fights Radix Dialog's focus trap
 * when the field lives inside a modal.
 */
function usePlaceAutocompleteField(mapsReady: boolean) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<RouteLocation | null>(null);
  const tokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapsReady || !query.trim() || place) {
      setPredictions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!tokenRef.current) {
        tokenRef.current = new google.maps.places.AutocompleteSessionToken();
      }
      getAutocompletePredictions(query, tokenRef.current).then((results) => {
        if (!cancelled) setPredictions(results);
      });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, place, mapsReady]);

  // Plain DOM click-outside, scoped to this field's own wrapper -- not
  // Radix machinery, so it can't be affected by (or interfere with) the
  // Dialog's own outside-interaction/focus handling.
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const onInputChange = (value: string) => {
    setQuery(value);
    setPlace(null);
    setOpen(true);
  };

  const select = async (prediction: google.maps.places.AutocompletePrediction) => {
    setOpen(false);
    setPredictions([]);
    const details = await getPlaceDetails(prediction.place_id, tokenRef.current ?? undefined);
    tokenRef.current = null;
    if (!details) {
      toast.error("Couldn't load that address — try again or enter details manually.");
      setQuery(prediction.description);
      return;
    }
    const location = placeToRouteLocation(details);
    setQuery(location.name || prediction.description);
    setPlace(location);
  };

  const reset = () => {
    setQuery("");
    setPredictions([]);
    setOpen(false);
    setPlace(null);
    tokenRef.current = null;
  };

  return { query, predictions, open, setOpen, place, wrapperRef, onInputChange, select, reset };
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
 * Writes a real document to the `routes` collection. From/To use a
 * manually-rendered predictions list (see usePlaceAutocompleteField),
 * not the google.maps.places.Autocomplete widget, since that widget's
 * body-portaled dropdown fights Radix Dialog's focus trap. Driving
 * distance and a Static Maps route image are calculated automatically
 * once both ends resolve to a real place. Any failure along that path
 * (script load, no place selected, no route found) is non-fatal:
 * distance stays a normal editable field and the trip still saves with
 * plain-text names and no map, exactly like before this feature
 * existed.
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
  const [calculatingDistance, setCalculatingDistance] = useState(false);
  const [routeMapUrl, setRouteMapUrl] = useState("");

  const fromField = usePlaceAutocompleteField(mapsReady);
  const toField = usePlaceAutocompleteField(mapsReady);

  const reset = () => {
    setPurpose("");
    setDistance("");
    setDate(todayInputValue());
    setRoundTrip(false);
    setRouteMapUrl("");
    setCalculatingDistance(false);
    fromField.reset();
    toField.reset();
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

  // Auto-calculates distance + route map the moment both ends resolve
  // to a real geocoded place. Never blocks: on any failure the distance
  // field just stays whatever the user last typed, editable as normal.
  useEffect(() => {
    const origin = fromField.place?.location;
    const destination = toField.place?.location;
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
  }, [fromField.place, toField.place, distanceUnit]);

  const handleSave = async () => {
    const fromName = fromField.query.trim();
    const toName = toField.query.trim();
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
    const startRoute: RouteLocation = fromField.place ?? { ...EMPTY_LOCATION, name: fromName };
    const endRoute: RouteLocation = toField.place ?? { ...EMPTY_LOCATION, name: toName };
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
              <div ref={fromField.wrapperRef} className="relative">
                <input
                  value={fromField.query}
                  onChange={(e) => fromField.onInputChange(e.target.value)}
                  onFocus={() => fromField.predictions.length > 0 && fromField.setOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && fromField.open) {
                      e.stopPropagation();
                      fromField.setOpen(false);
                    }
                  }}
                  placeholder="Start typing an address…"
                  className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                />
                {fromField.open && fromField.predictions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
                    {fromField.predictions.map((p) => (
                      <button
                        key={p.place_id}
                        type="button"
                        onClick={() => fromField.select(p)}
                        className="block w-full px-3 py-2 text-left text-sm text-black hover:bg-black/5"
                      >
                        {p.description}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-black/55">To</label>
              <div ref={toField.wrapperRef} className="relative">
                <input
                  value={toField.query}
                  onChange={(e) => toField.onInputChange(e.target.value)}
                  onFocus={() => toField.predictions.length > 0 && toField.setOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && toField.open) {
                      e.stopPropagation();
                      toField.setOpen(false);
                    }
                  }}
                  placeholder="Start typing an address…"
                  className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                />
                {toField.open && toField.predictions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
                    {toField.predictions.map((p) => (
                      <button
                        key={p.place_id}
                        type="button"
                        onClick={() => toField.select(p)}
                        className="block w-full px-3 py-2 text-left text-sm text-black hover:bg-black/5"
                      >
                        {p.description}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

type SortColumn = "date" | "distance" | "amount";
type SortDirection = "asc" | "desc";

/** Small ▲/▼ sort indicator for a clickable <th> -- neutral ChevronsUpDown when this isn't the active sort column, a filled Chevron pointing the active direction when it is. */
function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ChevronsUpDown className="size-3.5 text-black/25" aria-hidden />;
  return direction === "asc" ? (
    <ChevronUp className="size-3.5 text-black" aria-hidden />
  ) : (
    <ChevronDown className="size-3.5 text-black" aria-hidden />
  );
}

function MileagePage() {
  const { distanceUnit, mileageRate, dateFormat, year } = useDashboardContext();
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const loadTrips = (targetUid: string) => {
    setLoading(true);
    setError(null);
    return fetchTrips(targetUid, year)
      .then((data) => setTrips(data))
      .catch((e) => setError(errorMessage(e, "Couldn't load trips.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTrips(uid, year)
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
  }, [uid, year]);

  const totalDistance = trips.reduce((sum, t) => sum + tripDistance(t, distanceUnit), 0);
  const totalAmount = trips.reduce((sum, t) => sum + t.totalPrice, 0);
  const summaryCurrency = trips[0]?.currency ?? "USD";

  const sortedTrips = sortColumn
    ? [...trips].sort((a, b) => {
        const cmp =
          sortColumn === "date"
            ? a.date.getTime() - b.date.getTime()
            : sortColumn === "distance"
              ? tripDistance(a, distanceUnit) - tripDistance(b, distanceUnit)
              : a.totalPrice - b.totalPrice;
        return sortDirection === "asc" ? cmp : -cmp;
      })
    : trips;

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
                <th
                  onClick={() => handleSort("date")}
                  className="cursor-pointer select-none px-5 py-2 font-medium transition-colors hover:text-black"
                >
                  <span className="inline-flex items-center gap-1">
                    Date
                    <SortIcon active={sortColumn === "date"} direction={sortDirection} />
                  </span>
                </th>
                <th className="px-5 py-2 font-medium">Note</th>
                <th className="px-5 py-2 font-medium">Route</th>
                <th
                  onClick={() => handleSort("distance")}
                  className="cursor-pointer select-none px-5 py-2 text-right font-medium transition-colors hover:text-black"
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    Distance
                    <SortIcon active={sortColumn === "distance"} direction={sortDirection} />
                  </span>
                </th>
                <th
                  onClick={() => handleSort("amount")}
                  className="cursor-pointer select-none px-5 py-2 text-right font-medium transition-colors hover:text-black"
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    Amount
                    <SortIcon active={sortColumn === "amount"} direction={sortDirection} />
                  </span>
                </th>
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
                sortedTrips.map((t) => (
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
                    {`No trips for ${year} yet — trips logged from the ReceiptOne mobile app will show up here.`}
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
        onChanged={() => uid && loadTrips(uid)}
      />
    </div>
  );
}
