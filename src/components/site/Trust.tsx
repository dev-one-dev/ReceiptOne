import React from "react";
import { useLang } from "@/lib/use-lang";

type Region = "ca" | "us";

interface TrustItem {
  Icon: () => React.ReactElement;
  title: string;
  desc: string;
}

const CA_ITEMS: TrustItem[] = [
  {
    Icon: LockIcon,
    title: "Bank-grade encryption",
    desc: "All receipts and financial data encrypted at rest and in transit with AES-256. Your data is yours alone.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "CRA-ready reports",
    desc: "Expense reports formatted to meet CRA requirements. Ready for personal tax, HST returns, or a CRA audit.",
  },
  {
    Icon: CloudIcon,
    title: "Automatic cloud backup",
    desc: "Every receipt backed up the moment you snap it. Access your full history from any device, anytime.",
  },
  {
    Icon: EyeOffIcon,
    title: "Privacy-first design",
    desc: "Your financial data is never sold, shared, or used for advertising. Full stop.",
  },
  {
    Icon: FileCheckIcon,
    title: "Audit-ready documentation",
    desc: "All supporting documents organized and timestamped. Organized and ready if the CRA ever asks.",
  },
  {
    Icon: ReceiptTaxIcon,
    title: "GST / HST / PST tracking",
    desc: "Input tax credits tracked automatically by province, so your records stay accurate and organized.",
  },
];

const FR_ITEMS: TrustItem[] = [
  {
    Icon: LockIcon,
    title: "Chiffrement de niveau bancaire",
    desc: "Tous les reçus et toutes les données financières sont chiffrés au repos et en transit avec AES-256. Vos données n'appartiennent qu'à vous.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "Rapports prêts pour l'ARC",
    desc: "Des rapports de dépenses mis en forme selon les exigences de l'ARC. Prêts pour votre déclaration de revenus, vos déclarations de TVH ou une vérification de l'ARC.",
  },
  {
    Icon: CloudIcon,
    title: "Sauvegarde automatique dans le nuage",
    desc: "Chaque reçu est sauvegardé dès que vous le photographiez. Consultez tout votre historique sur n'importe quel appareil, en tout temps.",
  },
  {
    Icon: EyeOffIcon,
    title: "Confidentialité avant tout",
    desc: "Vos données financières ne sont jamais vendues, partagées ni utilisées à des fins publicitaires. Point final.",
  },
  {
    Icon: FileCheckIcon,
    title: "Documentation prête en cas de vérification",
    desc: "Toutes les pièces justificatives sont organisées et horodatées. Classées et prêtes si l'ARC vous les demande un jour.",
  },
  {
    Icon: ReceiptTaxIcon,
    title: "Suivi de la TPS / TVH / TVP",
    desc: "Crédits de taxe sur les intrants suivis automatiquement par province, pour des dossiers exacts et organisés.",
  },
];

const US_ITEMS: TrustItem[] = [
  {
    Icon: LockIcon,
    title: "Bank-grade encryption",
    desc: "All receipts and financial data encrypted at rest and in transit with AES-256. Your data is yours alone.",
  },
  {
    Icon: ShieldCheckIcon,
    title: "IRS-ready reports",
    desc: "Expense reports formatted for Schedule C, 1099 contractors, and business deductions.",
  },
  {
    Icon: CloudIcon,
    title: "Automatic cloud backup",
    desc: "Every receipt backed up the moment you snap it. Access your full history from any device, anytime.",
  },
  {
    Icon: EyeOffIcon,
    title: "Privacy-first design",
    desc: "Your financial data is never sold, shared, or used for advertising. Full stop.",
  },
  {
    Icon: FileCheckIcon,
    title: "Audit-ready documentation",
    desc: "All supporting documents organized and timestamped. Organized and ready if the IRS ever asks.",
  },
  {
    Icon: ReceiptTaxIcon,
    title: "Sales tax tracking",
    desc: "State and local sales tax tracked automatically, so your records stay accurate.",
  },
];

export function Trust({ region = "ca" }: { region?: Region }) {
  const fr = useLang() === "fr" && region === "ca";
  const items = region === "us" ? US_ITEMS : fr ? FR_ITEMS : CA_ITEMS;
  const heading =
    region === "us"
      ? "Built for US tax compliance"
      : fr
        ? "Conçu pour la conformité fiscale canadienne"
        : "Built for Canadian tax compliance";

  return (
    <section
      data-surface="void"
      className="w-full bg-ink px-4 pt-12 pb-6 sm:px-6 sm:pt-16 sm:pb-8 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="eyebrow">{fr ? "Sécurité et conformité" : "Security & compliance"}</p>
          <h2 className="mt-3 text-paper">{heading}</h2>
          <p className="mt-4 text-body text-paper-40 sm:text-lead">
            {region === "us"
              ? "AES-256 encryption, IRS-ready records, and cloud backup that keeps your receipts until you delete them — built to protect your data and your deductions."
              : fr
                ? "Chiffrement AES-256, dossiers prêts pour l'ARC et sauvegarde dans le nuage qui conserve vos reçus jusqu'à ce que vous les supprimiez — conçu pour protéger vos données et vos déductions."
                : "AES-256 encryption, CRA-ready records, and cloud backup that keeps your receipts until you delete them — built to protect your data and your deductions."}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-card border border-hairline-void bg-paper-05 p-6 transition-colors hover:bg-paper-05"
            >
              <div className="flex size-11 items-center justify-center rounded-card bg-paper-10 text-paper-80">
                <item.Icon />
              </div>
              <div>
                <h3 className="text-lead tracking-body text-paper">{item.title}</h3>
                <p className="mt-1.5 text-sm text-paper-40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M10.73 10.73A2 2 0 0 0 14 12" />
    </svg>
  );
}

function FileCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

function ReceiptTaxIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
      <path d="M8 10h8M8 14h4" />
    </svg>
  );
}
