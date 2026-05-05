import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import logoMark from "../assets/figma/logo-mark.svg?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ReceiptOne — Receipt, Expense & Mileage Tracker" },
      { name: "description", content: "Track expenses, store receipts, and generate tax-ready reports. Built for freelancers, self-employed, and small businesses in Canada and the USA." },
      { name: "author", content: "ReceiptOne" },
      { property: "og:title", content: "ReceiptOne — Receipt, Expense & Mileage Tracker" },
      { property: "og:description", content: "Track expenses, store receipts, and generate tax-ready reports. Built for freelancers, self-employed, and small businesses in Canada and the USA." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ReceiptOne — Receipt, Expense & Mileage Tracker" },
      { name: "twitter:description", content: "Track expenses, store receipts, and generate tax-ready reports. Built for freelancers, self-employed, and small businesses in Canada and the USA." },
      { name: "twitter:image", content: "/og-image.svg" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: logoMark },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href={logoMark} />
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
  return <Outlet />;
}
