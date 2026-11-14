import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

/**
 * Cookie banner copy, buttons and policy link, EN and FR. Renders the
 * stateless CookieConsentBanner server-side inside a TanStack router (so the
 * policy <Link> resolves to a real href), and walks its element tree to press
 * each button and record the consent value it hands back.
 */

const DIR = resolve("node_modules/.cache/cookie-consent-test");
const OUT = resolve(DIR, "render.mjs");
mkdirSync(DIR, { recursive: true });
await build({
  stdin: {
    contents: `
      import { renderToString } from "react-dom/server";
      import { createElement, isValidElement, Children } from "react";
      import {
        RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter,
      } from "@tanstack/react-router";
      import { CookieConsentBanner } from "@/components/site/CookieConsent";

      export async function render(path, lang) {
        const root = createRootRoute();
        const page = createRoute({
          getParentRoute: () => root,
          path,
          component: () => createElement(CookieConsentBanner, { lang, onChoose: () => {} }),
        });
        const router = createRouter({
          routeTree: root.addChildren([page]),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        return renderToString(createElement(RouterProvider, { router }));
      }

      /** Presses every <button> in the banner; returns [label, choice] pairs in order. */
      export function press(lang) {
        const pressed = [];
        let last;
        const tree = CookieConsentBanner({ lang, onChoose: (c) => { last = c; } });
        const walk = (node) => {
          if (!isValidElement(node)) return;
          if (node.type === "button") {
            last = undefined;
            node.props.onClick();
            pressed.push([Children.toArray(node.props.children).join(""), last]);
          }
          Children.forEach(node.props.children, walk);
        };
        walk(tree);
        return pressed;
      }
    `,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  alias: { "@": resolve("src") },
  bundle: true,
  packages: "external",
  jsx: "automatic",
  format: "esm",
  platform: "node",
  outfile: OUT,
  logLevel: "silent",
});
const { render, press } = (await import(pathToFileURL(OUT).href)) as {
  render: (path: string, lang: "en" | "fr") => Promise<string>;
  press: (lang: "en" | "fr") => [string, string | undefined][];
};

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ");

const CASES = {
  en: {
    path: "/ca",
    title: "We use a few cookies",
    body: "Essential cookies keep the site working and remember which link brought you here. With your OK, Google Analytics cookies measure visits. Choose Essential only and no analytics code loads. See our Cookie Policy.",
    link: "Cookie Policy",
    href: "/privacy#section-2-4",
    accept: "Accept all",
    essential: "Essential only",
  },
  fr: {
    path: "/fr",
    title: "Nous utilisons quelques témoins",
    body: "Les témoins essentiels font fonctionner le site et retiennent le lien qui vous a amené ici. Avec votre accord, les témoins de Google Analytics mesurent les visites. Choisissez Essentiels seulement et aucun code d'analyse n'est chargé. Consultez notre Politique relative aux témoins.",
    link: "Politique relative aux témoins",
    href: "/fr/privacy#section-2-4",
    accept: "Tout accepter",
    essential: "Essentiels seulement",
  },
} as const;

for (const [lang, c] of Object.entries(CASES) as [keyof typeof CASES, (typeof CASES)["en"]][]) {
  const html = await render(c.path, lang);
  const plain = text(html);

  test(`cookie banner (${lang}): title and body`, () => {
    assert.ok(plain.includes(c.title), `title missing: ${plain}`);
    assert.ok(plain.includes(c.body), `body missing: ${plain}`);
    assert.match(html, /aria-labelledby="cookie-consent-title"/);
    assert.match(html, /aria-describedby="cookie-consent-text"/);
  });

  test(`cookie banner (${lang}): policy link targets section 2.4`, () => {
    const links = [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)].map((m) => [
      m[1],
      m[2],
    ]);
    assert.deepEqual(links, [[c.href, c.link]]);
  });

  test(`cookie banner (${lang}): Accept all -> granted, Essential only -> denied`, () => {
    assert.deepEqual(press(lang), [
      [c.accept, "granted"],
      [c.essential, "denied"],
    ]);
  });

  test(`cookie banner (${lang}): no mention of Meta or ads`, () => {
    assert.doesNotMatch(plain, /\bmeta\b|\bads?\b|advert|publicit/i);
  });
}
