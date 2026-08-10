import {
  Outlet,
  Link,
  useLocation,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import appCss from "../styles.css?url";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/integrations/firebase/auth-context";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { NotFoundBeaver } from "@/components/site/NotFoundBeaver";

export function NotFoundComponent() {
  const location = useLocation();
  const isUS = location.pathname.startsWith("/us");
  const region = isUS ? "us" : "ca";

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f5f4f0] font-sans text-black antialiased">
      <Header />

      <section className="px-4 pb-10 pt-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[440px]">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/55">
            404
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
            This page doesn&apos;t add up.
          </h1>
          <p className="mx-auto mt-2 max-w-sm font-sans text-base leading-relaxed text-black/55">
            The link may be broken or the page may have moved. Your receipts are still exactly where
            you left them.
          </p>

          <div className="mt-6">
            <NotFoundBeaver />
          </div>

          <div className="mt-6">
            <Link
              to={region === "us" ? "/us" : "/ca"}
              className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:bg-[#ea6c0a] hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
            >
              Back to ReceiptOne
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <Footer region={region} />
    </main>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ReceiptOne | Receipt, Expense & Mileage Tracker" },
      {
        name: "description",
        content:
          "ReceiptOne helps freelancers and small businesses organize receipts, track mileage, manage expenses, and export tax-ready reports.",
      },
      { name: "author", content: "ReceiptOne" },
      { name: "theme-color", content: "#f5f4f0" },
      { name: "format-detection", content: "telephone=no" },
      // Per-route head() overrides og/twitter tags below for shareable pages.
      { property: "og:site_name", content: "ReceiptOne" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
