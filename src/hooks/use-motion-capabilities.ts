import { useEffect, useState } from "react";

export function useMotionCapabilities() {
  const [caps, setCaps] = useState({ hasFinePointer: false, prefersReducedMotion: false });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setCaps({ hasFinePointer: fine.matches, prefersReducedMotion: reduce.matches });
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);
  return caps;
}
