/**
 * Roadmap & changelog data for the marketing site: the wire schema of the
 * portal's `listRoadmapItems` callable and the pure rules the /roadmap pages
 * and the hero announcement pill are built from.
 *
 * Pure -- no React, no fetch, no "@/" imports -- so the rules are unit-tested
 * with plain Node (tests/roadmap.test.ts). Fetching lives in
 * roadmap-fetch.ts, the server function in roadmap.functions.ts.
 *
 * Source of truth: ReceiptOne-Web-Portal functions/src/ideas/curated.ts
 * (RoadmapApiItem) and listRoadmapItems.ts. The callable answers
 * `{ result: { items: RoadmapApiItem[] } }` (onCall envelope).
 */

export type Lang = "en" | "fr";
export type RoadmapStatus = "planned" | "in_progress" | "done";
export type HomePage = "ca" | "us" | "fr";

export type RoadmapItem = {
  id: string;
  itemKey: string;
  section: string;
  order: number;
  status: RoadmapStatus;
  title: string;
  description: string;
  titleFr: string;
  descriptionFr: string;
  /** ISO timestamp the item became done; null unless status is done. */
  doneAt: string | null;
  /**
   * Market the item applies to, if the portal ever sends one. The current
   * RoadmapApiItem has no region field, so this is always null today.
   */
  region: string | null;
};

/** What the server function hands the pages: the items plus the render clock. */
export type RoadmapData = {
  items: RoadmapItem[];
  /**
   * When the data was fetched (ISO). Every date rule (12-month window,
   * 60-day pill) uses this instead of the client's clock, so SSR and
   * hydration always agree.
   */
  fetchedAt: string;
};

const STATUSES: readonly RoadmapStatus[] = ["planned", "in_progress", "done"];

export const SHIPPED_MONTHS = 12;
export const COMING_NEXT_MAX = 3;
export const PILL_MAX_AGE_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

/* -------------------------------- Schema ---------------------------------- */

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isNonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const isIsoDate = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v) && !Number.isNaN(Date.parse(v));

function parseItem(raw: unknown): RoadmapItem | null {
  if (!isObject(raw)) return null;
  const {
    id,
    item_key,
    section,
    icon,
    order,
    status,
    title,
    description,
    title_fr,
    description_fr,
    done_at,
    region,
  } = raw;
  if (!isNonEmptyString(id) || !isNonEmptyString(item_key) || !isNonEmptyString(section))
    return null;
  if (typeof icon !== "string") return null;
  if (typeof order !== "number" || !Number.isFinite(order)) return null;
  if (!STATUSES.includes(status as RoadmapStatus)) return null;
  if (!isNonEmptyString(title)) return null;
  if (typeof description !== "string" || typeof title_fr !== "string") return null;
  if (typeof description_fr !== "string") return null;
  // done_at: an ISO date or null; only a done item may carry one.
  if (done_at !== null && !isIsoDate(done_at)) return null;
  if (done_at !== null && status !== "done") return null;
  // region is optional and not sent today; accept a string or null if it appears.
  if (region !== undefined && region !== null && typeof region !== "string") return null;
  return {
    id,
    itemKey: item_key,
    section,
    order,
    status: status as RoadmapStatus,
    title,
    description,
    titleFr: title_fr,
    descriptionFr: description_fr,
    doneAt: done_at,
    region: isNonEmptyString(region) ? region : null,
  };
}

/**
 * Validates a raw `listRoadmapItems` response body. Strict: one item with a
 * missing or mistyped field rejects the whole response (returns null), so a
 * contract change in the portal shows the fallback line instead of a half
 * page. Unknown extra fields are ignored (the output is a whitelist). An
 * empty list is valid and returns [].
 */
export function parseRoadmapResponse(body: unknown): RoadmapItem[] | null {
  if (!isObject(body) || !isObject(body.result)) return null;
  const { items } = body.result;
  if (!Array.isArray(items)) return null;
  const out: RoadmapItem[] = [];
  for (const raw of items) {
    const item = parseItem(raw);
    if (!item) return null;
    out.push(item);
  }
  return out;
}

/* ------------------------------ Selection --------------------------------- */

/** Title and description in the page language; French falls back to English if the item has no French text. */
export function localized(item: RoadmapItem, lang: Lang): { title: string; description: string } {
  if (lang === "fr" && item.titleFr.trim())
    return { title: item.titleFr, description: item.descriptionFr || item.description };
  return { title: item.title, description: item.description };
}

const doneTime = (item: RoadmapItem) => (item.doneAt ? Date.parse(item.doneAt) : NaN);

/** Done items that carry a date, newest first (ties: board order). */
function datedDone(items: readonly RoadmapItem[]): RoadmapItem[] {
  return items
    .filter((i) => i.status === "done" && !Number.isNaN(doneTime(i)))
    .sort((a, b) => doneTime(b) - doneTime(a) || a.order - b.order);
}

export type ShippedMonth = {
  /** "2026-11" (UTC; the portal stores done dates at noon UTC). */
  key: string;
  /** "November 2026" / "novembre 2026". */
  label: string;
  items: RoadmapItem[];
};

/**
 * Done items from the last SHIPPED_MONTHS calendar months (the current month
 * and the eleven before it, UTC), newest first, grouped by month.
 */
export function groupShippedByMonth(
  items: readonly RoadmapItem[],
  lang: Lang,
  now: Date,
): ShippedMonth[] {
  const firstMonth = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (SHIPPED_MONTHS - 1), 1);
  const fmt = new Intl.DateTimeFormat(lang === "fr" ? "fr-CA" : "en-CA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const months: ShippedMonth[] = [];
  for (const item of datedDone(items)) {
    const t = doneTime(item);
    if (t < firstMonth) continue;
    const d = new Date(t);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    let month = months.at(-1);
    if (month?.key !== key) {
      month = { key, label: fmt.format(d), items: [] };
      months.push(month);
    }
    month.items.push(item);
  }
  return months;
}

/** At most COMING_NEXT_MAX items: in_progress first, then planned, each by board order. */
export function selectComingNext(items: readonly RoadmapItem[]): RoadmapItem[] {
  const byOrder = (a: RoadmapItem, b: RoadmapItem) => a.order - b.order;
  const inProgress = items.filter((i) => i.status === "in_progress").sort(byOrder);
  const planned = items.filter((i) => i.status === "planned").sort(byOrder);
  return [...inProgress, ...planned].slice(0, COMING_NEXT_MAX);
}

/** The most recently shipped item, or null. */
export function latestShipped(items: readonly RoadmapItem[]): RoadmapItem | null {
  return datedDone(items)[0] ?? null;
}

/** True when the region names Canada only ("ca", "CA", "canada", "CA-only" ...). */
export function isCanadaSpecific(region: string | null): boolean {
  if (!region) return false;
  const r = region.trim().toLowerCase();
  return r === "ca" || r === "canada" || r.startsWith("ca-") || r.startsWith("canada");
}

export type Announcement = { label: string; title: string; href: "/roadmap" | "/fr/roadmap" };

/**
 * The hero pill for a home page, or null when nothing should render:
 * - no data (fetch failed) or nothing shipped;
 * - the latest done item shipped more than PILL_MAX_AGE_DAYS ago;
 * - on /us, unless the item carries a region that is not Canada-specific
 *   (no region field = not shown on /us, since we cannot tell).
 */
export function announcementFor(data: RoadmapData | null, page: HomePage): Announcement | null {
  if (!data) return null;
  const item = latestShipped(data.items);
  if (!item) return null;
  const age = Date.parse(data.fetchedAt) - doneTime(item);
  if (!(age <= PILL_MAX_AGE_DAYS * DAY_MS)) return null;
  if (page === "us" && (item.region === null || isCanadaSpecific(item.region))) return null;
  const lang: Lang = page === "fr" ? "fr" : "en";
  return {
    label: lang === "fr" ? "Nouveau" : "New",
    title: localized(item, lang).title,
    href: lang === "fr" ? "/fr/roadmap" : "/roadmap",
  };
}

export type RoadmapView =
  { kind: "unavailable" } | { kind: "lists"; shipped: ShippedMonth[]; comingNext: RoadmapItem[] };

/**
 * What the /roadmap pages render: the two lists, or -- when the fetch failed
 * (data is null) -- the "being updated" line in place of both.
 */
export function roadmapView(data: RoadmapData | null, lang: Lang): RoadmapView {
  if (!data) return { kind: "unavailable" };
  return {
    kind: "lists",
    shipped: groupShippedByMonth(data.items, lang, new Date(data.fetchedAt)),
    comingNext: selectComingNext(data.items),
  };
}

/* ------------------------------- Caching ---------------------------------- */

/** Edge cache for pages that rendered roadmap data. */
export const ROADMAP_CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";
/**
 * Pages rendered without data (fetch failed): cached briefly so one portal
 * blip does not pin the fallback at the edge for an hour.
 */
export const ROADMAP_FALLBACK_CACHE_CONTROL = "public, s-maxage=60";

export function roadmapCacheControl(data: RoadmapData | null | undefined): string {
  return data ? ROADMAP_CACHE_CONTROL : ROADMAP_FALLBACK_CACHE_CONTROL;
}
