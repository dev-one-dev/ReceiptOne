import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CardImage, CategoryPill } from "@/components/site/ArticlesSection";
import { FrArticlesCta } from "@/components/site/FrArticlesCta";
import { getServerNow } from "@/lib/server-time.functions";
import { pageSEO, breadcrumbJsonLd, regionHreflang, SITE_URL } from "@/lib/seo";
import { articleDisplayTitle, readingMinutes } from "@/lib/articles";
import {
  FR_ARTICLES,
  FR_ARTICLES_INDEX,
  formatFrArticleDate,
  type FrArticle,
} from "@/lib/articles.fr";

/** French articles index (fr-CA): a plain card grid, paired with /articles for hreflang. */
export const Route = (createFileRoute as any)("/fr/articles/")({
  loader: async () => ({ now: await getServerNow() }),
  head: () => {
    const seo = pageSEO({
      path: "/fr/articles",
      title: FR_ARTICLES_INDEX.title,
      description: FR_ARTICLES_INDEX.description,
      hreflang: regionHreflang("/articles"),
    });
    const breadcrumb = breadcrumbJsonLd([
      { name: "Accueil", path: "/fr" },
      { name: "Articles", path: "/fr/articles" },
    ]);
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: FR_ARTICLES_INDEX.heading,
      url: `${SITE_URL}/fr/articles`,
      numberOfItems: FR_ARTICLES.length,
      itemListElement: FR_ARTICLES.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/fr/articles/${a.slug}`,
        name: a.title,
      })),
    };
    return {
      meta: [...seo.meta, { property: "og:locale", content: "fr_CA" }],
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        { type: "application/ld+json", children: JSON.stringify(itemList) },
      ],
    };
  },
  component: FrArticlesIndexPage,
});

function FrCard({ article, eager }: { article: FrArticle; eager: boolean }) {
  return (
    <Link
      to={"/fr/articles/$slug" as any}
      params={{ slug: article.slug } as any}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      <CardImage article={article} eager={eager} />
      <div className="flex flex-1 flex-col p-3">
        <CategoryPill label={article.category} />
        <h2 className="mt-1.5 text-lead tracking-body text-ink">{articleDisplayTitle(article)}</h2>
        <div className="mt-auto flex items-center gap-3 pt-2 text-label text-ink-60">
          <span className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            {readingMinutes(article)} min de lecture
          </span>
          <span>·</span>
          <time dateTime={article.publishedAt}>{formatFrArticleDate(article.publishedAt)}</time>
        </div>
      </div>
    </Link>
  );
}

function FrArticlesIndexPage() {
  const { now } = Route.useLoaderData() as { now: string };
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      <section className="pt-24 pb-4 text-center">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">{FR_ARTICLES_INDEX.eyebrow}</p>
          <h1 className="mt-3 text-ink">{FR_ARTICLES_INDEX.heading}</h1>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-ink-60 sm:text-lead">
            {FR_ARTICLES_INDEX.subheading}
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8 lg:py-10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {FR_ARTICLES.map((article, i) => (
            <FrCard key={article.slug} article={article} eager={i < 3} />
          ))}
        </div>
      </section>

      <FrArticlesCta />
      <Footer region="ca" now={now} />
    </main>
  );
}
