import { Outlet, useLocation, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

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
    <main
      data-interactive-page
      className="min-h-screen overflow-x-clip bg-paper font-sans text-ink antialiased"
    >
      <Header />

      <section className="px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <NotFoundBeaver />
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
        // Weight ceiling is 600 — 700/800 are deliberately not fetched.
        // Inter is retained only as the inherited --default-font-family for the
        // dashboard/helpdesk/shadcn surfaces, which declare no family of their
        // own; the marketing shells set font-sans/font-display explicitly and
        // render Inter Tight. Inter Tight 400 is new and required: marketing
        // body copy is 400 and would otherwise synthesize.
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Inter+Tight:wght@400;500;600&family=Geist+Mono:wght@400&display=swap",
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
