import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { pageSEO, breadcrumbJsonLd } from "@/lib/seo";
import {
  getArticle,
  getRelatedArticles,
  articleJsonLd,
  type ContentBlock,
  type Article,
} from "@/lib/articles";

export const Route = (createFileRoute as any)("/articles/$slug")({
  head: ({ params }: { params: { slug: string } }) => {
    const article = getArticle(params.slug);

    if (!article) {
      return {
        meta: [{ title: "Article Not Found | ReceiptOne" }],
        links: [],
      };
    }

    const seo = pageSEO({
      path: `/articles/${article.slug}`,
      title: `${article.title} | ReceiptOne`,
      description: article.excerpt,
      ogType: "article",
      ogImage: article.imageUrl,
    });

    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Articles", path: "/articles" },
      { name: article.title, path: `/articles/${article.slug}` },
    ]);

    return {
      meta: [
        ...seo.meta,
        { property: "article:published_time", content: article.publishedAt },
        { property: "article:author", content: article.author.name },
        { property: "article:section", content: article.category },
        ...article.tags.map((tag) => ({ property: "article:tag", content: tag })),
      ],
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        { type: "application/ld+json", children: JSON.stringify(articleJsonLd(article)) },
      ],
    };
  },
  component: ArticleDetailPage,
});

/* ----------------------------- Not found ---------------------------------- */

function ArticleNotFound() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />
      <div className="mx-auto flex min-h-[60vh] max-w-[760px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-ink">Article not found</h1>
        <p className="mt-4 font-sans text-body text-ink-60">
          The article you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to={"/articles/" as any}
          className="mt-8 inline-flex items-center gap-2 rounded-pill border border-hairline px-5 py-2.5 font-sans text-sm font-semibold text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-paper"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to all articles
        </Link>
      </div>
      <Footer region="ca" />
    </main>
  );
}

/* ----------------------------- Content blocks ----------------------------- */

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={index} className="mb-5 font-sans text-body text-ink-80">
          {block.text}
        </p>
      );

    case "h2":
      return (
        <h2 key={index} className="mb-4 mt-10 text-h3 text-ink">
          {block.text}
        </h2>
      );

    case "ul":
      return (
        <ul key={index} className="mb-5 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ember" aria-hidden />
              <span className="font-sans text-body text-ink-80">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <div
          key={index}
          className="mb-5 overflow-hidden rounded-card border border-hairline bg-paper"
        >
          <div className="flex gap-0">
            {/* Orange left stripe */}
            <div className="w-1 shrink-0 bg-ember" aria-hidden />
            <p className="p-6 font-sans text-body text-ink-80">{block.text}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ----------------------------- Small card (related) ----------------------- */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function RelatedCard({ article }: { article: Article }) {
  return (
    <Link
      to={"/articles/$slug" as any}
      params={{ slug: article.slug } as any}
      className="group flex flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      <div className="overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-block rounded-pill bg-ink-05 px-3 py-1 eyebrow text-ink-60">
          {article.category}
        </span>
        <h3 className="mt-3 text-lead tracking-body text-ink">{article.title}</h3>
        <div className="mt-auto flex items-center gap-3 pt-4 text-label text-ink-60">
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

/* ----------------------------- CTA strip ---------------------------------- */

function CtaBanner() {
  return (
    <section data-surface="void" className="bg-ink py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-8">
        <p className="eyebrow">Get Started</p>
        <h2 className="mt-3 text-paper">Start managing your receipts in minutes</h2>
        <p className="mx-auto mt-4 max-w-md font-sans text-body text-paper-60">
          Built for Canadian freelancers who want to stay CRA-ready without the paperwork headache.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to={"/ca" as any}
            hash="pricing"
            className="inline-flex items-center gap-2 rounded-pill bg-ember px-6 py-3 font-sans text-sm font-semibold text-ink transition-all duration-200 hover:bg-ember-hover hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
          >
            See pricing
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            to={"/ca" as any}
            className="inline-flex items-center gap-2 rounded-pill border border-hairline-void px-6 py-3 font-sans text-sm font-semibold text-paper transition-all duration-200 hover:border-paper-40 hover:bg-paper-05"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Main page component ----------------------- */

function ArticleDetailPage() {
  const { slug } = (Route.useParams as any)() as { slug: string };
  const article = getArticle(slug);

  if (!article) {
    return <ArticleNotFound />;
  }

  const related = getRelatedArticles(slug, 3);

  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Back link + breadcrumb */}
      <div className="mx-auto max-w-[1200px] px-4 pt-28 pb-6 sm:px-6 lg:px-8">
        <nav
          aria-label="breadcrumb"
          className="flex items-center gap-2 font-sans text-sm text-ink-60"
        >
          <Link
            to={"/articles/" as any}
            className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All articles
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate font-medium text-ink-80">{article.category}</span>
        </nav>

        {article.clusterPillar && article.clusterName && (
          <p className="mt-3 font-sans text-sm text-ink-60">
            Part of the{" "}
            <Link
              to={"/articles/$slug" as any}
              params={{ slug: article.clusterPillar } as any}
              className="font-medium text-ink underline underline-offset-2 transition-colors duration-150 hover:text-ember"
            >
              {article.clusterName}
            </Link>{" "}
            guide
          </p>
        )}
      </div>

      <article>
        {/* Hero image */}
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-card">
            <img
              src={article.imageUrl}
              alt={article.imageAlt}
              loading="lazy"
              decoding="async"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </div>

        {/* Article header */}
        <header className="mx-auto max-w-[760px] px-4 pb-8 pt-10 sm:px-6 lg:px-0">
          {/* Category pill */}
          <span className="inline-block rounded-pill bg-ember/10 px-3 py-1 eyebrow text-ember">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="mt-4 text-ink">{article.title}</h1>

          {/* Excerpt / lead */}
          <p className="mt-4 font-sans text-lead text-ink-60">{article.excerpt}</p>

          {/* Author + meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-hairline pt-6">
            {/* Author initials avatar */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-[#fed7aa] font-display text-sm font-semibold text-[#9a3412]">
              {article.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold text-ink">{article.author.name}</p>
              <p className="font-sans text-label text-ink-60">{article.author.role}</p>
            </div>

            <div className="ml-auto flex items-center gap-4 font-sans text-sm text-ink-60">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden />
                {article.readTime} min read
              </span>
              <span>·</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </div>
          </div>
        </header>

        {/* Article body */}
        <div className="mx-auto max-w-[760px] px-4 pb-16 sm:px-6 lg:px-0">
          {article.body.map((block, i) => renderBlock(block, i))}
        </div>

        {/* Tags */}
        <div className="mx-auto max-w-[760px] px-4 pb-16 sm:px-6 lg:px-0">
          <div className="flex flex-wrap gap-2 border-t border-hairline pt-8">
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

      {/* Related articles */}
      {related.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <h2 className="text-h3 text-ink">More guides</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <RelatedCard key={rel.slug} article={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CtaBanner />

      <Footer region="ca" />
    </main>
  );
}
