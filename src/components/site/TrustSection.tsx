import { ShieldCheck, CloudUpload, KeyRound, FileText } from "lucide-react";

type Region = "ca" | "us";

const points = [
  {
    icon: ShieldCheck,
    title: "Built for recordkeeping",
    description:
      "Keep clean, organized records of receipts, expenses, and mileage in one secure place.",
  },
  {
    icon: CloudUpload,
    title: "Secure cloud storage",
    description:
      "Your data is encrypted in transit and stored in the cloud, available across mobile and web.",
  },
  {
    icon: KeyRound,
    title: "You control your data",
    description:
      "Export anytime to PDF or CSV. Cancel anytime. No long-term lock-in.",
  },
  {
    icon: FileText,
    title: "Not a tax filing service",
    description:
      "ReceiptOne is a recordkeeping and reporting tool — not a tax preparer or advisor.",
  },
];

export function TrustSection({ region = "ca" }: { region?: Region }) {
  const disclaimer =
    region === "us"
      ? "ReceiptOne helps organize records and generate reports for personal and small-business use in the United States. It does not provide tax, accounting, legal, or financial advice. For tax filing decisions, consult a qualified professional."
      : "ReceiptOne helps organize records and generate reports for personal and small-business use in Canada. It does not provide tax, accounting, legal, or financial advice. For CRA filings or tax decisions, consult a qualified professional.";

  return (
    <section
      id="trust"
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-black/50">
            Trust & transparency
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-5xl">
            Your records, kept honest and in your hands
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-4">
          {points.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col rounded-3xl border border-black/[0.08] bg-white/70 p-6 transition-all duration-200 hover:border-black/15 hover:shadow-[0_16px_36px_-20px_rgba(0,0,0,0.2)]"
            >
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-black/[0.04] text-black">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-black">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-black/65">
                {description}
              </p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl rounded-2xl border border-black/[0.06] bg-black/[0.03] px-5 py-4 text-center text-xs leading-relaxed text-black/60 sm:text-sm">
          {disclaimer}
        </p>
      </div>
    </section>
  );
}