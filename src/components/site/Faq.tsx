import { MessageCircle, Plus } from "lucide-react";
import { useState } from "react";

type QA = { q: string; a: string };

const items: QA[] = [
  {
    q: "How does receipt scanning work?",
    a: "Snap a photo or upload a file — our AI extracts the merchant, date, total and tax amounts automatically and files the receipt for you.",
  },
  {
    q: "Does ReceiptOne calculate my tax refund?",
    a: "No. ReceiptOne does not calculate or guarantee tax refunds. We display taxes found on your receipts to help with reporting.",
  },
  {
    q: "What does “Estimated refundable taxes” mean?",
    a: "It’s the sum of GST/HST and other refundable taxes detected on your receipts — a quick reference, not an official refund amount.",
  },
  {
    q: "Why is PST marked as non-refundable?",
    a: "Provincial sales tax (PST) in most provinces is generally not recoverable for businesses, so we surface it separately from refundable taxes.",
  },
  {
    q: "What if my receipt has no tax?",
    a: "No problem — the receipt is still stored and categorized. Tax fields simply remain empty in your reports.",
  },
  {
    q: "Can I export reports?",
    a: "Yes. Export tax-ready reports as PDF or CSV at any time — perfect for your accountant or tax software.",
  },
  {
    q: "What does “Reimbursable” mean?",
    a: "Mark expenses as reimbursable when a client or employer should pay you back. Filter and export them as a single report.",
  },
  {
    q: "What’s included in Pro?",
    a: "All features: real-time sync, AI extraction, mileage tracking, bulk upload, 10+ years storage, PDF & CSV exports, and email forwarding.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from the app in one tap — no questions asked, no hidden fees.",
  },
  {
    q: "Is ReceiptOne a tax filing service?",
    a: "No. ReceiptOne organizes your receipts and expenses so filing is easier — but we don’t file taxes on your behalf.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <section id="faq" className="mx-auto w-full max-w-[760px] scroll-mt-28 px-6 pt-4 pb-16 md:pt-8 md:pb-20">
      {/* Pill */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 font-display text-[12px] font-semibold text-white">
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
          FAQ
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-5 text-center font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-black md:text-[56px]">
        Questions you’ll likely ask
      </h2>

      {/* List */}
      <ul className="mt-10 space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <li
              key={it.q}
              className={`group rounded-[20px] bg-white px-5 py-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.12)] md:px-6 md:py-5 ${
                isOpen ? "shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18)] ring-1 ring-black/5" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-display text-[15px] font-semibold text-black transition-colors duration-200 md:text-[16px]">
                  {it.q}
                </span>
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out ${
                    isOpen
                      ? "rotate-45 scale-110 bg-black text-white"
                      : "bg-black/10 text-black group-hover:bg-black/20"
                  }`}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen
                    ? "mt-3 grid-rows-[1fr] opacity-100"
                    : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
              >
                <p
                  className={`overflow-hidden font-display text-[14px] leading-[1.55] text-[#7e8890] md:text-[15px] ${
                    isOpen ? "translate-y-0" : "-translate-y-1"
                  } transition-transform duration-300 ease-out`}
                >
                  {it.a}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
