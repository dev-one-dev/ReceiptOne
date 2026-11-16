import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * The footer's brand tagline (one <p>, CA / FR / US copy) uses exactly the
 * text colour of the PRODUCT / ACCOUNT / LEGAL link items: the same ink token
 * class, never a hard-coded colour.
 */

const SRC = readFileSync("src/components/site/Footer.tsx", "utf8");
const colour = (cls: string) =>
  cls.split(/\s+/).filter((c) => /^text-(?!sm$|body$|label$|nav$|lead$|left$)/.test(c));

test("footer tagline: same colour token as the column links", () => {
  const tagline = /<p className="([^"]*)">\{tagline\}<\/p>/.exec(SRC)?.[1];
  assert.ok(tagline, "tagline <p> found");
  // Every link / button in the three nav columns.
  const links = [
    ...SRC.matchAll(
      /className="((?:text-left )?font-sans text-sm text-paper-\d+ transition-colors hover:text-paper)"/g,
    ),
  ].map((m) => m[1]);
  assert.ok(links.length >= 4, `column link items found (${links.length})`);
  const linkColours = new Set(
    links.map((c) =>
      colour(c)
        .filter((x) => !x.startsWith("hover:"))
        .join(" "),
    ),
  );
  assert.equal(linkColours.size, 1, "the column links share one colour");
  const [linkColour] = linkColours;
  assert.equal(colour(tagline!).join(" "), linkColour);
  assert.match(linkColour, /^text-paper-\d+$/, "a design token class");
  assert.doesNotMatch(tagline!, /#[0-9a-f]{3,8}|rgb|\[/i, "no hard-coded colour");
});
