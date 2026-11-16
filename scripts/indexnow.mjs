#!/usr/bin/env node
/**
 * Submits URLs to IndexNow (Bing, Yandex, Seznam, Naver and others share one
 * endpoint). The key is public by design: search engines verify ownership by
 * fetching https://receipt-one.com/{KEY}.txt, served from public/{KEY}.txt.
 *
 *   npm run indexnow                      # every <loc> in public/sitemap.xml
 *   npm run indexnow -- <url> [<url>...]  # only these URLs
 *
 * Run it by hand after a production deploy has finished, never during the
 * build: at build time the new pages (and a new key file) are not live yet,
 * and an engine that fetches them then gets the old site or a 404.
 *
 * 200 and 202 mean accepted; anything else exits non-zero.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const HOST = "receipt-one.com";
export const KEY = "49ccd386b1ec0e3fcc337fb2edcd609d";
export const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
export const ENDPOINT = "https://api.indexnow.org/indexnow";
export const SITEMAP = resolve("public/sitemap.xml");

/** Every <loc> in the sitemap, in order, entities decoded. */
export function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) =>
    m[1]
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&"),
  );
}

export function buildPayload(urlList) {
  if (urlList.length === 0) throw new Error("indexnow: no URLs to submit");
  if (urlList.length > 10000) throw new Error("indexnow: at most 10,000 URLs per request");
  for (const u of urlList) {
    if (new URL(u).host !== HOST) throw new Error(`indexnow: ${u} is not on ${HOST}`);
  }
  return { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
}

/** POSTs the payload; returns the HTTP status. `fetchImpl` is injectable for tests. */
export async function submit(urlList, fetchImpl = fetch) {
  const res = await fetchImpl(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(buildPayload(urlList)),
  });
  return { status: res.status, body: await res.text() };
}

async function main(args) {
  const urls = args.length > 0 ? args : sitemapUrls(readFileSync(SITEMAP, "utf8"));
  console.log(`indexnow: submitting ${urls.length} URL(s) to ${ENDPOINT}`);
  const { status, body } = await submit(urls);
  const ok = status === 200 || status === 202;
  console.log(`indexnow: HTTP ${status} ${ok ? "(accepted)" : "(not accepted)"}`);
  if (body.trim()) console.log(body.trim());
  if (!ok) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await main(process.argv.slice(2));
}
