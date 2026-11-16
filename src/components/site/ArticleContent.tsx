/**
 * Article body template: content blocks, the "Quick answer" box and the
 * "How ReceiptOne helps" box. Markup matches the CA article route
 * (src/routes/articles/$slug.tsx) so a US article written to the same
 * structure renders the same way. Used by /us/articles/$slug and, with
 * lang="fr", by /fr/articles/$slug.
 */
import { CheckCircle2 } from "lucide-react";
import { FAQ_HEADING, type Article, type ContentBlock } from "@/lib/articles";
import type { Lang } from "@/lib/locales";

/** The template's own labels. French follows OQLF spacing (space before ":"). */
const ARTICLE_LABELS: Record<
  Lang,
  { sources: string; quickAnswer: string; helps: string; faqHeading: string }
> = {
  en: {
    sources: "Sources:",
    quickAnswer: "Quick answer",
    helps: "How ReceiptOne helps",
    faqHeading: FAQ_HEADING,
  },
  fr: {
    sources: "Sources\u00a0:",
    quickAnswer: "Réponse rapide",
    helps: "Comment ReceiptOne vous aide",
    faqHeading: "Foire aux questions",
  },
};

/* ----------------------------- Content blocks ----------------------------- */

export function renderBlock(block: ContentBlock, index: number, lang: Lang = "en") {
  switch (block.type) {
    case "p":
      return (
        <p key={index} className="mb-5 font-sans text-body text-ink-80">
          {block.text}
          {block.link && (
            <>
              {" "}
              <a
                href={block.link.href}
                hrefLang={block.link.hrefLang}
                className="text-ink underline underline-offset-2 hover:text-ink-80"
              >
                {block.link.label}
              </a>
            </>
          )}
        </p>
      );

    case "faq":
      return (
        <p key={index} className="mb-5 font-sans text-body text-ink-80">
          {block.q} {block.a}
        </p>
      );

    case "h2":
      return (
        <h2 key={index} className="mb-4 mt-10 text-h3 text-ink">
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3 key={index} className="mb-3 mt-8 text-lead tracking-body text-ink">
          {block.text}
        </h3>
      );

    case "ul":
      return (
        <ul key={index} className="mb-5 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ember" aria-hidden />
              <span className="font-sans text-body text-ink-80">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "callout":
      return (
        <div
          key={index}
          className="mb-5 overflow-hidden rounded-card border border-hairline bg-paper"
        >
          <div className="flex gap-0">
            {/* Orange left stripe */}
            <div className="w-1 shrink-0 bg-ember" aria-hidden />
            <p className="p-6 font-sans text-body text-ink-80">{block.text}</p>
          </div>
        </div>
      );

    case "table":
      return (
        <figure key={index} className="mb-5">
          <div className="overflow-x-auto rounded-card border border-hairline bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left font-sans text-sm">
              <thead className="bg-ink-05">
                <tr>
                  {block.headers.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="border-b border-hairline px-3 py-2.5 align-bottom font-semibold text-ink"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-hairline last:border-b-0">
                    {row.map((cell, c) =>
                      c === 0 ? (
                        <th
                          key={c}
                          scope="row"
                          className="px-3 py-2.5 align-top font-semibold text-ink"
                        >
                          {cell}
                        </th>
                      ) : (
                        <td key={c} className="px-3 py-2.5 align-top text-ink-80">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figcaption className="mt-2 font-sans text-sm text-ink-60">{block.caption}</figcaption>
        </figure>
      );

    case "sources":
      return (
        <div key={index} className="mb-5 font-sans text-sm text-ink-60">
          <p>
            {ARTICLE_LABELS[lang].sources}{" "}
            {block.links.map((link, i) => (
              <span key={link.href}>
                {i > 0 && " · "}
                <a
                  href={link.href}
                  hrefLang={link.hrefLang}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-ink-80 underline underline-offset-2 hover:text-ink"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </p>
          <p className="mt-1">{block.checked}</p>
        </div>
      );

    default:
      return null;
  }
}

/* ----------------------------- Optional boxes ----------------------------- */

/** "Quick answer" above the body. Ember is the border only; the text is ink. */
function QuickAnswer({ text, lang }: { text: string; lang: Lang }) {
  return (
    <div data-quick-answer className="mb-8 rounded-card border border-ember bg-white p-5 sm:p-6">
      <p className="eyebrow">{ARTICLE_LABELS[lang].quickAnswer}</p>
      <p className="mt-2 font-sans text-body text-ink-80">{text}</p>
    </div>
  );
}

/** "How ReceiptOne helps", before the FAQ: the callout's stripe with a checklist and a CTA link. */
function ReceiptOneHelps({
  helps,
  lang,
}: {
  helps: NonNullable<Article["receiptOneHelps"]>;
  lang: Lang;
}) {
  return (
    <aside
      data-receiptone-helps
      aria-label={ARTICLE_LABELS[lang].helps}
      className="mb-5 mt-10 overflow-hidden rounded-card border border-hairline bg-white"
    >
      <div className="flex gap-0">
        <div className="w-1 shrink-0 bg-ember" aria-hidden />
        <div className="p-6">
          <p className="eyebrow">{ARTICLE_LABELS[lang].helps}</p>
          <ul className="mt-3 space-y-3">
            {helps.items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ember" aria-hidden />
                <span className="font-sans text-body text-ink-80">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-sans text-body">
            <a
              href={helps.link.href}
              className="font-medium text-ink underline underline-offset-2 hover:text-ink-80"
            >
              {helps.link.label}
            </a>
          </p>
        </div>
      </div>
    </aside>
  );
}

/** Body blocks, with the optional helps box inserted before the FAQ heading (or at the end). */
export function ArticleBody({ article, lang = "en" }: { article: Article; lang?: Lang }) {
  const heading = ARTICLE_LABELS[lang].faqHeading;
  const faqAt = article.body.findIndex((b) => b.type === "h2" && b.text === heading);
  const split = faqAt === -1 ? article.body.length : faqAt;
  return (
    <>
      {article.quickAnswer && <QuickAnswer text={article.quickAnswer} lang={lang} />}
      {article.body.slice(0, split).map((block, i) => renderBlock(block, i, lang))}
      {article.receiptOneHelps && <ReceiptOneHelps helps={article.receiptOneHelps} lang={lang} />}
      {article.body.slice(split).map((block, i) => renderBlock(block, split + i, lang))}
    </>
  );
}
