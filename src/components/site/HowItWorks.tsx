import { ScanLine, Sparkles, FileDown } from "lucide-react";

type Region = "ca" | "us";

const steps = [
  {
    icon: ScanLine,
    title: "Scan or upload receipts",
    description:
      "Snap a photo, forward an email, or bulk-upload PDFs. Paper, digital, and email receipts all land in one place.",
  },
  {
    icon: Sparkles,
    title: "We extract and categorize",
    description:
      "ReceiptOne reads merchant, date, total, and tax automatically, then sorts each expense into the right category.",
  },
  {
    icon: FileDown,
    title: "Export tax-ready reports",
    description:
      "Generate accountant-ready PDF and CSV reports for your records, your bookkeeper, or tax time — anytime.",
  },
];

export function HowItWorks({ region = "ca" }: { region?: Region }) {
  const taxNote =
    region === "us"
      ? "Built around US recordkeeping needs — sales tax, 1099 contractors, and Schedule C-friendly categories."
      : "Built around Canadian recordkeeping needs — GST/HST tracking and CRA-friendly categories.";

  return (
    <section
      id="how-it-works"
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-black/50">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-5xl">
            From paper pile to tax-ready in three steps
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/65 sm:text-lg">
            {taxNote}
          </p>
        </div>

        <ol className="mt-12 grid gap-5 sm:gap-6 md:grid-cols-3 lg:mt-16">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="group relative flex flex-col rounded-3xl border border-black/[0.08] bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.18)] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-black text-white">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <span
                    className="font-display text-5xl font-semibold leading-none text-black/[0.06] sm:text-6xl"
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold leading-snug text-black sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-black/65 sm:text-base">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}