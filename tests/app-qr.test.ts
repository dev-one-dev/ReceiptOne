import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";
import QRCode from "qrcode";
import {
  APP_QR_FILE,
  APP_QR_HERO_FILE,
  APP_QR_HERO_PAYLOAD,
  APP_QR_OPTIONS,
  APP_QR_PAYLOAD,
  renderAppQr,
} from "../scripts/generate-app-qr.mjs";

/**
 * The footer's one app-download block: a committed static SVG QR of the /app
 * smart link with a "Get the app" label and the two store badges beside it,
 * shown at lg and up in the footer brand column only (it was removed from the
 * pricing card). Below lg it is display:none (Tailwind `hidden lg:flex`) and
 * the footer's own badge row (`lg:hidden`) takes over, so exactly one set of
 * store badges shows at every width.
 * Pixel alignment of the footer columns was measured in a browser; here the
 * structure that keeps it (the shared grid template, the QR inside the brand
 * column) is pinned.
 */

const URL_ON_QR = "https://receipt-one.com/app?utm_source=site&utm_medium=qr&utm_campaign=app_qr";
const URL_ON_HERO_QR =
  "https://receipt-one.com/app?utm_source=site&utm_medium=qr&utm_campaign=app_qr_hero";

const qrText = (payload: string) =>
  QRCode.create(payload, { errorCorrectionLevel: "M" })
    .segments.map((s: { data: Uint8Array | string }) =>
      typeof s.data === "string" ? s.data : Buffer.from(s.data).toString("utf8"),
    )
    .join("");
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

test("app qr: the hero QR is the same link with utm_campaign=app_qr_hero", () => {
  assert.equal(APP_QR_HERO_PAYLOAD, URL_ON_HERO_QR);
  assert.equal(new URL(APP_QR_HERO_PAYLOAD).searchParams.get("utm_campaign"), "app_qr_hero");
  // Only the campaign differs from the footer QR.
  const footer = new URL(APP_QR_PAYLOAD);
  footer.searchParams.set("utm_campaign", "app_qr_hero");
  assert.equal(footer.toString(), APP_QR_HERO_PAYLOAD);
  assert.equal(qrText(APP_QR_HERO_PAYLOAD), URL_ON_HERO_QR, "the QR segments carry the URL");
});

test("app qr: the committed hero SVG is exactly what the generator produces", async () => {
  const committed = readFileSync(APP_QR_HERO_FILE, "utf8").replace(/\r\n/g, "\n");
  assert.equal(committed, await renderAppQr(APP_QR_HERO_PAYLOAD), "run `npm run qr` and commit");
  assert.notEqual(committed, readFileSync(APP_QR_FILE, "utf8").replace(/\r\n/g, "\n"));
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
      import { Route as Drivers } from "@/routes/ca/drivers";
      export { FOOTER_GRID_LG } from "@/components/site/TaxDeadlines";

      const now = "2026-11-15T18:00:00Z";
      const ROUTES = {
        "/ca/": [Ca, () => ({ now, roadmap: null })],
        "/fr/": [Fr, () => ({ now, roadmap: null })],
        "/us/": [Us, () => null],
        "/ca/drivers": [Drivers, () => ({ now })],
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

// The block holds one nested <div>, so its inner HTML runs to the second </div>.
const blocks = (html: string) =>
  [
    ...html.matchAll(
      /<div data-app-qr="[^"]*" class="([^"]*)">((?:(?!<\/div>)[\s\S])*<\/div>[\s\S]*?)<\/div>/g,
    ),
  ].map((m) => ({
    classes: m[1].split(/\s+/),
    inner: m[2],
  }));

const APPLE = /<a href="https:\/\/apps\.apple\.com\/[^"]*"/g;
const GOOGLE = /<a href="https:\/\/play\.google\.com\/[^"]*"/g;
const count = (html: string, re: RegExp) => [...html.matchAll(re)].length;
const at = (html: string, re: RegExp) => html.search(new RegExp(re.source));

for (const [path, label] of [
  ["/ca", "Get the app"],
  ["/fr", "Obtenir l&#x27;application"],
  ["/us", "Get the app"],
] as const) {
  test(`app qr: ${path} shows the block in the footer only, lg and up only`, async () => {
    const html = await mod.render(path);
    const footer = html.slice(html.indexOf("<footer"));
    const found = blocks(footer);
    assert.equal(found.length, 1, "one in the footer");
    assert.equal(blocks(html).length, 1, "nowhere else on the page");
    for (const { classes, inner } of found) {
      // display:none below lg, flex from lg.
      assert.ok(classes.includes("hidden"), "hidden below lg");
      assert.ok(classes.includes("lg:flex"), "visible at lg");
      assert.ok(!classes.some((c) => /^(sm|md):(flex|block)$/.test(c)), "no earlier breakpoint");
      assert.match(inner, new RegExp(`<img[^>]*alt="${ALT}"`), "alt text");
      assert.match(inner, /width="112" height="112"/);
      assert.ok(inner.includes(label), `label: ${label}`);
      assert.ok(!inner.includes("Scan to get") && !inner.includes("Numérisez"), "old label gone");
      // The label sits above the badges, App Store first, then Google Play.
      assert.ok(inner.indexOf(label) < at(inner, APPLE), "label above the badges");
      assert.ok(at(inner, APPLE) < at(inner, GOOGLE), "App Store, then Google Play");
      assert.equal(count(inner, APPLE), 1, "one App Store badge in the block");
      assert.equal(count(inner, GOOGLE), 1, "one Google Play badge in the block");
    }
    const pricing = html.slice(html.indexOf('id="pricing"'), html.indexOf("<footer"));
    assert.ok(html.includes('id="pricing"'), "the page has a pricing section");
    assert.equal(blocks(pricing).length, 0, "no QR in the pricing section");
    assert.ok(!pricing.includes(ALT), "no QR image in the pricing section");
  });

  test(`app qr: ${path} footer shows exactly one set of store badges per breakpoint`, async () => {
    const html = await mod.render(path);
    const footer = html.slice(html.indexOf("<footer"));
    assert.equal(count(footer, APPLE), 2, "two App Store links in the footer markup");
    assert.equal(count(footer, GOOGLE), 2, "two Google Play links in the footer markup");
    // lg and up: the set inside the app block (hidden below lg, tested above).
    // Below lg: the badge row, hidden from lg. Never both, never neither.
    const rows = [
      ...footer.matchAll(
        /<div class="([^"]*)">(<a href="https:\/\/apps\.apple\.com\/[\s\S]*?)<\/div>/g,
      ),
    ];
    assert.equal(rows.length, 1, "one badge row outside the app block");
    const row = rows[0][1].split(/\s+/);
    assert.ok(row.includes("lg:hidden"), "badge row hidden at lg");
    assert.ok(!row.includes("hidden") && row.includes("flex"), "badge row visible below lg");
    assert.ok(!row.some((c) => /^(sm|md):hidden$/.test(c)), "no earlier breakpoint");
    assert.equal(count(rows[0][2], APPLE), 1);
    assert.equal(count(rows[0][2], GOOGLE), 1);
    // The app block's badges come before the row, which follows the grid.
    assert.ok(footer.indexOf("data-app-qr") < footer.indexOf(rows[0][0]));
    // Both sets sit inside the footer's cta_click location.
    assert.match(html, /<footer[^>]*data-cta-location="footer"/);
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
      qrAt < footer.search(/<p class="eyebrow">(Product|Produit)<\/p>/),
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

// --- Hero CTA row ----------------------------------------------------------

const heroOf = (html: string) => {
  const at = html.indexOf('<section data-cta-location="hero"');
  assert.ok(at >= 0, "the page has a hero");
  return html.slice(at, html.indexOf("</section>", at));
};
const unescapeHtml = (v: string) =>
  v
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
const SVG_DATA_URL = "data:image/svg+xml,";

for (const [path, qrFrom, trial] of [
  ["/ca", "xl", "Start 7-day free trial"],
  ["/fr", "xl", "Commencer l&#x27;essai gratuit de 7 jours"],
  ["/us", "xl", "Start 7-day free trial"],
  ["/ca/drivers", "lg", "Start 7-day free trial"],
] as const) {
  const noCard = path === "/fr" ? "Aucune carte de crédit requise" : "No credit card required";
  test(`hero: ${path} has one trial button, one set of badges, and the hero QR from ${qrFrom}`, async () => {
    const html = await mod.render(path);
    const hero = heroOf(html);
    // One trial button, same copy, visible at every width.
    const trials = [...hero.matchAll(/<a href="([^"]*\/signup)"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.equal(trials.length, 1, "one trial button");
    assert.ok(trials[0][2].startsWith(trial), `copy: ${trial}`);
    assert.ok(!/(^| )(hidden|[a-z]+:hidden)( |")/.test(trials[0][0]), "never hidden");
    // One set of badges, App Store first, never hidden at any breakpoint.
    assert.equal(count(hero, APPLE), 1, "one App Store badge");
    assert.equal(count(hero, GOOGLE), 1, "one Google Play badge");
    assert.ok(at(hero, APPLE) < at(hero, GOOGLE));
    // The row: trial button, then the QR, then the badges.
    const row = hero.slice(hero.indexOf("data-hero-cta"));
    const imgs = [...row.matchAll(/<img[^>]*alt="QR code[^"]*"[^>]*>/g)].map((m) => m[0]);
    assert.equal(imgs.length, 1, "one QR in the hero");
    const img = imgs[0];
    assert.match(img, new RegExp(`alt="${ALT}"`));
    // FR uses a 96px tile: at 112 its row does not clear the mascot column.
    const size = path === "/fr" ? 96 : 112;
    assert.match(img, new RegExp(`width="${size}" height="${size}"`), "sized: no layout shift");
    assert.ok(img.includes(size === 96 ? "size-24" : "size-28"));
    const classes = /class="([^"]*)"/.exec(img)![1].split(/\s+/);
    assert.ok(classes.includes("hidden"), "QR hidden below " + qrFrom);
    assert.ok(classes.includes(`${qrFrom}:block`), "QR shown from " + qrFrom);
    assert.ok(!classes.some((c) => /^(sm|md|lg|xl):block$/.test(c) && c !== `${qrFrom}:block`));
    assert.ok(row.indexOf("/signup") < row.indexOf(img), "QR after the trial button");
    assert.ok(row.indexOf(img) < at(row, APPLE), "badges after the QR");
    // The hero QR is the app_qr_hero SVG, not the footer's.
    // (The test bundler inlines the SVG as a data URL; Vite emits a file.)
    const src = unescapeHtml(/src="([^"]*)"/.exec(img)![1]);
    assert.ok(src.startsWith(SVG_DATA_URL), "inlined SVG");
    assert.equal(
      decodeURIComponent(src.slice(SVG_DATA_URL.length)),
      readFileSync(APP_QR_HERO_FILE, "utf8"),
      "src is app-qr-hero.svg",
    );
    // The badges stack from the same breakpoint, beside the QR.
    assert.match(row, new RegExp(`class="[^"]*${qrFrom}:flex-col[^"]*"><span class="sr-only">`));
    // Hero links stay inside the hero's cta_click location.
    assert.ok(hero.startsWith('<section data-cta-location="hero"'));
  });

  test(`hero: ${path} no-card line, in its language, only from ${qrFrom}`, async () => {
    const row = heroOf(await mod.render(path));
    const lines = [...row.matchAll(/<p class="([^"]*)">([^<]*)<\/p>/g)].filter((m) =>
      /carte|card/i.test(m[2]),
    );
    assert.equal(lines.length, 1, "one no-card line in the hero");
    assert.equal(lines[0][2], noCard);
    const other = path === "/fr" ? "No credit card required" : "Aucune carte de crédit requise";
    assert.ok(!row.includes(other), "not the other language");
    const classes = lines[0][1].split(/\s+/);
    assert.ok(classes.includes("hidden"), "hidden below " + qrFrom);
    assert.ok(classes.includes(`${qrFrom}:block`), "shown from " + qrFrom);
    assert.ok(!classes.some((c) => /^(sm|md|lg|xl):block$/.test(c) && c !== `${qrFrom}:block`));
    assert.ok(
      classes.includes("text-ink-60") && !classes.some((c) => /ember/.test(c)),
      "muted, no orange",
    );
  });

  // Layout was measured in a browser (1280/1440; drivers also 1024): button
  // top = QR top, a plain gap between the groups (56px; FR 52, its row then
  // ends 1.5px short of the mascot column), badges 8px apart and centred on
  // the QR, the QR >= 48px above the hero's bottom edge (more on /us, where the
  // mascot sets the height). Here the classes that produce it are pinned.
  const bp = qrFrom;
  const classesOf = (hero: string, re: RegExp) => {
    const m = re.exec(hero);
    assert.ok(m, `found: ${re.source}`);
    return m[1].split(/\s+/);
  };
  const shownOnlyFrom = (classes: string[], display: string) => {
    // Nothing below the breakpoint: hidden or display:contents at base, and
    // no sm:/md: (or lg: when the breakpoint is xl) display override.
    assert.ok(classes.includes("hidden") || classes.includes("contents"), classes.join(" "));
    assert.ok(classes.includes(`${bp}:${display}`), `${bp}:${display}`);
    const earlier = bp === "xl" ? "sm|md|lg" : "sm|md";
    assert.ok(
      !classes.some((c) => new RegExp(`^(${earlier}):(block|flex|grid|inline-flex)$`).test(c)),
      "nothing shows below " + bp,
    );
  };

  test(`hero: ${path} two groups, a plain gap, no divider from ${bp}; button top = QR top`, async () => {
    const hero = heroOf(await mod.render(path));
    const row = classesOf(hero, /<div data-hero-cta="[^"]*" class="([^"]*)"/);
    for (const c of [`${bp}:grid`, `${bp}:grid-cols-[auto_auto]`, `${bp}:items-start`])
      assert.ok(row.includes(c), c);
    // 56px between the groups; FR on the landing hero 52 (56 would reach the
    // mascot column). One column gap, and only from the breakpoint.
    const gap = path === "/fr" ? `${bp}:gap-x-13` : `${bp}:gap-x-14`;
    assert.deepEqual(
      row.filter((c) => /gap-x-/.test(c)),
      [gap],
      gap,
    );
    // No divider: no element, no vertical rule anywhere in the row.
    assert.ok(!hero.includes("data-hero-cta-divider"), "no divider element");
    const rowHtml = hero.slice(hero.indexOf("<div data-hero-cta"));
    assert.ok(!/border-l|divide-x/.test(rowHtml), "no vertical rule");
    // Primary group: the button (first) and the no-card line, column 1, row 2.
    const primary = classesOf(
      hero,
      /<div data-hero-cta-primary="[^"]*" class="([^"]*)"><a href="[^"]*\/signup"/,
    );
    shownOnlyFrom(primary, "flex");
    for (const c of [`${bp}:col-start-1`, `${bp}:row-start-2`, `${bp}:flex-col`])
      assert.ok(primary.includes(c), c);
    // Secondary group: QR then badges, column 2, row 2 (same row as the
    // button, so its top edge is the QR's), centred on the QR.
    const secondary = classesOf(hero, /<div data-hero-cta-secondary="[^"]*" class="([^"]*)"><img/);
    shownOnlyFrom(secondary, "flex");
    for (const c of [`${bp}:col-start-2`, `${bp}:row-start-2`, `${bp}:items-center`, `${bp}:gap-3`])
      assert.ok(secondary.includes(c), c);
    const at2 = (re: RegExp) => hero.search(re);
    assert.ok(at2(/data-hero-cta-primary/) < at2(/data-hero-cta-secondary/));
    assert.ok(
      at2(/data-hero-cta-secondary/) < at2(/alt="QR code/) && at2(/alt="QR code/) < at(hero, APPLE),
    );
  });

  test(`hero: ${path} badges stack 8px apart, centred on the QR, from ${bp}`, async () => {
    const hero = heroOf(await mod.render(path));
    const badges = classesOf(hero, /<div class="([^"]*)"><span class="sr-only">/);
    for (const c of [`${bp}:flex-col`, `${bp}:gap-2`, `${bp}:flex-nowrap`])
      assert.ok(badges.includes(c), c);
    // The 707972e stretch is gone: no justify-between, no self-stretch.
    assert.ok(!badges.some((c) => /justify-between|self-stretch/.test(c)), "not stretched");
  });

  test(`hero: ${path} "or get the app" label in its language, above the QR, from ${bp}`, async () => {
    const hero = heroOf(await mod.render(path));
    const label = path === "/fr" ? "ou obtenez l&#x27;application" : "or get the app";
    const other = path === "/fr" ? "or get the app" : "ou obtenez l&#x27;application";
    const m = /<p class="([^"]*)">([^<]*)<\/p><div data-hero-cta-secondary/.exec(hero);
    assert.ok(m, "label right before the secondary group");
    assert.equal(m[2], label);
    assert.ok(!hero.includes(other), "not the other language");
    const classes = m[1].split(/\s+/);
    assert.ok(classes.includes("eyebrow"), "the one eyebrow treatment");
    shownOnlyFrom(classes, "block");
    for (const c of [`${bp}:col-start-2`, `${bp}:row-start-1`]) assert.ok(classes.includes(c), c);
  });

  test(`hero: ${path} below ${bp} the row is the row it was`, async () => {
    const hero = heroOf(await mod.render(path));
    const base = (classes: string[]) =>
      classes.filter(
        (c) => !c.includes(":") || /^sm:|^md:/.test(c) || (bp === "xl" && /^lg:/.test(c)),
      );
    // The row's own classes below the breakpoint, as before the QR row.
    const row = classesOf(hero, /<div data-hero-cta="[^"]*" class="([^"]*)"/);
    const margin = path === "/ca/drivers" ? ["mt-4"] : ["relative", "z-10", "mt-6"];
    assert.deepEqual(base(row), [
      ...margin,
      "flex",
      "w-full",
      "flex-col",
      "items-stretch",
      "gap-3",
      "sm:w-auto",
      "sm:flex-row",
      "sm:flex-wrap",
      "sm:items-center",
    ]);
    // The badge strip: same classes as before below the breakpoint.
    const badges = classesOf(hero, /<div class="([^"]*)"><span class="sr-only">/);
    assert.deepEqual(base(badges), [
      "flex",
      "flex-wrap",
      "items-center",
      "justify-center",
      "gap-3",
      path === "/ca/drivers" ? "sm:justify-start" : "lg:justify-start",
    ]);
    // Everything new is display:none (line, label, QR) or display:contents
    // (the two group wrappers) below the breakpoint.
    const hiddenBelow = [
      /<p class="([^"]*)">(?:No credit|Aucune carte)/,
      /<p class="(eyebrow[^"]*)">/,
      /<img[^>]*alt="QR code[^"]*"[^>]*class="([^"]*)"/,
    ];
    // Only inside the row (drivers has its own eyebrow above the h1).
    const rowHtml = hero.slice(hero.indexOf("<div data-hero-cta"));
    for (const re of hiddenBelow) {
      const c = classesOf(rowHtml, re);
      assert.ok(c.includes("hidden"), re.source);
      assert.ok(
        !c.some((x) => /^(sm|md):/.test(x) || (bp === "xl" && /^lg:(block|flex)$/.test(x))),
        re.source,
      );
    }
    for (const re of [
      /<div data-hero-cta-primary="[^"]*" class="([^"]*)"/,
      /<div data-hero-cta-secondary="[^"]*" class="([^"]*)"/,
    ])
      assert.equal(classesOf(hero, re)[0], "contents", re.source);
  });
}

// Bottom breathing room: from the QR breakpoint the CTA row is the hero's
// last element; 48px (pb-12) under it, measured in a browser at 1280/1440
// (drivers also 1024): QR bottom to hero bottom 48 on /ca, /fr, /ca/drivers;
// /us 113-118, where the mascot column sets the height. Nothing below.
for (const path of ["/ca", "/fr", "/us"] as const) {
  test(`hero: ${path} 48px under the CTA row from xl only`, async () => {
    const hero = heroOf(await mod.render(path));
    // The section itself is untouched: no bottom padding at any width.
    const section = /^<section data-cta-location="hero" class="([^"]*)"/.exec(hero)![1];
    assert.equal(
      section,
      "relative w-full overflow-visible px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28",
    );
    // The left column (the one with the h1) pads its bottom from xl.
    const col = /<div class="([^"]*)">(?:(?!<div class=)[\s\S])*?<h1/.exec(hero);
    assert.ok(col, "left column");
    const classes = col[1].split(/\s+/);
    assert.ok(classes.includes("xl:pb-12"), "xl:pb-12");
    assert.deepEqual(
      classes.filter((c) => /(^|:)p[by]-/.test(c)),
      ["xl:pb-12"],
      "no bottom padding below xl",
    );
  });
}

test("hero: /ca/drivers 48px under the CTA row from lg only", async () => {
  const hero = heroOf(await mod.render("/ca/drivers"));
  const section = /^<section data-cta-location="hero" class="([^"]*)"/.exec(hero)![1].split(/\s+/);
  assert.ok(section.includes("pb-4"), "16px below lg, as before");
  assert.ok(section.includes("lg:pb-12"), "48px from lg");
  assert.deepEqual(
    section.filter((c) => /(^|:)p[by]-/.test(c)),
    ["pb-4", "lg:pb-12"],
  );
});
