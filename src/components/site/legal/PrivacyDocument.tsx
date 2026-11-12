import React, { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronsDownUp, ChevronsUpDown, ListTree, X } from "lucide-react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import {
  AnchorButton,
  LegalSummary,
  PrintButton,
  REGION_TAG_LABELS,
  RegionSwitcher,
  RegionTag,
  useLegalUIState,
  type SummaryItem,
  type Region,
} from "@/components/site/legal/shared";
import type { Lang } from "@/lib/locales";

/**
 * Page shell for the privacy policy: sticky bar, region switcher, collapsible
 * sections, TOC, summary sidebar and print support. /privacy and /fr/privacy
 * each pass their own section catalog, summary, header and section text; the
 * chrome strings below are the only text this module owns.
 */

export type PrivacySectionMeta = {
  number: string;
  title: string;
  /** `region` flags subsections that apply only to one jurisdiction. */
  subsections?: { id: string; title: string; region?: "us" | "ca" }[];
};

type RegionMap = Record<string, "us" | "ca" | "all">;

const CHROME: Record<
  Lang,
  {
    docTitle: string;
    openToc: string;
    contents: string;
    backToSite: string;
    home: "/ca" | "/fr";
    expandAll: string;
    collapseAll: string;
    close: string;
    tocLabel: string;
    copySection: (n: string) => string;
    copyTitle: (t: string) => string;
  }
> = {
  en: {
    docTitle: "Privacy Policy",
    openToc: "Open table of contents",
    contents: "Contents",
    backToSite: "Back to site",
    home: "/ca",
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    close: "Close",
    tocLabel: "Table of contents",
    copySection: (n) => `Copy link to section ${n}`,
    copyTitle: (t) => `Copy link to ${t}`,
  },
  fr: {
    docTitle: "Politique de confidentialité",
    openToc: "Ouvrir la table des matières",
    contents: "Table des matières",
    backToSite: "Retour au site",
    home: "/fr",
    expandAll: "Tout développer",
    collapseAll: "Tout réduire",
    close: "Fermer",
    tocLabel: "Table des matières",
    copySection: (n) => `Copier le lien vers la section ${n}`,
    copyTitle: (t) => `Copier le lien vers ${t}`,
  },
};

export const sectionAnchorId = (n: string) => `section-${n}`;
export const subsectionAnchorId = (id: string) => `section-${id.replace(".", "-")}`;

export function PrivacyDocument({
  lang,
  storageKey,
  sections,
  summary,
  header,
  children,
}: {
  lang: Lang;
  storageKey: string;
  sections: PrivacySectionMeta[];
  summary: SummaryItem[];
  /** "Last updated" line, h1, intro and request contact line. */
  header: ReactNode;
  /** The <Section> elements. */
  children: ReactNode;
}) {
  const t = CHROME[lang];
  const allPartIds = useMemo(() => ["privacy-all"], []);
  const { region, setRegion, openSections, setOpenSections, toggleSection } = useLegalUIState(
    storageKey,
    allPartIds,
  );
  const [tocOpen, setTocOpen] = useState(false);
  const printRestoreRef = useRef<Set<string> | null>(null);

  const subsectionRegions = useMemo(
    () =>
      sections.reduce<RegionMap>((acc, s) => {
        s.subsections?.forEach((ss) => {
          acc[ss.id] = ss.region ?? "all";
        });
        return acc;
      }, {}),
    [sections],
  );

  const allSectionAnchors = useMemo(
    () =>
      sections.flatMap((s) => [
        sectionAnchorId(s.number),
        ...(s.subsections?.map((ss) => subsectionAnchorId(ss.id)) ?? []),
      ]),
    [sections],
  );

  const expandAll = () => setOpenSections(new Set(allSectionAnchors));
  const collapseAll = () => setOpenSections(new Set());

  const handleBeforePrint = () => {
    printRestoreRef.current = new Set(openSections);
    setOpenSections(new Set(allSectionAnchors));
  };
  const handleAfterPrint = () => {
    if (printRestoreRef.current) {
      setOpenSections(printRestoreRef.current);
      printRestoreRef.current = null;
    }
  };

  const scrollToId = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.add(id);
      // Also open the parent section if `id` is a subsection.
      const parent = sections.find((s) =>
        s.subsections?.some((ss) => subsectionAnchorId(ss.id) === id),
      );
      if (parent) next.add(sectionAnchorId(parent.number));
      return next;
    });
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    setTocOpen(false);
  };

  // Open section if URL has a hash on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) scrollToId(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to={t.home} className="flex items-center gap-2">
              <img src={logoMark} alt="" aria-hidden className="block size-10" />
              <img src={logoWordmark} alt="ReceiptOne" className="block h-6 w-auto" />
            </Link>
            <p className="hidden text-sm text-muted-foreground sm:block">{t.docTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTocOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
              aria-label={t.openToc}
            >
              <ListTree className="size-4" />
              {t.contents}
            </button>
            <Link
              to={t.home}
              className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-block"
            >
              {t.backToSite}
            </Link>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="border-b border-border pb-8">
          {header}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <RegionSwitcher region={region} onChange={setRegion} lang={lang} />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground print:hidden"
              >
                <ChevronsUpDown className="size-4" />
                {t.expandAll}
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground print:hidden"
              >
                <ChevronsDownUp className="size-4" />
                {t.collapseAll}
              </button>
              <PrintButton
                onBeforePrint={handleBeforePrint}
                onAfterPrint={handleAfterPrint}
                lang={lang}
              />
            </div>
          </div>
        </header>

        <div className="grid gap-10 py-10 lg:grid-cols-[240px_minmax(0,1fr)_280px] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <PrivacyTOC lang={lang} sections={sections} region={region} onJump={scrollToId} />
            </div>
          </aside>

          <PrivacyContext.Provider
            value={{ lang, region, openSections, toggleSection, subsectionRegions }}
          >
            <div className="space-y-4">{children}</div>
          </PrivacyContext.Provider>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
              <LegalSummary subtitle={t.docTitle} items={summary} region={region} lang={lang} />
            </div>
          </aside>
        </div>
      </article>

      {tocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden print:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => setTocOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto border-l border-border bg-background p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">{t.contents}</p>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                className="rounded-full border border-border p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label={t.close}
              >
                <X className="size-4" />
              </button>
            </div>
            <PrivacyTOC lang={lang} sections={sections} region={region} onJump={scrollToId} />
          </div>
        </div>
      )}
    </main>
  );
}

/* --------------------------------- Context -------------------------------- */

type PrivacyCtx = {
  lang: Lang;
  region: Region;
  openSections: Set<string>;
  toggleSection: (id: string) => void;
  subsectionRegions: RegionMap;
};

const PrivacyContext = React.createContext<PrivacyCtx | null>(null);
const usePrivacyCtx = () => {
  const ctx = React.useContext(PrivacyContext);
  if (!ctx) throw new Error("Section/SubSection must be rendered inside PrivacyContext");
  return ctx;
};

/* ----------------------------- Table of contents -------------------------- */

function PrivacyTOC({
  lang,
  sections,
  region,
  onJump,
}: {
  lang: Lang;
  sections: PrivacySectionMeta[];
  region: Region;
  onJump: (id: string) => void;
}) {
  const t = CHROME[lang];
  const tags = REGION_TAG_LABELS[lang];
  const visible = (r?: "us" | "ca") => region === "all" || !r || r === region;
  return (
    <nav aria-label={t.tocLabel} className="space-y-5 text-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {t.docTitle}
      </p>
      <ul className="space-y-3 border-l border-border pl-3">
        {sections.map((s) => {
          const id = sectionAnchorId(s.number);
          const subs = s.subsections?.filter((ss) => visible(ss.region)) ?? [];
          return (
            <li key={s.number}>
              <div className="group flex items-start gap-1">
                <button
                  type="button"
                  onClick={() => onJump(id)}
                  className="flex-1 text-left leading-snug text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="mr-1 text-foreground/70">{s.number}.</span>
                  {s.title}
                </button>
                <AnchorButton
                  hash={id}
                  region={region}
                  label={t.copySection(s.number)}
                  lang={lang}
                />
              </div>
              {subs.length > 0 && (
                <ul className="mt-1 space-y-1 border-l border-border/60 pl-3">
                  {subs.map((ss) => {
                    const sid = subsectionAnchorId(ss.id);
                    return (
                      <li key={ss.id}>
                        <div className="group flex items-start gap-1">
                          <button
                            type="button"
                            onClick={() => onJump(sid)}
                            className="flex-1 text-left text-xs leading-snug text-muted-foreground/80 transition-colors hover:text-foreground"
                          >
                            {ss.title}
                            {ss.region === "us" && <RegionTag tone="us">{tags.us}</RegionTag>}
                            {ss.region === "ca" && <RegionTag tone="ca">{tags.ca}</RegionTag>}
                          </button>
                          <AnchorButton
                            hash={sid}
                            region={region}
                            label={t.copyTitle(ss.title)}
                            lang={lang}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ----------------------------- Section accordion -------------------------- */

export function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  const { lang, region, openSections, toggleSection } = usePrivacyCtx();
  const t = CHROME[lang];
  const id = sectionAnchorId(number);
  const isOpen = openSections.has(id);
  return (
    <section
      id={id}
      className="group/section overflow-hidden rounded-xl border border-border bg-background scroll-mt-24"
    >
      <div className="relative flex items-center gap-2 pr-3">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          className="flex flex-1 items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 sm:px-5 sm:py-4"
        >
          <div className="flex flex-1 items-baseline gap-3">
            <span className="font-mono text-xs font-semibold text-muted-foreground sm:text-sm">
              {number.padStart(2, "0")}
            </span>
            <h2 className="font-display text-base font-semibold tracking-normal sm:text-lg">
              {title}
            </h2>
          </div>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        <AnchorButton
          hash={id}
          region={region}
          label={t.copySection(number)}
          className="opacity-0 group-hover/section:opacity-100"
          lang={lang}
        />
      </div>
      {isOpen && (
        <div
          id={`${id}-panel`}
          className="space-y-4 border-t border-border bg-background px-4 py-4 text-base leading-7 text-muted-foreground sm:px-5 sm:py-5"
        >
          {children}
        </div>
      )}
    </section>
  );
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  const { lang, region, subsectionRegions } = usePrivacyCtx();
  const t = CHROME[lang];
  const tags = REGION_TAG_LABELS[lang];
  // Detect "8.1", "9.2", etc. at the start of the title.
  const idMatch = title.match(/^(\d+\.\d+)/);
  const subId = idMatch ? idMatch[1] : title;
  const anchorId = subsectionAnchorId(subId);
  const subRegion = subsectionRegions[subId];
  const applicable = !subRegion || subRegion === "all" || region === "all" || region === subRegion;

  return (
    <section
      id={anchorId}
      data-region-applicable={applicable ? "true" : "false"}
      className={`group/sub scroll-mt-24 space-y-3 rounded-lg border p-4 transition-all ${
        applicable
          ? "border-border/60 bg-card/40"
          : "border-dashed border-border/40 bg-muted/10 opacity-60 print:opacity-100"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold tracking-normal text-foreground">
          {title}
          {subRegion === "us" && <RegionTag tone="us">{tags.us}</RegionTag>}
          {subRegion === "ca" && <RegionTag tone="ca">{tags.ca}</RegionTag>}
        </h3>
        <AnchorButton
          hash={anchorId}
          region={region}
          label={t.copyTitle(title)}
          className="opacity-0 group-hover/sub:opacity-100"
          lang={lang}
        />
      </div>
      <div className="space-y-3 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-5">
      {items.map((item) => (
        <li key={item} className="list-disc marker:text-foreground">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-muted/50 text-foreground">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium sm:px-5">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card text-muted-foreground">
            {rows.map((row) => (
              <tr key={row.join("-")} className="align-top">
                {row.map((cell) => (
                  <td key={cell} className="px-4 py-3 sm:px-5">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
