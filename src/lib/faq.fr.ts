import type { QA } from "@/components/site/Faq";

/**
 * French (fr-CA) translation of the Canadian FAQ in components/site/Faq.tsx:
 * the same 21 entries in the same order, so CATEGORIZED_FAQ_FR can use the
 * same indexes. Keep the two lists in step -- add, change or remove an entry
 * in both.
 *
 * Tax vocabulary is the web portal's own fr locale (exports.fr.json,
 * taxForms.fr.json, fr.json): TPS/TVH, TVP, TVQ, CTI, RTI, ARC, "Tableau A –
 * Dépenses relatives aux véhicules à moteur", "pourcentage d'utilisation
 * professionnelle", "Partie 7 – Calcul des frais d'utilisation de la
 * résidence aux fins de l'entreprise", and its read-only and Telegram labels.
 *
 * Links to pages that are still English-only carry `en: true` and say
 * "(en anglais)" in the label.
 */
export const faqItemsFR: QA[] = [
  {
    q: "Comment fonctionne la numérisation des reçus?",
    a: "Ouvrez l'application, pointez votre appareil photo vers n'importe quel reçu et touchez l'écran. ReceiptOne lit automatiquement le nom du commerçant, la date, le total et les montants de TPS/TVH/TVP, et vous pouvez corriger tout ce qui a été mal lu. Reçus papier, photos et factures PDF : tout fonctionne.",
  },
  {
    q: "ReceiptOne calcule-t-il mon remboursement d'impôt?",
    a: "Non — et nous le disons franchement. ReceiptOne organise vos reçus, votre kilométrage et les dépenses de votre bureau à domicile avec les renseignements fiscaux que l'ARC demande — TPS/TVH, TVP et plus — pour que vos dossiers soient exacts et prêts. Votre remboursement réel dépend de l'ensemble de votre situation fiscale, que calcule votre comptable ou votre logiciel d'impôt.",
  },
  {
    q: "Que signifie « Taxes remboursables estimées »?",
    a: "C'est le total cumulatif de la TPS/TVH et de la TVQ (s'il y a lieu) figurant sur vos reçus — les crédits de taxe sur les intrants (CTI) et les remboursements de la taxe sur les intrants (RTI) qu'un travailleur autonome ou une petite entreprise peut généralement récupérer auprès de l'ARC et, pour la TVQ, de Revenu Québec. C'est un chiffre de référence, pas un montant de remboursement garanti.",
  },
  {
    q: "Pourquoi la TVP est-elle marquée comme non remboursable?",
    a: "La taxe de vente provinciale (TVP — perçue en Colombie-Britannique, en Saskatchewan et au Manitoba) n'est généralement pas récupérable sous forme de crédit de taxe sur les intrants, contrairement à la TPS/TVH. Nous l'indiquons séparément pour que vos dossiers soient exacts au moment de produire votre déclaration.",
  },
  {
    q: "Et si mon reçu ne comporte aucune taxe?",
    a: "Aucun problème. Le reçu est quand même conservé, daté et classé correctement. Les champs de taxe restent simplement vides dans vos rapports — ce qui est exact, puisque tous les achats ne sont pas taxables.",
  },
  {
    q: "Puis-je exporter mes rapports de dépenses?",
    a: "Oui. Exportez en PDF et en CSV en tout temps — dans un format adapté à votre comptable, à votre teneur de livres ou à votre propre déclaration à l'ARC. Vos données, votre format, sans dépendance.",
  },
  {
    q: "Que signifie « Remboursable »?",
    a: "Marquez une dépense comme remboursable lorsqu'un client ou un employeur doit vous la rembourser. Filtrez vos dépenses remboursables dans un rapport distinct et envoyez-le directement — plus besoin de fouiller dans vos reçus au moment de facturer.",
  },
  {
    q: "Qu'est-ce qui est inclus dans le forfait payant?",
    a: "Tout : numérisation de reçus illimitée, extraction automatique de la TPS/TVH/TVP, suivi du kilométrage, téléversement en lot, synchronisation multiappareil et exportations en PDF et en CSV.",
  },
  {
    q: "Puis-je annuler en tout temps?",
    a: "Oui. Votre abonnement est facturé par l'App Store ou Google Play : vous l'annulez donc dans les réglages d'abonnement de votre compte App Store ou Google Play, sans appel téléphonique et sans frais d'annulation. Vous gardez l'accès complet jusqu'à la fin de la période payée; ensuite, votre compte passe en mode lecture seule : vos données restent consultables et modifiables, mais vous ne pouvez plus ajouter de nouveaux éléments.",
  },
  {
    q: "ReceiptOne est-il un service de production de déclarations?",
    a: "Non. ReceiptOne organise vos reçus et vos dépenses pour que la production de votre déclaration — que vous la fassiez vous-même ou la confiiez à un comptable — soit rapide, exacte et sans stress. Nous ne produisons pas de déclarations en votre nom.",
  },
  {
    q: "Comment fonctionne le suivi du kilométrage?",
    a: "Démarrez un trajet dans l'application mobile et ReceiptOne suit l'itinéraire par GPS, en arrière-plan, jusqu'à ce que vous l'arrêtiez. Ou enregistrez un trajet en entrant ses adresses de départ et d'arrivée, et ReceiptOne calcule l'itinéraire et la distance au moyen de Google Maps. Dans les deux cas, le trajet s'ajoute à votre registre. Indiquez si chaque trajet est professionnel ou personnel : la section Tableau A de votre rapport T2125 présente les kilomètres parcourus pour gagner un revenu d'entreprise, le total des kilomètres parcourus et le pourcentage d'utilisation professionnelle, soit les kilomètres professionnels divisés par tous les kilomètres enregistrés dans l'application. Le calcul n'utilise pas les relevés de votre odomètre : le pourcentage n'est donc exact que si vous enregistrez aussi vos trajets personnels.",
  },
  {
    q: "Quels documents de kilométrage l'ARC accepte-t-elle?",
    a: "Selon l'ARC, un registre exact tenu pour toute l'année est la meilleure preuve de l'utilisation à des fins professionnelles. Pour chaque trajet professionnel, il indique la date, la destination, le motif et les kilomètres parcourus, ainsi que les relevés de l'odomètre au début et à la fin de l'année. Dans ReceiptOne, vous démarrez un trajet dans l'application mobile et la laissez suivre l'itinéraire par GPS, ou vous entrez les adresses de départ et d'arrivée; ajoutez une note sur le motif et l'application enregistre le trajet avec sa date et sa distance.",
    link: {
      to: "/articles/$slug",
      slug: "mileage-deduction-canada-freelancers",
      label: "Lire le guide complet sur la déduction pour frais de véhicule (en anglais)",
      en: true,
    },
  },
  {
    q: "Comment la déduction pour bureau à domicile est-elle calculée?",
    a: "Selon la superficie de votre espace de travail par rapport à la superficie habitable totale de votre domicile, appliquée à vos dépenses du domicile — loyer ou intérêts hypothécaires, assurance habitation, services publics (chauffage, électricité, eau) et entretien — conformément aux règles de l'ARC sur les frais d'utilisation de la résidence aux fins de l'entreprise.",
  },
  {
    q: "Puis-je demander à la fois la déduction pour kilométrage et celle pour bureau à domicile?",
    a: "Oui. Les deux sont suivies séparément dans l'application, et toutes deux figurent dans votre rapport T2125.",
  },
  {
    q: "Puis-je transférer mes reçus par courriel?",
    a: "Pas encore — le transfert de courriels est en cours de développement. Pour l'instant, vous pouvez numériser vos reçus avec votre appareil photo ou les téléverser depuis votre photothèque.",
  },
  {
    q: "Y a-t-il une intégration Telegram?",
    a: "Oui. Notre robot Telegram est @ReceiptOne_bot. Pour le connecter, ouvrez une session dans l'application Web ReceiptOne, ouvrez Intégrations, choisissez Connecter Telegram et scannez le code QR avec l'appareil photo de votre téléphone, ou touchez Ouvrir dans Telegram si vous êtes sur votre téléphone. Le code ne fonctionne qu'une fois et expire après 15 minutes. Envoyez ensuite au robot la photo d'un reçu, ou un fichier image ou PDF : il lit le reçu, l'enregistre dans votre compte et vous répond avec le commerçant, le montant, la date et un lien vers le reçu. Si vous envoyez un reçu que vous avez déjà, il vous le signale au lieu d'en enregistrer une copie. Vous pouvez aussi écrire une question à l'assistant ReceiptOne, ou envoyer /support pour joindre notre équipe d'assistance, qui vous répond dans la conversation et par courriel. Le robot écrit en anglais ou en français, selon votre paramètre de langue ReceiptOne. L'ajout de reçus nécessite un essai ou un abonnement actif.",
    link: { to: "https://t.me/ReceiptOne_bot", label: "Ouvrir @ReceiptOne_bot", external: true },
  },
  {
    q: "Où mes données sont-elles stockées?",
    a: "Vos données sont stockées et traitées sur Firebase et Google Cloud aux États-Unis : la base de données dans la multirégion nam5 (Iowa et Caroline du Sud), les images de reçus et les fichiers dans Cloud Storage aux États-Unis, et le traitement côté serveur dans us-central1 (Iowa). Certains de nos fournisseurs de services traitent aussi des renseignements à l'extérieur du Canada — consultez notre politique de confidentialité pour la liste complète.",
    link: {
      to: "/privacy",
      label: "Lire notre politique de confidentialité (en anglais)",
      en: true,
    },
  },
  {
    q: "Qu'arrive-t-il à mes données si je supprime mon compte?",
    a: "Vos reçus, vos dépenses et vos autres dossiers sont supprimés lorsque vous supprimez votre compte, sauf si nous sommes tenus de les conserver plus longtemps pour des raisons juridiques, fiscales ou de sécurité. Certains fournisseurs d'infrastructure peuvent conserver des copies hachées ou en cache pendant une période limitée (généralement jusqu'à 30 jours) à des fins de prévention de la fraude et de sécurité, avant que ces copies résiduelles ne soient supprimées.",
    link: {
      to: "/privacy",
      label: "Lire notre politique de confidentialité (en anglais)",
      en: true,
    },
  },
  {
    q: "Combien de temps dois-je conserver mes reçus?",
    a: "L'ARC exige que les registres d'entreprise, y compris les reçus et les registres de kilométrage, soient conservés au moins six ans après la fin de la dernière année d'imposition à laquelle ils se rapportent.",
  },
  {
    q: "Quels rapports puis-je exporter pour mon formulaire T2125?",
    a: "Depuis l'application Web ReceiptOne, vous pouvez exporter un rapport T2125, en PDF et en CSV, présenté comme le formulaire T2125 de l'ARC, État des résultats des activités d'une entreprise ou d'une profession libérale : Partie 1 – Identification, vos dépenses par ligne de la partie 4, Partie 7 – Calcul des frais d'utilisation de la résidence aux fins de l'entreprise, et les kilomètres du Tableau A – Dépenses relatives aux véhicules à moteur : kilomètres parcourus dans l'exercice pour gagner un revenu d'entreprise, total des kilomètres parcourus dans l'exercice et pourcentage d'utilisation professionnelle. Les frais réels de véhicule du Tableau A, comme le carburant et l'huile, les assurances ou l'entretien et la réparation, sont laissés en blanc pour que vous les remplissiez. Vous pouvez aussi exporter un rapport de kilométrage : le CSV liste tous les trajets de l'année, professionnels et personnels, avec leur date, leurs adresses de départ et d'arrivée, leur motif et leur distance, et le PDF liste vos trajets professionnels. Ce sont des documents de travail pour vous ou votre comptable; ReceiptOne ne produit pas le formulaire.",
  },
  {
    q: "Comment fonctionnent l'essai gratuit et le paiement?",
    a: "Chaque nouveau compte commence par un essai gratuit de 7 jours dès votre inscription, dans l'application ou sur le Web, et nous ne demandons aucun renseignement de paiement pour le démarrer. Pour continuer à ajouter des reçus après l'essai, abonnez-vous dans l'application ReceiptOne pour iPhone ou Android : les abonnements sont vendus par l'App Store et Google Play, pas sur notre site ni dans l'application Web. Vous gérez ou annulez votre abonnement dans les réglages de votre compte App Store ou Google Play. Si votre essai ou votre abonnement prend fin, votre compte passe en mode lecture seule : vos données restent consultables et modifiables, mais vous ne pouvez plus ajouter de nouveaux éléments avant de vous abonner.",
  },
];

/** Same groups and indexes as CATEGORIZED_FAQ in components/site/Faq.tsx. */
export const CATEGORIZED_FAQ_FR: { category: string; items: QA[] }[] = [
  {
    category: "Général",
    items: [faqItemsFR[0], faqItemsFR[4], faqItemsFR[5], faqItemsFR[6]],
  },
  {
    category: "Impôts et ARC",
    items: [
      faqItemsFR[1],
      faqItemsFR[2],
      faqItemsFR[3],
      faqItemsFR[9],
      faqItemsFR[18],
      faqItemsFR[19],
    ],
  },
  {
    category: "Tarifs et forfaits",
    items: [faqItemsFR[7], faqItemsFR[8], faqItemsFR[20]],
  },
  {
    category: "Kilométrage et bureau à domicile",
    items: [faqItemsFR[10], faqItemsFR[11], faqItemsFR[12], faqItemsFR[13]],
  },
  {
    category: "Intégrations",
    items: [faqItemsFR[14], faqItemsFR[15]],
  },
  {
    category: "Données et sécurité",
    items: [faqItemsFR[16], faqItemsFR[17]],
  },
];
