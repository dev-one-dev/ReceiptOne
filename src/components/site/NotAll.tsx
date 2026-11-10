import { useLang } from "@/lib/use-lang";
import naBeaverPeace from "@/assets/figma/na-beaver-peace.webp";
import naBeaverWheel from "@/assets/figma/na-beaver-wheel.webp";
import naBeaverLaptop from "@/assets/figma/na-beaver-laptop.webp";
import naBeaverPhoneFolders from "@/assets/figma/na-beaver-phone-folders.webp";
import naBeaverThinking from "@/assets/figma/na-beaver-thinking.webp";
import usGraphic1 from "@/assets/figma/mileage-auto/US/Graphic-Small1.png";
import usGraphic2 from "@/assets/figma/mileage-auto/US/Graphic-Small2.png";
import usGraphic from "@/assets/figma/mileage-auto/US/Graphic-Small.png";
import usGraphic4 from "@/assets/figma/mileage-auto/US/Graphic-Small4.png";
import usGraphic6 from "@/assets/figma/mileage-auto/US/Graphic-Small6.png";

/*
 * Five portal features beyond the InfoCards / HowItWorks / Pricing set. Each was
 * checked against the web portal on dev_main (2026-11-10):
 *   Telegram   functions/src/telegram (telegramWebhook.ts, taxReportChat.ts:
 *              /report sends the Annual Tax Report as a PDF or CSV file)
 *   Assistant  src/components/layout/AppLayout.tsx mounts AiAssistantWidget;
 *              functions/src/ai/aiChat.ts + accountQueries.ts (total_expenses
 *              by category and period over the user's own receipts)
 *   Bulk       src/components/receipts/BulkUploadTab.tsx (JPG, PNG, PDF, ZIP;
 *              AI-read, category filled, duplicates flagged)
 *   Logbook    src/lib/exportMileagePdf.ts, exportMileageCsv.ts (date, from,
 *              to, purpose, vehicle, distance per trip)
 *   Reimburse  ReceiptEditFields.tsx (Reimbursable switch),
 *              ReceiptAdvancedFilters.tsx (filter), Receipts.tsx (exports the
 *              filtered list as PDF or CSV)
 */
const CA_FEATURES = [
  {
    title: "Send Receipts to Our Telegram Bot",
    desc: "Snap a receipt in Telegram and it lands in ReceiptOne. Type /report to get your annual tax report right in the chat.",
    img: naBeaverPhoneFolders,
    alt: "Beaver with phone and folders",
  },
  {
    title: "Ask About Your Spending",
    desc: "Ask the built-in assistant things like \u201cHow much did I spend on fuel this year?\u201d and get the answer from your own receipts.",
    img: naBeaverThinking,
    alt: "Beaver thinking",
  },
  {
    title: "Upload a Year of Receipts at Once",
    desc: "Drop in a batch of photos or PDFs. ReceiptOne reads them all, sorts them into categories and flags duplicates.",
    img: naBeaverLaptop,
    alt: "Beaver with laptop and headphones",
  },
  {
    title: "A Mileage Logbook the CRA Expects",
    desc: "Export a trip-by-trip logbook as PDF or CSV, with the date, distance and purpose of every business trip.",
    img: naBeaverWheel,
    alt: "Beaver at the steering wheel",
  },
  {
    title: "Get Paid Back for Client Expenses",
    desc: "Mark expenses as reimbursable, filter them and export a clean PDF or CSV for your client or employer.",
    img: naBeaverPeace,
    alt: "Beaver giving a peace sign",
  },
] as const;

const FR_FEATURES = [
  {
    title: "Envoyez vos reçus à notre robot Telegram",
    desc: "Prenez un reçu en photo dans Telegram et il arrive dans ReceiptOne. Tapez /report pour recevoir votre rapport fiscal annuel directement dans la conversation.",
    img: naBeaverPhoneFolders,
    alt: "Castor avec un téléphone et des dossiers",
  },
  {
    title: "Questionnez vos dépenses",
    desc: "Demandez à l'assistant intégré, par exemple \u00ab\u00a0Combien ai-je dépensé en carburant cette année\u00a0?\u00a0\u00bb, et obtenez la réponse tirée de vos propres reçus.",
    img: naBeaverThinking,
    alt: "Castor en pleine réflexion",
  },
  {
    title: "Téléversez une année de reçus d'un coup",
    desc: "Déposez un lot de photos ou de PDF. ReceiptOne les lit tous, les classe par catégorie et repère les doublons.",
    img: naBeaverLaptop,
    alt: "Castor avec un ordinateur portable et un casque d'écoute",
  },
  {
    title: "Un registre de kilométrage comme l'ARC l'exige",
    desc: "Exportez un registre trajet par trajet en PDF ou en CSV, avec la date, les kilomètres parcourus et le motif de chaque déplacement d'affaires.",
    img: naBeaverWheel,
    alt: "Castor au volant",
  },
  {
    title: "Faites-vous rembourser vos dépenses pour vos clients",
    desc: "Marquez vos dépenses comme remboursables, filtrez-les et exportez un PDF ou un CSV soigné pour votre client ou votre employeur.",
    img: naBeaverPeace,
    alt: "Castor faisant le signe de la paix",
  },
] as const;

const US_FEATURES = [
  {
    title: "Send Receipts to Our Telegram Bot",
    desc: "Snap a receipt in Telegram and it lands in ReceiptOne. Type /report to get your annual tax report right in the chat.",
    img: usGraphic4,
    alt: "Eagle with phone and folders",
  },
  {
    title: "Ask About Your Spending",
    desc: "Ask the built-in assistant things like \u201cHow much did I spend on fuel this year?\u201d and get the answer from your own receipts.",
    img: usGraphic6,
    alt: "Eagle thinking",
  },
  {
    title: "Upload a Year of Receipts at Once",
    desc: "Drop in a batch of photos or PDFs. ReceiptOne reads them all, sorts them into categories and flags duplicates.",
    img: usGraphic,
    alt: "Eagle with laptop and headset",
  },
  {
    title: "A Mileage Log the IRS Expects",
    desc: "Export a trip-by-trip log as PDF or CSV, with the date, miles and purpose of every business trip.",
    img: usGraphic2,
    alt: "Eagle tracking mileage",
  },
  {
    title: "Get Paid Back for Client Expenses",
    desc: "Mark expenses as reimbursable, filter them and export a clean PDF or CSV for your client or employer.",
    img: usGraphic1,
    alt: "Eagle giving a peace sign",
  },
] as const;

export function NotAll({ region = "ca" }: { region?: "ca" | "us" }) {
  const fr = useLang() === "fr" && region === "ca";
  const FEATURES = region === "us" ? US_FEATURES : fr ? FR_FEATURES : CA_FEATURES;
  return (
    <section className="w-full px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4 sm:mb-12">
          <div className="h-px flex-1 bg-ink-10" />
          <h2 className="eyebrow">{fr ? "Et ce n'est pas tout" : "And this is not all"}</h2>
          <div className="h-px flex-1 bg-ink-10" />
        </div>

        {/* Cards. A grid with auto-rows-fr so EVERY row takes the tallest
            card's height -- the second row (two cards) is exactly as tall as
            the first, which flex-wrap could not guarantee (each flex line
            sizes itself). Columns are doubled (4 on sm, 6 on lg) with each
            card spanning two, so the incomplete last row can still centre
            itself: card 4 starts at column 2 on lg, card 5 at column 2 on sm. */}
        <div className="grid grid-cols-1 auto-rows-fr items-stretch gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={[
                "relative col-span-1 sm:col-span-2",
                i === 3 && "lg:col-start-2",
                i === 4 && "sm:col-start-2 lg:col-start-auto",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="group flex h-full flex-col overflow-hidden rounded-card border border-hairline bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]">
                <div className="p-6 sm:p-8">
                  <h3 className="text-lead tracking-body text-ink">{f.title}</h3>
                  <p className="mt-3 text-sm text-ink-60">{f.desc}</p>
                </div>
                {/* Fixed-height mascot box, identical on all five cards; the
                    image fills it bottom-aligned so shorter artwork never
                    shortens the card. */}
                <div className="mt-auto flex h-48 items-end justify-center px-6 pt-2 sm:h-52">
                  <img
                    src={f.img}
                    alt={f.alt}
                    className="h-full w-auto max-w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
