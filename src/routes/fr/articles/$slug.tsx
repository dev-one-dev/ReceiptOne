import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CardImage, CategoryPill } from "@/components/site/ArticlesSection";
import { ArticleBody } from "@/components/site/ArticleContent";
import { CorrectionLine } from "@/components/site/CorrectionLine";
import { FrArticlesCta } from "@/components/site/FrArticlesCta";
import { getServerNow } from "@/lib/server-time.functions";
import { pageSEO, breadcrumbJsonLd, faqJsonLd, regionHreflang } from "@/lib/seo";
import {
  articleDisplayTitle,
  articleFaq,
  articleJsonLd,
  articleOgImage,
  readingMinutes,
} from "@/lib/articles";
import {
  FR_ARTICLE_BYLINE,
  formatFrArticleDate,
  getFrArticle,
  getFrRelatedArticles,
  type FrArticle,
} from "@/lib/articles.fr";

/**
 * French article (fr-CA). Same template as /articles/$slug: hero image,
 * header, body blocks through ArticleBody (lang="fr"), FAQPage JSON-LD,
 * sources, disclaimer and the correction line. hreflang pairs it with its
 * English counterpart (FRENCH_ARTICLE_SLUGS in src/lib/locales.ts).
 */
export const Route = (createFileRoute as any)("/fr/articles/$slug")({
  loader: async ({ params }: { params: { slug: string } }) => {
    const now = await getServerNow();
    if (!getFrArticle(params.slug)) throw notFound({ data: { now } });
    return { now };
  },
  head: ({ params }: { params: { slug: string } }) => {
    const article = getFrArticle(params.slug);
    if (!article) {
      return {
        meta: [
          { title: "Article introuvable | ReceiptOne" },
          { name: "robots", content: "noindex,nofollow" },
        ],
        links: [],
      };
    }
    const path = `/fr/articles/${article.slug}`;
    const seo = pageSEO({
      path,
      title: article.title,
      description: article.excerpt,
      ogType: "article",
      ogImage: articleOgImage(article),
      hreflang: regionHreflang(`/articles/${article.enSlug}`),
    });
    const breadcrumb = breadcrumbJsonLd([
      { name: "Accueil", path: "/fr" },
      { name: "Articles", path: "/fr/articles" },
      { name: article.title, path },
    ]);
    const faq = articleFaq(article);
    return {
      meta: [
        ...seo.meta,
        { property: "og:locale", content: "fr_CA" },
        { property: "article:published_time", content: article.publishedAt },
        { property: "article:modified_time", content: article.updatedAt },
        { property: "article:author", content: FR_ARTICLE_BYLINE },
        { property: "article:section", content: article.category },
        ...article.tags.map((tag) => ({ property: "article:tag", content: tag })),
      ],
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        {
          type: "application/ld+json",
          children: JSON.stringify({ ...articleJsonLd(article, path), inLanguage: "fr-CA" }),
        },
        ...(faq.length > 0
          ? [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd(faq)) }]
          : []),
      ],
    };
  },
  component: FrArticlePage,
  notFoundComponent: ({ data }: { data?: { now?: string } }) => (
    <FrArticleNotFound now={data?.now} />
  ),
});

const minutes = (a: FrArticle) => `${readingMinutes(a)} min de lecture`;

function FrArticleNotFound({ now }: { now?: string }) {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />
      <div className="mx-auto flex min-h-[60vh] max-w-[760px] flex-col items-center justify-center px-4 pt-24 pb-10 text-center sm:px-6">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-ink">Article introuvable</h1>
        <p className="mt-4 font-sans text-body text-ink-60">
          L'article que vous cherchez n'existe pas ou a peut-être été déplacé.
        </p>
        <Link
          to={"/fr/articles/" as any}
          className="mt-6 inline-flex items-center gap-2 rounded-pill border border-hairline px-5 py-2.5 font-sans text-sm font-semibold text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-paper"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux articles
        </Link>
      </div>
      <Footer region="ca" now={now} />
    </main>
  );
}

function RelatedCard({ article }: { article: FrArticle }) {
  return (
    <Link
      to={"/fr/articles/$slug" as any}
      params={{ slug: article.slug } as any}
      className="group flex flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      <CardImage article={article} />
      <div className="flex flex-1 flex-col p-3">
        <CategoryPill label={article.category} />
        <h3 className="mt-1.5 text-lead tracking-body text-ink">{articleDisplayTitle(article)}</h3>
        <div className="mt-auto flex items-center gap-3 pt-2 text-label text-ink-60">
          <span className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {minutes(article)}
          </span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{formatFrArticleDate(article.publishedAt)}</time>
        </div>
      </div>
    </Link>
  );
}

function FrArticlePage() {
  const { slug } = (Route.useParams as any)() as { slug: string };
  const { now } = Route.useLoaderData() as { now: string };
  const article = getFrArticle(slug);
  if (!article) return <FrArticleNotFound now={now} />;
  const related = getFrRelatedArticles(slug, 3);
  const title = articleDisplayTitle(article);

  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      <div className="mx-auto max-w-[760px] px-4 pt-24 pb-4 sm:px-6 lg:px-0">
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center gap-2 font-sans text-sm text-ink-60"
        >
          <Link
            to={"/fr/articles/" as any}
            className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tous les articles
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate font-medium text-ink-80">{article.category}</span>
        </nav>
      </div>

      <article>
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <div className="overflow-hidden rounded-card">
            <img
              src={article.image.path}
              alt={article.image.alt}
              width={article.image.width}
              height={article.image.height}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>

        <header className="mx-auto max-w-[760px] px-4 pb-6 pt-6 sm:px-6 lg:px-0">
          <span className="inline-block rounded-pill bg-ember px-3 py-1 eyebrow text-ink">
            {article.category}
          </span>
          <h1 className="mt-4 text-ink">{title}</h1>
          <p className="mt-4 font-sans text-lead text-ink-60">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-hairline pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-[#fed7aa] font-display text-sm font-semibold text-[#9a3412]">
              R
            </div>
            <p className="min-w-0 font-sans text-sm font-semibold text-ink">{FR_ARTICLE_BYLINE}</p>
            <div className="ml-auto flex items-center gap-4 font-sans text-sm text-ink-60">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden />
                {minutes(article)}
              </span>
              <span>·</span>
              <time dateTime={article.publishedAt}>{formatFrArticleDate(article.publishedAt)}</time>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[760px] px-4 pb-10 sm:px-6 lg:px-0">
          <ArticleBody article={article} lang="fr" />
          <CorrectionLine
            lang="fr"
            title={title}
            path={`/fr/articles/${article.slug}`}
            className="mb-5"
          />
        </div>

        <div className="mx-auto max-w-[760px] px-4 pb-10 sm:px-6 lg:px-0">
          <div className="flex flex-wrap gap-2 border-t border-hairline pt-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill bg-ink-05 px-3 py-1 font-sans text-label font-medium text-ink-60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-white py-6 sm:py-8 lg:py-10">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-h3 text-ink">Autres guides</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <RelatedCard key={rel.slug} article={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FrArticlesCta />
      <Footer region="ca" now={now} />
    </main>
  );
}
