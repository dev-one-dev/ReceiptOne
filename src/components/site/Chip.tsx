type ChipTone = "ember" | "green";

/**
 * The one floating chip on the marketing surface. "Coming soon" in
 * NotAll.tsx is the reference; Pricing's "Most Popular" / "Best Deal" render
 * the same element, so height, font size, padding and shadow live in exactly
 * one place and cannot drift again.
 *
 * Positioning belongs to the caller (NotAll floats it on a card edge,
 * Pricing sits it in a grid row); everything else is fixed here.
 *
 * Plain template string, not cn(): tailwind-merge does not know text-label
 * is a font size and would drop it as a "conflicting" text colour.
 */
const BASE =
  "whitespace-nowrap rounded-pill px-4 py-1 font-sans text-label font-semibold text-ink shadow-[0_4px_12px_rgba(249,115,22,0.4)]";

/* green-500 is Tailwind's default-theme green, the direct analogue of ember
   (orange-500). No green is defined in receiptone-tokens.css or styles.css. */
const TONE: Record<ChipTone, string> = {
  ember: "bg-ember",
  green: "bg-green-500",
};

export function Chip({
  tone = "ember",
  className,
  children,
}: {
  tone?: ChipTone;
  className?: string;
  children: React.ReactNode;
}) {
  return <span className={`${BASE} ${TONE[tone]}${className ? ` ${className}` : ""}`}>{children}</span>;
}
