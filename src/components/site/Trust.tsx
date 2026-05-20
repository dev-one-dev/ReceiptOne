import React from "react";

type Region = "ca" | "us";

interface TrustItem {
  Icon: () => React.ReactElement;
  title: string;
  desc: string;
}

const CA_ITEMS: TrustItem[] = [
  {
    Icon: LockIcon,
    title: "Bank-grade encryption",
    desc: "All receipts and financial data encrypted at rest and in transit with AES-256. Your data is yours alone.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "CRA-compliant reports",
    desc: "Expense reports formatted to meet CRA requirements. Ready for personal tax, HST returns, or a CRA audit.",
  },
  {
    Icon: CloudIcon,
    title: "Automatic cloud backup",
    desc: "Every receipt backed up the moment you snap it. Access your full history from any device, anytime.",
  },
  {
    Icon: EyeOffIcon,
    title: "Privacy-first design",
    desc: "Your financial data is never sold, shared, or used for advertising. Full stop.",
  },
  {
    Icon: FileCheckIcon,
    title: "Audit-ready documentation",
    desc: "All supporting documents organized and timestamped. Survive any CRA audit with confidence.",
  },
  {
    Icon: ReceiptTaxIcon,
    title: "GST / HST / PST tracking",
    desc: "Input tax credits tracked automatically by province. Every eligible deduction captured — nothing slips through.",
  },
];

const US_ITEMS: TrustItem[] = [
  {
    Icon: LockIcon,
    title: "Bank-grade encryption",
    desc: "All receipts and financial data encrypted at rest and in transit with AES-256. Your data is yours alone.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "IRS-ready reports",
    desc: "Expense reports formatted for Schedule C, 1099 contractors, and business deductions.",
  },
  {
    Icon: CloudIcon,
    title: "Automatic cloud backup",
    desc: "Every receipt backed up the moment you snap it. Access your full history from any device, anytime.",
  },
  {
    Icon: EyeOffIcon,
    title: "Privacy-first design",
    desc: "Your financial data is never sold, shared, or used for advertising. Full stop.",
  },
  {
    Icon: FileCheckIcon,
    title: "Audit-ready documentation",
    desc: "All supporting documents organized and timestamped. Survive any IRS audit with confidence.",
  },
  {
    Icon: ReceiptTaxIcon,
    title: "Sales tax tracking",
    desc: "State and local sales tax tracked per transaction. Maximize deductions without lifting a finger.",
  },
];

export function Trust({ region = "ca" }: { region?: Region }) {
  const items = region === "us" ? US_ITEMS : CA_ITEMS;
  const heading =
    region === "us"
      ? "Built for US tax compliance"
      : "Built for Canadian tax compliance";

  return (
    <section className="w-full bg-[#0d0d14] px-4 pt-12 pb-6 sm:px-6 sm:pt-16 sm:pb-8 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-white/30">
            Security &amp; compliance
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
            AES-256 encryption, CRA-compliant records, and 10-year cloud backup — built to protect your data and your deductions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-6 transition-colors hover:bg-white/[0.07]"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/[0.08] text-white/70">
                <item.Icon />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M10.73 10.73A2 2 0 0 0 14 12" />
    </svg>
  );
}

function FileCheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

function ReceiptTaxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
      <path d="M8 10h8M8 14h4" />
    </svg>
  );
}
