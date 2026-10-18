import { useLocation } from "@tanstack/react-router";
import { langOf, type Lang } from "@/lib/locales";

/** The page's language, from its path: /fr and /fr/* are French, the rest English. */
export function useLang(): Lang {
  return langOf(useLocation().pathname);
}
