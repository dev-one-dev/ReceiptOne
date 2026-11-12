import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  slug,
  useLegalUIState,
  type SummaryItem,
  type Region,
} from "@/components/site/legal/shared";
import type { Lang } from "@/lib/locales";

/**
 * Page shell for the terms of use: parts, collapsible sections, TOC, summary
 * sidebar and print support. /terms and /fr/terms each pass their own PARTS,
 * summary and header; the chrome strings below are the only text this module
 * owns.
 */

export type SectionEntry = {
  number?: string;
  title: string;
  /** Which jurisdictions the section is relevant to. Empty/undefined = both. */
  regions?: Region[];
  content: (region: Region) => ReactNode;
};

export type PartEntry = {
  id: string;
  label: string;
  title: string;
  sections: SectionEntry[];
};

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
    sectionCount: (n: number) => string;
  }
> = {
  en: {
    docTitle: "Terms of Use",
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
    sectionCount: (n) => `${n} section${n === 1 ? "" : "s"}`,
  },
  fr: {
    docTitle: "Conditions d'utilisation",
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
    sectionCount: (n) => `${n} section${n > 1 ? "s" : ""}`,
  },
};

export const sectionId = (s: SectionEntry) =>
  s.number ? `section-${s.number}` : `section-${slug(s.title)}`;

const isApplicable = (s: SectionEntry, region: Region) => {
  if (region === "all" || !s.regions || s.regions.length === 0) return true;
  return s.regions.includes(region);
};

/* --------------------------------- Page --------------------------------- */

export function TermsDocument({
  lang,
  storageKey,
  parts,
  summary,
  header,
}: {
  lang: Lang;
  storageKey: string;
  parts: PartEntry[];
  summary: SummaryItem[];
  /** "Last updated" line, h1 and intro. */
  header: ReactNode;
}) {
  const t = CHROME[lang];
  const allPartIds = useMemo(() => parts.map((p) => p.id), [parts]);
  const {
    region,
    setRegion,
    openParts,
    openSections,
    setOpenParts,
    setOpenSections,
    toggleSection,
    togglePart,
  } = useLegalUIState(storageKey, allPartIds);
  const [tocOpen, setTocOpen] = useState(false);
  const printRestoreRef = useRef<{ parts: Set<string>; sections: Set<string> } | null>(null);

  const allSectionIds = useMemo(
    () => parts.flatMap((p) => p.sections.map((s) => sectionId(s))),
    [parts],
  );

  const expandAll = () => {
    setOpenSections(new Set(allSectionIds));
    setOpenParts(new Set(parts.map((p) => p.id)));
  };
  const collapseAll = () => {
    setOpenSections(new Set());
  };

  const handleBeforePrint = () => {
    printRestoreRef.current = {
      parts: new Set(openParts),
      sections: new Set(openSections),
    };
    // Open every applicable section/part for the active region.
    setOpenParts(new Set(parts.map((p) => p.id)));
    setOpenSections(
      new Set(
        parts.flatMap((p) =>
          p.sections.filter((s) => isApplicable(s, region)).map((s) => sectionId(s)),
        ),
      ),
    );
  };
  const handleAfterPrint = () => {
    const snap = printRestoreRef.current;
    if (snap) {
      setOpenParts(snap.parts);
      setOpenSections(snap.sections);
      printRestoreRef.current = null;
    }
  };

  const scrollToId = (id: string) => {
    // Open the section + its part before scrolling.
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const part = parts.find((p) => p.sections.some((s) => sectionId(s) === id));
    if (part) {
      setOpenParts((prev) => {
        const next = new Set(prev);
        next.add(part.id);
        return next;
      });
    }
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
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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
              <TableOfContents lang={lang} parts={parts} region={region} onJump={scrollToId} />
            </div>
          </aside>

          <div className="space-y-6">
            {parts.map((part) => (
              <PartBlock
                key={part.id}
                lang={lang}
                part={part}
                region={region}
                isOpen={openParts.has(part.id)}
                onToggle={() => togglePart(part.id)}
                openSections={openSections}
                onToggleSection={toggleSection}
              />
            ))}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
              <LegalSummary subtitle={t.docTitle} items={summary} region={region} lang={lang} />
            </div>
          </aside>
        </div>
      </article>

      {/* Mobile TOC drawer */}
      {tocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
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
            <TableOfContents lang={lang} parts={parts} region={region} onJump={scrollToId} />
          </div>
        </div>
      )}
    </main>
  );
}

/* --------------------------- Table of contents --------------------------- */

function TableOfContents({
  lang,
  parts,
  region,
  onJump,
}: {
  lang: Lang;
  parts: PartEntry[];
  region: Region;
  onJump: (id: string) => void;
}) {
  const t = CHROME[lang];
  return (
    <nav aria-label={t.tocLabel} className="space-y-5 text-sm">
      {parts.map((part) => {
        const visible = part.sections.filter((s) => isApplicable(s, region));
        return (
          <div key={part.id}>
            <div className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => onJump(part.id)}
                className="flex-1 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                {part.label} — {part.title}
              </button>
              <AnchorButton
                hash={part.id}
                region={region}
                label={t.copyTitle(part.label)}
                lang={lang}
              />
            </div>
            <ul className="mt-2 space-y-1 border-l border-border pl-3">
              {visible.map((s) => {
                const id = sectionId(s);
                return (
                  <li key={id}>
                    <div className="group flex items-start gap-1">
                      <button
                        type="button"
                        onClick={() => onJump(id)}
                        className="flex-1 text-left leading-snug text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {s.number ? (
                          <span className="mr-1 text-foreground/70">{s.number}.</span>
                        ) : null}
                        {s.title}
                      </button>
                      <AnchorButton
                        hash={id}
                        region={region}
                        label={t.copySection(s.number ?? s.title)}
                        lang={lang}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------- Part block ------------------------------ */

function PartBlock({
  lang,
  part,
  region,
  isOpen,
  onToggle,
  openSections,
  onToggleSection,
}: {
  lang: Lang;
  part: PartEntry;
  region: Region;
  isOpen: boolean;
  onToggle: () => void;
  openSections: Set<string>;
  onToggleSection: (id: string) => void;
}) {
  const t = CHROME[lang];
  const visible = part.sections.filter((s) => isApplicable(s, region));
  const headingRef = useRef<HTMLDivElement>(null);

  return (
    <section id={part.id} className="rounded-2xl border border-border bg-card/50 scroll-mt-24">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 rounded-2xl bg-muted/30 px-5 py-4 text-left transition-colors hover:bg-muted/50"
      >
        <div ref={headingRef}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {part.label}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-normal sm:text-2xl">
            {part.title}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t.sectionCount(visible.length)}</p>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="space-y-3 px-3 pb-5 pt-3 sm:px-5">
          {visible.map((s) => {
            const id = sectionId(s);
            return (
              <SectionAccordion
                key={id}
                lang={lang}
                id={id}
                section={s}
                region={region}
                isOpen={openSections.has(id)}
                onToggle={() => onToggleSection(id)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

/* --------------------------- Section accordion --------------------------- */

function SectionAccordion({
  lang,
  id,
  section,
  region,
  isOpen,
  onToggle,
}: {
  lang: Lang;
  id: string;
  section: SectionEntry;
  region: Region;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const t = CHROME[lang];
  const tags = REGION_TAG_LABELS[lang];
  const onlyUS = section.regions?.length === 1 && section.regions[0] === "us";
  const onlyCA = section.regions?.length === 1 && section.regions[0] === "ca";

  return (
    <div
      id={id}
      className="group/section overflow-hidden rounded-xl border border-border bg-background scroll-mt-24"
    >
      <div className="flex items-center gap-2 pr-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          className="flex flex-1 items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40 sm:px-5 sm:py-4"
        >
          <div className="flex flex-1 items-baseline gap-3">
            {section.number && (
              <span className="font-mono text-xs font-semibold text-muted-foreground sm:text-sm">
                {section.number.padStart(2, "0")}
              </span>
            )}
            <h3 className="font-display text-base font-semibold tracking-normal sm:text-lg">
              {section.title}
            </h3>
            {onlyUS && <RegionTag tone="us">{tags.us}</RegionTag>}
            {onlyCA && <RegionTag tone="ca">{tags.ca}</RegionTag>}
          </div>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        <AnchorButton
          hash={id}
          region={region}
          label={t.copyTitle(section.title)}
          className="opacity-0 group-hover/section:opacity-100"
          lang={lang}
        />
      </div>
      {isOpen && (
        <div
          id={`${id}-panel`}
          className="space-y-4 border-t border-border bg-background px-4 py-4 text-base leading-7 text-muted-foreground sm:px-5 sm:py-5"
        >
          {section.content(region)}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Helpers --------------------------------- */

export function RegionInline({
  region,
  us,
  ca,
  both,
}: {
  region: Region;
  us: string;
  ca: string;
  both: string;
}) {
  if (region === "us") return <>{us}</>;
  if (region === "ca") return <>{ca}</>;
  return <>{both}</>;
}
