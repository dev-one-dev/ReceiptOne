import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section
      id="final-cta"
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[28px] bg-black px-6 py-14 text-center sm:rounded-[36px] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 0%, rgba(255,255,255,0.18), transparent 70%), radial-gradient(40% 60% at 100% 100%, rgba(255,255,255,0.08), transparent 60%)",
          }}
        />
        <div className="relative">
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready for cleaner receipts and easier tax time?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            Start your 7-day free trial and keep receipts, mileage, and expense
            reports organized in one place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-display text-base font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
            >
              Start 7-day free trial
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/25 px-7 py-3.5 font-display text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Log in
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/55">
            Cancel anytime · Export anytime · 7-day free trial
          </p>
        </div>
      </div>
    </section>
  );
}