import { Link } from "@tanstack/react-router";
import type { Announcement } from "@/lib/roadmap";

/**
 * "[New] <latest shipped feature> →" above the hero h1, linking to the
 * changelog. Server-rendered from the route loader, so it is either in the
 * first paint or absent -- no pop-in, no reserved space. One line; the title
 * truncates with an ellipsis when the column is narrow.
 *
 * The badge is the darkened accent (ember-text) with paper text, the same
 * pairing as Chip's "ember-text" tone: white on plain ember is ~2.8:1 and
 * fails AA at this size; paper on ember-text clears 4.5:1.
 *
 * The focus ring is `!`-important because the unlayered
 * `[data-interactive-page] a:focus-visible` rule in styles.css (outline:
 * none, a faint shadow, radius-card) otherwise beats utilities and would
 * square the pill off on focus.
 */
export function AnnouncementPill({ announcement }: { announcement: Announcement }) {
  return (
    <Link
      to={announcement.href}
      data-no-anim
      className="group mb-4 inline-flex max-w-full items-center gap-2 rounded-pill border border-hairline bg-paper py-1 pl-1 pr-3 font-sans text-sm font-normal tracking-body text-ink hover:border-ink-20 focus-visible:rounded-pill! focus-visible:shadow-[0_0_0_2px_var(--color-paper),0_0_0_4px_var(--color-ink)]!"
    >
      <span className="shrink-0 rounded-pill bg-ember-text px-2 py-0.5 text-label font-semibold text-paper">
        {announcement.label}
      </span>
      <span className="min-w-0 truncate">{announcement.title}</span>
      <span
        className="shrink-0 text-ink-60 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
