import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "paper" | "void";

/**
 * The one primary CTA, shared by FinalCta (on the void), TopBanner and
 * Pricing (on paper). Same shape, arrow and hover lift everywhere; only the
 * fill inverts for the surface it sits on. Ember is never the fill here --
 * see the Ember Surface Rule in DESIGN.md.
 *
 * Sized as a peer of StoreBadge, not a hero button: the same 44px height
 * (h-11) and the same card radius, so button + badges sit on one row as a
 * single family. Keep the two in lockstep if either changes.
 *
 * Renders a plain <a>: every trial CTA is cross-origin into the web app.
 */
const BASE =
  "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-card px-5 font-display text-body font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto";

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
