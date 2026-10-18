import { Briefcase, Laptop2, Palette } from "lucide-react";
import { useLang } from "@/lib/use-lang";

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
      "GST/HST is read from each receipt you scan, so you can see what you may be able to claim back before you even talk to your accountant.",
    icon: Laptop2,
  },
  {
    role: "Freelance Consultant",
    description:
      "Vehicle expenses, equipment, client meals — all sorted in one place, so tax season isn't a scramble.",
    icon: Briefcase,
  },
];

const FR_PERSONAS: Persona[] = [
  {
    role: "Graphiste pigiste",
    description:
      "Photographiez vos reçus de logiciels, de rencontres avec des clients et d'équipement dès l'achat — plus besoin de fouiller votre boîte de réception à la période des impôts.",
    icon: Palette,
  },
  {
    role: "Contractuel indépendant en TI",
    description:
      "La TPS/TVH est lue sur chaque reçu que vous numérisez : vous voyez ce que vous pourriez récupérer avant même de parler à votre comptable.",
    icon: Laptop2,
  },
  {
    role: "Consultant autonome",
    description:
      "Frais de véhicule, équipement, repas avec des clients — tout est classé au même endroit, pour une période des impôts sans course contre la montre.",
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
      "Gear, mileage, client meals — all sorted in one place, so filing your Schedule C isn't a scramble.",
    icon: Briefcase,
  },
];

export function Testimonials({ region = "ca" }: { region?: "ca" | "us" }) {
  const fr = useLang() === "fr" && region === "ca";
  const personas = region === "us" ? US_PERSONAS : fr ? FR_PERSONAS : CA_PERSONAS;
  const heading =
    region === "us"
      ? "Made for US freelancers"
      : fr
        ? "Conçu pour les travailleurs autonomes du Canada"
        : "Built for Canadian freelancers";
  return (
    <section className="w-full px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-12 text-center">
          <p className="eyebrow">{fr ? "Pour qui" : "Who it's for"}</p>
          <h2 className="mt-2 text-ink">{heading}</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {personas.map((p) => (
            <figure
              key={p.role}
              className="flex flex-col gap-4 rounded-card border border-hairline bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:p-8"
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-ink text-paper"
                aria-hidden
              >
                <p.icon className="size-5" />
              </div>
              <figcaption>
                <p className="font-display text-body font-semibold text-ink">{p.role}</p>
                <p className="mt-2 font-sans text-body text-ink-80">{p.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
