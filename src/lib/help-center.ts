/**
 * Help Center configuration — one config object per region.
 * Add a new entry here to support additional regions in the future.
 */
import type { Article, Region } from "@/lib/articles";
import { ARTICLES, getArticlesByRegion } from "@/lib/articles";
import { US_ARTICLES } from "@/lib/articles.us";
import { regionHreflang } from "@/lib/seo";
import { FRENCH_PAGES } from "@/lib/locales";
import type { QA } from "@/components/site/Faq";
import { faqItems, faqItemsUS, CATEGORIZED_FAQ, CATEGORIZED_FAQ_US } from "@/components/site/Faq";

export type { Region };

export interface HelpCenterConfig {
  region: Region;
  faqItems: QA[];
  categorizedFaq: { category: string; items: QA[] }[];
  /** All articles visible in this region's Help Center. */
  articles: Article[];
  meta: {
    pageTitle: string;
    pageDescription: string;
    articlesHeading: string;
    articlesSubheading: string;
    landingPath: string;
    faqPath: string;
    articlesPath: string;
  };
}

export const CA_HELP_CENTER: HelpCenterConfig = {
  region: "ca",
  faqItems,
  categorizedFaq: CATEGORIZED_FAQ,
  articles: getArticlesByRegion(ARTICLES, "ca"),
  meta: {
    pageTitle: "Help Center — Frequently Asked Questions | ReceiptOne",
    pageDescription:
      "Answers to common questions about ReceiptOne — receipt scanning, GST/HST tracking, mileage, exports, pricing, and CRA compliance.",
    articlesHeading: "Tax guides for Canadian freelancers",
    articlesSubheading:
      "CRA-ready tips on receipts, GST/HST, mileage, and deductions — written for independent contractors and self-employed Canadians.",
    landingPath: "/ca",
    faqPath: "/faq",
    articlesPath: "/articles",
  },
};

export const US_HELP_CENTER: HelpCenterConfig = {
  region: "us",
  faqItems: faqItemsUS,
  categorizedFaq: CATEGORIZED_FAQ_US,
  articles: US_ARTICLES,
  meta: {
    pageTitle: "Help Center — Frequently Asked Questions | ReceiptOne US",
    pageDescription:
      "Answers to common questions about ReceiptOne — receipt scanning, sales tax tracking, mileage, exports, pricing, and IRS compliance.",
    articlesHeading: "Tax guides for US freelancers",
    articlesSubheading:
      "IRS-ready tips on receipts, deductions, mileage, and Schedule C — written for 1099 contractors and self-employed Americans.",
    landingPath: "/us",
    faqPath: "/us/faq",
    articlesPath: "/us/articles",
  },
};

/** Lookup helpers scoped to a specific region's article pool. */
export function getHelpCenterArticle(slug: string, allArticles: Article[]): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getHelpCenterRelated(slug: string, allArticles: Article[], count = 3): Article[] {
  const article = allArticles.find((a) => a.slug === slug);
  if (!article) return allArticles.slice(0, count);

  if (article.relatedSlugs && article.relatedSlugs.length > 0) {
    const results: Article[] = [];
    for (const relSlug of article.relatedSlugs) {
      const rel = allArticles.find((a) => a.slug === relSlug);
      if (rel && results.length < count) results.push(rel);
    }
    if (results.length >= count) return results;
    const relSet = new Set([...article.relatedSlugs, slug]);
    for (const a of allArticles) {
      if (!relSet.has(a.slug) && a.category === article.category && results.length < count) {
        results.push(a);
      }
    }
    return results;
  }

  const others = allArticles.filter((a) => a.slug !== slug);
  const scored = others.map((a) => {
    let score = 0;
    if (a.category === article.category) score += 10;
    if (a.clusterName && a.clusterName === article.clusterName) score += 8;
    for (const tag of article.tags) {
      if (a.tags.includes(tag)) score += 2;
    }
    return { article: a, score };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, count).map((s) => s.article);
}

/**
 * hreflang for a Canadian or US article slug: when the same slug is published
 * in both regions (/articles/$slug and /us/articles/$slug), and/or when the
 * Canadian article has a French translation (FRENCH_PAGES, from
 * FRENCH_ARTICLE_SLUGS in src/lib/locales.ts). Otherwise none.
 */
export function articleHreflang(slug: string) {
  const caPath = `/articles/${slug}`;
  const inCa = ARTICLES.some((a) => a.slug === slug);
  const inUs = US_ARTICLES.some((a) => a.slug === slug);
  const usPath = inCa && inUs ? `/us/articles/${slug}` : undefined;
  const inFr = inCa && caPath in FRENCH_PAGES;
  return usPath || inFr ? regionHreflang(caPath, usPath) : undefined;
}

export function getHelpCenter(region: Region): HelpCenterConfig {
  return region === "us" ? US_HELP_CENTER : CA_HELP_CENTER;
}
