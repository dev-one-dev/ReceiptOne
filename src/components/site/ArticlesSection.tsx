import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import {
  ARTICLES,
  articleCardImage,
  formatArticleDate,
  readingMinutes,
  type Article,
  articleDisplayTitle,
} from "@/lib/articles";

/* ----------------------------- Shared helpers ----------------------------- */

const formatDate = (iso: string) => formatArticleDate(iso);

/* ----------------------------- Category pill ------------------------------ */

/** One pill style on every card. self-start: in the card's flex column it
 * would otherwise stretch to the full width. */
export function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-block self-start rounded-pill bg-ink-05 px-3 py-1 eyebrow text-ink-60">
      {label}
    </span>
  );
}

/* ----------------------------- Card image --------------------------------- */

/** 16:9 photo at the top of a card; the card's overflow-hidden rounds its top
 * corners. Explicit width/height reserve the space before it loads. Only the
 * featured card (above the fold) loads eagerly. */
export function CardImage({ article, eager = false }: { article: Article; eager?: boolean }) {
  return (
    <div className="overflow-hidden">
      <img
        src={articleCardImage(article)}
        alt={article.image.alt}
        width={800}
        height={450}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}

/* ----------------------------- Featured card ------------------------------ */

function FeaturedCard({ article, basePath }: { article: Article; basePath: string }) {
  return (
    <Link
      to={`${basePath}/$slug` as any}
      params={{ slug: article.slug } as any}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      <CardImage article={article} eager />

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <CategoryPill label={article.category} />

        <h3 className="mt-2 text-h3 text-ink">{articleDisplayTitle(article)}</h3>

        <p className="mt-1.5 flex-1 font-sans text-body text-ink-60">{article.excerpt}</p>

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-4 text-sm text-ink-60">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {readingMinutes(article)} min read
          </span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>

        {/* CTA */}
        <div className="mt-3 flex items-center gap-1.5 font-sans text-sm font-semibold text-ink">
          Read article
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

/* ----------------------------- Small card --------------------------------- */

export function SmallCard({
  article,
  basePath,
  eager = false,
}: {
  article: Article;
  basePath: string;
  /** Load the image eagerly: only for a card that is above the fold. */
  eager?: boolean;
}) {
  return (
    <Link
      to={`${basePath}/$slug` as any}
      params={{ slug: article.slug } as any}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      <CardImage article={article} eager={eager} />

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <CategoryPill label={article.category} />

        <h3 className="mt-1.5 text-lead tracking-body text-ink">{articleDisplayTitle(article)}</h3>

        {/* Meta row */}
        <div className="mt-auto pt-2 flex items-center gap-3 text-label text-ink-60">
          <span className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {readingMinutes(article)} min read
          </span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>
      </div>
    </Link>
  );
}

/* ----------------------------- Main section ------------------------------- */

interface ArticlesSectionProps {
  articles?: Article[];
  showHeader?: boolean;
  limit?: number;
  basePath?: string;
  region?: "ca" | "us";
}

export function ArticlesSection({
  articles,
  showHeader = true,
  limit,
  basePath = "/articles",
  region = "ca",
}: ArticlesSectionProps) {
  const all = articles ?? ARTICLES;
  const items = limit ? all.slice(0, limit) : all;

  const [featured, ...rest] = items;
  const row1Right = rest.slice(0, 2);
  const row2 = rest.slice(2);

  if (!featured) return null;

  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Knowledge Base</p>
              <h2 className="mt-1 text-ink">
                {region === "us"
                  ? "Tax guides for US freelancers"
                  : "Tax guides for self-employed Canadians"}
              </h2>
            </div>

            <Link
              to={`${basePath}/` as any}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-pill border border-hairline px-5 py-2.5 font-sans text-sm font-semibold text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-paper sm:self-auto"
            >
              All articles
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}

        {/* Row 1: featured (2/3) + two stacked small cards (1/3) */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr]">
          <FeaturedCard article={featured} basePath={basePath} />

          {row1Right.length > 0 && (
            <div className="grid grid-rows-2 gap-3">
              {row1Right.map((article) => (
                <SmallCard key={article.slug} article={article} basePath={basePath} />
              ))}
            </div>
          )}
        </div>

        {/* Row 2: up to 3 equal cards */}
        {row2.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {row2.map((article) => (
              <SmallCard key={article.slug} article={article} basePath={basePath} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
