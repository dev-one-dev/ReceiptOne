import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  GeoPoint,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import type { DistanceUnit } from "@/components/dashboard/DashboardContext";
import { kmToMi, miToKm } from "@/lib/dashboard-format";

export type RouteLocation = {
  address: string;
  city: string;
  country: string;
  name: string;
  state: string;
  zipCode: string;
  /** Real trip documents always carry this (a Firestore GeoPoint); null here means a web-logged trip where geocoding wasn't available. */
  location: { lat: number; lng: number } | null;
};

/**
 * Mirrors the real `routes` collection written by the mobile app --
 * (named "trips" here, not "routes", to avoid colliding with this app's
 * own src/lib/routes.ts page-path constants). Mostly read-only, except
 * for `createTrip` below, which is this app's first real Firestore
 * write.
 */
export type Trip = {
  id: string;
  comment: string;
  createdAt: Date;
  createdBy: string;
  currency: string;
  date: Date;
  /** The unit `rate` was actually recorded in for this trip (e.g. "km") -- not necessarily the same as Settings' current display unit. */
  recordedUnit: string;
  startRoute: RouteLocation;
  endRoute: RouteLocation;
  isReimbursable: boolean;
  mileageKm: number;
  mileageKmRoundTrip: number;
  mileageMi: number;
  mileageMiRoundTrip: number;
  rate: number;
  roundTrip: boolean;
  routeMapUrl: string;
  totalPrice: number;
};

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date(0);
}

function toLocation(value: unknown): RouteLocation {
  const v = (value ?? {}) as Record<string, unknown>;
  return {
    address: typeof v.address === "string" ? v.address : "",
    city: typeof v.city === "string" ? v.city : "",
    country: typeof v.country === "string" ? v.country : "",
    name: typeof v.name === "string" ? v.name : "",
    state: typeof v.state === "string" ? v.state : "",
    zipCode: typeof v.zip_code === "string" ? v.zip_code : "",
    location:
      v.location instanceof GeoPoint
        ? { lat: v.location.latitude, lng: v.location.longitude }
        : null,
  };
}

function toTrip(id: string, data: Record<string, unknown>): Trip {
  return {
    id,
    comment: typeof data.comment === "string" ? data.comment : "",
    createdAt: toDate(data.created_at),
    createdBy: typeof data.created_by === "string" ? data.created_by : "",
    currency: typeof data.currency === "string" ? data.currency : "USD",
    date: toDate(data.date),
    recordedUnit: typeof data.distance === "string" ? data.distance : "km",
    startRoute: toLocation(data.start_route),
    endRoute: toLocation(data.end_route),
    isReimbursable: Boolean(data.is_reimbursable),
    mileageKm: typeof data.mileage === "number" ? data.mileage : 0,
    mileageKmRoundTrip:
      typeof data.mileage_km_RoundTrip === "number" ? data.mileage_km_RoundTrip : 0,
    mileageMi: typeof data.mileage_ml === "number" ? data.mileage_ml : 0,
    mileageMiRoundTrip:
      typeof data.mileage_ml_RoundTrip === "number" ? data.mileage_ml_RoundTrip : 0,
    rate: typeof data.rate === "number" ? data.rate : 0,
    roundTrip: Boolean(data.round_trip),
    routeMapUrl: typeof data.routeMap === "string" ? data.routeMap : "",
    totalPrice: typeof data.total_price === "number" ? data.total_price : 0,
  };
}

/**
 * Fetches the signed-in user's own trips, newest first -- matches the
 * security rules' `created_by == request.auth.uid` scoping. `year`
 * (optional) filters client-side by each trip's own `date` field, same
 * fetch-then-filter pattern as fetchHomeOffice's `forYear` match. Omit
 * `year` for callers that intentionally want every trip regardless of
 * date (Reports' own date-range picker).
 */
export async function fetchTrips(uid: string, year?: string): Promise<Trip[]> {
  const q = query(
    collection(db, "routes"),
    where("created_by", "==", uid),
    orderBy("date", "desc"),
  );
  const snapshot = await getDocs(q);
  const trips = snapshot.docs.map((doc) => toTrip(doc.id, doc.data()));
  if (!year) return trips;
  return trips.filter((t) => String(t.date.getFullYear()) === year);
}

/** Distance for this trip in the requested display unit, respecting round_trip (the stored one-way vs round-trip fields differ). */
export function tripDistance(trip: Trip, unit: DistanceUnit): number {
  if (unit === "km") return trip.roundTrip ? trip.mileageKmRoundTrip : trip.mileageKm;
  return trip.roundTrip ? trip.mileageMiRoundTrip : trip.mileageMi;
}

export function formatLocation(loc: RouteLocation): string {
  return [loc.address, loc.city, loc.state, loc.zipCode, loc.country].filter(Boolean).join(", ");
}

/**
 * routeMap is a ready-made Google Static Maps URL with default green
 * (start) / red (end) markers already baked in as a stored string --
 * recoloring it here is purely a client-side display transform (string
 * in, string out), never written back to Firestore. Matches the existing
 * illustrated RouteMap placeholder's own convention: ink for origin,
 * ember for destination. Falls back to the original URL untouched if the
 * expected substrings aren't found, so an unfamiliar URL shape just shows
 * Google's default colors instead of breaking.
 */
export function recolorRouteMap(url: string): string {
  if (!url) return url;
  return url.replace(/color:green/gi, "color:0x000000").replace(/color:red/gi, "color:0xf97316");
}

export type NewTripInput = {
  uid: string;
  comment: string;
  startRoute: RouteLocation;
  endRoute: RouteLocation;
  date: Date;
  /** One-way distance in `unit` -- doubled internally if roundTrip is true. */
  distance: number;
  unit: DistanceUnit;
  roundTrip: boolean;
  /** Settings' current mileage rate ($/unit) at the time this trip is logged -- stored as this trip's own `rate`, matching how a real mobile-app-logged trip carries the rate active when it was created, not a value recomputed later. */
  rate: number;
  currency: string;
  /** Google Static Maps URL from buildStaticMapUrl(), or "" if geocoding/routing wasn't available -- matches the empty-string fallback TripDetailDialog already handles via RouteMap's illustrated placeholder. */
  routeMapUrl: string;
};

function toFirestoreLocation(loc: RouteLocation) {
  return {
    address: loc.address,
    city: loc.city,
    country: loc.country,
    name: loc.name,
    state: loc.state,
    zip_code: loc.zipCode,
    location: loc.location ? new GeoPoint(loc.location.lat, loc.location.lng) : null,
  };
}

/**
 * Creates a new document in `routes`, matching the real mobile-app
 * schema as closely as a web form reasonably can -- full structured
 * start_route/end_route (including the geopoint) when Places Autocomplete
 * resolved a real place, or just a plain-text `name` with everything
 * else empty when it didn't. Both km and mi distance fields are
 * populated regardless of `unit` so the trip reads correctly under
 * either Settings distance unit later. created_by is the signed-in
 * user's uid, matching the security rules' ownership check exactly.
 */
export async function createTrip(input: NewTripInput): Promise<void> {
  const oneWayKm = input.unit === "km" ? input.distance : miToKm(input.distance);
  const oneWayMi = input.unit === "mi" ? input.distance : kmToMi(input.distance);
  const totalDistance = input.roundTrip ? input.distance * 2 : input.distance;

  await addDoc(collection(db, "routes"), {
    comment: input.comment,
    created_at: serverTimestamp(),
    created_by: input.uid,
    currency: input.currency,
    date: Timestamp.fromDate(input.date),
    distance: input.unit,
    start_route: toFirestoreLocation(input.startRoute),
    end_route: toFirestoreLocation(input.endRoute),
    is_reimbursable: false,
    mileage: oneWayKm,
    mileage_km_RoundTrip: oneWayKm * 2,
    mileage_ml: oneWayMi,
    mileage_ml_RoundTrip: oneWayMi * 2,
    rate: input.rate,
    round_trip: input.roundTrip,
    routeMap: input.routeMapUrl,
    total_price: totalDistance * input.rate,
  });
}

export type TripUpdateInput = {
  date: Date;
  comment: string;
  roundTrip: boolean;
  isReimbursable: boolean;
  /** One-way distance in `recordedUnit` -- doubled internally if roundTrip is true, same convention as NewTripInput.distance. */
  distance: number;
  /** The trip's own recorded unit ("km"|"mi") -- read-only context for recomputing the distance-derived fields below, never written back (the `distance` Firestore field itself, which stores this unit string, is untouched by this function). */
  recordedUnit: DistanceUnit;
  /** The trip's own historical rate ($/recordedUnit) -- read-only context for recomputing total_price, never written back. Never recomputed from Settings' current mileage rate. */
  rate: number;
};

/**
 * Updates an existing trip -- only the fields the edit form actually
 * exposes: date, comment, round_trip, is_reimbursable, and the
 * distance-derived fields (mileage/mileage_km_RoundTrip/mileage_ml/
 * mileage_ml_RoundTrip/total_price), recomputed together every time
 * since distance and round_trip are edited as one form, exactly
 * mirroring createTrip's own km/mi-both-populated computation (reusing
 * kmToMi/miToKm the same way). Deliberately never touches rate
 * (historical, recorded when the trip was logged -- never recomputed
 * from current Settings), routeMap, start_route/end_route (including
 * geopoints), currency, created_by, created_at, or distance (the
 * recorded unit string) -- those aren't part of the edit UI and
 * shouldn't be reassignable through this path.
 */
export async function updateTrip(id: string, patch: TripUpdateInput): Promise<void> {
  const oneWayKm = patch.recordedUnit === "km" ? patch.distance : miToKm(patch.distance);
  const oneWayMi = patch.recordedUnit === "mi" ? patch.distance : kmToMi(patch.distance);
  const totalDistance = patch.roundTrip ? patch.distance * 2 : patch.distance;

  await updateDoc(doc(db, "routes", id), {
    date: Timestamp.fromDate(patch.date),
    comment: patch.comment,
    round_trip: patch.roundTrip,
    is_reimbursable: patch.isReimbursable,
    mileage: oneWayKm,
    mileage_km_RoundTrip: oneWayKm * 2,
    mileage_ml: oneWayMi,
    mileage_ml_RoundTrip: oneWayMi * 2,
    total_price: totalDistance * patch.rate,
  });
}

/**
 * A real, permanent hard delete -- not a soft-delete flag. Security
 * rules already allow this for the document's own creator. Callers must
 * confirm with the user before calling this; nothing here prompts.
 */
export async function deleteTrip(id: string): Promise<void> {
  await deleteDoc(doc(db, "routes", id));
}
