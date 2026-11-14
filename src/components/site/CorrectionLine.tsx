import { SITE_URL } from "@/lib/seo";
import type { Lang } from "@/lib/locales";

const SUPPORT_EMAIL = "support@receipt-one.com";

const COPY: Record<Lang, { before: string; after: string; subject: string; page: string }> = {
  en: {
    before: "Spotted an error or something out of date? Let us know at ",
    after: ".",
    subject: "Correction: ",
    page: "Page: ",
  },
  fr: {
    before: "Vous avez repéré une erreur ou une information périmée? Écrivez-nous à ",
    after: ".",
    subject: "Correction : ",
    page: "Page : ",
  },
};

/** mailto: with the page title in the subject and the page URL in the body,
 * both percent-encoded (encodeURIComponent: spaces as %20, never "+"). */
function correctionMailto(lang: Lang, title: string, path: string): string {
  const c = COPY[lang];
  const subject = encodeURIComponent(`${c.subject}${title}`);
  const body = encodeURIComponent(`${c.page}${SITE_URL}${path}`);
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * "Found an error?" line under the disclaimer on articles and the tax
 * deadlines pages. The address is already inside an <a>, so client-side
 * auto-linkers (iOS data detectors, mail clients) have nothing to re-link.
 */
export function CorrectionLine({
  lang,
  title,
  path,
  className = "",
}: {
  lang: Lang;
  title: string;
  path: string;
  className?: string;
}) {
  const c = COPY[lang];
  return (
    <p data-correction-line className={`font-sans text-sm text-ink-60 ${className}`.trim()}>
      {c.before}
      <a
        href={correctionMailto(lang, title, path)}
        className="text-ink-80 underline underline-offset-2 hover:text-ink"
      >
        {SUPPORT_EMAIL}
      </a>
      {c.after}
    </p>
  );
}
