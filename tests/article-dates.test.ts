// Set before any Date is formatted: west of UTC is where date-only strings
// used to slip back a day.
process.env.TZ = "America/Vancouver";

import { test } from "node:test";
import assert from "node:assert/strict";
// @ts-expect-error -- plain .mjs helper without types
import { loadTs } from "../scripts/lib/load-ts.mjs";

/**
 * Article dates are date-only strings ("2026-10-04"), which parse as UTC
 * midnight. Formatted in a time zone west of UTC they used to render as the
 * day before ("Oct 3, 2026"). formatArticleDate formats in UTC, so cards,
 * related cards and article headers (CA and US) show the calendar day.
 */
const { formatArticleDate, ARTICLES } = (await loadTs(
  `export { formatArticleDate, ARTICLES } from "@/lib/articles";`,
)) as {
  formatArticleDate: (iso: string, locale?: string) => string;
  ARTICLES: { slug: string; publishedAt: string }[];
};

test("article dates: TZ is America/Vancouver and the old formatting slipped a day", () => {
  assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, "America/Vancouver");
  const old = new Date("2026-10-04").toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  assert.equal(old, "Oct 3, 2026", "precondition: the bug reproduces in this time zone");
});

test('article dates: "2026-10-04" renders as "Oct 4, 2026" (en-CA and en-US)', () => {
  assert.equal(formatArticleDate("2026-10-04"), "Oct 4, 2026");
  assert.equal(formatArticleDate("2026-10-04", "en-US"), "Oct 4, 2026");
  // Year boundaries too.
  assert.equal(formatArticleDate("2026-01-01"), "Jan 1, 2026");
  assert.equal(formatArticleDate("2026-12-31", "en-US"), "Dec 31, 2026");
});

test("article dates: every article's publishedAt renders as its own calendar day", () => {
  const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
  for (const a of ARTICLES) {
    const [y, m, d] = a.publishedAt.split("-").map(Number);
    assert.equal(formatArticleDate(a.publishedAt), `${MONTHS[m - 1]} ${d}, ${y}`, a.slug);
  }
});
