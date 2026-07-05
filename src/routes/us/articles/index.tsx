import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticlesSection } from "@/components/site/ArticlesSection";
import { pageSEO, breadcrumbJsonLd, SITE_URL, HREFLANG_US_CA } from "@/lib/seo";
import { US_ARTICLES } from "@/lib/articles.us";

export const Route = (createFileRoute as any)("/us/articles/")({
  head: () => {
    const seo = pageSEO({
      path: "/us/articles",
      title: "Tax Guides for US Freelancers | ReceiptOne Knowledge Base",
      description:
        "IRS expense rules, Schedule C deductions, mileage tracking, and more. Free tax guides written for US freelancers, 1099 contractors, and self-employed workers.",
      ogTitle: "US Freelancer Tax Guides | ReceiptOne",
      ogDescription:
        "Expert guides on IRS compliance, Schedule C, mileage tracking, and top deductions for self-employed Americans.",
      hreflang: HREFLANG_US_CA,
    });

    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", path: "/us" },
      { name: "Articles", path: "/us/articles" },
    ]);

    const collectionJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Tax Guides for US Freelancers",
      description:
        "A knowledge base of US tax and receipt management guides for freelancers and self-employed workers.",
      url: `${SITE_URL}/us/articles`,
      publisher: {
        "@type": "Organization",
        name: "ReceiptOne",
        url: SITE_URL,
      },
    };

    const itemListJsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Tax Guides for US Freelancers",
      url: `${SITE_URL}/us/articles`,
      numberOfItems: US_ARTICLES.length,
      itemListElement: US_ARTICLES.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/us/articles/${a.slug}`,
        name: a.title,
      })),
    };

    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
        { type: "application/ld+json", children: JSON.stringify(collectionJsonLd) },
        { type: "application/ld+json", children: JSON.stringify(itemListJsonLd) },
      ],
    };
  },
  component: USArticlesIndexPage,
});

function USArticlesIndexPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f5f4f0] font-sans text-black antialiased">
      <Header />

      {/* Page hero */}
      <section className="pt-24 pb-4 text-center">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/55">
            Knowledge Base
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            Tax guides for US freelancers
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base leading-relaxed text-black/55 sm:text-lg">
            IRS-ready tips on receipts, deductions, mileage, and Schedule C — written for
            1099 contractors and self-employed Americans.
          </p>
        </div>
      </section>

      <ArticlesSection articles={US_ARTICLES} showHeader={false} basePath="/us/articles" />

      <CtaBanner />

      <Footer region="us" />
    </main>
  );
}

function CtaBanner() {
  return (
    <section className="bg-[#0d0d14] py-6 sm:py-8">
      <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-8">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50">
          Get Started
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          Start managing your receipts in minutes
        </h2>
        <p className="mx-auto mt-2 max-w-md font-sans text-base text-white/55">
          Join thousands of US freelancers who use ReceiptOne to stay IRS-ready
          without the paperwork headache.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to={"/signup" as any}
            className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:bg-[#ea6c0a] hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
          >
            Try free for 7 days
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            to={"/us" as any}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/5"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
