/**
 * Copy for the tax-deadlines page (/ca/tax-deadlines, /fr/echeances-fiscales).
 * Every year in it is computed from "today" (src/lib/tax-deadlines.ts), and
 * every statement comes from the CRA rules listed there -- nothing else.
 * The FAQ strings feed both the visible FAQ and the FAQPage JSON-LD, so the
 * two can never differ.
 *
 * No React imports -- pure data, so the route head and tests can use it.
 */
import type { Lang } from "@/lib/locales";
import { appUrl } from "@/lib/external";
import { TRIAL_DAYS } from "@/lib/pricing";
import {
  currentFilingYear,
  formatLongDate,
  getCraDeadlinesNext12Months,
} from "@/lib/tax-deadlines";

export const TAX_DEADLINES_PATH: Record<Lang, "/ca/tax-deadlines" | "/fr/echeances-fiscales"> = {
  en: "/ca/tax-deadlines",
  fr: "/fr/echeances-fiscales",
};

export const TAX_DEADLINES_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Self-Employed Tax Deadlines in Canada: CRA and GST/HST Due Dates | ReceiptOne",
    description:
      "Every CRA deadline for self-employed Canadians in one place: instalments, the April 30 balance, the June 15 return and GST/HST due dates. Updated automatically.",
  },
  fr: {
    title:
      "Échéances fiscales des travailleurs autonomes au Canada : dates limites de l'ARC et de la TPS/TVH | ReceiptOne",
    description:
      "Toutes les échéances de l'ARC pour les travailleurs autonomes au même endroit : acomptes provisionnels, solde du 30 avril, déclaration du 15 juin et dates limites de la TPS/TVH. Mis à jour automatiquement.",
  },
};

export const SOURCES: Record<Lang, { label: string; url: string }[]> = {
  en: [
    {
      label: "Income tax instalment due dates",
      url: "https://www.canada.ca/en/revenue-agency/services/payments-cra/individual-payments/income-tax-instalments/due-dates.html",
    },
    {
      label: "GST/HST reporting requirements and deadlines",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/complete-file-when.html",
    },
    {
      label: "CRA public holidays",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/public-holidays.html",
    },
  ],
  fr: [
    {
      label: "Dates limites des acomptes provisionnels d'impôt",
      url: "https://www.canada.ca/fr/agence-revenu/services/paiements/paiements-arc/paiements-particuliers/impots-acomptes-provisionnels/dates-limites.html",
    },
    {
      label: "Exigences et dates limites en matière de déclaration de TPS/TVH",
      url: "https://www.canada.ca/fr/agence-revenu/services/impot/entreprises/sujets/tps-tvh-entreprises/produire-declaration-tps-tvh/exigences-dates-limites-matiere-declaration.html",
    },
    {
      label: "Jours fériés de l'ARC",
      url: "https://www.canada.ca/fr/agence-revenu/services/impot/jours-feries.html",
    },
  ],
};

/** The trial CTA, with the site's UTM pattern (see RoadmapPage's IDEAS_URL). */
export function ctaHref(lang: Lang): string {
  return `${appUrl("/signup")}?utm_source=landing&utm_medium=tax-deadlines&utm_campaign=tax-deadlines&utm_content=${lang}`;
}

export interface PageCopy {
  eyebrow: string;
  h1: string;
  lead: string;
  next12: { eyebrow: string; h2: string; date: string; what: string; who: string };
  rules: { eyebrow: string; h2: string; blocks: { h3: string; paragraphs: string[] }[] };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  cta: { h2: string; body: string; button: string };
  disclaimer: string;
  sourcesLabel: string;
  newTab: string;
  breadcrumb: { name: string; path: string }[];
}

/** All page copy for `lang`, with years computed from `today` (YYYY-MM-DD). */
export function taxDeadlinesCopy(lang: Lang, today: string): PageCopy {
  const F = currentFilingYear(today); // filing season; returns are for F - 1
  const T = F - 1;
  const d = (m: number, day: number, y: number) =>
    formatLongDate(`${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`, lang);
  // Weekend example: the first shifted deadline in the next 12 months, if any.
  const shifted = getCraDeadlinesNext12Months(today).find((r) => r.shifted);

  if (lang === "fr") {
    const weekendExample = shifted
      ? ` Par exemple, le ${formatLongDate(shifted.officialDate, "fr", true)} tombe une fin de semaine : un paiement ou une déclaration est donc à temps jusqu'au ${formatLongDate(shifted.effectiveDate, "fr", true)}.`
      : "";
    return {
      eyebrow: "Échéances fiscales",
      h1: "Les échéances fiscales des travailleurs autonomes au Canada",
      lead: "Toutes les dates limites de l'ARC des 12 prochains mois : acomptes provisionnels, solde du 30 avril, déclaration du 15 juin et TPS/TVH. Les dates sont calculées à partir des règles de l'ARC et reportées au lundi lorsqu'elles tombent une fin de semaine.",
      next12: {
        eyebrow: "Calendrier",
        h2: "Les 12 prochains mois",
        date: "Date",
        what: "Échéance",
        who: "Pour qui",
      },
      rules: {
        eyebrow: "Les règles",
        h2: "Comment fonctionnent les échéances",
        blocks: [
          {
            h3: "Impôt sur le revenu",
            paragraphs: [
              `Vous devez verser des acomptes provisionnels d'impôt si votre impôt net à payer dépasse 3 000 $ (1 800 $ au Québec) pour l'année en cours et pour l'une des deux années précédentes. Pour ${F}, ils sont dus le ${d(3, 15, F)}, le ${d(6, 15, F)}, le ${d(9, 15, F)} et le ${d(12, 15, F)}.`,
              `Le solde d'impôt de ${T} doit être payé au plus tard le ${d(4, 30, F)}.`,
              `Si vous êtes travailleur autonome, votre déclaration T1 de ${T} doit être produite au plus tard le ${d(6, 15, F)}. Cette date vise la production de la déclaration : le solde reste dû le ${d(4, 30, F)}.`,
            ],
          },
          {
            h3: "TPS/TVH : déclarants annuels",
            paragraphs: [
              `Si vous êtes un particulier qui a un revenu d'entreprise et un exercice se terminant le 31 décembre, et que vous produisez vos déclarations de TPS/TVH annuellement, votre paiement de ${T} est dû au plus tard le ${d(4, 30, F)} et votre déclaration, au plus tard le ${d(6, 15, F)}.`,
            ],
          },
          {
            h3: "TPS/TVH : déclarants trimestriels et acomptes provisionnels",
            paragraphs: [
              `Les déclarants trimestriels (trimestres civils) produisent leur déclaration et paient un mois après la fin de chaque trimestre. Pour ${F} : le ${d(4, 30, F)} (1er trimestre), le ${d(7, 31, F)} (2e trimestre), le ${d(10, 31, F)} (3e trimestre) et le ${d(1, 31, F + 1)} (4e trimestre).`,
              "Les déclarants annuels dont la taxe nette était de 3 000 $ ou plus versent des acomptes provisionnels de TPS/TVH aux quatre mêmes dates.",
              "L'ARC attribue par défaut la production annuelle lorsque vos fournitures taxables annuelles sont de 1,5 million de dollars ou moins; la production trimestrielle est une option que vous pouvez choisir.",
            ],
          },
          {
            h3: "TPS/TVH : déclarants mensuels",
            paragraphs: [
              "Les déclarants mensuels produisent leur déclaration et paient un mois après la fin de chaque mois.",
            ],
          },
          {
            h3: "Pour les sociétés",
            paragraphs: [
              "La déclaration T2 d'une société doit être produite dans les six mois suivant la fin de son exercice.",
            ],
          },
          {
            h3: "Fins de semaine",
            paragraphs: [
              `Si une date d'échéance tombe un samedi ou un dimanche, un paiement ou une déclaration est à temps s'il est reçu le lundi suivant.${weekendExample}`,
            ],
          },
        ],
      },
      faq: {
        eyebrow: "FAQ",
        h2: "Questions fréquentes",
        items: [
          {
            q: "Quelle est la date limite de production pour les travailleurs autonomes au Canada?",
            a: `Si vous êtes travailleur autonome, votre déclaration de revenus de ${T} doit être produite au plus tard le ${d(6, 15, F)}. Le solde dû pour ${T} doit toutefois être payé plus tôt, au plus tard le ${d(4, 30, F)}.`,
          },
          {
            q: "Dois-je payer au plus tard le 15 juin ou le 30 avril?",
            a: `Au plus tard le 30 avril. La date du 15 juin vise la production de la déclaration des travailleurs autonomes; le solde dû pour ${T} doit être payé au plus tard le ${d(4, 30, F)}.`,
          },
          {
            q: "Quand dois-je payer la TPS/TVH si je produis une déclaration annuelle?",
            a: `Si vous êtes un particulier qui a un revenu d'entreprise et un exercice se terminant le 31 décembre, votre paiement de TPS/TVH de ${T} est dû au plus tard le ${d(4, 30, F)} et votre déclaration, au plus tard le ${d(6, 15, F)}. Si votre taxe nette était de 3 000 $ ou plus, vous versez aussi des acomptes provisionnels de TPS/TVH le 30 avril, le 31 juillet, le 31 octobre et le 31 janvier.`,
          },
          {
            q: "Quand les déclarations trimestrielles de TPS/TVH sont-elles dues?",
            a: "Un mois après la fin de chaque trimestre civil : le 30 avril, le 31 juillet, le 31 octobre et le 31 janvier de l'année suivante. Vous produisez la déclaration et payez à la même date.",
          },
          {
            q: "Que se passe-t-il si une date limite tombe une fin de semaine?",
            a: "Si une date d'échéance tombe un samedi ou un dimanche, votre paiement ou votre déclaration est à temps si l'ARC le reçoit au plus tard le lundi suivant.",
          },
        ],
      },
      cta: {
        h2: "Prêt pour des reçus mieux organisés et une période des impôts plus simple?",
        body: `Commencez votre essai gratuit de ${TRIAL_DAYS} jours et gardez vos reçus, votre kilométrage et vos rapports de dépenses au même endroit.`,
        button: `Commencer l'essai gratuit de ${TRIAL_DAYS} jours`,
      },
      disclaimer:
        "Cette page fournit des renseignements généraux et non des conseils fiscaux. Vos propres dates d'échéance figurent dans votre compte de l'ARC.",
      sourcesLabel: "Sources (canada.ca) :",
      newTab: "(s'ouvre dans un nouvel onglet)",
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Canada (français)", path: "/fr" },
        { name: "Échéances fiscales", path: "/fr/echeances-fiscales" },
      ],
    };
  }

  const weekendExample = shifted
    ? ` For example, ${formatLongDate(shifted.officialDate, "en", true)} falls on a weekend, so a payment or return is on time until ${formatLongDate(shifted.effectiveDate, "en", true)}.`
    : "";
  return {
    eyebrow: "Tax deadlines",
    h1: "Tax deadlines for self-employed Canadians",
    lead: "Every CRA due date for the next 12 months: income tax instalments, the April 30 balance, the June 15 return and GST/HST. Dates are computed from the CRA's rules and move to Monday when they fall on a weekend.",
    next12: {
      eyebrow: "Calendar",
      h2: "Next 12 months",
      date: "Date",
      what: "Deadline",
      who: "Who it applies to",
    },
    rules: {
      eyebrow: "The rules",
      h2: "How the deadlines work",
      blocks: [
        {
          h3: "Income tax",
          paragraphs: [
            `You must pay income tax instalments if your net tax owing is more than $3,000 ($1,800 in Quebec) in the current year and in either of the two previous years. For ${F}, they are due ${d(3, 15, F)}, ${d(6, 15, F)}, ${d(9, 15, F)} and ${d(12, 15, F)}.`,
            `Your ${T} income tax balance owing is due ${d(4, 30, F)}.`,
            `If you are self-employed, your ${T} T1 return is due ${d(6, 15, F)}. That date is for filing only: the balance is still due ${d(4, 30, F)}.`,
          ],
        },
        {
          h3: "GST/HST: annual filers",
          paragraphs: [
            `If you are an individual with business income and a December 31 fiscal year-end and you file GST/HST annually, your ${T} payment is due ${d(4, 30, F)} and your return is due ${d(6, 15, F)}.`,
          ],
        },
        {
          h3: "GST/HST: quarterly filers and instalments",
          paragraphs: [
            `Quarterly filers (calendar quarters) file and pay one month after each quarter. For ${F}: ${d(4, 30, F)} (Q1), ${d(7, 31, F)} (Q2), ${d(10, 31, F)} (Q3) and ${d(1, 31, F + 1)} (Q4).`,
            "Annual filers whose net tax was $3,000 or more pay GST/HST instalments on the same four dates.",
            "The CRA assigns annual reporting by default when your annual taxable supplies are $1.5 million or less; quarterly reporting is an option you can elect.",
          ],
        },
        {
          h3: "GST/HST: monthly filers",
          paragraphs: ["Monthly filers file and pay one month after the end of each month."],
        },
        {
          h3: "For corporations",
          paragraphs: [
            "A corporation's T2 return is due within six months after the end of its fiscal year.",
          ],
        },
        {
          h3: "Weekends",
          paragraphs: [
            `If a due date falls on a Saturday or Sunday, a payment or return is on time if it is received the next Monday.${weekendExample}`,
          ],
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      h2: "Frequently asked questions",
      items: [
        {
          q: "When is the self-employed tax deadline in Canada?",
          a: `If you are self-employed, your ${T} income tax return is due ${d(6, 15, F)}. Any balance owing for ${T} is due earlier, on ${d(4, 30, F)}.`,
        },
        {
          q: "Do I have to pay by June 15 or April 30?",
          a: `By April 30. June 15 is the deadline for filing the self-employed return; the ${T} balance owing is due ${d(4, 30, F)}.`,
        },
        {
          q: "When is GST/HST due if I file annually?",
          a: `If you are an individual with business income and a December 31 fiscal year-end, your ${T} GST/HST payment is due ${d(4, 30, F)} and your return is due ${d(6, 15, F)}. If your net tax was $3,000 or more, you also pay GST/HST instalments on April 30, July 31, October 31 and January 31.`,
        },
        {
          q: "When are GST/HST quarterly returns due?",
          a: "One month after each calendar quarter ends: April 30, July 31, October 31 and January 31 of the following year. You file and pay by the same date.",
        },
        {
          q: "What if a deadline falls on a weekend?",
          a: "If a due date falls on a Saturday or Sunday, your payment or return is on time if the CRA receives it by the following Monday.",
        },
      ],
    },
    cta: {
      h2: "Ready for cleaner receipts and easier tax time?",
      body: `Start your ${TRIAL_DAYS}-day free trial and keep receipts, mileage, and expense reports organized in one place.`,
      button: `Start ${TRIAL_DAYS}-day free trial`,
    },
    disclaimer:
      "This page is general information, not tax advice. Your own due dates are in your CRA account.",
    sourcesLabel: "Sources (canada.ca):",
    newTab: "(opens in a new tab)",
    breadcrumb: [
      { name: "Home", path: "/" },
      { name: "Canada", path: "/ca" },
      { name: "Tax deadlines", path: "/ca/tax-deadlines" },
    ],
  };
}
