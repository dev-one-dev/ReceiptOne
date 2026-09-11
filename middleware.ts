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
  ],
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

  // Geo redirect for the bare root: US visitors to /us, everyone else to /ca.
  const country = request.headers.get("x-vercel-ip-country");
  url.pathname = country === "US" ? "/us" : "/ca";
  return Response.redirect(url.toString(), 302);
}
