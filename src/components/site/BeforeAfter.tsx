import { Check, X } from "lucide-react";
import { useLang } from "@/lib/use-lang";

type Region = "ca" | "us";

type Copy = {
  heading: string;
  without: string;
  with: string;
  before: string[];
  after: string[];
};

const EN_AFTER = [
  "Snap the receipt at the counter",
  "A clear copy that never fades",
  "Work trips logged by GPS",
  "One export when it's time to file",
];

const CA: Copy = {
  heading: "Tax season shouldn't start in April.",
  without: "Without ReceiptOne",
  with: "With ReceiptOne",
  before: [
    "A shoebox of crumpled receipts",
    "Gas receipts faded to blank",
    "Kilometres guessed from memory",
    "A weekend sorting it all for your accountant",
  ],
  after: EN_AFTER,
};

const US: Copy = {
  ...CA,
  before: [
    "A shoebox of crumpled receipts",
    "Gas receipts faded to blank",
    "Miles guessed from memory",
    "A weekend sorting it all for your accountant",
  ],
};

const FR: Copy = {
  heading: "La saison des impôts ne devrait pas commencer en avril.",
  without: "Sans ReceiptOne",
  with: "Avec ReceiptOne",
  before: [
    "Une boîte à chaussures pleine de reçus froissés",
    "Des reçus d'essence devenus illisibles",
    "Des kilomètres estimés de mémoire",
    "Une fin de semaine à tout trier pour votre comptable",
  ],
  after: [
    "Photographiez le reçu à la caisse",
    "Une copie nette qui ne s'efface jamais",
    "Des trajets d'affaires enregistrés par GPS",
    "Un seul export au moment de produire votre déclaration",
  ],
};

/** Before/after contrast, directly after HowItWorks on /ca, /fr and /us. */
export function BeforeAfter({ region = "ca" }: { region?: Region }) {
  const fr = useLang() === "fr" && region === "ca";
  const t = region === "us" ? US : fr ? FR : CA;

  return (
    <section
      id="before-after"
      aria-labelledby="before-after-heading"
      className="w-full px-4 pt-12 pb-4 sm:px-6 sm:pt-16 sm:pb-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 id="before-after-heading" className="mx-auto max-w-2xl text-center text-ink">
          {t.heading}
        </h2>

        <div className="mx-auto mt-6 grid max-w-[960px] gap-3 md:grid-cols-2 lg:mt-8">
          {/* Without: muted surface, ink at low alpha */}
          <div className="rounded-card border border-hairline bg-ink-05 p-5 sm:p-6">
            <h3 className="eyebrow">{t.without}</h3>
            <ul className="mt-4 space-y-3">
              {t.before.map((row) => (
                <li key={row} className="flex items-start gap-3 text-body text-ink-60">
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-pill bg-ink-10"
                    aria-hidden
                  >
                    <X className="size-3 text-ink-60" strokeWidth={2.5} />
                  </span>
                  {row}
                </li>
              ))}
            </ul>
          </div>

          {/* With: white card, ember border and ember check chips (fill only, ink on top) */}
          <div className="rounded-card border-2 border-ember bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:p-6">
            <h3 className="eyebrow text-ink">{t.with}</h3>
            <ul className="mt-4 space-y-3">
              {t.after.map((row) => (
                <li key={row} className="flex items-start gap-3 text-body text-ink">
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-pill bg-ember"
                    aria-hidden
                  >
                    <Check className="size-3 text-ink" strokeWidth={3} />
                  </span>
                  {row}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
