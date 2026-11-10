import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Announcement } from "@/lib/roadmap";

/**
 * "New · <latest shipped feature>" above the hero h1, linking to the
 * changelog. Server-rendered from the route loader, so it is either in the
 * first paint or absent -- no pop-in, no reserved space. One line; the title
 * truncates with an ellipsis when the column is narrow.
 */
export function AnnouncementPill({ announcement }: { announcement: Announcement }) {
  return (
    <Link
      to={announcement.href}
      data-no-anim
      className="mb-4 inline-flex max-w-full items-center gap-2 rounded-pill border border-hairline bg-white px-3 py-1.5 font-mono text-label uppercase tracking-mono text-ink-80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:text-ink"
    >
      <span className="size-1.5 shrink-0 rounded-pill bg-ember" aria-hidden />
      <span className="shrink-0 text-ink">{announcement.label}</span>
      <span className="shrink-0 text-ink-40" aria-hidden>
        ·
      </span>
      <span className="min-w-0 truncate">{announcement.title}</span>
      <ArrowRight className="size-3.5 shrink-0" aria-hidden />
    </Link>
  );
}
