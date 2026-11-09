import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// @ts-expect-error -- plain .mjs build script, no type declarations
import { generateSitemap, OUTPUT, PAGE_LASTMOD } from "../scripts/generate-sitemap.mjs";
// @ts-expect-error -- plain .mjs build script, no type declarations
import { loadTs } from "../scripts/lib/load-ts.mjs";

// Article modules import through the "@/" alias, which plain Node can't resolve.
const { articleDates } = (await loadTs(`
  import { ARTICLES } from "@/lib/articles";
  import { US_ARTICLES } from "@/lib/articles.us";
  export const articleDates = [...ARTICLES, ...US_ARTICLES].map((a) => a.updatedAt || a.publishedAt);
`)) as { articleDates: string[] };

const lastmods = (xml: string) => [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);

test("sitemap: output is identical across two runs", async () => {
  const a = await generateSitemap();
  const b = await generateSitemap();
  assert.equal(a.xml, b.xml);
});

test("sitemap: no lastmod is later than the newest source date", async () => {
  const sourceDates = [
    ...Object.values(PAGE_LASTMOD as Record<string, string>),
    ...articleDates,
  ];
  const newest = sourceDates.sort().at(-1)!;
  const { xml, pages } = await generateSitemap();
  const dates = lastmods(xml);
  assert.equal(dates.length, pages.size, "every URL has a lastmod");
  for (const d of dates) assert.ok(d <= newest, `lastmod ${d} is after newest source date ${newest}`);
});

test("sitemap: committed public/sitemap.xml matches the generator", async () => {
  const { xml } = await generateSitemap();
  assert.equal(
    readFileSync(OUTPUT, "utf8").replaceAll("\r\n", "\n"),
    xml,
    "run `npm run sitemap` and commit public/sitemap.xml",
  );
});
