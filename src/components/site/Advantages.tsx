function scrollToApps(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Advantages() {
  return (
    <section id="advantages" className="w-full scroll-mt-28 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/35">
            Benefits
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            Maximized deductions, zero effort
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-black/55 sm:text-lg">
            Stop leaving money on the table. ReceiptOne identifies every deductible cent and categorizes it according to CRA rules, so you claim the biggest refund possible.
          </p>
          <a
            href="#pricing"
            onClick={scrollToApps}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 font-display text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] hover:opacity-90"
          >
            Claim your free trial
          </a>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-4">

          {/* Row 1 — large + small */}
          <BentoCard className="col-span-12 md:col-span-8">
            <CardLabel>Save time</CardLabel>
            <CardTitle>Save 10+ hours every month</CardTitle>
            <CardDesc>Capture expenses in seconds, any time. ReceiptOne sorts every purchase, tracks GST/HST by province, and keeps your books current — without touching a spreadsheet.</CardDesc>
            <AccentPanel bg="bg-black" textColor="text-white">
              <Stat value="10h+" label="saved monthly" light />
            </AccentPanel>
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-4">
            <CardLabel>Mileage</CardLabel>
            <CardTitle>Never miss a mileage deduction</CardTitle>
            <CardDesc>Every trip logged and the CRA per-kilometre rate applied automatically.</CardDesc>
            <AccentPanel bg="bg-[#fed7aa]" textColor="text-black">
              <Stat value="73¢" label="/ km, tracked" />
            </AccentPanel>
          </BentoCard>

          {/* Row 2 — small + large */}
          <BentoCard className="col-span-12 md:col-span-4">
            <CardLabel>Export</CardLabel>
            <CardTitle>Accountant-ready from day one</CardTitle>
            <CardDesc>PDF and CSV reports formatted exactly how accountants want them. No back-and-forth.</CardDesc>
            <AccentPanel bg="bg-[#f97316]" textColor="text-white">
              <Stat value="1-tap" label="export" light />
            </AccentPanel>
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-8">
            <CardLabel>CRA compliant</CardLabel>
            <CardTitle>CRA-ready documentation, always</CardTitle>
            <CardDesc>Every receipt timestamped and organized the moment you snap it. If the CRA ever asks, you're ready.</CardDesc>
            <AccentPanel bg="bg-black" textColor="text-white">
              <Stat value="10yr" label="secure cloud storage" light />
            </AccentPanel>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}

function BentoCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`group relative min-h-[280px] overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-[0.98] hover:-rotate-[0.5deg] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function AccentPanel({ bg, textColor, children }: { bg: string; textColor: string; children: React.ReactNode }) {
  return (
    <div className={`absolute bottom-0 left-4 right-4 top-[55%] translate-y-6 rounded-t-2xl p-5 transition-transform duration-[250ms] group-hover:translate-y-2 group-hover:rotate-[1.5deg] sm:left-6 sm:right-6 ${bg} ${textColor}`}>
      {children}
    </div>
  );
}

function Stat({ value, label, light }: { value: string; label: string; light?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className={`font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl ${light ? "text-white" : "text-black"}`}>
        {value}
      </span>
      <span className={`mt-1 font-sans text-sm ${light ? "text-white/60" : "text-black/55"}`}>
        {label}
      </span>
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/35">
      {children}
    </p>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-black sm:text-2xl">
      {children}
    </h3>
  );
}

function CardDesc({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 font-sans text-sm leading-relaxed text-black/55">
      {children}
    </p>
  );
}
