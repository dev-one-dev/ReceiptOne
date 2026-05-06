import {
  Briefcase,
  Hammer,
  UserRoundCog,
  Car,
  Store,
  Camera,
} from "lucide-react";

type Region = "ca" | "us";

const personasCA = [
  { icon: Briefcase, label: "Freelancers" },
  { icon: Hammer, label: "Contractors & trades" },
  { icon: UserRoundCog, label: "Self-employed consultants" },
  { icon: Car, label: "Drivers & mobile workers" },
  { icon: Store, label: "Small business owners" },
  { icon: Camera, label: "Creators & service pros" },
];

const personasUS = [
  { icon: Briefcase, label: "Freelancers" },
  { icon: Hammer, label: "1099 contractors" },
  { icon: UserRoundCog, label: "Self-employed consultants" },
  { icon: Car, label: "Drivers & gig workers" },
  { icon: Store, label: "Small business owners" },
  { icon: Camera, label: "Creators & service pros" },
];

export function WhoItsFor({ region = "ca" }: { region?: Region }) {
  const personas = region === "us" ? personasUS : personasCA;
  return (
    <section
      id="who-its-for"
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-black/50">
            Who it's for
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-5xl">
            Made for the people who run the work
          </h2>
          <p className="mt-4 text-base leading-relaxed text-black/65 sm:text-lg">
            ReceiptOne fits the way independent professionals and small teams
            actually work — on the move, between clients, and rarely behind a
            desk.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {personas.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-black/[0.08] bg-white/70 p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)] sm:p-6"
            >
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-black/[0.04] text-black">
                <Icon className="size-5" aria-hidden />
              </div>
              <span className="font-display text-sm font-semibold leading-snug text-black sm:text-[15px]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}