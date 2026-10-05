/**
 * SEO helpers for ReceiptOne.
 *
 * Centralized site URL + meta/JSON-LD builders so every route stays in sync
 * (canonicals, hreflang, OG, structured data).
 */
import { SITE_URL as EXTERNAL_SITE_URL, siteUrl } from "@/lib/external";
import { getPlans, type Plan } from "@/lib/pricing";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/stores";

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

/** 512x512 PNG of the logo mark (scripts/generate-logo.mjs). */
export const LOGO_URL = siteUrl("/logo-512.png");

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Social profiles linked from the site footer — keep the URLs identical. */
const SOCIAL_PROFILES = [
  "https://x.com/receiptone",
  "https://linkedin.com/company/receiptone",
  "https://facebook.com/receiptone",
];

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 512,
    height: 512,
  },
  // One App Store entry: both storefronts are the same listing (id6755740822),
  // so the CA one stands in, matching the CA-canonical site.
  sameAs: [APP_STORE_URL.ca, PLAY_STORE_URL, ...SOCIAL_PROFILES],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

/** UN/CEFACT codes for a subscription's billing period. */
const BILLING_UNIT: Record<Plan["id"], string> = { week: "WEE", month: "MON", year: "ANN" };

export function softwareApplicationJsonLd(region: "us" | "ca") {
  const pageUrl = url(region === "us" ? "/us" : "/ca");
  const country = region === "us" ? "US" : "CA";
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "FinanceApplication",
    operatingSystem: "iOS, Android, Web",
    description:
      region === "us"
        ? "ReceiptOne helps US freelancers, contractors, and small businesses organize receipts, track expenses and mileage, and export tax-ready reports."
        : "ReceiptOne helps Canadian freelancers, contractors, and small businesses organize receipts, track GST/HST, mileage, and export accountant-ready reports.",
    url: pageUrl,
    publisher: { "@id": ORGANIZATION_ID },
    // areaServed sits on each Offer: schema.org defines it for Offer, not
    // for SoftwareApplication, so validators would reject it one level up.
    offers: getPlans(region).map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price,
      priceCurrency: plan.currency,
      areaServed: country,
      url: `${pageUrl}#pricing`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: plan.price,
        priceCurrency: plan.currency,
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: BILLING_UNIT[plan.id],
        },
      },
    })),
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

/**
 * hreflang set for a page that exists in both regions. Both pages of a pair
 * must emit the identical set (each one includes itself). The CA version is
 * canonical, so it is also x-default. Only pass genuine equivalents: a US
 * page with no CA counterpart gets no hreflang at all.
 */
export function regionHreflang(caPath: string, usPath: string) {
  return [
    { hrefLang: "en-CA", href: url(caPath) },
    { hrefLang: "en-US", href: url(usPath) },
    { hrefLang: "x-default", href: url(caPath) },
  ];
}
