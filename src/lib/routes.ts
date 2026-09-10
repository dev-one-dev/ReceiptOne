import type { FileRoutesByTo } from "@/routeTree.gen";
import { appUrl } from "@/lib/external";

/**
 * Single source of truth for route paths.
 *
 * Internal paths are typed against the auto-generated TanStack route tree,
 * so any `<Link to={ROUTES.privacy} />` is statically guaranteed to match a
 * real file under `src/routes/`. If a route file is removed, TypeScript
 * fails this module first — surfacing the breakage at the source instead of
 * scattered TS2322 errors at every call site.
 *
 * `login` / `signup` are cross-origin: auth lives in the web app on
 * app.receipt-one.com. Render them with a plain `<a href>` (same tab),
 * never a router `<Link>`.
 */
export type AppRoute = keyof FileRoutesByTo;

export const INTERNAL_ROUTES = {
  home: "/",
  ca: "/ca",
  us: "/us",
  faq: "/faq",
  terms: "/terms",
  privacy: "/privacy",
  articles: "/articles",
} as const satisfies Record<string, AppRoute>;

export const EXTERNAL_ROUTES = {
  login: appUrl("/login"),
  signup: appUrl("/signup"),
} as const;

export const ROUTES = { ...INTERNAL_ROUTES, ...EXTERNAL_ROUTES } as const;

export type RouteKey = keyof typeof ROUTES;
