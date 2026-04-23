import { useEffect } from "react";

/**
 * Sets up a global IntersectionObserver that reveals elements
 * with the [data-reveal] attribute as they enter the viewport.
 * Works in tandem with the .reveal / .reveal-visible CSS in styles.css.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (prefersReduced) {
      elements.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    elements.forEach((el, i) => {
      el.classList.add("reveal");
      if (!el.style.getPropertyValue("--reveal-delay")) {
        el.style.setProperty("--reveal-delay", `${Math.min(i * 60, 240)}ms`);
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);
}