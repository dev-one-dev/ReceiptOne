import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export type QA = { q: string; a: string };

/** Shared FAQ list (used both for UI rendering and FAQPage JSON-LD). */
export const faqItems: QA[] = [
  {
    q: "How does receipt scanning work?",
    a: "Open the app, point your camera at any receipt, and tap. ReceiptOne reads the merchant name, date, total, and tax amounts automatically — no typing required. Paper receipts, email receipts, and PDF invoices all work.",
  },
  {
    q: "Does ReceiptOne calculate my tax refund?",
    a: "No — and we're upfront about that. ReceiptOne captures the GST/HST and PST on your receipts so you have accurate records for your CRA return. Your actual refund depends on your full tax situation, which your accountant or tax software calculates.",
  },
  {
    q: 'What does "Estimated refundable taxes" mean?',
    a: "It's the running total of GST/HST shown on your receipts — the input tax credits (ITCs) a self-employed person or small business can typically claim back from the CRA. It's a reference figure, not a guaranteed refund amount.",
  },
  {
    q: "Why is PST marked as non-refundable?",
    a: "Provincial sales tax (PST — charged in BC, Saskatchewan, Manitoba, and Quebec's QST) is generally not recoverable as an input tax credit the way GST/HST is. We flag it separately so your records are accurate when you file.",
  },
  {
    q: "What if my receipt has no tax?",
    a: "No problem. The receipt is still stored, dated, and categorized correctly. Tax fields simply show empty in your reports — which is accurate, since not every purchase is taxable.",
  },
  {
    q: "Can I export my expense reports?",
    a: "Yes. Export as PDF or CSV any time — formatted for your accountant, bookkeeper, or your own CRA filing. Your data, your format, no lock-in.",
  },
  {
    q: 'What does "Reimbursable" mean?',
    a: "Tag any expense as reimbursable when a client or employer should pay you back. Filter your reimbursables into a separate report and send it directly — no more digging through receipts at billing time.",
  },
  {
    q: "What's included in the paid plan?",
    a: "Everything: unlimited receipt scanning, automatic GST/HST/PST extraction, mileage tracking, bulk upload, multi-device sync, PDF & CSV exports, email receipt forwarding, and 10+ years of secure cloud storage.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — cancel in one tap from the app. No phone calls, no cancellation fees, no questions asked. Your data stays accessible until the end of your billing period.",
  },
  {
    q: "Is ReceiptOne a tax filing service?",
    a: "No. ReceiptOne organizes your receipts and expenses so that filing — whether you do it yourself or hand off to an accountant — is fast, accurate, and stress-free. We don't file taxes on your behalf.",
  },
];

/** US FAQ list — replaces CRA/GST/PST references with IRS/sales tax equivalents. */
export const faqItemsUS: QA[] = [
  {
    q: "How does receipt scanning work?",
    a: "Open the app, point your camera at any receipt, and tap. ReceiptOne reads the merchant name, date, total, and tax amounts automatically — no typing required. Paper receipts, email receipts, and PDF invoices all work.",
  },
  {
    q: "Does ReceiptOne calculate my tax refund?",
    a: "No — and we're upfront about that. ReceiptOne captures the sales tax on your receipts so you have accurate records for your IRS return. Your actual refund depends on your full tax situation, which your accountant or tax software calculates.",
  },
  {
    q: 'What does "Estimated refundable taxes" mean?',
    a: "It's a running reference total of deductible expenses tracked on your receipts — useful for self-employed filers and 1099 contractors. It's not a guaranteed refund amount.",
  },
  {
    q: "How is sales tax handled?",
    a: "ReceiptOne reads and records the sales tax on each receipt. For business expenses, that tax becomes part of your deductible cost — we track it separately so your records are clean and accurate when you file.",
  },
  {
    q: "What if my receipt has no tax?",
    a: "No problem. The receipt is still stored, dated, and categorized correctly. Tax fields simply show empty in your reports — which is accurate, since not every purchase is taxable.",
  },
  {
    q: "Can I export my expense reports?",
    a: "Yes. Export as PDF or CSV any time — formatted for your accountant, bookkeeper, or your own IRS filing. Your data, your format, no lock-in.",
  },
  {
    q: 'What does "Reimbursable" mean?',
    a: "Tag any expense as reimbursable when a client or employer should pay you back. Filter your reimbursables into a separate report and send it directly — no more digging through receipts at billing time.",
  },
  {
    q: "What's included in the paid plan?",
    a: "Everything: unlimited receipt scanning, automatic sales tax extraction, mileage tracking, bulk upload, multi-device sync, PDF & CSV exports, email receipt forwarding, and 10+ years of secure cloud storage.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — cancel in one tap from the app. No phone calls, no cancellation fees, no questions asked. Your data stays accessible until the end of your billing period.",
  },
  {
    q: "Is ReceiptOne a tax filing service?",
    a: "No. ReceiptOne organizes your receipts and expenses so that filing — whether you do it yourself or hand off to an accountant — is fast, accurate, and stress-free. We don't file taxes on your behalf.",
  },
];

/** FAQ questions grouped by category — used on the /faq help-center page. */
export const CATEGORIZED_FAQ: { category: string; items: QA[] }[] = [
  {
    category: "General",
    items: [faqItems[0], faqItems[4], faqItems[5], faqItems[6]],
  },
  {
    category: "Tax & CRA",
    items: [faqItems[1], faqItems[2], faqItems[3], faqItems[9]],
  },
  {
    category: "Pricing & Plans",
    items: [faqItems[7], faqItems[8]],
  },
];

/** US FAQ questions grouped by category — used on the /us/faq help-center page. */
export const CATEGORIZED_FAQ_US: { category: string; items: QA[] }[] = [
  {
    category: "General",
    items: [faqItemsUS[0], faqItemsUS[4], faqItemsUS[5], faqItemsUS[6]],
  },
  {
    category: "Tax & IRS",
    items: [faqItemsUS[1], faqItemsUS[2], faqItemsUS[3], faqItemsUS[9]],
  },
  {
    category: "Pricing & Plans",
    items: [faqItemsUS[7], faqItemsUS[8]],
  },
];

/* ----------------------------- Accordion list ----------------------------- */

/**
 * FaqAccordion — standalone accordion list with stable, jitter-free interactions.
 *
 * ANIMATION STABILITY — what was changed and why:
 *
 * 1. REMOVED: hover:-translate-y-0.5 on the <li> card.
 *    The original hover effect physically lifted the entire card upward by 2px.
 *    Because all cards sit in a stacked list, this vertical shift caused the
 *    cards below to visually "jump" relative to the hovered one, making the
 *    whole list feel unstable. Replaced with a pure background-color tint
 *    (hover:bg-black/[0.015]) which signals interactivity without moving anything.
 *
 * 2. REMOVED: transition-all on the <li> card.
 *    `transition-all` intercepts EVERY CSS property change, including any
 *    transform triggered during click/focus. Scoped to only the three properties
 *    that actually change: box-shadow, background-color, border-color.
 *    This prevents the browser from animating accidental transform side-effects.
 *
 * 3. REMOVED: scale-110 on the icon toggle button.
 *    When a question was clicked, the + icon scaled up 10% as it rotated to ×.
 *    That scale change altered the button's painted size and nudged the question
 *    text next to it, causing a visible horizontal "pop." The icon now only
 *    rotates (rotate-45) with no scale change — visually clear, physically stable.
 *
 * 4. REMOVED: -translate-y-1 / translate-y-0 on the answer <p>.
 *    The answer text had a CSS translate applied (-4px when closed, 0 when open)
 *    intended as a subtle entrance effect. In practice it caused a micro-bounce
 *    during the grid-rows expansion: the text started 4px above its final position
 *    and snapped into place, creating a jitter visible on slower devices. Removed
 *    entirely — the grid-rows height animation alone gives a clean reveal.
 *
 * 5. SCOPED: transition-[transform,background-color,color] on the icon.
 *    Previously transition-all, which animated every property including layout-
 *    affecting ones. Now only the properties that genuinely change are transitioned.
 *
 * 6. SCOPED: transition-[grid-template-rows,opacity] on the answer drawer.
 *    The drawer expands via grid-template-rows (0fr → 1fr) and fades via opacity.
 *    Those are the only two properties that change, so transition-all was narrowed
 *    to just these two. This prevents any accidental layout recalculations from
 *    being caught by a broader transition.
 *
 * Each instance manages its own open index (useState<number | null>) so multiple
 * FaqAccordion components on the same page (e.g. one per category on /faq) are
 * fully independent and do not interfere with each other.
 */
export function FaqAccordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="space-y-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li
            key={it.q}
            /*
             * transition-[box-shadow,background-color,border-color] — intentionally
             * narrow. We only animate the three visual properties that change on
             * hover/open. transform is excluded to prevent card-lift side effects.
             */
            className={`group rounded-3xl bg-white px-5 py-4 shadow-sm transition-[box-shadow,background-color,border-color] duration-200 hover:bg-black/[0.015] md:px-6 md:py-5 ${
              isOpen
                ? "shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
                : "border border-black/[0.07]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="font-display text-[15px] font-semibold text-black md:text-[16px]">
                {it.q}
              </span>
              <span
                /*
                 * rotate-45 only — no scale-110. Scale was removed because growing
                 * the icon pushed surrounding text sideways on click, causing a
                 * visible positional jump in the question row.
                 */
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-200 ${
                  isOpen
                    ? "rotate-45 bg-black text-white"
                    : "bg-black/10 text-black group-hover:bg-black/20"
                }`}
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </button>
            <div
              /*
               * Height animation via grid-template-rows (0fr → 1fr) is the most
               * performant collapse technique: it avoids height:auto transitions
               * (which require JS measurement) and doesn't trigger layout reflow
               * in surrounding list items. overflow-hidden on the child <p> clips
               * content cleanly at grid-rows-[0fr] without needing clip-path.
               * transition-[grid-template-rows,opacity] is scoped to exactly the
               * two properties that change — nothing else is animated.
               */
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                isOpen
                  ? "mt-3 grid-rows-[1fr] opacity-100"
                  : "mt-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              {/*
               * overflow-hidden is required on this <p> so that at grid-rows-[0fr]
               * the text is invisible (clipped to zero height) rather than leaking
               * outside the collapsed grid row. No transform applied — the old
               * -translate-y-1 entrance effect was removed because it caused a
               * vertical micro-bounce during the expand animation.
               */}
              <p className="overflow-hidden font-display text-[14px] leading-[1.55] text-black/60 md:text-[15px]">
                {it.a}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ----------------------------- Homepage widget ---------------------------- */

/**
 * Landing-page FAQ section. Shows `limit` items (default 3) with a link
 * to the full /faq help-center page.
 */
export function Faq({
  items = faqItems,
  limit = 3,
  helpCenterPath = "/faq",
}: {
  items?: QA[];
  limit?: number;
  helpCenterPath?: string;
} = {}) {
  const displayed = items.slice(0, limit);

  return (
    <section id="faq" className="mx-auto w-full max-w-[760px] scroll-mt-28 px-4 pt-4 pb-10 sm:px-6 md:pt-6 md:pb-14">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/55">
          FAQ
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
          Everything you need to know
        </h2>
      </div>

      {/* Accordion */}
      <FaqAccordion items={displayed} />

      {/* Help center link */}
      <div className="mt-6 text-center">
        <Link
          to={helpCenterPath as any}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-black/60 transition-colors duration-200 hover:text-black"
        >
          See all help articles in our Help Center
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
