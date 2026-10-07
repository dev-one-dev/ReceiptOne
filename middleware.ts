import { APP_URL, appUrl } from "./src/lib/external";

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard",
    "/dashboard/:path*",
    "/helpdesk",
    "/helpdesk/:path*",
    "/articles/how-long-keep-receipts-canada",
    "/articles/cra-receipt-rules-canadian-freelancer",
    "/articles/cra-acceptable-receipt-requirements",
    "/articles/what-receipts-do-i-need-for-taxes-canada",
    "/articles/receipt-organization-tips-canada",
    "/articles/self-employed-expense-report-template-canada",
    "/articles/year-round-tax-prep-canada",
    "/articles/tax-season-stress-freelancers-canada",
    "/articles/mileage-tracking-self-employed-2025-guide",
    "/articles/cra-mileage-logbook-requirements",
    "/articles/vehicle-expense-deductions-canada",
    "/articles/gst-hst-expense-tracking-canada",
    "/articles/input-tax-credits-canada-guide",
    "/articles/gst-hst-registration-threshold-canada",
    "/articles/pst-qst-freelancers-canada",
    "/articles/top-tax-deductions-canadian-self-employed-2025",
    "/articles/business-expense-categories-canada",
    "/articles/reimbursable-expenses-canada-freelancers",
    "/articles/freelancer-tax-mistakes-canada",
    "/articles/home-office-vs-coworking-expense-canada",
  ],
};

/** Retired article slugs, merged into another article: old path -> new path. */
const MERGED_ARTICLES: Record<string, string> = {
  "/articles/how-long-keep-receipts-canada": "/articles/cra-receipt-rules-canada",
  "/articles/cra-receipt-rules-canadian-freelancer": "/articles/cra-receipt-rules-canada",
  "/articles/cra-acceptable-receipt-requirements": "/articles/cra-receipt-rules-canada",
  "/articles/what-receipts-do-i-need-for-taxes-canada": "/articles/cra-receipt-rules-canada",
  "/articles/receipt-organization-tips-canada": "/articles/expense-tracking-canada-freelancers",
  "/articles/self-employed-expense-report-template-canada": "/articles/expense-tracking-canada-freelancers",
  "/articles/year-round-tax-prep-canada": "/articles/expense-tracking-canada-freelancers",
  "/articles/tax-season-stress-freelancers-canada": "/articles/expense-tracking-canada-freelancers",
  "/articles/mileage-tracking-self-employed-2025-guide": "/articles/mileage-deduction-canada-freelancers",
  "/articles/cra-mileage-logbook-requirements": "/articles/mileage-deduction-canada-freelancers",
  "/articles/vehicle-expense-deductions-canada": "/articles/mileage-deduction-canada-freelancers",
  "/articles/gst-hst-expense-tracking-canada": "/articles/track-gst-hst-business-expenses",
  "/articles/input-tax-credits-canada-guide": "/articles/track-gst-hst-business-expenses",
  "/articles/gst-hst-registration-threshold-canada": "/articles/track-gst-hst-business-expenses",
  "/articles/pst-qst-freelancers-canada": "/articles/track-gst-hst-business-expenses",
  "/articles/top-tax-deductions-canadian-self-employed-2025": "/articles/self-employed-tax-deductions-canada",
  "/articles/business-expense-categories-canada": "/articles/self-employed-tax-deductions-canada",
  "/articles/reimbursable-expenses-canada-freelancers": "/articles/self-employed-tax-deductions-canada",
  "/articles/freelancer-tax-mistakes-canada": "/articles/self-employed-tax-deductions-canada",
  "/articles/home-office-vs-coworking-expense-canada": "/articles/home-office-deduction-canadian-freelancers",
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // Auth and the signed-in product moved to the web app on its own origin.
  // Permanent redirects so old deep links, bookmarks and indexed URLs land
  // on the app rather than a 404 here. Query strings are carried across for
  // /login and /signup (e.g. ?ref= from a referral link).
  if (pathname === "/login" || pathname === "/signup") {
    return Response.redirect(appUrl(pathname) + url.search, 301);
  }
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return Response.redirect(APP_URL, 301);
  }
  // The staff helpdesk (support tickets + idea moderation) now lives in the
  // web portal; support requests and ideas are stored in Firestore there.
  if (pathname === "/helpdesk" || pathname.startsWith("/helpdesk/")) {
    return Response.redirect(appUrl("/support"), 301);
  }
  // A retired article's content now lives in another guide; send links and
  // indexed URLs there permanently instead of to the not-found page.
  const mergedInto = MERGED_ARTICLES[pathname];
  if (mergedInto) {
    url.pathname = mergedInto;
    return Response.redirect(url.toString(), 301);
  }

  // The bare root is never a page of its own. /ca is the canonical version
  // (and the hreflang x-default); US visitors go to /us. Both are permanent
  // so "/" consolidates onto the regional pages rather than being indexed.
  const country = request.headers.get("x-vercel-ip-country");
  url.pathname = country === "US" ? "/us" : "/ca";
  return Response.redirect(url.toString(), 301);
}
