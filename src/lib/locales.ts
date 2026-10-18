/**
 * Language and region pairs for the marketing site. Pure data -- no React --
 * so seo.ts, the Header's switchers and scripts/generate-sitemap.mjs all read
 * the same map.
 *
 * The Canadian English page is the anchor of every cluster: it is canonical
 * for x-default, and the US and French equivalents are looked up from it.
 * Only list genuine equivalents. A Canadian page with no French version
 * (articles, legal pages for now) is simply absent from FRENCH_PAGES.
 */
export type Lang = "en" | "fr";

/** Canadian English page -> its French (fr-CA) equivalent. */
export const FRENCH_PAGES: Record<string, string> = {
  "/ca": "/fr",
  "/faq": "/fr/faq",
  "/contact": "/fr/contact",
};

/** Canadian English page -> its US equivalent. */
export const US_PAGES: Record<string, string> = {
  "/ca": "/us",
  "/faq": "/us/faq",
  "/contact": "/us/contact",
  "/articles": "/us/articles",
};

export function langOf(pathname: string): Lang {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

/** The Canadian English page a path belongs to, or null if it is in no cluster. */
export function canadianPageOf(pathname: string): string | null {
  const path = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  if (path in FRENCH_PAGES || path in US_PAGES) return path;
  for (const map of [FRENCH_PAGES, US_PAGES]) {
    const hit = Object.entries(map).find(([, other]) => other === path);
    if (hit) return hit[0];
  }
  return null;
}

/**
 * hreflang alternates for the cluster `caPath` anchors, as site paths. Every
 * page in a cluster emits this same set, itself included.
 */
export function hreflangAlternates(
  caPath: string,
  /** For pairs not in US_PAGES, e.g. an article slug published in both regions. */
  usPath: string | undefined = US_PAGES[caPath],
): { hrefLang: string; path: string }[] {
  const out = [{ hrefLang: "en-CA", path: caPath }];
  if (usPath) out.push({ hrefLang: "en-US", path: usPath });
  if (FRENCH_PAGES[caPath]) out.push({ hrefLang: "fr-CA", path: FRENCH_PAGES[caPath] });
  out.push({ hrefLang: "x-default", path: caPath });
  return out;
}
