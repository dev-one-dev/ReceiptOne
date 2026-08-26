import { Briefcase, Laptop2, Palette } from "lucide-react";

type Persona = {
  role: string;
  description: string;
  icon: typeof Palette;
};

const CA_PERSONAS: Persona[] = [
  {
    role: "Freelance Graphic Designer",
    description:
      "Snap receipts for software, client meetings, and gear the moment you buy them — no digging through your inbox come tax season.",
    icon: Palette,
  },
  {
    role: "Independent IT Contractor",
    description:
      "GST/HST on every purchase is tracked automatically, so you know exactly what you can claim back before you even talk to your accountant.",
    icon: Laptop2,
  },
  {
    role: "Freelance Consultant",
    description:
      "Vehicle expenses, equipment, client meals — all sorted in one place, so tax season isn't a scramble.",
    icon: Briefcase,
  },
];

const US_PERSONAS: Persona[] = [
  {
    role: "Freelance Graphic Designer",
    description:
      "Snap receipts as they happen so your CPA gets a clean export at tax time — no more scrambling every April.",
    icon: Palette,
  },
  {
    role: "Independent IT Contractor",
    description:
      "Deductions get organized automatically, ready before you even sit down with your accountant.",
    icon: Laptop2,
  },
  {
    role: "Freelance Consultant",
    description:
      "Gear, mileage, client meals — all sorted, so filing your Schedule C takes an hour, not a weekend.",
    icon: Briefcase,
  },
];

export function Testimonials({ region = "ca" }: { region?: "ca" | "us" }) {
  const personas = region === "us" ? US_PERSONAS : CA_PERSONAS;
  const heading = region === "us" ? "Made for US freelancers" : "Built for Canadian freelancers";
  return (
    <section className="w-full px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-12 text-center">
          <p className="eyebrow">Who it's for</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            {heading}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {personas.map((p) => (
            <figure
              key={p.role}
              className="flex flex-col gap-4 rounded-3xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:p-8"
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white"
                aria-hidden
              >
                <p.icon className="size-5" />
              </div>
              <figcaption>
                <p className="font-display text-base font-semibold text-black">{p.role}</p>
                <p className="mt-2 font-sans text-[15px] leading-relaxed text-black/70">
                  {p.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
