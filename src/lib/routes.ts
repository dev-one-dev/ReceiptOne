import type { FileRoutesByFullPath } from "@/routeTree.gen";

/**
 * Single source of truth for application route paths.
 *
 * The type is derived from the auto-generated TanStack route tree, so any
 * `<Link to={ROUTES.privacy} />` is statically guaranteed to match a real
 * file under `src/routes/`. If a route file is removed, TypeScript will
 * fail this module first — surfacing the breakage at the source instead of
 * scattered TS2322 errors at every call site.
 */
export type AppRoute = keyof FileRoutesByFullPath;

export const ROUTES = {
  home: "/",
  ca: "/ca",
  us: "/us",
  login: "/login",
  signup: "/signup",
  terms: "/terms",
  privacy: "/privacy",
} as const satisfies Record<string, AppRoute>;

export type RouteKey = keyof typeof ROUTES;
