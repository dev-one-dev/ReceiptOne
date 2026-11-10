/**
 * Server-side fetch of the portal's public `listRoadmapItems` callable
 * (Firebase project check-app-a93a2, us-central1). It is an onCall function
 * without App Check enforcement, so a plain HTTPS POST of `{"data":{}}` is
 * the whole protocol -- no Firebase SDK, nothing shipped to the browser.
 *
 * Only imported by roadmap.functions.ts (a createServerFn handler), so the
 * bundler keeps it out of the client build.
 */
import { parseRoadmapResponse, type RoadmapData } from "./roadmap.ts";

export const ROADMAP_ENDPOINT =
  "https://us-central1-check-app-a93a2.cloudfunctions.net/listRoadmapItems";
export const ROADMAP_TIMEOUT_MS = 3000;

export type FetchRoadmapOptions = {
  endpoint?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  warn?: (message: string) => void;
  now?: () => Date;
};

/**
 * Fetches and validates the roadmap. Returns null -- after exactly one
 * warning -- on a network error, timeout, non-2xx answer, non-JSON body or a
 * body that fails the schema. Never throws.
 */
export async function fetchRoadmap(options: FetchRoadmapOptions = {}): Promise<RoadmapData | null> {
  const {
    endpoint = ROADMAP_ENDPOINT,
    timeoutMs = ROADMAP_TIMEOUT_MS,
    fetchImpl = fetch,
    warn = (m: string) => console.warn(m),
    now = () => new Date(),
  } = options;
  const fail = (reason: string) => {
    warn(`[roadmap] listRoadmapItems unavailable (${reason}); rendering without roadmap data`);
    return null;
  };
  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: {} }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return fail(`HTTP ${res.status}`);
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      return fail("invalid JSON");
    }
    const items = parseRoadmapResponse(body);
    if (!items) return fail("schema mismatch");
    return { items, fetchedAt: now().toISOString() };
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    return fail(
      name === "TimeoutError" || name === "AbortError"
        ? `timeout after ${timeoutMs} ms`
        : String(err),
    );
  }
}
