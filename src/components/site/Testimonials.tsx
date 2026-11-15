import { Briefcase, Car, Hammer } from "lucide-react";
import { useLang } from "@/lib/use-lang";

type Persona = {
  role: string;
  description: string;
  icon: typeof Briefcase;
};

const CA_PERSONAS: Persona[] = [
  {
    role: "Freelancers and independent contractors",
    description:
      "Photograph the receipt for software, equipment or a client lunch when you pay, or forward the e-mail receipt. GST/HST is read from each receipt, and your expense report exports to PDF and CSV for your accountant.",
    icon: Briefcase,
  },
  {
    role: "Rideshare and delivery drivers",
    description:
      "Turn on trip tracking and the app logs your work kilometres by GPS in the background. Snap gas and maintenance receipts as you go, and your T2125 report fills in the kilometres for Chart A.",
    icon: Car,
  },
  {
    role: "Sole proprietors and tradespeople",
    description:
      "Snap receipts for materials and supplies at the counter, or upload the PDF invoice from your supplier. Scan on your phone, then sort and export everything from your computer.",
    icon: Hammer,
  },
];

const FR_PERSONAS: Persona[] = [
  {
    role: "Pigistes et travailleurs autonomes",
    description:
      "Photographiez le reçu d'un logiciel, d'un équipement ou d'un dîner avec un client au moment de payer, ou transférez le reçu envoyé par courriel. La TPS/TVH est lue sur chaque reçu, et votre rapport de dépenses s'exporte en PDF et en CSV pour votre comptable.",
    icon: Briefcase,
  },
  {
    role: "Chauffeurs VTC et livreurs",
    description:
      "Activez le suivi des trajets et l'application enregistre vos kilomètres professionnels par GPS en arrière-plan. Photographiez vos reçus d'essence et d'entretien au fur et à mesure, et votre rapport T2125 remplit les kilomètres du Tableau A.",
    icon: Car,
  },
  {
    role: "Entrepreneurs et gens de métier",
    description:
      "Photographiez vos reçus de matériaux et de fournitures au comptoir, ou téléversez la facture PDF de votre fournisseur. Numérisez sur votre téléphone, puis classez et exportez tout depuis votre ordinateur.",
    icon: Hammer,
  },
];

const US_PERSONAS: Persona[] = [
  {
    role: "Freelancers and 1099 contractors",
    description:
      "Photograph the receipt for software, equipment or a client lunch when you pay, or forward the e-mail receipt. Sales tax is read from each receipt, and your expense report exports to PDF and CSV for your CPA.",
    icon: Briefcase,
  },
  {
    role: "Rideshare and delivery drivers",
    description:
      "Turn on trip tracking and the app logs your work miles by GPS in the background. Tag each trip business or personal, and snap gas and maintenance receipts as you go.",
    icon: Car,
  },
  {
    role: "Sole proprietors and tradespeople",
    description:
      "Snap receipts for materials and supplies at the counter, or upload the PDF invoice from your supplier. Scan on your phone, then sort and export everything from your computer.",
    icon: Hammer,
  },
];

export function Testimonials({ region = "ca" }: { region?: "ca" | "us" }) {
  const fr = useLang() === "fr" && region === "ca";
  const personas = region === "us" ? US_PERSONAS : fr ? FR_PERSONAS : CA_PERSONAS;
  const heading =
    region === "us"
      ? "Made for self-employed Americans"
      : fr
        ? "Conçu pour les travailleurs autonomes du Canada"
        : "Built for self-employed Canadians";
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
