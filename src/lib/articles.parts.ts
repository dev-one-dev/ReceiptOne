/**
 * The five parts of the Canadian articles hub (/articles). This is the one
 * place that assigns each CA article to a part; the hub, its sidebar, its jump
 * buttons and its ItemList JSON-LD all read from it, and
 * tests/articles-hub.test.ts checks that every CA article appears in exactly
 * one part. No React imports.
 */
import { ARTICLES, getArticlesByRegion, type Article } from "@/lib/articles";

/** A card that links to a site page rather than an article. */
export interface HubLink {
  href: "/ca/tax-deadlines" | "/ca/mileage-log-template";
  title: string;
  category: string;
  excerpt: string;
  /** Self-hosted 800x450 card photo (Pixabay; credit in docs/image-credits.md). */
  image: { path: string; alt: string };
}

export interface ArticlePart {
  /** Anchor id of the part's section on /articles. */
  id: string;
  /** "01".."05", shown as "Part 01". */
  number: string;
  title: string;
  subtitle: string;
  slugs: string[];
  /** Link cards shown after the part's articles. */
  links?: HubLink[];
}

export const ARTICLE_PARTS: ArticlePart[] = [
  {
    id: "filing",
    number: "01",
    title: "Filing and tax basics",
    subtitle: "What to file, what you can deduct and when it's due.",
    slugs: [
      "freelancer-taxes-canada-guide",
      "t2125-form-guide-canada",
      "self-employed-tax-deductions-canada",
      "home-office-deduction-canadian-freelancers",
      "track-gst-hst-business-expenses",
    ],
    links: [
      {
        href: "/ca/tax-deadlines",
        title: "Tax deadlines for self-employed Canadians",
        category: "Deadlines",
        excerpt: "Filing, payment, instalment and GST/HST dates for the current year.",
        image: {
          path: "/articles/tax-deadlines-card.webp",
          alt: "Close-up of a printed wall calendar grid with large black dates",
        },
      },
    ],
  },
  {
    id: "bookkeeping",
    number: "02",
    title: "Bookkeeping how-tos",
    subtitle: "Small habits that keep your records ready all year.",
    slugs: [
      "bookkeeping-self-employed-canada",
      "daily-receipt-routine",
      "month-end-bookkeeping-checklist-canada",
      "separate-business-personal-finances-canada",
      "year-end-checklist-accountant-canada",
    ],
  },
  {
    id: "receipts",
    number: "03",
    title: "Receipts and CRA records",
    subtitle: "What to keep, how long to keep it and how to back up a claim.",
    slugs: [
      "cra-receipt-rules-canada",
      "digital-receipts-canada-are-they-valid",
      "cra-audit-proof-expenses",
      "cra-audit-guide-self-employed-canada",
      "expense-tracking-canada-freelancers",
    ],
  },
  {
    id: "mileage",
    number: "04",
    title: "Mileage and vehicle",
    subtitle: "Log work kilometres and claim the business share of your car.",
    slugs: [
      "mileage-deduction-canada-freelancers",
      "mileage-tracking-apps-canada",
      "tax-deductions-rideshare-delivery-drivers-canada",
    ],
    links: [
      {
        href: "/ca/mileage-log-template",
        title: "Free CRA mileage log template",
        category: "Template",
        excerpt:
          "A mileage logbook in Excel or printable PDF, with a business-use percentage that adds itself up.",
        image: {
          path: "/articles/mileage-log-template-card.webp",
          alt: "Open blank notebook with a pencil, reading glasses and travel photos on an old map",
        },
      },
    ],
  },
  {
    id: "compare",
    number: "05",
    title: "Compare tools",
    subtitle: "How ReceiptOne stacks up against other options.",
    slugs: [
      "receipt-scanner-apps-canada-comparison",
      "quickbooks-vs-receiptone-canada",
      "spreadsheet-vs-expense-app",
    ],
  },
];

export interface ResolvedPart extends Omit<ArticlePart, "slugs"> {
  articles: Article[];
  links: HubLink[];
}

/** The parts with their slugs resolved to CA articles. Throws on an unknown
 * or non-CA slug so a typo fails the build instead of dropping a card. */
export function resolveArticleParts(articles: Article[] = ARTICLES): ResolvedPart[] {
  const ca = new Map(getArticlesByRegion(articles, "ca").map((a) => [a.slug, a]));
  return ARTICLE_PARTS.map(({ slugs, links, ...part }) => ({
    ...part,
    links: links ?? [],
    articles: slugs.map((slug) => {
      const a = ca.get(slug);
      if (!a) throw new Error(`articles.parts: "${slug}" is not a CA article`);
      return a;
    }),
  }));
}

/** Every CA article in hub display order (part by part). */
export function hubArticleOrder(articles: Article[] = ARTICLES): Article[] {
  return resolveArticleParts(articles).flatMap((p) => p.articles);
}
