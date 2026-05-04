import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref + a numeric key that increments every time the observed
 * element re-enters the viewport. Use the key on a child to restart its
 * CSS animations by remounting.
 */
export function useReplayOnVisible<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [key, setKey] = useState(0);
  const wasVisible = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!wasVisible.current) {
            wasVisible.current = true;
            setKey((k) => k + 1);
          }
        } else {
          wasVisible.current = false;
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, key] as const;
}
