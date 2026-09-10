import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "paper" | "void";

/**
 * The one primary CTA pill, shared by FinalCta (on the void), TopBanner and
 * Pricing (on paper). Same shape, arrow and hover lift everywhere; only the
 * fill inverts for the surface it sits on. Ember is never the fill here --
 * see the Ember Surface Rule in DESIGN.md.
 *
 * Renders a plain <a>: every trial CTA is cross-origin into the web app.
 */
const BASE =
  "group inline-flex w-full items-center justify-center gap-2 rounded-pill px-7 py-3.5 font-display text-body font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto";

const SURFACE: Record<Surface, string> = {
  paper: "bg-ink text-paper",
  void: "bg-paper text-ink",
};

export function PrimaryCta({
  href,
  surface = "paper",
  className,
  children,
}: {
  href: string;
  surface?: Surface;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={cn(BASE, SURFACE[surface], className)}>
      {children}
      <ArrowRight
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden
      />
    </a>
  );
}
