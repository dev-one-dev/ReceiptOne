import { useEffect } from "react";

/**
 * Auto-reveal on scroll.
 *
 * Targets:
 *  - any element with [data-reveal]
 *  - all direct children of [data-reveal-root] (auto-applies to new sections)
 *
 * Adds a staggered "wave" effect based on vertical position in the document,
 * so blocks animate top-to-bottom regardless of DOM order.
 * Honors prefers-reduced-motion.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const collect = (): HTMLElement[] => {
      const set = new Set<HTMLElement>();
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => set.add(el));
      document
        .querySelectorAll<HTMLElement>("[data-reveal-root] > *")
        .forEach((el) => {
          if (el.hasAttribute("data-reveal-skip")) return;
          set.add(el);
        });
      return Array.from(set);
    };

    const apply = (els: HTMLElement[]) => {
      if (prefersReduced) {
        els.forEach((el) => el.classList.add("reveal-visible"));
        return;
      }

      // Sort by vertical position so the wave goes top → bottom.
      const sorted = [...els].sort(
        (a, b) =>
          a.getBoundingClientRect().top + window.scrollY -
          (b.getBoundingClientRect().top + window.scrollY),
      );

      sorted.forEach((el, i) => {
        if (!el.classList.contains("reveal")) {
          el.classList.add("reveal");
        }
        // Wave stagger: 90ms per step, capped so late blocks don't lag too long.
        const delay = Math.min(i * 90, 600);
        el.style.setProperty("--reveal-delay", `${delay}ms`);
      });
    };

    let elements = collect();
    apply(elements);

    if (prefersReduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    elements.forEach((el) => io.observe(el));

    // Watch for newly added blocks (e.g. async content) and reveal them too.
    const mo = new MutationObserver(() => {
      const next = collect();
      const fresh = next.filter((el) => !elements.includes(el));
      if (fresh.length === 0) return;
      apply(next);
      fresh.forEach((el) => io.observe(el));
      elements = next;
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}