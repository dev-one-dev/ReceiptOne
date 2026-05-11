function scrollToApps(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("apps")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const CARDS = [
  {
    label: "Save time",
    title: "Save 10+ hours every month",
    desc: "Capture expenses in seconds, any time. ReceiptOne sorts every purchase, tracks GST/HST by province, and keeps your books current — without touching a spreadsheet.",
    accentBg: "bg-black",
    stat: "10h+",
    statLabel: "saved monthly",
    light: true,
    gridClass: "lg:col-span-2",
  },
  {
    label: "Mileage",
    title: "Never miss a mileage deduction",
    desc: "Every trip logged and the CRA per-kilometre rate applied automatically. Your logbook builds itself.",
    accentBg: "bg-[#fed7aa]",
    stat: "73¢",
    statLabel: "/ km, tracked",
    light: false,
    gridClass: "lg:col-span-2",
  },
  {
    label: "Export",
    title: "Accountant-ready from day one",
    desc: "PDF and CSV reports formatted exactly how accountants want them. No back-and-forth, no reformatting.",
    accentBg: "bg-[#f97316]",
    stat: "1-tap",
    statLabel: "export",
    light: true,
    gridClass: "lg:col-span-2",
  },
  {
    label: "CRA compliant",
    title: "CRA-ready documentation, always",
    desc: "Every receipt timestamped and organized the moment you snap it. If the CRA ever asks, you're ready.",
    accentBg: "bg-black",
    stat: "10yr",
    statLabel: "secure cloud storage",
    light: true,
    gridClass: "lg:col-span-2 lg:col-start-2",
  },
  {
    label: "Scanning",
    title: "Any receipt captured in seconds",
    desc: "Camera, email forward, or PDF upload — ReceiptOne reads merchant, amount, date, and GST number automatically. No manual entry ever.",
    accentBg: "bg-[#fed7aa]",
    stat: "3s",
    statLabel: "avg. capture time",
    light: false,
    gridClass: "sm:col-span-2 lg:col-span-2 lg:col-start-4",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="w-full scroll-mt-28 px-4 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-10 lg:px-8">
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
            href="#apps"
            onClick={scrollToApps}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-6 py-3 font-display text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] hover:opacity-90"
          >
            Claim your free trial
          </a>
        </div>

        {/* 5-card grid — row 1: 3 cards, row 2: 2 cards centered */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {CARDS.map((card) => (
            <div
              key={card.label}
              className={`group relative min-h-[280px] overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-[0.98] hover:-rotate-[0.5deg] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] sm:p-8 ${card.gridClass}`}
            >
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-black/35">
                {card.label}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-black sm:text-2xl">
                {card.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-black/55">
                {card.desc}
              </p>
              <div
                className={`absolute bottom-0 left-4 right-4 top-[55%] translate-y-6 rounded-t-2xl p-5 transition-transform duration-[250ms] group-hover:translate-y-2 group-hover:rotate-[1.5deg] sm:left-6 sm:right-6 ${card.accentBg} ${card.light ? "text-white" : "text-black"}`}
              >
                <div className="flex flex-col">
                  <span className="font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                    {card.stat}
                  </span>
                  <span className={`mt-1 font-sans text-sm ${card.light ? "text-white/60" : "text-black/55"}`}>
                    {card.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
