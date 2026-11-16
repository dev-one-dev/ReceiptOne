import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  ENDPOINT,
  HOST,
  KEY,
  KEY_LOCATION,
  buildPayload,
  sitemapUrls,
  submit,
  // @ts-expect-error -- plain .mjs script, no type declarations
} from "../scripts/indexnow.mjs";

/**
 * scripts/indexnow.mjs (`npm run indexnow`): the key file at the site root
 * holds exactly the key the script sends, and the payload is built from
 * public/sitemap.xml. The network is mocked; nothing is submitted.
 */

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

test("indexnow: public/{key}.txt holds exactly the script's key", () => {
  assert.match(KEY, /^[0-9a-f]{32}$/);
  assert.equal(readFileSync(`public/${KEY}.txt`, "utf8"), KEY);
  assert.equal(KEY_LOCATION, `https://receipt-one.com/${KEY}.txt`);
  const keyFiles = readdirSync("public").filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  assert.deepEqual(keyFiles, [`${KEY}.txt`], "one IndexNow key file, the script's");
});

test("indexnow: every sitemap <loc>, nothing else, in order", () => {
  const urls = sitemapUrls(sitemap);
  assert.ok(urls.length > 40);
  assert.deepEqual(urls, locs);
  assert.ok(urls.includes("https://receipt-one.com/us/faq"));
  assert.ok(!urls.some((u: string) => u.includes("hreflang") || u.includes("<")));
});

test("indexnow: POSTs {host, key, keyLocation, urlList} as JSON to api.indexnow.org", async () => {
  const calls: { url: string; init: RequestInit }[] = [];
  const fake = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response("", { status: 202 });
  };
  const urls = sitemapUrls(sitemap);
  const { status } = await submit(urls, fake);
  assert.equal(status, 202);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.indexnow.org/indexnow");
  assert.equal(ENDPOINT, "https://api.indexnow.org/indexnow");
  assert.equal(calls[0].init.method, "POST");
  assert.match(
    (calls[0].init.headers as Record<string, string>)["Content-Type"],
    /^application\/json/,
  );
  assert.deepEqual(JSON.parse(calls[0].init.body as string), {
    host: "receipt-one.com",
    key: KEY,
    keyLocation: `https://receipt-one.com/${KEY}.txt`,
    urlList: locs,
  });
  assert.equal(HOST, "receipt-one.com");
});

test("indexnow: explicit URLs replace the sitemap; off-site or empty lists are refused", () => {
  const one = ["https://receipt-one.com/us/faq"];
  assert.deepEqual(buildPayload(one).urlList, one);
  assert.throws(() => buildPayload([]), /no URLs/);
  assert.throws(() => buildPayload(["https://example.com/x"]), /not on receipt-one\.com/);
});
