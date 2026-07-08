/**
 * Loads the Google Maps JavaScript API (with the "places" library) once,
 * client-side only. Memoized so repeated calls (e.g. reopening the Log
 * Trip dialog) never inject the script twice. Never throws past the
 * returned promise's rejection -- callers are expected to catch and fall
 * back to manual entry, not treat a failed load as fatal.
 */

let loadPromise: Promise<void> | null = null;

function getApiKey(): string {
  return (
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
    (typeof process !== "undefined" ? process.env.VITE_GOOGLE_MAPS_API_KEY : undefined) ||
    ""
  );
}

export function loadGoogleMaps(): Promise<void> {
  if (loadPromise) return loadPromise;

  const promise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Google Maps can only load in the browser."));
      return;
    }
    if (window.google?.maps?.places) {
      resolve();
      return;
    }
    const apiKey = getApiKey();
    if (!apiKey) {
      reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY."));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps."));
    document.head.appendChild(script);
  });

  // Let the next caller try again instead of permanently caching a
  // failure (e.g. a transient network blip on first dialog open) --
  // a side-effect-only catch, kept separate from the returned promise
  // so callers still see the original rejection.
  promise.catch(() => {
    loadPromise = null;
  });

  loadPromise = promise;
  return promise;
}

export type DirectionsResult = {
  distanceMeters: number;
  encodedPolyline: string;
};

/**
 * Wraps DirectionsService in a promise that never rejects -- resolves
 * null on any failure (no route, API error, zero results) so callers can
 * treat "couldn't calculate" as a plain empty case rather than needing a
 * try/catch, matching the non-blocking fallback this dialog needs.
 */
export function getDirections(
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
): Promise<DirectionsResult | null> {
  return new Promise((resolve) => {
    try {
      const service = new google.maps.DirectionsService();
      service.route(
        { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
        (result, status) => {
          const route = result?.routes?.[0];
          const leg = route?.legs?.[0];
          if (status !== google.maps.DirectionsStatus.OK || !route || !leg?.distance) {
            resolve(null);
            return;
          }
          // Modern JS API typings return overview_polyline as a plain
          // string; guard against the older {points: string} shape too
          // rather than assume one and silently drop the path.
          const overview = route.overview_polyline as unknown;
          const encodedPolyline =
            typeof overview === "string"
              ? overview
              : ((overview as { points?: string } | undefined)?.points ?? "");
          resolve({ distanceMeters: leg.distance.value, encodedPolyline });
        },
      );
    } catch {
      resolve(null);
    }
  });
}

/**
 * Matches the exact structure of real routeMap URLs already stored by
 * the mobile app (confirmed against a real Firestore document): size
 * before path, path before markers, path is blue/weight:5, markers have
 * no label, key last. The marker colors ("green"/"red", literal named
 * colors, not hex) are load-bearing -- recolorRouteMap() in trips.ts
 * only knows how to recolor exactly those two substrings, so any other
 * marker color scheme would silently fail to recolor on display.
 */
export function buildStaticMapUrl(
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral,
  encodedPolyline: string,
): string | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const params = [
    "size=600x300",
    `path=color:0x0000ffff|weight:5|enc:${encodeURIComponent(encodedPolyline)}`,
    `markers=color:green|${origin.lat},${origin.lng}`,
    `markers=color:red|${destination.lat},${destination.lng}`,
    `key=${apiKey}`,
  ];
  return `https://maps.googleapis.com/maps/api/staticmap?${params.join("&")}`;
}

/**
 * Predictions for an in-progress query, via AutocompleteService directly
 * rather than the google.maps.places.Autocomplete widget -- that widget
 * renders its dropdown into document.body, outside of wherever the input
 * lives in the page, which fights Radix Dialog's focus trap when the
 * input is inside a modal. Resolves an empty array (never rejects) on
 * any failure, including a genuinely empty result set, so callers don't
 * need to distinguish "no matches" from "API error."
 */
export function getAutocompletePredictions(
  input: string,
  sessionToken?: google.maps.places.AutocompleteSessionToken,
): Promise<google.maps.places.AutocompletePrediction[]> {
  return new Promise((resolve) => {
    if (!input.trim()) {
      resolve([]);
      return;
    }
    try {
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions({ input, sessionToken }, (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          resolve([]);
          return;
        }
        resolve(predictions);
      });
    } catch {
      resolve([]);
    }
  });
}

let placesServiceNode: HTMLDivElement | null = null;

function getPlacesService(): google.maps.places.PlacesService {
  // PlacesService requires a Map or an HTMLElement to construct (for
  // attribution), even though we never render an actual map -- a
  // detached div is the standard workaround for this.
  if (!placesServiceNode) placesServiceNode = document.createElement("div");
  return new google.maps.places.PlacesService(placesServiceNode);
}

/**
 * Full place details for a predicted place_id -- the same data
 * (address_components, geometry, name, formatted_address) the old
 * Autocomplete widget's place_changed event used to hand over, just
 * fetched explicitly once the user clicks a prediction instead of
 * arriving via that widget. Resolves null on any failure.
 */
export function getPlaceDetails(
  placeId: string,
  sessionToken?: google.maps.places.AutocompleteSessionToken,
): Promise<google.maps.places.PlaceResult | null> {
  return new Promise((resolve) => {
    try {
      const service = getPlacesService();
      service.getDetails(
        {
          placeId,
          fields: ["address_components", "geometry", "name", "formatted_address"],
          sessionToken,
        },
        (result, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !result) {
            resolve(null);
            return;
          }
          resolve(result);
        },
      );
    } catch {
      resolve(null);
    }
  });
}
