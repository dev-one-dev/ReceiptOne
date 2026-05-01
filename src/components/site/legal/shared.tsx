import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Link2, Printer } from "lucide-react";

export type Region = "all" | "us" | "ca";

export const REGION_OPTIONS: { value: Region; label: string; flag: string }[] = [
  { value: "all", label: "All", flag: "🌐" },
  { value: "us", label: "United States", flag: "🇺🇸" },
  { value: "ca", label: "Canada", flag: "🇨🇦" },
];

export const isRegion = (v: unknown): v is Region => v === "all" || v === "us" || v === "ca";

/* ------------------------- URL + localStorage state ------------------------ */

/**
 * Persisted UI state for /terms and /privacy. Region lives in the URL so
 * shareable links (e.g. ?region=us#section-18) reproduce the exact view.
 * Open Part/Section ids live in localStorage so they survive refresh without
 * polluting the URL.
 */
export function useLegalUIState(storageKey: string, allPartIds: string[]) {
  const [region, setRegion] = useState<Region>("all");
  const [openParts, setOpenParts] = useState<Set<string>>(() => new Set(allPartIds));
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from URL + localStorage on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const r = params.get("region");
    if (isRegion(r)) setRegion(r);

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { parts?: string[]; sections?: string[] };
        if (Array.isArray(parsed.parts)) setOpenParts(new Set(parsed.parts));
        if (Array.isArray(parsed.sections)) setOpenSections(new Set(parsed.sections));
      }
    } catch {
      /* ignore corrupted state */
    }
    setHydrated(true);
  }, [storageKey]);

  // Persist to localStorage.
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ parts: [...openParts], sections: [...openSections] }),
      );
    } catch {
      /* quota / private mode — ignore */
    }
  }, [openParts, openSections, hydrated, storageKey]);

  // Sync region to URL without scrolling.
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (region === "all") url.searchParams.delete("region");
    else url.searchParams.set("region", region);
    window.history.replaceState({}, "", url.toString());
  }, [region, hydrated]);

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const toggleSection = useCallback(
    (id: string) => setOpenSections((prev) => toggle(prev, id)),
    [],
  );
  const togglePart = useCallback(
    (id: string) => setOpenParts((prev) => toggle(prev, id)),
    [],
  );

  return {
    region,
    setRegion,
    openParts,
    openSections,
    setOpenParts,
    setOpenSections,
    toggleSection,
    togglePart,
    hydrated,
  };
}

/* ------------------------------ Region switcher ---------------------------- */

export function RegionSwitcher({
  region,
  onChange,
}: {
  region: Region;
  onChange: (r: Region) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Jurisdiction"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 print:hidden"
    >
      {REGION_OPTIONS.map((o) => {
        const active = region === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <span aria-hidden>{o.flag}</span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function RegionTag({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "us" | "ca";
}) {
  const cls =
    tone === "us"
      ? "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-300"
      : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-300";
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}
    >
      {children}
    </span>
  );
}

/* --------------------------- Region-aware paragraph ------------------------ */

/**
 * Visually de-emphasize paragraphs that don't apply to the active region
 * while preserving them in the document order so the original text structure
 * is never lost.
 */
export function RegionParagraph({
  active,
  label,
  children,
}: {
  active: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border p-4 transition-all ${
        active
          ? "border-foreground/30 bg-accent/40 text-foreground"
          : "border-dashed border-border/60 bg-muted/20 text-muted-foreground/70 opacity-70 print:opacity-100"
      }`}
      data-region-applicable={active ? "true" : "false"}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="leading-7 [&>p+p]:mt-3">{children}</div>
    </div>
  );
}

/* ------------------------------ Anchor button ----------------------------- */

/**
 * Copies a deep link to the section/part. Includes the active region so the
 * recipient sees the same view.
 */
export function AnchorButton({
  hash,
  region,
  label = "Copy link",
  className,
}: {
  hash: string;
  region: Region;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.hash = hash;
    if (region === "all") url.searchParams.delete("region");
    else url.searchParams.set("region", region);
    const href = url.toString();
    try {
      await navigator.clipboard.writeText(href);
    } catch {
      window.prompt("Copy link", href);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void onClick();
      }}
      aria-label={label}
      title={copied ? "Copied!" : label}
      className={`inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground/70 opacity-0 transition-all hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 print:hidden ${className ?? ""}`}
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
    </button>
  );
}

/* --------------------------------- Print ---------------------------------- */

/**
 * Prints a clean version with all sections expanded for the active region.
 * Restores prior open state afterward.
 */
export function PrintButton({
  onBeforePrint,
  onAfterPrint,
  className,
}: {
  onBeforePrint: () => void;
  onAfterPrint: () => void;
  className?: string;
}) {
  const handlePrint = () => {
    if (typeof window === "undefined") return;
    onBeforePrint();
    // Wait for React to flush state + open accordions before printing.
    window.setTimeout(() => {
      window.print();
      window.setTimeout(onAfterPrint, 200);
    }, 80);
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground print:hidden ${className ?? ""}`}
    >
      <Printer className="size-4" />
      Print / Export
    </button>
  );
}

/* --------------------------------- Helpers -------------------------------- */

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export const useStable = <T,>(value: T): T => useMemo(() => value, [value]);
