import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { ARTICLES, type Article } from "@/lib/articles";

/* ----------------------------- Shared helpers ----------------------------- */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ----------------------------- Category pill ------------------------------ */

function CategoryPill({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: "featured" | "neutral";
}) {
  return (
    <span
      className={`inline-block rounded-pill px-3 py-1 eyebrow ${
        variant === "featured" ? "bg-ember text-ink" : "bg-ink-05 text-ink-60"
      }`}
    >
      {label}
    </span>
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
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <CategoryPill label={article.category} variant="featured" />

        <h3 className="mt-2 text-h3 text-ink">{article.title}</h3>

        <p className="mt-1.5 flex-1 font-sans text-body text-ink-60">{article.excerpt}</p>

        {/* Meta row */}
        <div className="mt-3 flex items-center gap-4 text-sm text-ink-60">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {article.readTime} min read
          </span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </div>

        {/* CTA */}
        <div className="mt-3 flex items-center gap-1.5 font-sans text-sm font-semibold text-ember-text">
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

function SmallCard({ article, basePath }: { article: Article; basePath: string }) {
  return (
    <Link
      to={`${basePath}/$slug` as any}
      params={{ slug: article.slug } as any}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <CategoryPill label={article.category} variant="neutral" />

        <h3 className="mt-1.5 text-lead tracking-body text-ink">{article.title}</h3>

        {/* Meta row */}
        <div className="mt-auto pt-2 flex items-center gap-3 text-label text-ink-60">
          <span className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {article.readTime} min
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
                  : "Tax guides for Canadian freelancers"}
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
