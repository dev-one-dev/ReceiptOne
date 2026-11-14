import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { CategoryPill, SmallCard } from "@/components/site/ArticlesSection";
import type { HubLink, ResolvedPart } from "@/lib/articles.parts";

/* ----------------------------- Jump buttons ------------------------------- */

/** One pill per part. Wraps and centres on desktop; on narrow screens it is a
 * single horizontally scrollable row that bleeds to the screen edges. */
export function PartJumpLinks({ parts }: { parts: ResolvedPart[] }) {
  return (
    <nav aria-label="Article parts" className="mt-4 -mx-4 sm:-mx-6 lg:mx-0">
      <ul className="flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:px-6 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {parts.map((part) => (
          <li key={part.id} className="shrink-0 snap-start">
            <a
              href={`#${part.id}`}
              className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-white px-4 py-2 font-sans text-sm font-medium text-ink transition-colors duration-200 hover:border-ink"
            >
              <span className="font-mono text-nav font-normal uppercase tracking-mono text-ink-60">
                {part.number}
              </span>
              {part.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ----------------------------- Link card ---------------------------------- */

/** A card for a site page, styled like an article card. The cover is drawn in
 * code (no photo), at the same 16:9 so rows stay aligned. */
function LinkCard({ link }: { link: HubLink }) {
  return (
    <Link
      to={link.href}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      <div
        aria-hidden
        className="flex aspect-video w-full items-center justify-center bg-ink-05 text-ink-40"
      >
        <CalendarDays className="size-10" strokeWidth={1.5} />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <CategoryPill label={link.category} />
        <h3 className="mt-1.5 text-lead tracking-body text-ink">{link.title}</h3>
        <p className="mt-auto pt-2 text-label text-ink-60">{link.excerpt}</p>
      </div>
    </Link>
  );
}

/* ----------------------------- Sidebar ------------------------------------ */

/**
 * The id of the part whose section is in view, or null before the observer
 * has run. Starts null on the server and on the first client render, so the
 * server HTML and hydration agree; the highlight appears after mount.
 */
function useActivePart(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = ids
      .map((id) => document.querySelector<HTMLElement>(`[data-part="${id}"]`))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();

    // The band between the fixed header and 55% down the viewport counts as
    // "in view"; the first part (in page order) inside it wins.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.part!;
          if (e.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        const first = ids.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-112px 0px -45% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function PartsSidebar({ parts, active }: { parts: ResolvedPart[]; active: string | null }) {
  return (
    <nav
      aria-label="Contents"
      className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 [scrollbar-width:thin]"
    >
      <p className="eyebrow">Contents</p>
      <ol className="mt-3 space-y-3">
        {parts.map((part) => {
          const isActive = part.id === active;
          return (
            <li
              key={part.id}
              className={`border-l-2 pl-3 transition-colors duration-200 ${
                isActive ? "border-ember" : "border-hairline"
              }`}
            >
              <a
                href={`#${part.id}`}
                aria-current={isActive ? "location" : undefined}
                className="block font-sans text-sm font-semibold text-ink hover:underline"
              >
                <span className="mr-1.5 font-mono text-nav font-normal uppercase tracking-mono text-ink-60">
                  {part.number}
                </span>
                {part.title}
              </a>
              <ul className="mt-1.5 space-y-1.5">
                {part.articles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to="/articles/$slug"
                      params={{ slug: a.slug }}
                      className={`block font-sans text-sm transition-colors duration-200 hover:text-ink hover:underline ${
                        isActive ? "text-ink-80" : "text-ink-60"
                      }`}
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
                {part.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      className={`block font-sans text-sm transition-colors duration-200 hover:text-ink hover:underline ${
                        isActive ? "text-ink-80" : "text-ink-60"
                      }`}
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ----------------------------- Hub ---------------------------------------- */

export function ArticlesHub({ parts }: { parts: ResolvedPart[] }) {
  const [ids] = useState(() => parts.map((p) => p.id));
  const active = useActivePart(ids);

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
        <aside className="hidden lg:block">
          <PartsSidebar parts={parts} active={active} />
        </aside>

        <div>
          {parts.map((part, partIndex) => (
            <section
              key={part.id}
              data-part={part.id}
              aria-labelledby={part.id}
              className="py-6 first:pt-2 sm:py-8 sm:first:pt-2"
            >
              <div className="mb-4">
                <p className="eyebrow">Part {part.number}</p>
                <h2 id={part.id} className="mt-1 scroll-mt-28 text-ink">
                  {part.title}
                </h2>
                <p className="mt-2 font-sans text-body text-ink-60">{part.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {part.articles.map((a, i) => (
                  <SmallCard
                    key={a.slug}
                    article={a}
                    basePath="/articles"
                    eager={partIndex === 0 && i === 0}
                  />
                ))}
                {part.links.map((l) => (
                  <LinkCard key={l.href} link={l} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
