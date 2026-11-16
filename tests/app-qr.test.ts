import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";
import QRCode from "qrcode";
import {
  APP_QR_FILE,
  APP_QR_OPTIONS,
  APP_QR_PAYLOAD,
  renderAppQr,
} from "../scripts/generate-app-qr.mjs";

/**
 * The "Scan to get the app" QR block: a committed static SVG of the /app smart
 * link, shown at lg and up in the footer brand column and under the pricing
 * card's store badges. Below lg it is display:none (Tailwind `hidden lg:flex`).
 * Pixel alignment of the footer columns was measured in a browser; here the
 * structure that keeps it (the shared grid template, the QR inside the brand
 * column) is pinned.
 */

const URL_ON_QR = "https://receipt-one.com/app?utm_source=site&utm_medium=qr&utm_campaign=app_qr";
const ALT = "QR code to download the ReceiptOne app";

test("app qr: the generator encodes the exact smart-link URL, EC level M, #111 on white", () => {
  assert.equal(APP_QR_PAYLOAD, URL_ON_QR);
  assert.equal(APP_QR_OPTIONS.errorCorrectionLevel, "M");
  assert.equal(APP_QR_OPTIONS.color.dark, "#111111");
  assert.ok(APP_QR_OPTIONS.margin >= 4, "quiet zone of at least 4 modules");
  const qr = QRCode.create(APP_QR_PAYLOAD, { errorCorrectionLevel: "M" });
  const data = qr.segments.map((s: { data: Uint8Array | string }) =>
    typeof s.data === "string" ? s.data : Buffer.from(s.data).toString("utf8"),
  );
  assert.equal(data.join(""), URL_ON_QR, "the QR segments carry the URL");
});

test("app qr: the committed SVG is exactly what the generator produces", async () => {
  const committed = readFileSync(APP_QR_FILE, "utf8").replace(/\r\n/g, "\n");
  assert.equal(committed, await renderAppQr(), "run `npm run qr` and commit the SVG");
  assert.match(committed, /fill="#ffffff" d="M0 0h(\d+)v\1H0z"/, "white quiet-zone background");
  assert.match(committed, /stroke="#111111"/);
});

// --- Server-rendered pages -------------------------------------------------

const DIR = resolve("node_modules/.cache/app-qr-test");
const OUT = resolve(DIR, "render.mjs");
mkdirSync(DIR, { recursive: true });

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

await build({
  stdin: {
    contents: `
      import { renderToString } from "react-dom/server";
      import { createElement } from "react";
      import {
        RouterProvider, createMemoryHistory, createRootRoute, createRouter,
      } from "@tanstack/react-router";
      import { Route as Ca } from "@/routes/ca/index";
      import { Route as Fr } from "@/routes/fr/index";
      import { Route as Us } from "@/routes/us/index";
      export { FOOTER_GRID_LG } from "@/components/site/TaxDeadlines";

      const now = "2026-11-15T18:00:00Z";
      const ROUTES = {
        "/ca/": [Ca, () => ({ now, roadmap: null })],
        "/fr/": [Fr, () => ({ now, roadmap: null })],
        "/us/": [Us, () => null],
      };

      export async function render(path) {
        const root = createRootRoute();
        const children = Object.entries(ROUTES).map(([p, [r, loader]]) =>
          r.update({ id: p, path: p, getParentRoute: () => root, loader }));
        const router = createRouter({
          routeTree: root.addChildren(children),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        return renderToString(createElement(RouterProvider, { router }));
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
  loader: { ".svg": "dataurl", ".png": "dataurl", ".webp": "dataurl", ".mp4": "dataurl" },
  format: "esm",
  platform: "node",
  outfile: OUT,
  logLevel: "silent",
});

const mod = (await import(pathToFileURL(OUT).href)) as {
  FOOTER_GRID_LG: string;
  render: (path: string) => Promise<string>;
};

const blocks = (html: string) =>
  [...html.matchAll(/<div data-app-qr="[^"]*" class="([^"]*)">([\s\S]*?)<\/div>/g)].map((m) => ({
    classes: m[1].split(/\s+/),
    inner: m[2],
  }));

for (const [path, label] of [
  ["/ca", "Scan to get the app"],
  ["/fr", "Numérisez pour obtenir l&#x27;application"],
  ["/us", "Scan to get the app"],
] as const) {
  test(`app qr: ${path} shows the block in pricing and footer, lg and up only`, async () => {
    const html = await mod.render(path);
    const found = blocks(html);
    assert.equal(found.length, 2, "one in the pricing card, one in the footer");
    for (const { classes, inner } of found) {
      // display:none below lg, flex from lg.
      assert.ok(classes.includes("hidden"), "hidden below lg");
      assert.ok(classes.includes("lg:flex"), "visible at lg");
      assert.ok(!classes.some((c) => /^(sm|md):(flex|block)$/.test(c)), "no earlier breakpoint");
      assert.match(inner, new RegExp(`<img[^>]*alt="${ALT}"`), "alt text");
      assert.match(inner, /width="112" height="112"/);
      assert.ok(inner.includes(label), `label: ${label}`);
    }
    const pricing = html.slice(html.indexOf('id="pricing"'), html.indexOf("<footer"));
    assert.equal(blocks(pricing).length, 1, "pricing block inside #pricing");
  });

  test(`app qr: ${path} footer keeps its grid; the QR sits in the brand column`, async () => {
    const html = await mod.render(path);
    const footer = html.slice(html.indexOf("<footer"));
    const grid = mod.FOOTER_GRID_LG;
    assert.equal(grid, "lg:grid-cols-[minmax(0,1.8fr)_repeat(5,minmax(0,1fr))] lg:gap-x-6");
    assert.ok(footer.includes(`class="grid gap-6 ${grid}"`), "main grid unchanged");
    // The QR comes after the social icons and before the PRODUCT column, and
    // the brand column is still the grid's first child.
    const qrAt = footer.indexOf("data-app-qr");
    assert.ok(footer.indexOf('aria-label="Facebook"') < qrAt, "under the social icons");
    assert.ok(
      qrAt < footer.indexOf('class="eyebrow"'),
      "before PRODUCT (still in the brand column)",
    );
    assert.ok(
      footer.includes(
        'class="grid grid-cols-3 gap-4 lg:col-span-5 lg:grid-cols-subgrid lg:gap-x-6"',
      ),
      "nav subgrid unchanged",
    );
  });
}
