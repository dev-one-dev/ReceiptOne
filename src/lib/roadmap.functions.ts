import { createServerFn } from "@tanstack/react-start";
import { fetchRoadmap } from "@/lib/roadmap-fetch";
import type { RoadmapData } from "@/lib/roadmap";

/**
 * The roadmap, fetched on the server. Route loaders call this: during SSR it
 * runs in-process; on a client-side navigation TanStack Start turns it into
 * a GET to the server, so the browser never talks to Firebase for this.
 * Resolves to null when the portal is unreachable or answers off-contract.
 *
 * ROADMAP_ENDPOINT (server env, optional) overrides the callable URL; used to
 * force the fallback when verifying a build.
 */
export const getRoadmap = createServerFn({ method: "GET" }).handler(
  async (): Promise<RoadmapData | null> =>
    fetchRoadmap({ endpoint: process.env.ROADMAP_ENDPOINT || undefined }),
);

/** Loader data is reused for this long on client-side navigations. */
export const ROADMAP_STALE_TIME_MS = 5 * 60 * 1000;
