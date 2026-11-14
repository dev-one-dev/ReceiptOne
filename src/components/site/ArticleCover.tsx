/**
 * Typographic article cover, rendered in code: no image file and no external
 * request. Fills the 16:9 slot the article photo used to (index cards, related
 * cards, article hero). Paper background, an ember accent bar (fill only, never
 * text), the category as an eyebrow and the title in the display face.
 *
 * Decorative: the same category and title are real text right next to it, so
 * the cover is aria-hidden and its title is a <p>, not a heading.
 */
type CoverSize = "hero" | "featured" | "card";

const PAD: Record<CoverSize, string> = {
  hero: "p-4 sm:p-6 lg:p-10",
  featured: "p-4 sm:p-5",
  card: "p-3",
};

const TITLE: Record<CoverSize, string> = {
  hero: "text-h3 tracking-h3 sm:text-h2 sm:tracking-display",
  featured: "text-h3 tracking-h3",
  card: "text-lead tracking-body",
};

export function ArticleCover({
  category,
  title,
  size,
  className = "",
}: {
  category: string;
  title: string;
  size: CoverSize;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-article-cover
      className={`relative flex aspect-[16/9] w-full flex-col justify-between overflow-hidden bg-paper ${PAD[size]} ${className}`}
    >
      <span className="absolute inset-y-0 left-0 w-1 bg-ember" />
      <p className="eyebrow">{category}</p>
      <p className={`line-clamp-3 font-display font-medium text-ink ${TITLE[size]}`}>{title}</p>
    </div>
  );
}
