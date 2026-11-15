import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build, type Plugin } from "esbuild";

/**
 * FAQ content and FAQPage JSON-LD. The CA, FR and US lists carry the new
 * questions (trip tracking, bulk upload, AI assistant; email forwarding and
 * Schedule C reports on US) appended after the existing entries, so the first
 * three, which the landing widget shows, stay put. Each landing page's JSON-LD
 * lists exactly the questions its widget renders; each /faq page's JSON-LD
 * lists exactly the questions on the page.
 */

const DIR = resolve("node_modules/.cache/faq-test");
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
      import { Route as Faq } from "@/routes/faq";
      import { Route as FrFaq } from "@/routes/fr/faq";
      import { Route as UsFaq } from "@/routes/us/faq";
      export { faqItems, faqItemsUS, CATEGORIZED_FAQ, CATEGORIZED_FAQ_US } from "@/components/site/Faq";
      export { faqItemsFR, CATEGORIZED_FAQ_FR } from "@/lib/faq.fr";
      export { FAQ_VIDEOS, CA_ONLY_FAQ_VIDEO_IDS, isoDuration } from "@/lib/faq-videos";
      import { FaqVideoPlayer } from "@/components/site/Faq";
      export function renderVideo(video) {
        return renderToString(createElement(FaqVideoPlayer, { video }));
      }

      const now = "2026-11-15T18:00:00Z";
      const ROUTES = {
        "/ca/": [Ca, () => ({ now, roadmap: null })],
        "/fr/": [Fr, () => ({ now, roadmap: null })],
        "/us/": [Us, () => null],
        "/faq": [Faq, () => ({ now })],
        "/fr/faq": [FrFaq, () => ({ now })],
        "/us/faq": [UsFaq, () => null],
      };

      export function head(routeId) {
        return ROUTES[routeId][0].options.head({});
      }

      export async function render(routeId, path) {
        const root = createRootRoute();
        const children = Object.entries(ROUTES).map(([p, [r, loader]]) =>
          r.update({ id: p, path: p, getParentRoute: () => root, loader }));
        const router = createRouter({
          routeTree: root.addChildren(children),
          history: createMemoryHistory({ initialEntries: [path] }),
        });
        await router.load();
        const match = router.state.matches.at(-1);
        return {
          matched: !!match && match.routeId === routeId && match.status === "success",
          html: renderToString(createElement(RouterProvider, { router })),
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
  loader: { ".svg": "dataurl", ".png": "dataurl", ".webp": "dataurl", ".mp4": "dataurl" },
  format: "esm",
  platform: "node",
  outfile: OUT,
  logLevel: "silent",
});

type Video = {
  id: string;
  src: string;
  poster: string;
  title: string;
  description: string;
  duration: number;
};
type QA = { q: string; a: string; videos?: Video[] };
type Cat = { category: string; items: QA[] }[];
const mod = (await import(pathToFileURL(OUT).href)) as {
  render: (routeId: string, path: string) => Promise<{ matched: boolean; html: string }>;
  head: (routeId: string) => { scripts: { type: string; children: string }[] };
  faqItems: QA[];
  faqItemsUS: QA[];
  faqItemsFR: QA[];
  CATEGORIZED_FAQ: Cat;
  CATEGORIZED_FAQ_US: Cat;
  CATEGORIZED_FAQ_FR: Cat;
  FAQ_VIDEOS: Record<string, Video>;
  CA_ONLY_FAQ_VIDEO_IDS: string[];
  isoDuration: (s: number) => string;
  renderVideo: (v: Video) => string;
};

const LISTS = {
  ca: { items: mod.faqItems, cats: mod.CATEGORIZED_FAQ },
  fr: { items: mod.faqItemsFR, cats: mod.CATEGORIZED_FAQ_FR },
  us: { items: mod.faqItemsUS, cats: mod.CATEGORIZED_FAQ_US },
};

const find = (items: QA[], q: string) => {
  const it = items.find((x) => x.q === q);
  assert.ok(it, `has "${q}"`);
  return it;
};
const categoryOf = (cats: Cat, q: string) =>
  cats.find((c) => c.items.some((x) => x.q === q))?.category;

test("faq: first three items of each list are unchanged", () => {
  const FIRST = {
    ca: [
      "How does receipt scanning work?",
      "Does ReceiptOne calculate my tax refund?",
      'What does "Estimated refundable taxes" mean?',
    ],
    us: [
      "How does receipt scanning work?",
      "Does ReceiptOne calculate my tax refund?",
      'What does "Estimated refundable taxes" mean?',
    ],
    fr: [
      "Comment fonctionne la numérisation des reçus?",
      "ReceiptOne calcule-t-il mon remboursement d'impôt?",
      "Que signifie « Taxes remboursables estimées »?",
    ],
  };
  for (const [k, qs] of Object.entries(FIRST))
    assert.deepEqual(
      LISTS[k as keyof typeof LISTS].items.slice(0, 3).map((x) => x.q),
      qs,
      `${k} first three`,
    );
});

test("faq: new questions are in the right lists, languages and categories", () => {
  const NEW = {
    ca: [
      ["How does automatic trip tracking work?", "Mileage & Home Office", "T2125 Chart A"],
      ["Can I upload many receipts at once?", "General", "Bulk Upload"],
      ["What can the AI assistant do?", "General", "recoverable GST/HST"],
    ],
    fr: [
      [
        "Comment fonctionne le suivi automatique des trajets?",
        "Kilométrage et bureau à domicile",
        "Tableau A",
      ],
      ["Puis-je téléverser plusieurs reçus à la fois?", "Général", "Téléversement groupé"],
      ["Que peut faire l'assistant IA?", "Général", "TPS/TVH récupérable"],
    ],
    us: [
      ["How does automatic trip tracking work?", "Mileage & Home Office", "Schedule C mileage"],
      ["Can I upload many receipts at once?", "General", "Bulk Upload"],
      ["What can the AI assistant do?", "General", "deductible totals"],
      ["Can I forward receipts by email?", "Integrations", "receipt address"],
      ["What reports can I export for my Schedule C?", "Tax & IRS", "Schedule C"],
    ],
  };
  for (const [k, rows] of Object.entries(NEW)) {
    const { items, cats } = LISTS[k as keyof typeof LISTS];
    for (const [q, cat, phrase] of rows) {
      assert.ok(find(items, q).a.includes(phrase), `${k} "${q}" mentions "${phrase}"`);
      assert.equal(categoryOf(cats, q), cat, `${k} "${q}" category`);
    }
  }
  // US answers keep US wording; CA answers keep CA wording.
  for (const it of mod.faqItemsUS.slice(-5)) assert.ok(!/T2125|GST|HST|CRA/.test(it.a), it.q);
  for (const it of mod.faqItems.slice(-3)) assert.ok(!/Schedule C|IRS/.test(it.a), it.q);
  // CA and FR stay index-aligned.
  assert.equal(mod.faqItems.length, mod.faqItemsFR.length);
});

test("faq: updated scanning and Telegram answers", () => {
  for (const items of [mod.faqItems, mod.faqItemsUS]) {
    const scan = find(items, "How does receipt scanning work?").a;
    assert.ok(scan.includes("Add receipt → Choose from file") && scan.includes("JPG, PNG or PDF"));
    const tg = find(items, "Is there a Telegram integration?").a;
    for (const p of [
      "Connect Telegram",
      "15 minutes",
      "/report",
      "PDF or CSV",
      "/support",
      "Integrations → Telegram → Disconnect",
    ])
      assert.ok(tg.includes(p), `Telegram mentions "${p}"`);
  }
  const scanFr = find(mod.faqItemsFR, "Comment fonctionne la numérisation des reçus?").a;
  assert.ok(
    scanFr.includes("Ajouter un reçu → Choisir un fichier") && scanFr.includes("JPG, PNG ou PDF"),
  );
  const tgFr = find(mod.faqItemsFR, "Y a-t-il une intégration Telegram?").a;
  for (const p of [
    "Connecter Telegram",
    "15 minutes",
    "/report",
    "PDF ou en CSV",
    "/support",
    "Intégrations → Telegram → Déconnecter",
  ])
    assert.ok(tgFr.includes(p), `Telegram FR mentions "${p}"`);
});

test("faq: no answer counts personal trips in a total, percentage or export", () => {
  // Personal trips show in the Mileage list only; they count in no total,
  // export or tax figure (portal DATA_CONTRACT §16).
  const CLAIMS = [
    /business and personal/i,
    /personal trips too/i,
    /all the kilometres you've logged/i,
    /every trip in the year/i,
    /professionnels et personnels/i,
    /trajets personnels\s*\./i,
    /tous les kilomètres enregistrés/i,
    /tous les trajets de l'année/i,
  ];
  for (const [k, { items }] of Object.entries(LISTS))
    for (const it of items)
      for (const re of CLAIMS) assert.ok(!re.test(it.a), `${k} "${it.q}" matches ${re}`);
  // The Canadian percentage is odometer-based.
  assert.match(find(mod.faqItems, "How does mileage tracking work?").a, /odometer readings/);
  assert.match(
    find(mod.faqItemsFR, "Comment fonctionne le suivi du kilométrage?").a,
    /relevés de son odomètre/,
  );
});

test("faq: no US answer claims the report fills in or shows Schedule C Part IV", () => {
  // The US annual tax report has no Part IV rows (portal taxFormRows.ts
  // usVehicleSection); the only allowed mention says ReceiptOne doesn't fill it in.
  const ALLOWED = "ReceiptOne doesn't fill in Schedule C Part IV";
  for (const it of mod.faqItemsUS)
    for (const sentence of it.a.split(/(?<=[.!?])\s+/))
      if (/Part IV/.test(sentence))
        assert.ok(sentence.startsWith(ALLOWED), `"${it.q}" claims Part IV: ${sentence}`);
  const usMileage = find(mod.faqItemsUS, "How does mileage tracking work?").a;
  assert.ok(usMileage.includes("car and truck expenses for line 9"));
});

test("faq: every entry is in exactly one category; no numeric caps or banned words", () => {
  const BANNED = /game-changer|seamless|effortless|hassle-free|unlock|supercharge/i;
  for (const [k, { items, cats }] of Object.entries(LISTS)) {
    const flat = cats.flatMap((c) => c.items);
    assert.equal(flat.length, items.length, `${k} categories cover the list once`);
    assert.deepEqual(new Set(flat), new Set(items), `${k} categories hold every entry`);
    for (const it of items) {
      assert.ok(
        !/\d[\d,.]*\s*(per hour|per day|MB|par heure|par jour|Mo)\b/i.test(it.a),
        `${k} "${it.q}" has no numeric cap`,
      );
      if (items.slice(-5).includes(it)) assert.ok(!BANNED.test(it.a), `${k} "${it.q}" banned word`);
    }
  }
});

const faqLd = (routeId: string) => {
  const ld = mod
    .head(routeId)
    .scripts.map((s) => JSON.parse(s.children))
    .filter((j) => j["@type"] === "FAQPage");
  assert.equal(ld.length, 1, `${routeId} has one FAQPage`);
  return ld[0].mainEntity as { name: string; acceptedAnswer: { text: string } }[];
};
const decode = (s: string) =>
  s
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
const visibleQuestions = (html: string) =>
  [...html.matchAll(/aria-expanded="(?:true|false)"[^>]*><span[^>]*>([\s\S]*?)<\/span>/g)].map(
    (m) => decode(m[1]),
  );

const PAGES = [
  { routeId: "/ca/", path: "/ca", list: mod.faqItems, landing: true },
  { routeId: "/fr/", path: "/fr", list: mod.faqItemsFR, landing: true },
  { routeId: "/us/", path: "/us", list: mod.faqItemsUS, landing: true },
  { routeId: "/faq", path: "/faq", list: mod.faqItems, landing: false },
  { routeId: "/fr/faq", path: "/fr/faq", list: mod.faqItemsFR, landing: false },
  { routeId: "/us/faq", path: "/us/faq", list: mod.faqItemsUS, landing: false },
];

test("faq JSON-LD: landing pages list the 3 visible questions, FAQ pages list them all", async () => {
  for (const p of PAGES) {
    const { matched, html } = await mod.render(p.routeId, p.path);
    assert.ok(matched, `${p.path} renders`);
    const visible = visibleQuestions(html);
    const ld = faqLd(p.routeId);
    if (p.landing) {
      assert.equal(ld.length, 3, `${p.path} JSON-LD has 3 questions`);
      assert.deepEqual(
        visible,
        p.list.slice(0, 3).map((x) => x.q),
        `${p.path} widget shows the first 3`,
      );
    } else {
      assert.equal(ld.length, p.list.length, `${p.path} JSON-LD has every question`);
    }
    assert.deepEqual(
      [...ld.map((x) => x.name)].sort(),
      [...visible].sort(),
      `${p.path} JSON-LD matches the visible questions`,
    );
    for (const x of ld) {
      const it = p.list.find((i) => i.q === x.name);
      assert.ok(it, `${p.path} "${x.name}" is in the list`);
      assert.equal(x.acceptedAnswer.text, it.a, `${p.path} "${x.name}" answer`);
    }
  }
});

/* ------------------------------ How-to videos ------------------------------ */

const videoIds = (items: QA[], q: string) => (find(items, q).videos ?? []).map((v) => v.id);

test("faq videos: the right clips on the right questions", () => {
  const CA: [string, string[]][] = [
    ["How does receipt scanning work?", ["upload-receipt", "add-receipt-manual"]],
    ["Can I upload many receipts at once?", ["upload-receipt"]],
    ["Is there a Telegram integration?", ["telegram-connect"]],
    ["How does mileage tracking work?", ["add-trip"]],
    ["How is the home office deduction calculated?", ["home-office"]],
    ["What reports can I export for my T2125?", ["report"]],
    ["How do I change my language or province?", ["settings"]],
    ["Can I send my report to my accountant?", ["accountant"]],
  ];
  const US: [string, string[]][] = [
    ["How does receipt scanning work?", ["upload-receipt", "add-receipt-manual"]],
    ["Can I upload many receipts at once?", ["upload-receipt"]],
    ["Is there a Telegram integration?", ["telegram-connect"]],
    ["How do I change my language or country?", ["settings"]],
  ];
  for (const [q, ids] of CA) assert.deepEqual(videoIds(mod.faqItems, q), ids, `CA "${q}"`);
  for (const [q, ids] of US) assert.deepEqual(videoIds(mod.faqItemsUS, q), ids, `US "${q}"`);
  // Nothing else carries a clip, and no item has more than two.
  const withClip = (items: QA[]) => items.filter((x) => x.videos?.length).map((x) => x.q);
  assert.deepEqual(withClip(mod.faqItems).sort(), CA.map(([q]) => q).sort());
  assert.deepEqual(withClip(mod.faqItemsUS).sort(), US.map(([q]) => q).sort());
  for (const it of [...mod.faqItems, ...mod.faqItemsUS])
    assert.ok((it.videos?.length ?? 0) <= 2, `"${it.q}" has at most two clips`);
  // French list: no clips for now.
  for (const it of mod.faqItemsFR) assert.ok(!it.videos?.length, `FR "${it.q}" has no clip`);
});

test("faq videos: no km, T2125, home-office or accountant clip on US", () => {
  for (const id of ["add-trip", "home-office", "report", "accountant"])
    assert.ok(mod.CA_ONLY_FAQ_VIDEO_IDS.includes(id), `${id} is CA-only`);
  for (const it of mod.faqItemsUS)
    for (const v of it.videos ?? [])
      assert.ok(!mod.CA_ONLY_FAQ_VIDEO_IDS.includes(v.id), `US "${it.q}" has ${v.id}`);
});

test("faq videos: files exist and the player loads nothing until play", () => {
  for (const v of Object.values(mod.FAQ_VIDEOS)) {
    assert.ok(existsSync(resolve("public", v.src.slice(1))), `${v.src} exists`);
    assert.ok(existsSync(resolve("public", v.poster.slice(1))), `${v.poster} exists`);
    assert.ok(v.title && v.description && v.duration > 0, `${v.id} metadata`);
    const html = mod.renderVideo(v);
    const tag = html.match(/<video[^>]*>/)?.[0] ?? "";
    assert.ok(tag.includes('preload="none"'), `${v.id} preload none`);
    assert.ok(tag.includes(`poster="${v.poster}"`), `${v.id} poster`);
    assert.ok(tag.includes('width="1280"') && tag.includes('height="720"'), `${v.id} 16:9 box`);
    assert.ok(tag.includes(`aria-label="${v.title.replace(/'/g, "&#x27;")}"`), `${v.id} label`);
    assert.ok(tag.includes("controls"), `${v.id} controls`);
    assert.ok(!/autoplay/i.test(html), `${v.id} no autoplay`);
    assert.ok(html.includes(`<source src="${v.src}" type="video/mp4"`), `${v.id} source`);
  }
});

test("faq videos: closed answers and landing pages render no video", async () => {
  for (const p of PAGES) {
    const { html } = await mod.render(p.routeId, p.path);
    // Landing heroes have their own clips; only the FAQ clips are checked here.
    assert.ok(!html.includes("/videos/faq/"), `${p.path} has no FAQ clip until opened`);
  }
  for (const id of ["/ca/", "/fr/", "/us/", "/fr/faq"]) {
    const ld = mod.head(id).scripts.map((s) => JSON.parse(s.children));
    assert.ok(!ld.some((j) => j["@type"] === "VideoObject"), `${id} has no VideoObject`);
  }
});

test("faq videos: VideoObject JSON-LD matches the embedded clips", () => {
  const PAIRS: [string, QA[]][] = [
    ["/faq", mod.faqItems],
    ["/us/faq", mod.faqItemsUS],
  ];
  for (const [routeId, items] of PAIRS) {
    const ld = mod
      .head(routeId)
      .scripts.map((s) => JSON.parse(s.children))
      .filter((j) => j["@type"] === "VideoObject");
    const embedded = [...new Set(items.flatMap((x) => (x.videos ?? []).map((v) => v.id)))];
    assert.equal(ld.length, embedded.length, `${routeId} one VideoObject per clip`);
    for (const id of embedded) {
      const v = mod.FAQ_VIDEOS[id];
      const o = ld.find((j) => j.name === v.title);
      assert.ok(o, `${routeId} has ${id}`);
      assert.equal(o.description, v.description);
      assert.equal(o.thumbnailUrl, `https://receipt-one.com${v.poster}`);
      assert.equal(o.contentUrl, `https://receipt-one.com${v.src}`);
      assert.equal(o.uploadDate, "2026-11-15");
      assert.equal(o.duration, mod.isoDuration(v.duration));
      assert.match(o.duration, /^PT\d+S$/);
    }
  }
  assert.equal(mod.isoDuration(26), "PT26S");
  assert.equal(mod.isoDuration(75), "PT1M15S");
});

test("faq: language and accountant questions appended to every list", () => {
  const NEW: Record<string, [string, string, string][]> = {
    ca: [
      ["How do I change my language or province?", "General", "country and province"],
      ["Can I send my report to my accountant?", "Tax & CRA", "Send to accountant"],
    ],
    fr: [
      ["Comment changer ma langue ou ma province?", "Général", "pays et votre province"],
      ["Puis-je envoyer mon rapport à mon comptable?", "Impôts et ARC", "Envoyer au comptable"],
    ],
    us: [
      ["How do I change my language or country?", "General", "Your country decides"],
      ["Can I send my report to my accountant?", "Tax & IRS", "Send to accountant"],
    ],
  };
  for (const [k, rows] of Object.entries(NEW)) {
    const { items, cats } = LISTS[k as keyof typeof LISTS];
    assert.deepEqual(
      items.slice(-2).map((x) => x.q),
      rows.map((r) => r[0]),
      `${k} appended`,
    );
    for (const [q, cat, phrase] of rows) {
      assert.ok(find(items, q).a.includes(phrase), `${k} "${q}" mentions "${phrase}"`);
      assert.equal(categoryOf(cats, q), cat, `${k} "${q}" category`);
    }
  }
  // The portal stores no US state, so the US answers name no state or province.
  for (const it of mod.faqItemsUS.slice(-2)) assert.ok(!/province|state/i.test(it.a), it.q);
});
