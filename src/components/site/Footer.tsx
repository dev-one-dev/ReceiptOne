import phoneProfile from "@/assets/figma/phone-profile.webp";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* CTA */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="flex justify-center">
          <img
            src={phoneProfile}
            alt="ReceiptOne app preview"
            loading="lazy"
            draggable={false}
            className="h-auto w-[220px] select-none object-contain md:w-[260px]"
          />
        </div>

        <h2 className="mt-8 text-center font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-white md:text-[56px]">
          Claim your free trial now
        </h2>
        <p className="mx-auto mt-3 max-w-[520px] text-center font-display text-[15px] text-white/60 md:text-[17px]">
          AI-powered magic that finds every deduction you’re missing
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="rounded-full border border-white/30 bg-transparent px-6 py-3 font-display text-[14px] font-semibold text-white transition hover:bg-white/10"
          >
            Log in
          </button>
          <button
            type="button"
            className="rounded-full bg-white px-6 py-3 font-display text-[14px] font-semibold text-black transition hover:bg-white/90"
          >
            Join now
          </button>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white font-display text-[18px] font-bold text-black">
              R
            </span>
            <span className="font-display text-[18px] font-semibold tracking-tight text-white">
              ReceiptOne
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8 font-display text-[14px] text-white/70">
            <a href="#" className="transition hover:text-white">
              Terms of Use
            </a>
            <a href="#" className="transition hover:text-white">
              Privacy Policy
            </a>
          </nav>

          {/* Locale */}
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-display text-[13px] font-semibold text-white">
            <span aria-hidden>🇺🇸</span>
            <span>EN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
