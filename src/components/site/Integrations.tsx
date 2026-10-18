import { FileSpreadsheet, Mail } from "lucide-react";
import telegramLogo from "@/assets/integrations/telegram.png";
import quickbooksLogo from "@/assets/integrations/quickbooks-logo.png";
import plaidLogo from "@/assets/integrations/plaid-logo.png";
import { useLang } from "@/lib/use-lang";

type Integration = {
  name: string;
  description: string;
  comingSoon: boolean;
  /** How to connect, shown as a numbered list under the description. */
  steps?: string[];
  link?: { href: string; label: string };
} & (
  | { brand: "logo"; logo: string; logoHeightClassName?: string }
  | { brand: "icon"; icon: typeof Mail }
);

/**
 * Order matches the grid below: receipt intake (Telegram, email) on the first
 * row, books and bank (QuickBooks, Plaid, statements) on the second. The
 * coming-soon set mirrors the web portal's Integrations page.
 */
const INTEGRATIONS: Integration[] = [
  {
    name: "Telegram",
    // Linking flow and bot behaviour: the portal's TelegramConnectDialog and
    // functions/src/telegram (telegramWebhook.ts, replies.ts).
    description:
      "Send a receipt photo, image or PDF to @ReceiptOne_bot. It's read, saved to your account and confirmed in the chat. Type a question for the assistant, or send /support to reach our team.",
    steps: [
      "In the ReceiptOne web app, open Integrations and choose Connect Telegram.",
      "Scan the QR code with your phone, or tap Open in Telegram.",
      "Send the bot your first receipt.",
    ],
    link: { href: "https://t.me/ReceiptOne_bot", label: "Open @ReceiptOne_bot" },
    comingSoon: false,
    brand: "logo",
    logo: telegramLogo,
  },
  {
    name: "Email forwarding",
    description: "Forward receipts to your ReceiptOne inbox — no app required.",
    comingSoon: true,
    brand: "icon",
    icon: Mail,
  },
  {
    name: "QuickBooks",
    description: "Sync your categorized expenses straight into your books.",
    comingSoon: true,
    brand: "logo",
    logo: quickbooksLogo,
  },
  {
    name: "Plaid",
    description: "Connect your bank to reconcile expenses automatically.",
    comingSoon: true,
    brand: "logo",
    logo: plaidLogo,
    logoHeightClassName: "h-6",
  },
  {
    name: "Bank statement reconciliation",
    description: "Upload your bank statements.",
    comingSoon: true,
    brand: "icon",
    icon: FileSpreadsheet,
  },
];

/**
 * French copy of INTEGRATIONS, same order and assets. Labels follow the
 * portal's fr locale (integrationsPage, telegram): "Connecter Telegram",
 * "Ouvrir dans Telegram", "Transfert de courriels", "Rapprochement de relevés
 * bancaires", "Bientôt disponible".
 */
const INTEGRATIONS_FR: Integration[] = [
  {
    name: "Telegram",
    description:
      "Envoyez une photo, une image ou un PDF de reçu à @ReceiptOne_bot. Il est lu, enregistré dans votre compte et confirmé dans la conversation. Posez une question à l'assistant ou envoyez /support pour joindre notre équipe.",
    steps: [
      "Dans l'application Web ReceiptOne, ouvrez Intégrations et choisissez Connecter Telegram.",
      "Scannez le code QR avec votre téléphone, ou touchez Ouvrir dans Telegram.",
      "Envoyez votre premier reçu au robot.",
    ],
    link: { href: "https://t.me/ReceiptOne_bot", label: "Ouvrir @ReceiptOne_bot" },
    comingSoon: false,
    brand: "logo",
    logo: telegramLogo,
  },
  {
    name: "Transfert de courriels",
    description: "Transférez vos reçus à votre adresse ReceiptOne — sans application.",
    comingSoon: true,
    brand: "icon",
    icon: Mail,
  },
  {
    name: "QuickBooks",
    description: "Synchronisez vos dépenses classées directement avec votre comptabilité.",
    comingSoon: true,
    brand: "logo",
    logo: quickbooksLogo,
  },
  {
    name: "Plaid",
    description: "Connectez votre banque pour rapprocher vos dépenses automatiquement.",
    comingSoon: true,
    brand: "logo",
    logo: plaidLogo,
    logoHeightClassName: "h-6",
  },
  {
    name: "Rapprochement de relevés bancaires",
    description: "Téléversez vos relevés bancaires.",
    comingSoon: true,
    brand: "icon",
    icon: FileSpreadsheet,
  },
];

/**
 * Five cards on a six-track grid: two wide cards (3 tracks each) over three
 * narrow ones (2 tracks each). On the two-column mobile grid the fifth card
 * spans the full row so nothing is left orphaned.
 */
const CARD_SPAN = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "col-span-2 lg:col-span-2",
];

export function Integrations() {
  const fr = useLang() === "fr";
  const integrations = fr ? INTEGRATIONS_FR : INTEGRATIONS;
  return (
    <section
      id="integrations"
      className="w-full scroll-mt-28 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">{fr ? "Intégrations" : "Integrations"}</p>
          <h2 className="mt-2 text-ink">
            {fr ? "S'intègre à votre façon de travailler" : "Fits into how you already work"}
          </h2>
          <p className="mt-3 max-w-2xl text-body text-ink-60 sm:text-lead">
            {fr
              ? "Envoyez dès aujourd'hui vos reçus à @ReceiptOne_bot sur Telegram. Le transfert de courriels, QuickBooks, la synchronisation bancaire et le rapprochement de relevés bancaires s'en viennent."
              : "Send receipts to @ReceiptOne_bot on Telegram today. Email forwarding, QuickBooks, bank sync, and bank statement reconciliation are on the way."}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {integrations.map((integration, i) => (
            <div
              key={integration.name}
              className={`${CARD_SPAN[i]} flex flex-col gap-3 rounded-card border border-hairline bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]`}
            >
              <div className="flex items-start justify-between gap-2">
                {integration.brand === "logo" ? (
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className={`${integration.logoHeightClassName ?? "h-5"} w-auto object-contain`}
                  />
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-ink-05 text-ink-40">
                    <integration.icon className="size-4" aria-hidden />
                  </span>
                )}
                {integration.comingSoon && (
                  <span className="shrink-0 rounded-pill bg-ink-05 px-2.5 py-1 text-label font-medium text-ink-60">
                    {fr ? "Bientôt disponible" : "Coming soon"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-ink">{integration.name}</p>
                <p className="mt-1 text-label text-ink-60">{integration.description}</p>
                {integration.steps && (
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-label text-ink-60">
                    {integration.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
                {integration.link && (
                  <a
                    href={integration.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-label font-medium text-ink underline underline-offset-2 hover:underline-offset-4"
                  >
                    {integration.link.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
