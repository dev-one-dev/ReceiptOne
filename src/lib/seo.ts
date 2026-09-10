/**
 * SEO helpers for ReceiptOne.
 *
 * Centralized site URL + meta/JSON-LD builders so every route stays in sync
 * (canonicals, hreflang, OG, structured data).
 */
import { SITE_URL as EXTERNAL_SITE_URL, siteUrl } from "@/lib/external";

export const SITE_URL = EXTERNAL_SITE_URL;
export const SITE_NAME = "ReceiptOne";
// Placeholder card from scripts/generate-og-image.mjs. Replace
// public/og-image.png with a designed 1200x630 asset when one exists.
export const DEFAULT_OG_IMAGE = siteUrl("/og-image.png");

export const url = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

type MetaEntry =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

type LinkEntry = { rel: string; href: string; hrefLang?: string };

export type PageSEOInput = {
  path: string; // e.g. "/us"
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  hreflang?: { hrefLang: string; href: string }[];
  noIndex?: boolean;
};

export function pageSEO(input: PageSEOInput): {
  meta: MetaEntry[];
  links: LinkEntry[];
} {
  const ogTitle = input.ogTitle ?? input.title;
  const ogDescription = input.ogDescription ?? input.description;
  const ogImage = input.ogImage ?? DEFAULT_OG_IMAGE;
  const canonical = url(input.path);

  const meta: MetaEntry[] = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:type", content: input.ogType ?? "website" },
    { property: "og:url", content: canonical },
    { property: "og:image", content: ogImage },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: ogTitle },
    { name: "twitter:description", content: ogDescription },
    { name: "twitter:image", content: ogImage },
  ];
  if (input.noIndex) meta.push({ name: "robots", content: "noindex,nofollow" });

  const links: LinkEntry[] = [{ rel: "canonical", href: canonical }];
  for (const h of input.hreflang ?? []) {
    links.push({ rel: "alternate", hrefLang: h.hrefLang, href: h.href });
  }
  return { meta, links };
}

/* ------------------------------ JSON-LD --------------------------------- */

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export function softwareApplicationJsonLd(region: "us" | "ca") {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web, iOS, Android",
    description:
      region === "us"
        ? "ReceiptOne helps US freelancers, contractors, and small businesses organize receipts, track expenses and mileage, and export tax-ready reports."
        : "ReceiptOne helps Canadian freelancers, contractors, and small businesses organize receipts, track GST/HST, mileage, and export accountant-ready reports.",
    url: url(region === "us" ? "/us" : "/ca"),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: url(it.path),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export const HREFLANG_US_CA = [
  { hrefLang: "en-US", href: url("/us") },
  { hrefLang: "en-CA", href: url("/ca") },
  { hrefLang: "x-default", href: url("/us") },
];
