import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * Server-renders the CA and US article routes through TanStack Router, the
 * same way tests/article-images.test.ts does, for tests that read the HTML and
 * head of article pages. `name` keeps each test's bundle in its own file.
 */

export type Head = {
  meta?: Record<string, string>[];
  links?: Record<string, string>[];
  scripts?: { type: string; children: string }[];
};
export type Rendered = { matched: boolean; html: string; head: Head };

const rawImports: Plugin = {
  name: "raw",
  setup(b) {
    b.onResolve({ filter: /\?raw$/ }, (args) => ({
      path: args.path.startsWith("@/")
        ? resolve("src", args.path.slice(2).replace(/\?raw$/, ""))
        : resolve(args.resolveDir, args.path.replace(/\?raw$/, "")),
      namespace: "raw",
    }));
    b.onLoad({ filter: /.*/, namespace: "raw" }, (args) => ({
      contents: readFileSync(args.path, "utf8"),
      loader: "text",
    }));
  },
};

export async function loadArticleRenderer<T extends Record<string, unknown>>(name: string) {
  const dir = resolve("node_modules/.cache", name);
  const out = resolve(dir, "render.mjs");
  mkdirSync(dir, { recursive: true });
  await build({
    stdin: {
      contents: `
        import { renderToString } from "react-dom/server";
        import { createElement } from "react";
        import {
          RouterProvider, createMemoryHistory, createRootRoute, createRouter,
        } from "@tanstack/react-router";
        import { Route as CaIndex } from "@/routes/articles/index";
        import { Route as CaArticle } from "@/routes/articles/$slug";
        import { Route as UsIndex } from "@/routes/us/articles/index";
        import { Route as UsArticle } from "@/routes/us/articles/$slug";
        export * from "@/lib/articles";
        export { ARTICLE_PARTS, hubArticleOrder } from "@/lib/articles.parts";
        export { US_ARTICLES } from "@/lib/articles.us";
        export { faqJsonLd } from "@/lib/seo";

        const ROUTES = {
          "/articles/": CaIndex,
          "/articles/$slug": CaArticle,
          "/us/articles/": UsIndex,
          "/us/articles/$slug": UsArticle,
        };

        export async function render(routeId, path, params) {
          const now = "2026-11-14T18:00:00Z";
          const root = createRootRoute();
          const children = Object.entries(ROUTES).map(([p, r]) =>
            r.update({ id: p, path: p, getParentRoute: () => root, loader: () => ({ now }) }));
          const router = createRouter({
            routeTree: root.addChildren(children),
            history: createMemoryHistory({ initialEntries: [path] }),
          });
          await router.load();
          const match = router.state.matches.at(-1);
          return {
            matched: !!match && match.routeId === routeId && match.status === "success",
            html: renderToString(createElement(RouterProvider, { router })),
            head: ROUTES[routeId].options.head({ params, loaderData: { now } }),
          };
        }
      `,
      resolveDir: process.cwd(),
      loader: "tsx",
    },
    alias: { "@": resolve("src") },
    plugins: [rawImports],
    bundle: true,
    packages: "external",
    jsx: "automatic",
    loader: { ".svg": "dataurl", ".png": "dataurl", ".webp": "dataurl" },
    format: "esm",
    platform: "node",
    outfile: out,
    logLevel: "silent",
  });
  return (await import(pathToFileURL(out).href)) as T & {
    render: (routeId: string, path: string, params: Record<string, string>) => Promise<Rendered>;
  };
}

/** Visible text of a rendered page: no scripts or styles, entities decoded, spaces collapsed. */
export function pageText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
