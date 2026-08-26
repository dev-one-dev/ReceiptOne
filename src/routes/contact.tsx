import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";
import { pageSEO, breadcrumbJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => {
    const seo = pageSEO({
      path: "/contact",
      title: "Contact Us | ReceiptOne",
      description:
        "Get in touch with the ReceiptOne team — questions, feedback, or support requests for Canadian freelancers and small businesses.",
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
      className="min-h-screen overflow-x-clip bg-[#f5f4f0] font-sans text-black antialiased"
    >
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-4 text-center">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-0">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/55">
            Contact
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            Get in touch
          </h1>
          <p className="mx-auto mt-3 max-w-lg font-sans text-base leading-relaxed text-black/55">
            Questions, feedback, or something not working right? We reply within one business day.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-[600px] px-4 sm:px-6 lg:px-0">
          <ContactForm region="ca" />
        </div>
      </section>

      <Footer region="ca" />
    </main>
  );
}
