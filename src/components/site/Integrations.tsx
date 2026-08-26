import { Mail } from "lucide-react";
import telegramLogo from "@/assets/integrations/telegram.png";
import quickbooksLogo from "@/assets/integrations/quickbooks-logo.png";
import plaidLogo from "@/assets/integrations/plaid-logo.png";

type Integration = {
  name: string;
  description: string;
  comingSoon: boolean;
} & (
  | { brand: "logo"; logo: string; logoHeightClassName?: string }
  | { brand: "icon"; icon: typeof Mail }
);

const INTEGRATIONS: Integration[] = [
  {
    name: "Telegram",
    description: "Send a photo to our bot — receipts land in your account instantly.",
    comingSoon: false,
    brand: "logo",
    logo: telegramLogo,
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
    name: "Email forwarding",
    description: "Forward receipts to your ReceiptOne inbox — no app required.",
    comingSoon: true,
    brand: "icon",
    icon: Mail,
  },
];

export function Integrations() {
  return (
    <section
      id="integrations"
      className="w-full scroll-mt-28 px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">Integrations</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl lg:text-[2.75rem]">
            Fits into how you already work
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-black/55 sm:text-lg">
            Send receipts straight from Telegram today. QuickBooks, bank sync, and email forwarding
            are on the way.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {INTEGRATIONS.map((integration) => (
            <div
              key={integration.name}
              className="flex flex-col gap-3 rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
            >
              <div className="flex items-start justify-between gap-2">
                {integration.brand === "logo" ? (
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className={`${integration.logoHeightClassName ?? "h-5"} w-auto object-contain`}
                  />
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-black/45">
                    <integration.icon className="size-4" aria-hidden />
                  </span>
                )}
                {integration.comingSoon && (
                  <span className="shrink-0 rounded-full bg-black/[0.05] px-2.5 py-1 text-[11px] font-medium text-black/55">
                    Coming soon
                  </span>
                )}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-black">{integration.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-black/55">
                  {integration.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
