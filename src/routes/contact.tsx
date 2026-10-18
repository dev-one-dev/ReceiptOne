import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { pageSEO, breadcrumbJsonLd, regionHreflang } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => {
    const seo = pageSEO({
      path: "/contact",
      title: "Contact Us | ReceiptOne",
      description:
        "Get in touch with the ReceiptOne team — questions, feedback, or support requests for Canadian freelancers and small businesses.",
      hreflang: regionHreflang("/contact"),
    });

    const breadcrumb = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]);

    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [{ type: "application/ld+json", children: JSON.stringify(breadcrumb) }],
    };
  },
  component: ContactPage,
});

function ContactPage() {
  return (
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-4 text-center">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-ink">Get in touch</h1>
          <p className="mx-auto mt-3 max-w-lg font-sans text-body text-ink-60">
            Questions, feedback, or something not working right? We reply within 1–2 business days.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-[600px] px-4 sm:px-6 lg:px-0">
          <ContactForm region="ca" />
          <p className="mt-4 text-center text-sm text-ink-60">
            Prefer email? Write to us at{" "}
            <a
              href="mailto:support@receipt-one.com"
              className="font-medium text-ink underline underline-offset-2 hover:underline-offset-4"
            >
              support@receipt-one.com
            </a>
            .
          </p>
        </div>
      </section>

      <Footer region="ca" />
    </main>
  );
}
