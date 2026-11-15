/**
 * Hyphenated tax-form names: 1099-NEC, 1099-K, 1099-MISC, 1040-ES, W-9, W-2,
 * 1120-S. Digits then letters, or W- then digits, so year ranges ("2025-26")
 * and ordinary hyphenated words ("Self-Employed") don't match.
 */
const FORM_NAME = /(?:^|[^\w-])(?:\d{3,4}-[A-Z]{1,4}|W-\d{1,2}[A-Z]?)(?![\w-])/;

/**
 * Renders a visible title unchanged, but keeps every whitespace-delimited word
 * that contains a form name on one line: browsers may break after the hyphen
 * ("1099-" / "NEC"), and CSS has no switch for it. The whole word is wrapped,
 * so trailing punctuation ("1099-NEC,") stays attached. Display only: the
 * stored string, <title>, og:title and JSON-LD are not touched. Same
 * technique as the footer deadline strip (TaxDeadlines.tsx).
 */
export function FormNames({ text }: { text: string }) {
  // Plain runs stay one text node each, so the SSR markup is
  // "Forms <span>1099-NEC,</span> <span>1099-K</span> and <span>W-9</span>".
  const parts: (string | { word: string })[] = [];
  for (const part of text.split(/(\s+)/)) {
    if (FORM_NAME.test(part)) parts.push({ word: part });
    else if (typeof parts.at(-1) === "string") parts[parts.length - 1] += part;
    else if (part) parts.push(part);
  }
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <span key={i} className="whitespace-nowrap">
            {p.word}
          </span>
        ),
      )}
    </>
  );
}
