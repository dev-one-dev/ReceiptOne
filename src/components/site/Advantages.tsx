import {
  Clock,
  Car,
  FileText,
  FolderOpen,
  Smartphone,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";

type Advantage = {
  Icon: LucideIcon;
  title: string;
  body: string;
};

const items: Advantage[] = [
  {
    Icon: Clock,
    title: "Save 10+ Hours Every Month",
    body: "ReceiptOne automatically scans receipts and categorizes expenses — no manual entry.",
  },
  {
    Icon: Car,
    title: "Never Miss Mileage Deductions",
    body: "Log trips in seconds, and we total everything by period so you don't forget the deductions that save you money",
  },
  {
    Icon: FileText,
    title: "Accountant-Ready Reports in 1 Click",
    body: "Clean PDF/CSV exports by date and category — ready to send with zero back-and-forth",
  },
  {
    Icon: FolderOpen,
    title: "Documentation Ready When Requested",
    body: "Receipts, mileage, and calculations are neatly stored and easy to find — for stress-free reviews and audits",
  },
  {
    Icon: Smartphone,
    title: "Mobile + Web, Always in Sync",
    body: "Scan on the go in the app and manage reports in the web dashboard — your data is always with you",
  },
];

export function Advantages() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Pill label */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 font-display text-[13px] font-semibold text-white">
          <ThumbsUp className="h-4 w-4" strokeWidth={2.25} />
          PRONS
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-5 text-center font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-black md:text-[56px]">
        What is our advantages
      </h2>

      {/* Subtitle */}
      <p className="mx-auto mt-4 max-w-[640px] text-center font-display text-[15px] leading-[1.55] text-[#7e8890] md:text-[16px]">
        Stop losing money on missed deductions. Our AI finds every dollar
        you're entitled to — automatically, accurately, instantly.
      </p>

      {/* 5 cards: 3 + 2 layout, centered */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:nth-child(4)]:lg:col-start-1 lg:[&>*:nth-child(4)]:lg:col-end-2">
        {items.map(({ Icon, title, body }, idx) => (
          <article
            key={title}
            className={`flex flex-col rounded-[28px] bg-[#f1f0ec] p-7 ${
              idx === 3 ? "lg:col-start-1" : ""
            } ${idx === 4 ? "lg:col-start-2" : ""}`}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Icon className="h-5 w-5 text-black" strokeWidth={2} />
            </span>
            <h3 className="mt-6 font-display text-[18px] font-bold leading-[1.2] tracking-[-0.01em] text-black">
              {title}
            </h3>
            <p className="mt-3 font-display text-[14px] leading-[1.55] text-[#7e8890]">
              {body}
            </p>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 flex justify-center">
        <button
          type="button"
          className="rounded-full bg-black px-8 py-4 font-display text-[15px] font-semibold text-white transition hover:bg-black/85"
        >
          Claim your free trial
        </button>
      </div>
    </section>
  );
}
