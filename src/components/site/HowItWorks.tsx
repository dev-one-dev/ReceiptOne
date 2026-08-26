import { ScanLine, Layers, FileDown } from "lucide-react";

type Region = "ca" | "us";

const CA_STEPS = [
  {
    icon: ScanLine,
    title: "Snap your receipts",
    description:
      "Photograph any receipt, forward an email receipt, or upload a PDF. Paper, digital, and email receipts all captured automatically.",
  },
  {
    icon: Layers,
    title: "Organized automatically",
    description:
      "ReceiptOne reads merchant, amount, date, and tax — then categorizes every expense. GST, HST, and PST tracked per province. Zero manual entry.",
  },
  {
    icon: FileDown,
    title: "Export CRA-ready reports",
    description:
      "Download audit-ready expense reports in one tap. Hand them to your accountant or file your own taxes — stress-free tax season, every year.",
  },
];

const US_STEPS = [
  {
    icon: ScanLine,
    title: "Snap your receipts",
    description:
      "Photograph any receipt, forward an email receipt, or upload a PDF. Paper, digital, and email receipts all captured automatically.",
  },
  {
    icon: Layers,
    title: "Organized automatically",
    description:
      "ReceiptOne reads merchant, amount, date, and sales tax — then categorizes every expense into Schedule C-friendly categories. Zero manual entry.",
  },
  {
    icon: FileDown,
    title: "Export tax-ready reports",
    description:
      "Download audit-ready expense reports in one tap. Hand them to your accountant or file your own taxes — stress-free tax season, every year.",
  },
];

export function HowItWorks({ region = "ca" }: { region?: Region }) {
  const steps = region === "us" ? US_STEPS : CA_STEPS;
  const heading =
    region === "us" ? "Three steps to tax-ready reports" : "Three steps to tax peace of mind";
  const sub =
    region === "us"
      ? "Point your camera, forward that email, upload that PDF. ReceiptOne reads, sorts, and reports — no manual entry, no spreadsheets, no tax-season scramble."
      : "Point your camera, forward that email, upload that PDF. ReceiptOne reads, sorts, and reports — no manual entry, no spreadsheets, no year-end scramble.";

  return (
    <section
      id="how-it-works"
      className="w-full bg-white px-4 pt-8 pb-8 sm:px-6 sm:pt-10 sm:pb-10 lg:px-8 lg:pt-12 lg:pb-12"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-ink">{heading}</h2>
          <p className="mt-3 text-body text-ink-60 sm:text-lead">{sub}</p>
        </div>

        <ol className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-3 lg:mt-12">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="group relative flex flex-col rounded-card border border-hairline bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-hairline hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.18)] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex size-12 items-center justify-center rounded-card bg-ink text-white">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <span
                    className="font-mono text-5xl font-normal leading-none tracking-mono text-ink-05 sm:text-6xl"
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lead tracking-body text-ink">{step.title}</h3>
                <p className="mt-3 text-body text-ink-60 sm:text-body">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
