import { test } from "node:test";
import assert from "node:assert/strict";

import {
  announcementFor,
  groupShippedByMonth,
  isCanadaSpecific,
  parseRoadmapResponse,
  roadmapCacheControl,
  roadmapView,
  ROADMAP_CACHE_CONTROL,
  ROADMAP_FALLBACK_CACHE_CONTROL,
  selectComingNext,
  type RoadmapData,
  type RoadmapItem,
} from "../src/lib/roadmap.ts";
import { fetchRoadmap } from "../src/lib/roadmap-fetch.ts";

/* ------------------------------- Fixtures --------------------------------- */

type Wire = Record<string, unknown>;

let seq = 0;
function wire(overrides: Wire = {}): Wire {
  seq += 1;
  const status = (overrides.status as string) ?? "done";
  return {
    id: `curated-item${seq}`,
    item_key: `item${seq}`,
    section: "receipts",
    icon: "Upload",
    order: seq,
    status,
    title: `Item ${seq}`,
    description: `Description ${seq}`,
    title_fr: `Élément ${seq}`,
    description_fr: `Description FR ${seq}`,
    done_at: status === "done" ? "2026-11-08T12:00:00.000Z" : null,
    ...overrides,
  };
}

const body = (items: unknown[]) => ({ result: { items } });

function items(...wires: Wire[]): RoadmapItem[] {
  const parsed = parseRoadmapResponse(body(wires));
  assert.ok(parsed, "fixture parses");
  return parsed;
}

const data = (list: RoadmapItem[], fetchedAt = "2026-11-10T15:00:00.000Z"): RoadmapData => ({
  items: list,
  fetchedAt,
});

/* -------------------------------- Schema ---------------------------------- */

test("schema: a good response parses to typed items with EN and FR text", () => {
  const out = parseRoadmapResponse(
    body([
      wire({ title: "Automatic mileage tracking", title_fr: "Suivi automatique du kilométrage" }),
      wire({ status: "planned" }),
    ]),
  );
  assert.ok(out);
  assert.equal(out.length, 2);
  assert.equal(out[0].title, "Automatic mileage tracking");
  assert.equal(out[0].titleFr, "Suivi automatique du kilométrage");
  assert.equal(out[0].doneAt, "2026-11-08T12:00:00.000Z");
  assert.equal(out[0].region, null);
  assert.equal(out[1].status, "planned");
  assert.equal(out[1].doneAt, null);
});

test("schema: an empty list is valid", () => {
  assert.deepEqual(parseRoadmapResponse(body([])), []);
});

test("schema: unknown extra fields are dropped, an optional region is kept", () => {
  const [item] = items(wire({ votes: 12, author: "x", region: "CA" }));
  assert.equal(item.region, "CA");
  assert.equal("votes" in item, false);
  assert.equal("author" in item, false);
});

test("schema: malformed responses are rejected whole", () => {
  const bad: [string, unknown][] = [
    ["null body", null],
    ["no result envelope", { items: [] }],
    ["items not an array", { result: { items: {} } }],
    ["onCall error envelope", { error: { status: "INTERNAL", message: "x" } }],
    ["unknown status", body([wire(), wire({ status: "hidden" })])],
    ["missing title", body([wire({ title: undefined })])],
    ["empty title", body([wire({ title: "  " })])],
    ["order not a number", body([wire({ order: "3" })])],
    ["order NaN", body([wire({ order: Number.NaN })])],
    ["description_fr missing", body([wire({ description_fr: undefined })])],
    ["done_at not a date", body([wire({ done_at: "last tuesday" })])],
    [
      "done_at on a planned item",
      body([wire({ status: "planned", done_at: "2026-11-08T12:00:00.000Z" })]),
    ],
    ["region of the wrong type", body([wire({ region: 3 })])],
    ["item not an object", body(["oops"])],
  ];
  for (const [name, value] of bad) assert.equal(parseRoadmapResponse(value), null, name);
});

/* -------------------------------- Fetch ----------------------------------- */

function fakeFetch(respond: () => Promise<Response> | Response): typeof fetch {
  return (async () => respond()) as unknown as typeof fetch;
}

test("fetch: success returns items plus the fetch time, no warning", async () => {
  const warnings: string[] = [];
  const out = await fetchRoadmap({
    fetchImpl: fakeFetch(() => Response.json(body([wire()]))),
    warn: (m) => warnings.push(m),
    now: () => new Date("2026-11-10T00:00:00.000Z"),
  });
  assert.ok(out);
  assert.equal(out.items.length, 1);
  assert.equal(out.fetchedAt, "2026-11-10T00:00:00.000Z");
  assert.equal(warnings.length, 0);
});

test("fetch: error, non-2xx, bad JSON, schema mismatch and timeout each return null with one warning", async () => {
  const cases: [string, typeof fetch, number?][] = [
    ["network", fakeFetch(() => Promise.reject(new TypeError("fetch failed")))],
    ["HTTP 500", fakeFetch(() => new Response("nope", { status: 500 }))],
    ["bad JSON", fakeFetch(() => new Response("<html>", { status: 200 }))],
    ["schema", fakeFetch(() => Response.json(body([wire({ status: "hidden" })])))],
    [
      "timeout",
      // Never answers. AbortSignal.timeout's timer is unref'd, so hold the
      // event loop open with a ref'd one until the abort fires.
      ((_url: string, init: RequestInit) =>
        new Promise((_, reject) => {
          const keepAlive = setTimeout(() => {}, 10_000);
          init.signal!.addEventListener("abort", () => {
            clearTimeout(keepAlive);
            reject(init.signal!.reason);
          });
        })) as unknown as typeof fetch,
      20,
    ],
  ];
  for (const [name, fetchImpl, timeoutMs] of cases) {
    const warnings: string[] = [];
    const out = await fetchRoadmap({ fetchImpl, timeoutMs, warn: (m) => warnings.push(m) });
    assert.equal(out, null, name);
    assert.equal(warnings.length, 1, `${name}: exactly one warning`);
  }
});

test("fetch: POSTs the onCall envelope with a JSON content type", async () => {
  let seen: RequestInit | undefined;
  await fetchRoadmap({
    fetchImpl: ((_u: string, init: RequestInit) => {
      seen = init;
      return Promise.resolve(Response.json(body([])));
    }) as unknown as typeof fetch,
  });
  assert.equal(seen?.method, "POST");
  assert.equal(seen?.body, JSON.stringify({ data: {} }));
  assert.deepEqual(seen?.headers, { "Content-Type": "application/json" });
});

/* --------------------------- Month grouping ------------------------------- */

test("shipped: newest first, grouped by month, last 12 months only", () => {
  const list = items(
    wire({ title: "Old", done_at: "2025-11-20T12:00:00.000Z" }), // 12 months back: out
    wire({ title: "Dec", done_at: "2025-12-01T12:00:00.000Z" }), // first month in the window
    wire({ title: "Nov early", done_at: "2026-11-02T12:00:00.000Z" }),
    wire({ title: "Nov late", done_at: "2026-11-08T12:00:00.000Z" }),
    wire({ title: "Jul", done_at: "2026-07-15T12:00:00.000Z" }),
    wire({ title: "Planned", status: "planned" }),
    wire({ title: "Undated done", done_at: null }),
  );
  const months = groupShippedByMonth(list, "en", new Date("2026-11-10T15:00:00.000Z"));
  assert.deepEqual(
    months.map((m) => [m.key, m.label, m.items.map((i) => i.title)]),
    [
      ["2026-11", "November 2026", ["Nov late", "Nov early"]],
      ["2026-07", "July 2026", ["Jul"]],
      ["2025-12", "December 2025", ["Dec"]],
    ],
  );
});

test("shipped: French month labels; same-day items keep board order", () => {
  const list = items(
    wire({ order: 9, title: "B", done_at: "2026-07-15T12:00:00.000Z" }),
    wire({ order: 1, title: "A", done_at: "2026-07-15T12:00:00.000Z" }),
  );
  const [month] = groupShippedByMonth(list, "fr", new Date("2026-11-10T00:00:00.000Z"));
  assert.equal(month.label, "juillet 2026");
  assert.deepEqual(
    month.items.map((i) => i.title),
    ["A", "B"],
  );
});

/* ----------------------------- Coming next -------------------------------- */

test("coming next: max 3, in_progress before planned, by board order, no done items", () => {
  const list = items(
    wire({ status: "planned", order: 1, title: "P1" }),
    wire({ status: "done", order: 0, title: "D" }),
    wire({ status: "in_progress", order: 7, title: "I7" }),
    wire({ status: "planned", order: 2, title: "P2" }),
    wire({ status: "in_progress", order: 3, title: "I3" }),
    wire({ status: "planned", order: 0, title: "P0" }),
  );
  assert.deepEqual(
    selectComingNext(list).map((i) => i.title),
    ["I3", "I7", "P0"],
  );
});

test("coming next: fewer than 3 candidates returns what there is", () => {
  assert.deepEqual(
    selectComingNext(items(wire({ status: "planned", title: "Only" }))).map((i) => i.title),
    ["Only"],
  );
  assert.deepEqual(selectComingNext(items(wire())), []);
});

/* ---------------------------- 60-day pill rule ---------------------------- */

test("pill: latest done item within 60 days shows on /ca (EN) and /fr (FR)", () => {
  const list = items(
    wire({ title: "Older", done_at: "2026-11-02T12:00:00.000Z" }),
    wire({
      title: "Automatic mileage tracking",
      title_fr: "Suivi automatique du kilométrage",
      done_at: "2026-11-08T12:00:00.000Z",
    }),
  );
  assert.deepEqual(announcementFor(data(list), "ca"), {
    label: "New",
    title: "Automatic mileage tracking",
    href: "/roadmap",
  });
  assert.deepEqual(announcementFor(data(list), "fr"), {
    label: "Nouveau",
    title: "Suivi automatique du kilométrage",
    href: "/fr/roadmap",
  });
});

test("pill: exactly 60 days old still shows, older does not", () => {
  const list = items(wire({ done_at: "2026-09-11T15:00:00.000Z" }));
  assert.ok(announcementFor(data(list, "2026-11-10T15:00:00.000Z"), "ca"), "60 days");
  assert.equal(
    announcementFor(data(list, "2026-11-10T15:00:00.001Z"), "ca"),
    null,
    "60 days + 1 ms",
  );
});

test("pill: nothing done means no pill", () => {
  assert.equal(announcementFor(data(items(wire({ status: "planned" }))), "ca"), null);
  assert.equal(announcementFor(data([]), "ca"), null);
});

test("pill: French falls back to the English title when the item has no French text", () => {
  const list = items(wire({ title: "Only English", title_fr: "" }));
  assert.equal(announcementFor(data(list), "fr")?.title, "Only English");
});

/* ------------------------------ /us region -------------------------------- */

test("pill on /us: hidden without a region field, hidden for Canada-only, shown otherwise", () => {
  assert.equal(announcementFor(data(items(wire())), "us"), null, "no region field");
  for (const region of ["CA", "ca", "Canada", "CA-only"])
    assert.equal(announcementFor(data(items(wire({ region }))), "us"), null, region);
  for (const region of ["global", "US", "all"])
    assert.equal(
      announcementFor(data(items(wire({ region, title: "X" }))), "us")?.title,
      "X",
      region,
    );
});

test("isCanadaSpecific", () => {
  assert.equal(isCanadaSpecific(null), false);
  assert.equal(isCanadaSpecific("ca"), true);
  assert.equal(isCanadaSpecific("global"), false);
});

/* ------------------------------ Null data --------------------------------- */

test("null data: no pill on any home page, short edge cache", () => {
  for (const page of ["ca", "us", "fr"] as const)
    assert.equal(announcementFor(null, page), null, page);
  assert.equal(roadmapCacheControl(null), ROADMAP_FALLBACK_CACHE_CONTROL);
  assert.equal(roadmapCacheControl(undefined), ROADMAP_FALLBACK_CACHE_CONTROL);
  assert.equal(roadmapCacheControl(data([])), ROADMAP_CACHE_CONTROL);
  assert.equal(ROADMAP_CACHE_CONTROL, "public, s-maxage=3600, stale-while-revalidate=86400");
});

test("null data: the roadmap page renders the fallback line instead of both lists", () => {
  assert.deepEqual(roadmapView(null, "en"), { kind: "unavailable" });
  assert.deepEqual(roadmapView(null, "fr"), { kind: "unavailable" });
});

test("page view: data renders both lists, empty data renders empty lists (not the fallback)", () => {
  const view = roadmapView(
    data(items(wire({ title: "Shipped" }), wire({ status: "in_progress", title: "Next" }))),
    "en",
  );
  assert.equal(view.kind, "lists");
  if (view.kind !== "lists") return;
  assert.deepEqual(
    view.shipped.map((m) => m.items.map((i) => i.title)),
    [["Shipped"]],
  );
  assert.deepEqual(
    view.comingNext.map((i) => i.title),
    ["Next"],
  );
  assert.deepEqual(roadmapView(data([]), "en"), { kind: "lists", shipped: [], comingNext: [] });
});
