import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
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

/** Fetches the signed-in user's own trips, newest first -- matches the security rules' `created_by == request.auth.uid` scoping. */
export async function fetchTrips(uid: string): Promise<Trip[]> {
  const q = query(
    collection(db, "routes"),
    where("created_by", "==", uid),
    orderBy("date", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => toTrip(doc.id, doc.data()));
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
  fromName: string;
  toName: string;
  date: Date;
  /** One-way distance in `unit` -- doubled internally if roundTrip is true. */
  distance: number;
  unit: DistanceUnit;
  roundTrip: boolean;
  /** Settings' current mileage rate ($/unit) at the time this trip is logged -- stored as this trip's own `rate`, matching how a real mobile-app-logged trip carries the rate active when it was created, not a value recomputed later. */
  rate: number;
  currency: string;
};

/**
 * Creates a new document in `routes`, matching the real mobile-app
 * schema as closely as a web form reasonably can: start_route/end_route
 * only get a plain-text `name` (no geocoded address/city/state -- see
 * RouteLocation's other fields, left empty), and routeMap is left empty
 * since there's no real map to generate client-side. Both km and mi
 * distance fields are populated regardless of `unit` so the trip reads
 * correctly under either Settings distance unit later. created_by is
 * the signed-in user's uid, matching the security rules' ownership
 * check exactly.
 */
export async function createTrip(input: NewTripInput): Promise<void> {
  const oneWayKm = input.unit === "km" ? input.distance : miToKm(input.distance);
  const oneWayMi = input.unit === "mi" ? input.distance : kmToMi(input.distance);
  const totalDistance = input.roundTrip ? input.distance * 2 : input.distance;
  const emptyLocation = { address: "", city: "", country: "", state: "", zip_code: "" };

  await addDoc(collection(db, "routes"), {
    comment: input.comment,
    created_at: serverTimestamp(),
    created_by: input.uid,
    currency: input.currency,
    date: Timestamp.fromDate(input.date),
    distance: input.unit,
    start_route: { ...emptyLocation, name: input.fromName },
    end_route: { ...emptyLocation, name: input.toName },
    is_reimbursable: false,
    mileage: oneWayKm,
    mileage_km_RoundTrip: oneWayKm * 2,
    mileage_ml: oneWayMi,
    mileage_ml_RoundTrip: oneWayMi * 2,
    rate: input.rate,
    round_trip: input.roundTrip,
    routeMap: "",
    total_price: totalDistance * input.rate,
  });
}
