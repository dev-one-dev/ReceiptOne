import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * public/robots.txt vs public/sitemap.xml: nothing we ask search engines to
 * index may be disallowed. Matching follows Google's rules: rules are path
 * prefixes (with * and a trailing $), the longest matching rule wins, and
 * Allow wins a tie.
 */
type Rule = { allow: boolean; pattern: string };

function rulesForAllAgents(robots: string): Rule[] {
  const rules: Rule[] = [];
  let inStar = false;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, value] = m;
    const k = key.toLowerCase();
    if (k === "user-agent") inStar = value === "*";
    else if (inStar && (k === "allow" || k === "disallow") && value)
      rules.push({ allow: k === "allow", pattern: value });
  }
  return rules;
}

function matches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`).test(path);
}

function isAllowed(rules: Rule[], path: string): boolean {
  let best: Rule | null = null;
  for (const r of rules) {
    if (!matches(r.pattern, path)) continue;
    if (
      !best ||
      r.pattern.length > best.pattern.length ||
      (r.pattern.length === best.pattern.length && r.allow)
    )
      best = r;
  }
  return best?.allow ?? true;
}

const rules = rulesForAllAgents(readFileSync("public/robots.txt", "utf8"));
const sitemapPaths = [
  ...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g),
].map((m) => new URL(m[1]).pathname);

test("robots: every URL in the sitemap is crawlable", () => {
  assert.ok(sitemapPaths.length > 0, "sitemap has URLs");
  const blocked = sitemapPaths.filter((p) => !isAllowed(rules, p));
  assert.deepEqual(blocked, [], `disallowed by robots.txt: ${blocked.join(", ")}`);
  assert.ok(sitemapPaths.includes("/roadmap"), "/roadmap is in the sitemap");
});

test("robots: referral links and the API stay blocked", () => {
  for (const p of ["/r/abc123", "/r/", "/api/anything"])
    assert.equal(isAllowed(rules, p), false, p);
});

test("robots: matcher follows longest-match semantics", () => {
  const r: Rule[] = [
    { allow: true, pattern: "/" },
    { allow: false, pattern: "/r" },
  ];
  assert.equal(isAllowed(r, "/roadmap"), false, "a bare /r prefix would block /roadmap");
  assert.equal(isAllowed(r, "/ca"), true);
});
