/**
 * French (fr-CA) translations of Canadian articles, served at
 * /fr/articles/$slug. Pure data, like src/lib/articles.ts.
 *
 * Each article declares its English counterpart (`enSlug`); its own slug comes
 * from FRENCH_ARTICLE_SLUGS in src/lib/locales.ts, which also drives hreflang,
 * the header's language switch and the sitemap. Facts, figures and examples
 * match the English article; the terms are the CRA's own French ones, checked
 * on the French canada.ca pages listed in each Sources block.
 *
 * Text is written with plain spaces. frenchTypography() then adds the
 * non-breaking spaces French typesetting needs: between digit groups
 * (1 500), before $, % and km, before a colon, and inside « ». Question marks
 * take no space, as on the rest of the French site.
 */
import type { Article, ContentBlock } from "@/lib/articles";
import { FRENCH_ARTICLE_SLUGS } from "@/lib/locales";

export interface FrArticle extends Article {
  /** Slug of the English article this one translates (/articles/{enSlug}). */
  enSlug: string;
}

const NBSP = "\u00a0";

/** French non-breaking spaces; see the file comment. Idempotent. */
export function frenchTypography(text: string): string {
  let out = text;
  // 1 500 / 30 000 / 1 000 000: repeat until no group is left unjoined.
  for (let prev = ""; prev !== out;) {
    prev = out;
    out = out.replace(/(\d) (\d{3})(?!\d)/g, `$1${NBSP}$2`);
  }
  return out
    .replace(/(\d) (\$|%|km\b)/g, `$1${NBSP}$2`)
    .replace(/ :/g, `${NBSP}:`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`);
}

function typesetBlock(b: ContentBlock): ContentBlock {
  const t = frenchTypography;
  switch (b.type) {
    case "p":
      return {
        ...b,
        text: t(b.text),
        ...(b.link ? { link: { ...b.link, label: t(b.link.label) } } : {}),
      };
    case "h2":
    case "h3":
    case "callout":
      return { ...b, text: t(b.text) };
    case "ul":
      return { ...b, items: b.items.map(t) };
    case "faq":
      return { ...b, q: t(b.q), a: t(b.a) };
    case "table":
      return {
        ...b,
        caption: t(b.caption),
        headers: b.headers.map(t),
        rows: b.rows.map((r) => r.map(t)),
      };
    case "sources":
      return {
        ...b,
        links: b.links.map((l) => ({ ...l, label: t(l.label) })),
        checked: t(b.checked),
      };
  }
}

/** The article with its slug from FRENCH_ARTICLE_SLUGS and French typography applied. */
function fr(article: Omit<FrArticle, "slug">): FrArticle {
  const slug = FRENCH_ARTICLE_SLUGS[article.enSlug];
  if (!slug) throw new Error(`articles.fr: no French slug for ${article.enSlug} in locales.ts`);
  const t = frenchTypography;
  return {
    ...article,
    slug,
    title: t(article.title),
    displayTitle: article.displayTitle && t(article.displayTitle),
    excerpt: t(article.excerpt),
    image: { ...article.image, alt: t(article.image.alt) },
    quickAnswer: article.quickAnswer && t(article.quickAnswer),
    receiptOneHelps: article.receiptOneHelps && {
      items: article.receiptOneHelps.items.map(t),
      link: { ...article.receiptOneHelps.link, label: t(article.receiptOneHelps.link.label) },
    },
    body: article.body.map(typesetBlock),
  };
}

/** Marker after a link to a page that exists only in English. */
export const EN_ONLY = "(en anglais)";

/** A link from a French article to an English-only page: labelled and hrefLang="en". */
const enOnly = (label: string, href: string) => ({
  label: `${label} ${EN_ONLY}`,
  href,
  hrefLang: "en",
});

/** /fr/articles/{slug} of the French translation of an English article. */
const frArticle = (enSlug: string) => {
  const slug = FRENCH_ARTICLE_SLUGS[enSlug];
  if (!slug) throw new Error(`articles.fr: ${enSlug} has no French translation`);
  return `/fr/articles/${slug}`;
};

/** Byline on every French article, as on the English ones ("ReceiptOne Team"). */
export const FR_ARTICLE_BYLINE = "Équipe ReceiptOne";

/** Heading of the FAQ section; must match ARTICLE_LABELS.fr.faqHeading. */
export const FR_FAQ_HEADING = "Foire aux questions";

/** Copy for /fr/articles. */
export const FR_ARTICLES_INDEX = {
  title: "Guides fiscaux pour les travailleurs autonomes au Canada | ReceiptOne",
  description:
    "Règles de l'ARC sur les reçus, formulaire T2125 et déductions : des guides gratuits, en français, pour les travailleurs autonomes, les pigistes et les entrepreneurs du Canada.",
  eyebrow: "Base de connaissances",
  heading: "Guides fiscaux pour les travailleurs autonomes au Canada",
  subheading:
    "Des conseils prêts pour l'ARC sur les reçus, la TPS/TVH, le kilométrage et les déductions, pour les pigistes, les entrepreneurs et les chauffeurs.",
};

const CANADA_FR = "https://www.canada.ca/fr/agence-revenu/services";
const T4002_FR = `${CANADA_FR}/formulaires-publications/publications/t4002`;
const RECORDS_FR = `${CANADA_FR}/impot/entreprises/sujets/tenue-registres-comptables`;
const DISCLAIMER =
  "Ces renseignements sont d'ordre général et ne constituent pas des conseils fiscaux.";
const GST_FR = `${CANADA_FR}/impot/entreprises/sujets/tps-tvh-entreprises`;
const SOLE_PROP_FR = `${CANADA_FR}/impot/entreprises/sujets/entreprise-individuelle-societe-personnes`;
const VEHICLE_FR = `${SOLE_PROP_FR}/depenses-entreprise/depenses-relatives-vehicules-a-moteur`;
const RQ_FR = "https://www.revenuquebec.ca/fr/entreprises/taxes/tpstvh-et-tvq";
const MB = "https://www.gov.mb.ca/finance/taxation";
/** English-only provincial sources: B.C. and Saskatchewan publish no French PST pages. */
const BC_EN = "https://www2.gov.bc.ca";
const SK_EN =
  "https://www.saskatchewan.ca/business/taxes-licensing-and-reporting/provincial-taxes-policies-and-bulletins/provincial-sales-tax";

export const FR_ARTICLES: FrArticle[] = [
  /* ------------------------------------------------------------------ */
  /* t2125-form-guide-canada                                             */
  /* ------------------------------------------------------------------ */
  fr({
    enSlug: "t2125-form-guide-canada",
    title: "Formulaire T2125 expliqué : guide ligne par ligne (2026)",
    displayTitle: "Formulaire T2125 expliqué : guide ligne par ligne",
    excerpt:
      "Un guide ligne par ligne du formulaire T2125 de l'ARC pour 2026 : revenus, coût des marchandises vendues, chaque ligne de dépenses, frais d'utilisation de la résidence, DPA et tableaux des véhicules.",
    category: "Notions fiscales de base",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/t2125-form-guide-canada.webp",
      width: 1280,
      height: 720,
      alt: "Stylo à bille bleu au-dessus d'une case de formulaire cochée",
    },
    tags: [
      "T2125",
      "revenu d'entreprise",
      "travailleur autonome",
      "ARC",
      "formulaire fiscal",
      "déductions",
    ],
    relatedSlugs: ["deductions-travailleurs-autonomes-canada", "regles-recus-arc"],
    body: [
      {
        type: "p",
        text: "Le formulaire T2125, État des résultats des activités d'une entreprise ou d'une profession libérale, est le formulaire de l'ARC qui sert à calculer votre revenu d'entreprise, de profession libérale ou de commissions tiré d'un travail indépendant, ainsi que les dépenses que vous en déduisez. Vous le produisez avec votre déclaration de revenus si vous êtes propriétaire unique ou associé d'une société de personnes exploitant une entreprise ou une profession libérale, et vous remplissez un T2125 distinct pour chaque entreprise.",
      },
      {
        type: "p",
        text: "Les agriculteurs utilisent plutôt le formulaire T2042, et les pêcheurs, le formulaire T2121. Les sociétés et les fiducies n'utilisent aucun de ces formulaires. Les numéros de ligne, les règles et les montants ci-dessous proviennent de canada.ca : le guide T4002, le formulaire lui-même et les plafonds de 2026 pour les automobiles annoncés par le ministère des Finances Canada. Les sources sont énumérées à la fin. Les exemples sont fictifs.",
      },
      {
        type: "callout",
        text: "Au 5 octobre 2026, le formulaire T2125 et le guide T4002 les plus récents sur canada.ca sont les éditions 2025. Les versions 2026 ne sont pas encore publiées : tous les numéros de ligne ci-dessous proviennent donc du formulaire 2025. Vérifiez le formulaire 2026 avant de produire votre déclaration.",
      },
      { type: "h2", text: "Partie 1 : Identification" },
      {
        type: "p",
        text: "La partie 1 demande votre nom et votre NAS, ainsi que le nom, le numéro et l'adresse de votre entreprise. Elle demande aussi votre exercice, s'il s'agit de votre dernière année d'activité et votre principal produit ou service. La plupart des travailleurs autonomes doivent avoir un exercice qui se termine le 31 décembre. Si vous avez droit à une autre fin d'exercice, vous produisez aussi le formulaire T1139.",
      },
      {
        type: "ul",
        items: [
          "Code d'industrie : le code à six chiffres du SCIAN Canada 2022 qui correspond à votre activité principale. Si vous produisez votre déclaration par voie électronique, utilisez les codes de votre logiciel d'impôt.",
          "Méthode de comptabilité : sur le formulaire, elle ne vise que le revenu de commissions. Le T4002 permet aux agriculteurs, aux pêcheurs et aux agents à commission travaillant de façon autonome d'utiliser la méthode de comptabilité de caisse. Tout autre revenu de travail indépendant doit être déclaré selon la méthode de comptabilité d'exercice, qui inscrit les revenus lorsqu'ils sont gagnés et les dépenses lorsqu'elles sont engagées.",
          "Associés : inscrivez votre pourcentage de participation dans la société de personnes et le numéro d'entreprise de celle-ci.",
        ],
      },
      {
        type: "p",
        text: "La partie 2 demande de combien de pages Web et de sites Web vous tirez un revenu, y compris les plateformes de tiers, et quelle part de votre revenu brut ils produisent.",
      },
      { type: "h2", text: "Partie 3 : Revenus (lignes 8000, 8290, 8230, 8299)" },
      {
        type: "p",
        text: "Utilisez la partie 3A pour le revenu d'entreprise, qui comprend le revenu de commissions, et la partie 3B pour le revenu de profession libérale. Si vous avez les deux, remplissez un formulaire distinct pour chacun. Le montant 3A correspond aux ventes brutes, y compris la TPS/TVH perçue ou percevable. Le montant 3B en retire la TPS/TVH, la TVP, les retours, les rabais et les escomptes. Si vous utilisez la méthode rapide pour la TPS/TVH, vous rajustez le total aux montants 3D à 3F. Dans la partie 3B, les professionnels incluent aussi les travaux en cours dans leurs honoraires.",
      },
      {
        type: "ul",
        items: [
          "Ligne 8000 – Ventes brutes rajustées (montant 3G) ou honoraires rajustés (montant 3N).",
          "Ligne 8290 – Provisions déduites l'année précédente, ajoutées au revenu de cette année.",
          "Ligne 8230 – Autres revenus, comme les créances irrécouvrables recouvrées, les prix gagnés dans le cadre de l'entreprise et les subventions que vous ne pouvez pas appliquer à une dépense ou à un bien précis. Si vous utilisez la méthode rapide, vous y déclarez le crédit de 1 % (maximum de 300 $).",
          "Ligne 8299 – Revenus bruts d'entreprise ou de profession libérale : la ligne 8000 plus les lignes 8290 et 8230. Ce montant va à la ligne 13499, 13699 ou 13899 de votre déclaration.",
        ],
      },
      { type: "h2", text: "Partie 3D : Coût des marchandises vendues et bénéfice brut" },
      {
        type: "p",
        text: "Sur le formulaire, le coût des marchandises vendues se trouve à la partie 3D, et non à la partie 4. Ne la remplissez que si vous achetez des marchandises pour les revendre ou si vous fabriquez des marchandises pour les vendre. Inscrivez les stocks d'ouverture à la ligne 8300; ils doivent correspondre aux stocks de fermeture de l'année précédente. Les achats vont à la ligne 8320, déduction faite des escomptes et transport compris, moins ce que vous avez pris pour votre usage personnel. Viennent ensuite les coûts directs des salaires (8340), la sous-traitance (8360) et les autres coûts (8450). Les stocks de fermeture vont à la ligne 8500. Évaluez-les soit entièrement à leur juste valeur marchande, soit au moindre du coût et de la juste valeur marchande, et utilisez la même méthode chaque année. La ligne 8518 correspond au coût des marchandises vendues et la ligne 8519, au bénéfice brut.",
      },
      { type: "h2", text: "Partie 4 : Dépenses, ligne par ligne" },
      {
        type: "p",
        text: "La partie 4 part de la ligne 8299, ou de la ligne 8519 si vous vendez des marchandises. Trois règles s'appliquent à chaque ligne. N'inscrivez que la partie entreprise. Ne déduisez pas les achats d'immobilisations ici, car ils passent par la déduction pour amortissement (DPA). Si vous demandez des crédits de taxe sur les intrants (CTI), excluez la TPS/TVH que vous récupérez.",
      },
      {
        type: "p",
        text: "Ligne 8521 – Publicité : annonces dans les médias canadiens, plus les commissions d'intermédiaire. Des règles sur le contenu ou la propriété canadienne s'appliquent, mais pas aux annonces sur des sites Web étrangers. Une annonce dans un périodique destiné aux Canadiens est entièrement déductible si au moins 80 % du contenu non publicitaire du numéro est du contenu rédactionnel original, et déductible à 50 % dans le cas contraire.",
      },
      {
        type: "p",
        text: "Ligne 8523 – Repas et frais de représentation : vous pouvez déduire au plus 50 % du moindre du montant dépensé et d'un montant raisonnable, et vous n'inscrivez que cette partie admissible. La limite ne s'applique pas aux repas que vous facturez à un client et qui figurent sur la facture, ni à un maximum de six événements par année auxquels tous les employés sont invités. Les conducteurs de grand routier peuvent déduire 80 % des aliments et des boissons consommés pendant un déplacement admissible.",
      },
      {
        type: "callout",
        text: "Exemple fictif : vous dépensez 800 $ en repas raisonnables avec des clients en 2026 et ne les refacturez pas. Vous inscrivez 400 $ à la ligne 8523.",
      },
      {
        type: "p",
        text: "Ligne 8690 – Assurances : primes d'assurance commerciale sur les bâtiments, la machinerie et l'équipement de l'entreprise. L'assurance du véhicule va au tableau A, et l'assurance habitation, à la partie 7. Les primes d'assurance-vie ne sont généralement pas déductibles.",
      },
      {
        type: "p",
        text: "Ligne 8710 – Intérêts et frais bancaires : intérêts sur l'argent emprunté pour l'entreprise. Les frais engagés pour obtenir un prêt servant à acheter ou à améliorer un bien de l'entreprise se déduisent à raison de 20 % par année sur cinq ans. Les intérêts sur un prêt automobile vont au tableau A, et les intérêts hypothécaires liés à un espace de travail à domicile, à la partie 7.",
      },
      {
        type: "p",
        text: "Ligne 8760 – Taxes d'affaires, droits d'adhésion et licences : droits de licence annuels, certaines taxes d'affaires, cotisations à des associations commerciales et abonnements à des publications. Les cotisations à des clubs dont le but principal est d'offrir des repas, des loisirs ou des activités sportives ne sont pas déductibles.",
      },
      {
        type: "p",
        text: "Ligne 8810 – Frais de bureau : petits articles comme les stylos, la papeterie et les timbres. Un bureau, une chaise ou un classeur est une immobilisation et passe par la DPA. Les fournitures que vous utilisez pour offrir votre service vont à la ligne 8811.",
      },
      {
        type: "p",
        text: "Ligne 8860 – Honoraires professionnels : conseils externes, frais comptables et juridiques, et frais de préparation de vos déclarations de revenus et de TPS/TVH. Les frais juridiques liés à l'achat d'une immobilisation s'ajoutent à son coût.",
      },
      {
        type: "p",
        text: "Ligne 9060 – Salaires, traitements et avantages : la rémunération des employés et votre part d'employeur des cotisations au RPC ou au RRQ, des cotisations d'assurance-emploi et des primes d'indemnisation des accidentés du travail. Un salaire versé à votre enfant ou à votre époux ou conjoint de fait est déductible si le travail est nécessaire, si la rémunération est raisonnable et si vous la versez réellement. Vos propres prélèvements ne sont pas déductibles.",
      },
      {
        type: "p",
        text: "Ligne 9180 – Impôts fonciers : pour le terrain et les bâtiments où se trouve l'entreprise. Les impôts fonciers d'un espace de travail à domicile vont à la partie 7.",
      },
      {
        type: "p",
        text: "Ligne 9200 – Frais de déplacement : billets de transport, hôtels et repas lors de déplacements d'affaires. La limite de 50 % sur les repas s'applique généralement quand même.",
      },
      {
        type: "p",
        text: "Ligne 9220 – Services publics : téléphone, gaz, électricité, eau et câble utilisés pour gagner un revenu, plus la part d'entreprise du temps d'antenne de votre cellulaire. Vous ne pouvez pas déduire le tarif mensuel de base de votre téléphone résidentiel, mais vous pouvez déduire les appels interurbains d'affaires ou une ligne d'affaires distincte. Les services publics du domicile vont à la partie 7.",
      },
      {
        type: "p",
        text: "Ligne 9224 – Carburant et huile (sauf pour véhicule à moteur) : carburant et lubrifiants pour l'équipement de l'entreprise. Le carburant du véhicule va au tableau A.",
      },
      {
        type: "p",
        text: "Ligne 9281 – Dépenses relatives aux véhicules à moteur (sans la DPA) : le montant 16 du tableau A. Ligne 9936 – DPA : le montant ii de la section A, moins l'usage personnel et toute DPA demandée à la partie 7.",
      },
      {
        type: "p",
        text: "Ligne 9270 – Autres dépenses : tout ce qu'aucune ligne précédente ne vise, énuméré sur le formulaire. Par exemple, la location de biens de l'entreprise, jusqu'à deux congrès par année et les rénovations liées à une invalidité. Si les frais d'un congrès comprennent des repas qui ne sont pas détaillés, considérez 50 $ par jour comme un repas : la limite de 50 % s'y applique donc.",
      },
      {
        type: "p",
        text: "La partie 4 comprend aussi des lignes pour les créances irrécouvrables (8590), les frais de gestion et d'administration (8871), le loyer (8910), les réparations (8960) et la livraison (9275). La ligne 9368 additionne les dépenses, et la ligne 9369 correspond au revenu net avant rajustements.",
      },
      {
        type: "callout",
        text: "L'exportation de fin d'année de ReceiptOne vous fournit un PDF et un CSV de vos registres organisés : les dépenses regroupées par catégorie, les totaux de TPS/TVH par type et un sommaire du kilométrage. Vous ou votre comptable vous en servez pour remplir la partie 4. Elle ne couvre pas vos revenus, et ReceiptOne ne prépare ni ne produit le formulaire T2125.",
      },
      { type: "h2", text: "Partie 5 : Revenu net, y compris la ligne 9945" },
      {
        type: "p",
        text: "La ligne 9945 n'est pas une ligne de dépenses de la partie 4. La partie 5 part de votre part de la ligne 9369 (montant 5A). Les associés peuvent ajouter le montant 5B et la ligne 9974, et soustraire leurs propres montants déductibles à la ligne 9943. Le résultat est le revenu net après rajustements (montant 5D). Les frais d'utilisation de la résidence aux fins de l'entreprise, tirés de la partie 7, sont soustraits à la ligne 9945. Le résultat est la ligne 9946, votre revenu net, qui va à la ligne 13500, 13700 ou 13900 de votre déclaration.",
      },
      {
        type: "h2",
        text: "Partie 7 : Frais d'utilisation de la résidence, règle sur les pertes et report",
      },
      {
        type: "p",
        text: "Vous pouvez déduire un espace de travail à domicile s'il est votre principal lieu d'affaires. Vous pouvez aussi le déduire si vous l'utilisez uniquement pour l'entreprise et y rencontrez régulièrement des clients. Répartissez les frais de façon raisonnable, habituellement selon la superficie. Si vous vivez aussi dans la pièce, rajustez selon le nombre d'heures où elle sert à l'entreprise. Les locataires déduisent une partie de leur loyer. Les propriétaires peuvent déduire une partie de leurs intérêts hypothécaires (pas le capital), de leurs impôts fonciers et de la DPA. Le T4002 prévient que demander la DPA sur votre résidence fait entrer en jeu les règles sur les gains en capital et la récupération lorsque vous la vendez.",
      },
      {
        type: "p",
        text: "Les montants 7A à 7G énumèrent le chauffage, l'électricité, l'assurance, l'entretien, les intérêts hypothécaires, les impôts fonciers et les autres frais. Le montant 7I retire la partie personnelle, le montant 7K ajoute la DPA pour l'entreprise et le montant 7L ajoute le report de l'année précédente. Le montant 7N est votre revenu net après rajustements, ou 0 s'il est négatif. La déduction (7P) est le moindre de 7M et de 7N : les frais de la résidence ne peuvent donc pas créer ni augmenter une perte d'entreprise. Le montant inutilisé (7O) est reporté à l'année suivante.",
      },
      {
        type: "table",
        caption:
          "Exemple fictif : un espace de travail qui occupe 12,5 % du logement, pendant une année à faible revenu.",
        headers: ["Montant", "Ce qu'il contient", "Valeur"],
        rows: [
          ["7A–7G", "Total des frais de la résidence", "16 800 $"],
          ["7I", "Partie personnelle (87,5 %)", "14 700 $"],
          ["7M", "Partie entreprise plus report (0 $)", "2 100 $"],
          ["7N", "Revenu net après rajustements", "1 500 $"],
          ["7P", "Déduction à la ligne 9945 (moindre de 7M et de 7N)", "1 500 $"],
          ["7O", "Reporté à 2027", "600 $"],
        ],
      },
      { type: "h2", text: "Sections A à C : Déduction pour amortissement" },
      {
        type: "p",
        text: "Utilisez la section B pour l'équipement (y compris les véhicules) et la section C pour les bâtiments que vous avez achetés ou améliorés pendant l'année. Leurs totaux alimentent la colonne 3 de la section A, où vous calculez la DPA par catégorie. Les sections D et E servent aux dispositions, et la section F, au terrain, qui ne donne droit à aucune DPA. Remplissez les sections même si vous ne demandez pas de DPA.",
      },
      {
        type: "ul",
        items: [
          "Règle de la demi-année : l'année où vous ajoutez un bien, la DPA est généralement limitée à la moitié de l'ajout net. La plupart des petits outils de la catégorie 12 en sont exemptés.",
          "Catégories : catégorie 8 (20 %) pour le mobilier et l'équipement, catégorie 10 (30 %) pour les véhicules, catégorie 10.1 (30 %) pour les voitures de tourisme dont le coût dépasse le plafond, catégorie 12 (100 %) pour les outils de moins de 500 $, et catégorie 50 (55 %) pour les ordinateurs.",
          "Selon des modifications proposées, les biens de la catégorie 50 acquis après le 15 avril 2024 et prêts à être mis en service avant 2027 donnent droit à une déduction de 100 % la première année.",
          "La passation en charges immédiate pour les particuliers visait les biens prêts à être mis en service avant 2025 : elle ne s'applique donc pas en 2026.",
          "Vous pouvez demander n'importe quel montant, de zéro jusqu'au maximum. Calculez la déduction au prorata si votre exercice compte moins de 365 jours.",
        ],
      },
      { type: "h2", text: "Tableaux A à C : Dépenses relatives aux véhicules à moteur" },
      {
        type: "p",
        text: "Au tableau A, inscrivez les kilomètres parcourus pour l'entreprise et le total des kilomètres, ainsi que les frais de l'année pour le carburant, les intérêts, l'assurance, les permis, les réparations, la location et l'électricité d'un véhicule électrique. Multipliez le total par le rapport entre les kilomètres parcourus pour l'entreprise et le total des kilomètres. Ajoutez ensuite en entier le stationnement d'affaires et l'assurance d'affaires supplémentaire; le résultat va à la ligne 9281. La DPA sur le véhicule passe plutôt par les sections B et A.",
      },
      {
        type: "callout",
        text: "Exemple fictif : 8 000 km pour l'entreprise sur 20 000 km au total, c'est 40 %. Sur 6 000 $ de frais de fonctionnement, 40 % représente 2 400 $. Ajoutez 150 $ de stationnement d'affaires : la ligne 9281 est de 2 550 $.",
      },
      {
        type: "p",
        text: "Le tableau B plafonne les intérêts sur un prêt pour une voiture de tourisme à 350 $ par mois pour les véhicules achetés après 2023. Le tableau C plafonne les frais de location. Pour 2026, le ministère des Finances Canada a porté le plafond de la catégorie 10.1 à 39 000 $ avant taxes pour les véhicules achetés le 1er janvier 2026 ou après. Le plafond des voitures de tourisme zéro émission reste à 61 000 $, celui des frais de location, à 1 100 $ par mois, et celui des intérêts, à 350 $ par mois. Tenez un registre qui indique la date, la destination, le but et le nombre de kilomètres de chaque déplacement, plus les relevés du compteur kilométrique au début et à la fin de l'année.",
      },
      { type: "h2", text: "Erreurs fréquentes" },
      {
        type: "ul",
        items: [
          "Inscrire le loyer, les services publics ou les impôts fonciers de la résidence aux lignes 8910, 9220 ou 9180 plutôt qu'à la partie 7.",
          "Inscrire le coût total des repas plutôt que la partie admissible de 50 %.",
          "Passer en charges un ordinateur ou un bureau à la ligne 8810 au lieu de demander la DPA.",
          "Laisser la TPS/TVH dans les dépenses après l'avoir récupérée sous forme de CTI.",
          "Utiliser les frais de la résidence pour créer une perte, ou oublier de reporter le montant 7O.",
          "Déduire vos propres prélèvements à la ligne 9060.",
          "Déduire des frais de véhicule sans registre.",
        ],
      },
      { type: "h2", text: FR_FAQ_HEADING },
      {
        type: "faq",
        q: "Le formulaire T2125 de 2026 est-il déjà disponible?",
        a: "Pas au 5 octobre 2026. Le formulaire et le guide T4002 les plus récents sur canada.ca sont les éditions 2025.",
      },
      {
        type: "faq",
        q: "Quand dois-je produire mon T2125 de 2026?",
        a: "Il accompagne votre déclaration. Pour les déclarations de 2025, le T4002 fixe au 15 juin 2026 la date de production des travailleurs autonomes, et tout solde dû doit être payé au plus tard le 30 avril. Selon les mêmes règles, ces dates tombent le 30 avril et le 15 juin 2027 pour les déclarations de 2026, mais l'ARC n'avait pas encore publié son calendrier daté de 2026 au moment de la rédaction; vérifiez-les avant de produire votre déclaration.",
      },
      {
        type: "faq",
        q: "Me faut-il un T2125 distinct pour chaque entreprise?",
        a: "Oui. Il vous faut aussi des formulaires distincts si vous avez à la fois un revenu d'entreprise et un revenu de profession libérale.",
      },
      {
        type: "faq",
        q: "Puis-je parfois déduire 100 % d'un repas?",
        a: "Oui, dans certains cas, comme les repas que vous facturez à un client et qui figurent sur la facture, ou un maximum de six événements par année auxquels tous les employés sont invités.",
      },
      {
        type: "faq",
        q: "Qu'advient-il des frais de bureau à domicile que je ne peux pas déduire cette année?",
        a: "Ils sont reportés au montant 7O. Vous pouvez les déduire une année ultérieure où votre revenu d'entreprise est assez élevé, pourvu que vous remplissiez toujours l'une des conditions relatives à l'espace de travail.",
      },
      {
        type: "faq",
        q: "Où va l'amortissement de ma voiture?",
        a: "Ajoutez la voiture à la section B, calculez la DPA à la section A et demandez-la à la ligne 9936. Le tableau A ne couvre que les frais de fonctionnement.",
      },
      {
        type: "sources",
        links: [
          {
            label: "Guide T4002, édition 2025",
            href: `${CANADA_FR}/formulaires-publications/publications/t4002.html`,
          },
          {
            label: "Formulaire T2125, 2025",
            href: `${CANADA_FR}/formulaires-publications/formulaires/t2125.html`,
          },
          {
            label:
              "Ministère des Finances Canada, plafonds de déduction des frais d'automobile pour 2026 (14 janvier 2026)",
            href: "https://www.canada.ca/fr/ministere-finances/nouvelles/2026/01/le-gouvernement-annonce-les-plafonds-de-deduction-des-frais-dautomobile-et-les-taux-des-avantages-relatifs-a-lutilisation-dune-automobile-pour-les-.html",
          },
        ],
        checked: `Pages françaises de canada.ca consultées le 16 novembre 2026; le formulaire T2125 et le guide T4002 les plus récents sont toujours les éditions 2025. ${DISCLAIMER}`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /* self-employed-tax-deductions-canada                                 */
  /* ------------------------------------------------------------------ */
  fr({
    enSlug: "self-employed-tax-deductions-canada",
    title: "Déductions fiscales des travailleurs autonomes au Canada (guide 2026)",
    displayTitle: "Déductions fiscales des travailleurs autonomes au Canada",
    excerpt:
      "Ce qu'un propriétaire unique peut déduire en 2026 : les critères du caractère raisonnable et de la partie entreprise, les lignes de dépenses du T2125, la limite de 50 % pour les repas et les remboursements des clients.",
    category: "Déductions fiscales",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/self-employed-tax-deductions-canada.webp",
      width: 1280,
      height: 720,
      alt: "Bureau en bois vu de haut avec des lunettes de lecture, une tasse de café noir et le coin d'un ordinateur portable",
    },
    tags: [
      "déductions",
      "dépenses d'entreprise",
      "T2125",
      "catégories de dépenses",
      "repas et frais de représentation",
      "frais remboursables",
      "erreurs fiscales",
      "travailleur autonome",
      "ARC",
    ],
    relatedSlugs: ["guide-formulaire-t2125", "regles-recus-arc"],
    body: [
      {
        type: "p",
        text: "Si vous êtes propriétaire unique, vous déclarez les revenus et les dépenses de votre entreprise sur le formulaire T2125, État des résultats des activités d'une entreprise ou d'une profession libérale, que vous produisez avec votre déclaration T1. Chaque dollar de dépense déductible réduit le revenu net d'entreprise sur lequel votre impôt est calculé. Le point de départ de l'ARC tient en une phrase : vous pouvez déduire toute dépense courante raisonnable que vous engagez pour gagner un revenu. La plupart des problèmes viennent des mots de cette phrase; ce guide les examine donc un par un.",
      },
      {
        type: "p",
        text: "Il porte sur l'année d'imposition 2026 : ce que vous pouvez déduire, les critères du caractère raisonnable et de la partie entreprise, où inscrire les principales dépenses sur le formulaire T2125, la limite de 50 % pour les repas et les frais de représentation, ce que vous ne pouvez pas déduire, comment traiter les dépenses qu'un client vous rembourse, et les erreurs qui coûtent le plus souvent de l'argent aux travailleurs autonomes. Chaque règle provient de canada.ca, principalement du guide T4002, et de la Loi de l'impôt sur le revenu (sources à la fin). L'édition la plus récente du guide T4002 est celle de 2025. Les exemples sont fictifs. Pour passer en revue chaque ligne du formulaire, consultez notre guide sur le formulaire T2125.",
      },
      { type: "h2", text: "Ce qu'un propriétaire unique peut déduire" },
      {
        type: "p",
        text: "Selon la règle générale du guide T4002, vous pouvez déduire toute dépense courante raisonnable que vous engagez pour gagner un revenu, pourvu qu'il ne s'agisse pas d'une dépense personnelle. Lue comme une liste de vérification, une dépense doit satisfaire à quatre critères avant d'aller sur le formulaire T2125 :",
      },
      {
        type: "ul",
        items: [
          "But : vous l'avez engagée pour gagner un revenu d'entreprise, et non pour un usage personnel.",
          "Montant : elle est raisonnable dans les circonstances.",
          "Moment : il s'agit d'une dépense courante, et non d'une dépense en capital. Une immobilisation se déduit sur plusieurs années au moyen de la déduction pour amortissement (DPA).",
          "Part : pour tout ce que vous utilisez aussi à des fins personnelles, vous n'inscrivez que la partie entreprise.",
        ],
      },
      {
        type: "p",
        text: "La TPS/TVH suit la même logique. Les dépenses que vous pouvez déduire comprennent la TPS/TVH payée sur celles-ci, moins tout crédit de taxe sur les intrants (CTI) que vous demandez. Si vous n'êtes pas inscrit, la taxe fait simplement partie du coût. Si vous l'êtes, demandez le CTI dans votre déclaration de TPS/TVH et déduisez le coût avant taxes sur le formulaire T2125. Au Québec, la TVQ est administrée par Revenu Québec, et non par l'ARC.",
      },
      {
        type: "p",
        text: "Chaque déduction doit aussi s'appuyer sur un registre. Conservez le reçu ou la facture pendant six ans à partir de la fin de l'année d'imposition à laquelle il se rapporte; notre guide sur les règles de l'ARC concernant les reçus explique ce qu'un reçu doit indiquer.",
      },
      { type: "h2", text: "Le critère du caractère raisonnable" },
      {
        type: "p",
        text: "L'article 67 de la Loi de l'impôt sur le revenu fixe la limite : aucune déduction n'est permise pour une dépense, sauf dans la mesure où elle était raisonnable dans les circonstances. Cette règle s'ajoute à toutes les autres. Une dépense engagée entièrement pour l'entreprise peut quand même être réduite si son montant est disproportionné par rapport aux besoins de l'entreprise.",
      },
      {
        type: "p",
        text: "En pratique, la question est de savoir ce qu'une entreprise comme la vôtre paierait normalement. La règle compte surtout lorsque vous fixez vous-même le prix. Le guide T4002 indique que vous pouvez déduire un salaire versé à votre enfant ou à votre époux ou conjoint de fait seulement si le travail était nécessaire pour gagner un revenu d'entreprise, si le salaire est raisonnable pour le travail accompli et si vous conservez des documents qui prouvent les paiements. La règle sur les repas intègre le critère dans son propre libellé : les 50 % s'appliquent au moindre du montant dépensé et d'un montant raisonnable dans les circonstances.",
      },
      { type: "h2", text: "Le critère de la partie entreprise" },
      {
        type: "p",
        text: "Beaucoup de frais d'un pigiste sont partagés entre l'entreprise et la vie personnelle : un téléphone, Internet à la maison, une voiture, le logement lui-même. Le guide T4002 vous demande de n'inscrire que la partie entreprise de ces dépenses et d'être en mesure de démontrer comment vous l'avez calculée.",
      },
      {
        type: "ul",
        items: [
          "Téléphone et Internet : déduisez la part d'entreprise. Vous ne pouvez pas déduire le tarif mensuel de base de votre ligne téléphonique résidentielle, sauf si cette ligne sert uniquement à l'entreprise.",
          "Véhicule à moteur : vous ne pouvez déduire que la partie des dépenses payées pour gagner un revenu, établie selon la proportion des kilomètres parcourus pour l'entreprise sur le total des kilomètres et appuyée par un registre.",
          "Bureau à domicile : vous pouvez déduire une part des frais du logement seulement si l'espace est votre principal lieu d'affaires, ou si vous l'utilisez uniquement pour gagner un revenu d'entreprise et y rencontrez régulièrement des clients. La part doit être calculée de façon raisonnable, par exemple selon la superficie de l'espace de travail par rapport à celle du logement.",
        ],
      },
      {
        type: "p",
        text: "Exemple fictif : le forfait téléphonique d'une graphiste coûte 900 $ pour l'année. Trois factures mensuelles représentatives montrent qu'environ les deux tiers de l'utilisation sont liés aux clients; elle déduit donc 600 $ à la ligne 9220 et conserve les factures qui appuient cette répartition. Les calculs pour le véhicule et le bureau à domicile ont leurs propres guides : consultez notre guide sur la déduction pour frais de kilométrage et notre guide sur la déduction pour bureau à domicile.",
      },
      { type: "h2", text: "Où inscrire les dépenses sur le formulaire T2125" },
      {
        type: "p",
        text: "Le formulaire T2125 regroupe les dépenses par ligne. Inscrire une dépense à la mauvaise ligne ne change pas votre impôt, mais une classification uniforme et exacte rend votre déclaration plus facile à justifier si l'ARC pose des questions. Voici les lignes qu'un pigiste ou un consultant utilise le plus souvent; notre guide sur le formulaire T2125 couvre le reste du formulaire.",
      },
      {
        type: "table",
        caption:
          "Lignes de dépenses courantes du T2125 et ce qui va à chacune (guide T4002, édition 2025)",
        headers: ["Ligne", "Ce qui y va", "À ne pas inscrire à cette ligne"],
        rows: [
          [
            "8521 Publicité",
            "Frais de publicité et de promotion",
            "Annonces dans des périodiques étrangers au-delà des limites du T4002",
          ],
          [
            "8523 Repas et frais de représentation",
            "Repas et frais de représentation d'affaires, partie admissible seulement",
            "Les 50 % non déductibles",
          ],
          [
            "8690 Assurances",
            "Assurance commerciale sur les bâtiments, la machinerie et l'équipement de l'entreprise",
            "La plupart des primes d'assurance-vie",
          ],
          [
            "8710 Intérêts et frais bancaires",
            "Intérêts sur l'argent emprunté pour l'entreprise, frais du compte d'entreprise",
            "Intérêts sur des prêts personnels",
          ],
          [
            "8760 Taxes d'affaires, droits d'adhésion et licences",
            "Droits de licence annuels, certaines taxes d'affaires, cotisations",
            "Cotisations à des clubs dont le but principal est d'offrir des repas, des loisirs ou des activités sportives",
          ],
          [
            "8810 Frais de bureau",
            "Petits articles comme les stylos, le papier, la papeterie et les timbres",
            "Calculatrices, classeurs et autres immobilisations",
          ],
          [
            "8811 Papeterie et fournitures de bureau",
            "Fournitures que l'entreprise utilise pour fournir ses biens ou ses services",
            "Articles de bureau visés par la ligne 8810",
          ],
          [
            "8860 Honoraires professionnels",
            "Frais comptables, juridiques et autres honoraires de professionnels et de consultants externes",
            "Honoraires liés à l'acquisition d'une immobilisation",
          ],
          [
            "8910 Loyer",
            "Loyer d'un bien utilisé dans l'entreprise",
            "Le loyer de votre logement, qui va aux frais d'utilisation de la résidence",
          ],
          [
            "8960 Réparations et entretien",
            "Main-d'œuvre et matériaux pour des réparations mineures aux biens de l'entreprise",
            "Améliorations, et la valeur de votre propre travail",
          ],
          [
            "9200 Frais de déplacement",
            "Billets, hôtels et repas lors de voyages d'affaires",
            "Les 50 % non déductibles des repas en déplacement",
          ],
          [
            "9220 Services publics",
            "Part d'entreprise du téléphone et d'Internet",
            "Le tarif mensuel de base d'une ligne téléphonique résidentielle",
          ],
          [
            "9270 Autres dépenses",
            "Frais déductibles qu'aucune autre ligne ne vise; décrivez chacun",
            "Tout ce qui a sa propre ligne",
          ],
          [
            "9281 Dépenses relatives aux véhicules à moteur",
            "Part d'entreprise des frais du véhicule, tirée du tableau A",
            "La DPA sur le véhicule, qui va à la ligne 9936",
          ],
          [
            "9936 Déduction pour amortissement (DPA)",
            "DPA sur l'équipement, les ordinateurs, le mobilier et les véhicules",
            "Le coût total d'une immobilisation l'année de l'achat",
          ],
          [
            "9945 Frais d'utilisation de la résidence aux fins de l'entreprise",
            "Part admissible des frais du logement",
            "Tout montant qui créerait ou augmenterait une perte d'entreprise",
          ],
        ],
      },
      {
        type: "p",
        text: "L'équipement que vous utiliserez pendant plus d'un an, comme un ordinateur, un appareil photo ou un bureau, est une immobilisation. Vous ne pouvez pas en déduire le coût total l'année de l'achat; vous demandez plutôt la DPA. Le matériel informatique et les logiciels d'exploitation font généralement partie de la catégorie 50, au taux de 55 %, et l'année où vous acquérez un bien, vous pouvez habituellement demander la DPA sur seulement la moitié de l'ajout net. Les règles temporaires de passation en charges immédiate pour les particuliers visaient les biens acquis après 2021 et prêts à être mis en service avant 2025; elles ne s'appliquent donc pas à l'équipement que vous commencez à utiliser en 2026.",
      },
      { type: "h2", text: "Repas et frais de représentation : la limite de 50 %" },
      {
        type: "p",
        text: "Le montant maximal que vous pouvez déduire pour des aliments, des boissons et des divertissements est de 50 % du moindre du montant engagé et d'un montant raisonnable dans les circonstances. Cette limite s'applique même si le repas était entièrement d'affaires, et elle vise aussi les repas pris en voyage et lors de congrès. Elle ne s'applique pas dans les cas suivants :",
      },
      {
        type: "ul",
        items: [
          "Votre entreprise fournit régulièrement des aliments, des boissons ou des divertissements à des clients contre rémunération, comme un restaurant ou un hôtel.",
          "Vous facturez à votre client les frais de repas et de représentation, et ces frais figurent sur la facture.",
          "Les dépenses visent une fête de bureau ou un événement semblable auquel vous invitez tous vos employés d'un lieu donné, jusqu'à six événements de ce genre par année.",
          "Les dépenses visent un événement de financement au profit d'un organisme de bienfaisance enregistré.",
          "Les repas relèvent des règles visant les employés qui travaillent sur des chantiers éloignés ou dans des camps de travail temporaires.",
        ],
      },
      {
        type: "p",
        text: "Les conducteurs de grand routier ont leur propre taux : les aliments et les boissons consommés pendant une période de déplacement admissible sont déductibles à 80 %.",
      },
      {
        type: "p",
        text: "Exemple fictif : un consultant qui n'est pas inscrit aux fins de la TPS/TVH invite un client potentiel à dîner et paie 84 $, taxes comprises, un montant raisonnable pour la rencontre. Il inscrit 42 $ à la ligne 8523 et note sur le reçu qui était présent et ce dont il a été question. S'il était inscrit aux fins de la TPS/TVH, le CTI sur ce repas serait limité de la même façon; notre guide sur la TPS/TVH explique comment.",
      },
      { type: "h2", text: "Ce que vous ne pouvez pas déduire" },
      {
        type: "p",
        text: "Le guide T4002 et la page de l'ARC sur les dépenses d'entreprise nomment les frais qui ne vont jamais sur le formulaire T2125, peu importe la ligne :",
      },
      {
        type: "ul",
        items: [
          "Les dépenses personnelles et de subsistance, et la partie personnelle de tout ce que vous utilisez à la fois pour l'entreprise et pour vous.",
          "Le coût d'une immobilisation l'année de l'achat. Demandez plutôt la DPA au fil des ans.",
          "Le salaire, le traitement ou les prélèvements que vous vous versez, et la valeur de votre propre travail.",
          "Les dons à des organismes de bienfaisance et les contributions politiques. Les dons de bienfaisance donnent droit à un crédit dans votre déclaration, et non à une déduction comme dépense d'entreprise.",
          "Les intérêts et les pénalités payés sur votre impôt sur le revenu.",
          "La plupart des amendes et pénalités imposées en vertu des lois du Canada ou d'une province.",
          "La plupart des primes d'assurance-vie.",
          "Les cotisations à des clubs, y compris les droits d'adhésion initiaux, si le but principal du club est d'offrir des repas, des loisirs ou des activités sportives.",
          "Les frais d'utilisation de la résidence aux fins de l'entreprise qui dépassent votre revenu net d'entreprise de l'année. Ils ne peuvent pas créer ni augmenter une perte, mais vous pouvez reporter l'excédent.",
        ],
      },
      { type: "h2", text: "Les dépenses remboursées par un client" },
      {
        type: "p",
        text: "Les pigistes paient souvent des frais pour un projet, comme des déplacements, du matériel ou une licence de photo, puis les facturent au client. Aux fins de l'impôt sur le revenu, un remboursement n'est compté qu'une fois. L'alinéa 12(1)x) de la Loi de l'impôt sur le revenu inclut dans votre revenu un montant que vous recevez dans le cadre de l'exploitation d'une entreprise à titre de remboursement d'une dépense, sauf si ce montant a déjà réduit cette dépense. Il reste donc deux façons cohérentes de le déclarer :",
      },
      {
        type: "ul",
        items: [
          "Inclure ce que le client vous a payé dans votre revenu brut et déduire la dépense en entier.",
          "Ou réduire la dépense du montant remboursé et ne déduire que la partie que vous avez assumée vous-même.",
        ],
      },
      {
        type: "p",
        text: "Dans les deux cas, seul l'écart que vous assumez se traduit par une déduction nette. Ce que vous ne pouvez pas faire, c'est déduire la dépense en entier et laisser le remboursement hors de votre revenu. Les repas sont l'exception à connaître : si vous facturez un repas au client et qu'il figure sur la facture, la limite de 50 % ne s'y applique pas.",
      },
      {
        type: "p",
        text: "Pour les inscrits aux fins de la TPS/TVH, l'Info TPS/TVH GI-197, Frais remboursables, de l'ARC repose sur une question : avez-vous engagé la dépense à titre de mandataire de votre client? La plupart des pigistes ne le sont pas. Dans ce cas, le montant que vous facturez constitue une contrepartie supplémentaire pour votre service, et la TPS/TVH s'y applique de la même manière et au même taux qu'au service lui-même. Vous demandez le CTI sur la taxe que vous avez payée; vous facturez donc le coût avant taxes. Si vous avez agi comme mandataire, le remboursement n'est pas une contrepartie pour votre service : vous n'exigez pas de TPS/TVH sur ce montant, vous ne pouvez pas demander le CTI, et un client inscrit peut le demander à votre place.",
      },
      {
        type: "p",
        text: "Exemple fictif : une consultante inscrite en Ontario paie 250 $ plus 32,50 $ de TVH pour une nuit d'hôtel liée au projet d'un client, sans agir comme mandataire de ce client. Elle demande les 32,50 $ comme CTI, facture les 250 $ avec ses honoraires et exige la TVH de 13 % sur ce montant. Aux fins de l'impôt sur le revenu, les 250 $ sont inclus dans le revenu brut et les 250 $ de frais d'hôtel sont déduits à la ligne 9200; l'effet net est donc nul.",
      },
      {
        type: "p",
        text: "En pratique, marquez une dépense remboursable au moment où vous saisissez le reçu : le client, le projet, et si la totalité ou une partie sera facturée. Les frais signalés sur le moment sont facturés; ceux dont on se souvient au moment de facturer sont oubliés.",
      },
      { type: "h2", text: "Erreurs fréquentes, formulées comme des règles" },
      {
        type: "p",
        text: "Voici les erreurs qui mènent le plus souvent à des déductions refusées, à des intérêts ou à de l'argent laissé sur la table. Chacune est formulée comme la règle qui permet de l'éviter.",
      },
      {
        type: "ul",
        items: [
          "Les repas se déduisent à 50 %, pas à 100 %. Ne déduisez le montant total que dans l'une des exceptions énumérées, comme un repas facturé à un client et inscrit sur la facture.",
          "Le kilométrage s'inscrit au fur et à mesure. Chaque entrée du registre indique la date, la destination, le but et le nombre de kilomètres du déplacement d'affaires, avec les relevés du compteur kilométrique au début et à la fin de l'année. Pour l'ARC, un registre exact tenu pour toute l'année est la meilleure preuve; après une année de base complète, un registre de trois mois peut servir d'échantillon si l'utilisation pour l'entreprise reste à 10 % près de celle de l'année de base.",
          "Les acomptes provisionnels se paient lorsque le seuil est atteint. Pour 2026, vous payez des acomptes provisionnels si votre impôt net à payer est supérieur à 3 000 $ (1 800 $ au Québec) en 2026 et en 2025 ou en 2024. Les dates limites sont le 15 mars, le 15 juin, le 15 septembre et le 15 décembre; l'ARC exige des intérêts sur les acomptes provisionnels lorsque les paiements sont en retard ou insuffisants.",
          "Les frais personnels restent hors du formulaire. Une dépense n'est déductible que si elle a été engagée pour gagner un revenu d'entreprise, et une dépense partagée, seulement pour sa partie entreprise.",
          "La TPS/TVH perçue n'est pas un revenu. Sur le formulaire T2125, vous l'incluez dans les ventes brutes au montant 3A et la soustrayez au montant 3B, sauf si vous utilisez la méthode rapide.",
          "Les frais de bureau à domicile s'arrêtent au revenu net d'entreprise. Ils ne peuvent pas créer ni augmenter une perte; reportez l'excédent.",
          "L'inscription à la TPS/TVH commence au seuil, pas au moment de produire la déclaration. Dès que vous dépassez 30 000 $ au cours d'un seul trimestre civil, vous exigez la TPS/TVH sur la vente qui vous a fait dépasser le seuil. Si vous le dépassez sur les quatre trimestres civils consécutifs précédents, vous cessez d'être un petit fournisseur à la fin du mois qui suit le trimestre où vous l'avez dépassé.",
          "Les achats d'immobilisations passent par la DPA. Un ordinateur ou un bureau ne se déduit pas comme frais de bureau.",
          "Une dépense remboursée est comptée une seule fois. Déclarez le remboursement comme revenu ou soustrayez-le de la dépense, mais faites l'un ou l'autre.",
        ],
      },
      {
        type: "callout",
        text: "Dates limites pour les déclarations de 2026 : les travailleurs autonomes produisent leur déclaration au plus tard le 15 juin, et tout solde dû doit être payé au plus tard le 30 avril. Selon les mêmes règles, ces dates tombent le 30 avril et le 15 juin 2027 pour les déclarations de 2026, mais l'ARC n'avait pas encore publié son calendrier daté de 2026 au moment de la rédaction; vérifiez-les avant de produire votre déclaration.",
      },
      { type: "h2", text: FR_FAQ_HEADING },
      {
        type: "faq",
        q: "Puis-je déduire mes abonnements à des logiciels?",
        a: "Oui, si vous les utilisez pour gagner un revenu d'entreprise. Un abonnement est une dépense courante; le formulaire T2125 n'a pas de ligne propre aux logiciels, il va donc habituellement à la ligne 9270, Autres dépenses, avec une description. Un logiciel acheté avec un ordinateur peut plutôt être une immobilisation. Quelle que soit la ligne choisie, utilisez-la de façon constante.",
      },
      {
        type: "faq",
        q: "Ai-je besoin d'un reçu pour chaque dépense?",
        a: "Il vous faut un registre qui appuie chaque dépense que vous déduisez, normalement le reçu ou la facture, et vous le conservez pendant six ans à partir de la fin de l'année d'imposition à laquelle il se rapporte. Un relevé bancaire seul montre que vous avez payé, pas ce que vous avez acheté.",
      },
      {
        type: "faq",
        q: "Puis-je déduire un repas que je prends seul en travaillant?",
        a: "Généralement, non. Un repas ordinaire que vous auriez pris de toute façon est une dépense personnelle. Les repas pris lors d'un voyage d'affaires à l'extérieur de chez vous sont des frais de déplacement, et la limite de 50 % s'y applique.",
      },
      {
        type: "faq",
        q: "Mon client a payé directement mes frais de déplacement. Dois-je déclarer quelque chose?",
        a: "Si le client a payé directement la compagnie aérienne ou l'hôtel, vous n'avez pas engagé la dépense : vous n'avez donc rien à déduire ni de remboursement à déclarer. Les règles sur les remboursements s'appliquent lorsque vous payez d'abord, puis facturez le client.",
      },
      {
        type: "faq",
        q: "Que faire si je découvre une déduction oubliée après avoir produit ma déclaration?",
        a: "Vous pouvez demander à l'ARC de modifier votre déclaration, par exemple au moyen du service « Modifier ma déclaration » dans Mon dossier. Conservez les reçus qui appuient la modification.",
      },
      {
        type: "sources",
        links: [
          { label: "T4002, chapitre 3 : Dépenses", href: `${T4002_FR}/t4002-5.html` },
          {
            label: "T4002, chapitre 2 : Revenus (montants 3A et 3B)",
            href: `${T4002_FR}/t4002-4.html`,
          },
          {
            label: "T4002, chapitre 4 : Déduction pour amortissement",
            href: `${T4002_FR}/t4002-6.html`,
          },
          {
            label: "Dépenses d'entreprise",
            href: `${CANADA_FR}/impot/entreprises/sujets/entreprise-individuelle-societe-personnes/depenses-entreprise.html`,
          },
          {
            label: "Ligne 8523 – Repas et frais de représentation",
            href: `${CANADA_FR}/impot/entreprises/sujets/entreprise-individuelle-societe-personnes/declarer-vos-revenus-depenses-entreprise/comment-remplir-formulaire-t2125/ligne-8523-repas-frais-representation-partie-admissible-seulement.html`,
          },
          {
            label: "Registres pour les véhicules à moteur",
            href: `${CANADA_FR}/impot/entreprises/sujets/entreprise-individuelle-societe-personnes/depenses-entreprise/depenses-relatives-vehicules-a-moteur/registres-vehicules-a-moteur.html`,
          },
          {
            label: "Info TPS/TVH GI-197, Frais remboursables",
            href: `${CANADA_FR}/formulaires-publications/publications/gi-197/frais-remboursables.html`,
          },
          {
            label: "Quand s'inscrire et commencer à facturer la TPS/TVH",
            href: `${CANADA_FR}/impot/entreprises/sujets/tps-tvh-entreprises/quand-inscrire-facture.html`,
          },
          {
            label: "Acomptes provisionnels : qui doit en payer",
            href: `${CANADA_FR}/paiements/paiements-arc/paiements-particuliers/impots-acomptes-provisionnels/qui-paie-acomptes-provisionnels.html`,
          },
          {
            label: "Acomptes provisionnels : dates limites de paiement",
            href: `${CANADA_FR}/paiements/paiements-arc/paiements-particuliers/impots-acomptes-provisionnels/dates-limites.html`,
          },
          {
            label: "Loi de l'impôt sur le revenu, article 12 (alinéa 12(1)x))",
            href: "https://laws-lois.justice.gc.ca/fra/lois/i-3.3/section-12.html",
          },
          {
            label: "Loi de l'impôt sur le revenu, article 67",
            href: "https://laws-lois.justice.gc.ca/fra/lois/i-3.3/section-67.html",
          },
        ],
        checked: `Pages françaises de canada.ca et du Site Web de la législation (Justice) consultées le 16 novembre 2026. Le guide T4002 le plus récent est l'édition 2025. ${DISCLAIMER}`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /* cra-receipt-rules-canada                                            */
  /* ------------------------------------------------------------------ */
  fr({
    enSlug: "cra-receipt-rules-canada",
    title: "Règles de l'ARC sur les reçus : quoi conserver et pendant combien de temps (2026)",
    displayTitle: "Règles de l'ARC sur les reçus : quoi conserver et pendant combien de temps",
    excerpt:
      "Ce que l'ARC exige sur un reçu d'entreprise en 2026, quand une copie numérisée peut remplacer le papier, la règle des six ans et les seuils de 100 $ et de 500 $ des CTI de TPS/TVH.",
    category: "Conformité fiscale",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/cra-receipt-rules-canada.webp",
      width: 1280,
      height: 720,
      alt: "Café au lait dans une tasse noire près d'une sonnette de comptoir en laiton et de reçus piqués sur un pique-notes, sur un comptoir en bois",
    },
    tags: [
      "ARC",
      "reçus",
      "conformité",
      "travailleur autonome",
      "vérification",
      "tenue de registres",
    ],
    relatedSlugs: ["deductions-travailleurs-autonomes-canada", "guide-formulaire-t2125"],
    body: [
      {
        type: "p",
        text: "Si vous êtes travailleur autonome au Canada, l'ARC s'attend à ce que chaque dépense d'entreprise que vous déduisez soit appuyée par un reçu ou une autre pièce justificative, et vous devez généralement la conserver pendant six ans à partir de la fin de la dernière année d'imposition à laquelle elle se rapporte. Pour votre année d'imposition 2026, vos reçus restent donc en votre possession au moins jusqu'à la fin de 2032, et plus longtemps dans les cas décrits plus bas.",
      },
      {
        type: "p",
        text: "Ce guide porte sur l'année d'imposition 2026. Chaque exigence et chaque montant proviennent de canada.ca. Les exemples sont fictifs et présentés comme tels.",
      },
      { type: "h2", text: "Ce que l'ARC accepte comme reçu" },
      {
        type: "p",
        text: "La loi vous oblige à tenir des registres de toutes vos transactions afin de pouvoir justifier vos revenus et les dépenses que vous déduisez. Le guide T4002 recommande de toujours obtenir un reçu ou une autre pièce justificative lorsque vous achetez quelque chose pour votre entreprise, et précise que le reçu doit indiquer :",
      },
      {
        type: "ul",
        items: [
          "La date de l'achat",
          "Le nom et l'adresse du vendeur ou du fournisseur",
          "Le nom et l'adresse de l'acheteur",
          "Une description complète des biens ou des services",
          "Le numéro d'entreprise du vendeur, s'il est inscrit aux fins de la TPS/TVH et que le prix d'achat est de 100 $ ou plus avant taxes",
        ],
      },
      {
        type: "p",
        text: "La notion de « registre » est large. La liste de l'ARC comprend notamment les factures de vente, les reçus d'achat, les bons, les contrats, les bordereaux de dépôt, les relevés bancaires, les chèques encaissés, les reçus de caisse, les relevés de carte de crédit, les carnets de route et les courriels. Tous les registres doivent être fiables et complets, appuyés par des pièces justificatives et tenus en français, en anglais ou dans les deux langues.",
      },
      {
        type: "p",
        text: "Si un reçu est incomplet, corrigez-le sur le moment. S'il n'y a pas de description, comme sur une bande de caisse enregistreuse, le guide T4002 indique d'écrire de quel article il s'agit sur le reçu ou dans vos registres de dépenses. Si un fournisseur refuse de vous remettre un reçu, le T4002 prévient que des transactions peuvent être refusées faute de pièces justificatives adéquates.",
      },
      {
        type: "p",
        text: "Ce qui ne convient pas : une image numérisée dont la résolution, la tonalité ou la couleur masque des détails importants, et des registres conservés à l'extérieur du Canada, sauf si l'ARC l'a autorisé par écrit. Les registres conservés à l'extérieur du Canada et consultés électroniquement à partir du Canada ne sont pas considérés comme étant conservés au Canada.",
      },
      { type: "h2", text: "Copies numérisées et électroniques : faut-il garder l'original?" },
      {
        type: "p",
        text: "L'ARC accepte les registres tenus sur papier puis convertis dans un format électronique accessible et lisible, ainsi que les registres électroniques dès le départ. Les règles diffèrent dans chaque cas :",
      },
      {
        type: "ul",
        items: [
          "Originaux papier : « En général, vous devez conserver les originaux de tous vos documents papier. » Vous pouvez plutôt conserver des images électroniques, mais vous ne pouvez détruire le papier que si l'imagerie respecte la norme nationale CAN/CGSB 72.34, Enregistrements électroniques – Preuve documentaire. Les images deviennent alors le registre permanent.",
          "Si votre imagerie ne respecte pas cette norme, l'ARC indique que vous devez conserver les documents originaux. En cas de doute sur la destruction des documents papier, elle conseille d'obtenir d'abord un avis juridique.",
          "Les originaux électroniques, comme les factures reçues par courriel et les reçus en PDF, doivent être conservés dans un format électronique lisible, même si vous les imprimez aussi.",
          "Toute image doit être une reproduction fidèle destinée à remplacer le document papier, fournir les mêmes renseignements et garder lisibles les détails importants.",
        ],
      },
      {
        type: "p",
        text: "Les registres électroniques doivent demeurer accessibles aux fonctionnaires de l'ARC et lisibles par ses logiciels, y compris après un changement de système. Conservez des copies de sauvegarde, de préférence à un endroit au Canada autre que votre lieu d'affaires. Si des registres électroniques sont perdus, détruits ou endommagés, l'ARC vous demande de l'en informer au 1-800-959-7775 et de les reconstituer dans un délai raisonnable.",
      },
      {
        type: "callout",
        text: "ReceiptOne conserve une photo de chaque reçu, en extrait le commerçant, la date, le total et les montants de taxe de vente, et exporte vos registres en PDF et en CSV. Il ne vérifie pas le numéro d'inscription à la TPS/TVH d'un fournisseur : vérifiez-le vous-même sur les achats de 100 $ ou plus. Notre politique de confidentialité précise que les données peuvent être stockées à l'extérieur du Canada; conservez donc votre copie exportée au Canada.",
      },
      { type: "h2", text: "La règle des six ans et son point de départ" },
      {
        type: "p",
        text: "La règle générale est de six ans à partir de la fin de la dernière année d'imposition à laquelle les registres se rapportent. Pour les particuliers, l'année d'imposition correspond à l'année civile : le délai commence donc le 31 décembre, et non à la date imprimée sur le reçu. Les mêmes règles de conservation s'appliquent en vertu de la Loi sur la taxe d'accise, de sorte que vos registres de TPS/TVH les suivent aussi. Plusieurs situations modifient la période :",
      },
      {
        type: "ul",
        items: [
          "Déclaration produite en retard : conservez les registres pendant six ans à partir de la date où vous produisez cette déclaration.",
          "Opposition ou appel : conservez les registres jusqu'à la plus tardive des dates suivantes : le règlement de l'opposition ou de l'appel, l'expiration du délai pour tout autre appel, ou la fin de la période de six ans.",
          "Acquisitions et dispositions de biens à long terme, et autres historiques qui auraient une incidence sur la vente ou la liquidation de l'entreprise : conservez-les indéfiniment.",
          "Entreprise qui prend fin : une entreprise non constituée en société conserve ses registres pendant six ans à partir de la fin de l'année d'imposition au cours de laquelle elle a pris fin.",
          "Si l'ARC veut que vous conserviez vos registres plus longtemps, un fonctionnaire vous en informera en personne ou par courrier recommandé.",
        ],
      },
      {
        type: "p",
        text: "Exemple fictif : un reçu daté du 10 mars 2026 pour un achat d'entreprise se rapporte à votre année d'imposition 2026. Si la déclaration est produite à temps, il doit être conservé au moins jusqu'au 31 décembre 2032. Si cette même déclaration de 2026 était produite en retard, à une date en 2027, les six ans courraient plutôt à partir de cette date de production. Certains registres se rapportent à plus d'une année, comme le reçu d'un équipement sur lequel vous demandez la déduction pour amortissement (DPA) pendant plusieurs années. Pour ceux-là, le délai court à partir de la dernière année qu'ils appuient.",
      },
      {
        type: "p",
        text: "Pour détruire des registres avant la fin de la période, il vous faut l'autorisation écrite de l'ARC, au moyen du formulaire T137, Demande d'autorisation de détruire des registres, ou d'une lettre à votre bureau des services fiscaux. L'ARC précise que détruire des registres papier ou électroniques sans son autorisation peut entraîner des poursuites.",
      },
      { type: "h2", text: "Ce qui arrive lors d'une vérification si des registres manquent" },
      {
        type: "p",
        text: "Vous devez mettre vos registres à la disposition de l'ARC lorsqu'elle le demande et permettre aux fonctionnaires d'en faire des copies. Le guide T4002 énonce les conséquences de ne pas tenir des registres adéquats :",
      },
      {
        type: "ul",
        items: [
          "Si vous n'avez pas les renseignements nécessaires ni d'autre preuve, l'ARC peut établir votre revenu à l'aide d'autres méthodes.",
          "L'ARC peut refuser des dépenses que vous avez déduites si vous ne pouvez pas les justifier.",
          "Des pénalités s'appliquent si vous ne tenez pas de registres adéquats, si vous ne donnez pas accès à vos registres à l'ARC et si vous ne fournissez pas de renseignements aux fonctionnaires de l'ARC lorsqu'ils le demandent.",
        ],
      },
      {
        type: "p",
        text: "Les pages de l'ARC sur la tenue de registres vont dans le même sens. Si les vérificateurs ne peuvent pas établir votre revenu ou vos recettes taxables à partir de vos registres, ils doivent recourir à d'autres méthodes, ce qui vous coûte du temps. Si vos registres n'appuient pas vos demandes, celles-ci pourraient être refusées. Si vos registres ont été détruits par suite d'une catastrophe, l'ARC a une page de soutien distincte pour les contribuables touchés.",
      },
      { type: "h2", text: "Crédits de taxe sur les intrants (CTI) de TPS/TVH : pièces et seuils" },
      {
        type: "p",
        text: "Si vous êtes inscrit aux fins de la TPS/TVH, le reçu joue un deuxième rôle : il appuie le crédit de taxe sur les intrants (CTI) que vous demandez à la ligne 106 de votre déclaration. Parmi les conditions d'admissibilité de l'ARC, vous devez obtenir « des preuves documentaires suffisantes pour appuyer le CTI avant d'en faire la demande ». Vous conservez les pièces plutôt que de les envoyer, et ce qu'elles doivent indiquer dépend du total de la vente :",
      },
      {
        type: "ul",
        items: [
          "Moins de 100 $ : le nom ou le nom commercial du fournisseur (ou de l'intermédiaire), la date de la facture (ou, à défaut de facture, la date à laquelle la TPS/TVH a été payée ou est devenue payable) et le montant total payé ou payable.",
          "De 100 $ à 499,99 $ : tout ce qui précède, plus la TPS/TVH exigée (ou une mention que le prix comprend la taxe au taux applicable), le statut de chaque fourniture si des articles taxables et exonérés sont combinés, et le numéro d'inscription à la TPS/TVH du fournisseur ou de l'intermédiaire.",
          "500 $ ou plus : tout ce qui précède, plus le nom ou le nom commercial de l'acheteur (ou de son mandataire autorisé), une brève description des biens ou des services et les modalités de paiement.",
        ],
      },
      {
        type: "p",
        text: "Ces seuils de 100 $ et de 500 $ ont remplacé les anciens seuils de 30 $ et de 150 $ le 20 avril 2021. Le guide RC4022 (rév. 25) les présente comme étant en vigueur. Exemple fictif : un achat de fournitures de bureau de 60 $ n'exige que le nom du vendeur, la date et le total. Une commande de 240 $ exige en plus le montant de TPS/TVH et le numéro d'inscription du vendeur. Une facture de 1 130 $ pour un ordinateur portable doit aussi indiquer votre nom ou votre nom commercial, décrire l'ordinateur et préciser les modalités de paiement.",
      },
      {
        type: "p",
        text: "Un numéro d'inscription sur un reçu vaut la peine d'être vérifié. Le registre de la TPS/TVH, un service gratuit de l'ARC, confirme si l'entreprise qui vous facture la TPS/TVH est inscrite. Vous entrez les neuf premiers chiffres du numéro (sans les lettres), le nom du fournisseur tel qu'il figure sur le reçu et la date de la transaction, puis vous imprimez l'écran des détails de la recherche pour vos dossiers. Si un fournisseur refuse de vous donner son numéro, la ligne de renseignements aux entreprises de l'ARC (1-800-959-5525) peut confirmer s'il est inscrit. Au Québec, la TVQ est administrée par Revenu Québec, et c'est vers Revenu Québec que l'ARC vous dirige pour confirmer un numéro de TVQ.",
      },
      {
        type: "p",
        text: "Le moment compte aussi. Pour la plupart des inscrits, un CTI doit être demandé au plus tard à la date limite de production de la déclaration visant la dernière période de déclaration qui se termine dans les quatre ans suivant la période où il aurait pu être demandé pour la première fois. Les pièces doivent être en main avant la demande.",
      },
      { type: "h2", text: FR_FAQ_HEADING },
      {
        type: "faq",
        q: "Un relevé de carte de crédit ou un relevé bancaire suffit-il à lui seul?",
        a: "Les relevés bancaires et les relevés de compte figurent dans la liste des registres de l'ARC, mais un relevé n'indique ni ce que vous avez acheté, ni qui était l'acheteur, ni le montant de TPS/TVH exigé. Le T4002 demande ces renseignements sur les reçus, et le tableau des CTI les exige à partir de 100 $. Conservez aussi le reçu ou la facture.",
      },
      {
        type: "faq",
        q: "Puis-je jeter mes reçus papier une fois que je les ai photographiés?",
        a: "Seulement si votre imagerie respecte la norme CAN/CGSB 72.34. Les images deviennent alors les registres permanents. Sinon, l'ARC indique de conserver les originaux papier et d'obtenir un avis juridique en cas de doute.",
      },
      {
        type: "faq",
        q: "Quand puis-je déchiqueter mes reçus d'entreprise de 2020?",
        a: "Six ans après la fin de 2020, c'est le 31 décembre 2026. Après cette date, vous pouvez généralement vous en départir si votre déclaration de 2020 a été produite à temps, ne fait pas l'objet d'une opposition ou d'un appel, et si les reçus n'appuient pas une année ultérieure, comme dans le cas d'une immobilisation.",
      },
      {
        type: "faq",
        q: "Dois-je envoyer mes reçus avec ma déclaration de revenus?",
        a: "Non. Le T4002 indique de ne pas envoyer vos registres avec votre déclaration de revenus, mais de les conserver au cas où l'ARC demanderait à les voir. De même, les inscrits aux fins de la TPS/TVH ne joignent pas leurs pièces justificatives de CTI à leur déclaration.",
      },
      {
        type: "faq",
        q: "Puis-je conserver mes registres dans un service infonuagique?",
        a: "L'ARC exige que les registres soient conservés à votre lieu d'affaires ou à votre résidence au Canada, sauf si elle vous autorise par écrit à faire autrement. Les registres conservés à l'extérieur du Canada et consultés électroniquement à partir du Canada ne sont pas considérés comme étant conservés au Canada. Renseignez-vous sur l'endroit où votre fournisseur stocke les données, et conservez une copie au Canada.",
      },
      {
        type: "faq",
        q: "Que faire si mes reçus ont été perdus dans un incendie ou une inondation?",
        a: "Pour des registres électroniques perdus ou endommagés, l'ARC vous demande de l'en informer au 1-800-959-7775 et de les reconstituer dans un délai raisonnable. En cas de catastrophe, elle renvoie à sa page sur le soutien offert aux personnes touchées.",
      },
      {
        type: "sources",
        links: [
          {
            label: "T4002, chapitre 1 : Renseignements généraux",
            href: `${T4002_FR}/t4002-3.html`,
          },
          { label: "Tenue de registres comptables", href: `${RECORDS_FR}.html` },
          {
            label:
              "Qu'entend-on par « registres comptables », qui doit en tenir et pourquoi c'est important",
            href: `${RECORDS_FR}/entend-on-registres-comptables-doit-tenir.html`,
          },
          {
            label:
              "Vos responsabilités et les exigences liées aux registres que vous devez tenir selon la loi",
            href: `${RECORDS_FR}/vos-responsabilites-exigences-liees-registres-vous-devez-tenir-selon-loi.html`,
          },
          {
            label:
              "Supports acceptés, imagerie de document papier et copies de sauvegarde de fichiers électroniques",
            href: `${RECORDS_FR}/supports-acceptes-imagerie-document-papier-copies-sauvegarde-fichiers-electroniques.html`,
          },
          {
            label:
              "Où conserver vos registres, pendant combien de temps et comment obtenir la permission de les détruire",
            href: `${RECORDS_FR}/conserver-vos-registres-pendant-combien-temps-comment-obtenir-permission-detruire-avant-fin-delai-conservation.html`,
          },
          {
            label: "T137, Demande d'autorisation de détruire des registres",
            href: `${CANADA_FR}/formulaires-publications/formulaires/t137.html`,
          },
          {
            label: "Crédits de taxe sur les intrants pour la TPS/TVH",
            href: `${CANADA_FR}/impot/entreprises/sujets/tps-tvh-entreprises/calculer-preparer-declarer/credits-taxe-intrants.html`,
          },
          {
            label: "RC4022, Renseignements généraux sur la TPS/TVH pour les inscrits",
            href: `${CANADA_FR}/formulaires-publications/publications/rc4022.html`,
          },
          {
            label: "Confirmation d'un numéro de compte de TPS/TVH",
            href: `${CANADA_FR}/services-electroniques/services-numeriques-entreprises/confirmation-numero-compte-tps-tvh.html`,
          },
        ],
        checked: `Pages françaises de canada.ca consultées le 16 novembre 2026. ${DISCLAIMER}`,
      },
    ],
  }),
  /* ------------------------------------------------------------------ */
  /* track-gst-hst-business-expenses                                     */
  /* ------------------------------------------------------------------ */
  fr({
    enSlug: "track-gst-hst-business-expenses",
    title: "TPS/TVH pour les travailleurs autonomes au Canada (guide 2026)",
    displayTitle: "TPS/TVH pour les travailleurs autonomes au Canada",
    excerpt:
      "Quand s'inscrire à la TPS/TVH, quel taux exiger, les crédits de taxe sur les intrants et les seuils des reçus, la TVP et la TVQ, la méthode rapide et les dates limites de 2026.",
    category: "TPS/TVH",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/track-gst-hst-business-expenses.webp",
      width: 1280,
      height: 720,
      alt: "Pile de pièces canadiennes en argent ornées d'une feuille d'érable",
    },
    tags: [
      "TPS",
      "TVH",
      "TVP",
      "TVQ",
      "crédits de taxe sur les intrants",
      "CTI",
      "méthode rapide",
      "inscription à la TPS/TVH",
      "travailleur autonome",
    ],
    relatedSlugs: [
      "taxes-de-vente-par-province-travailleurs-autonomes",
      "regles-recus-arc",
      "guide-formulaire-t2125",
    ],
    body: [
      {
        type: "p",
        text: "La TPS/TVH touche une entreprise autonome dans deux sens. Une fois inscrit, vous l'exigez sur vos ventes et la versez à l'ARC, et vous récupérez la TPS/TVH payée sur vos achats d'entreprise en demandant des crédits de taxe sur les intrants (CTI). Pour bien faire les choses, quatre points comptent : savoir quand l'inscription commence, exiger le taux du lieu où la vente est effectuée, conserver des reçus qui respectent les seuils de documentation de l'ARC, et produire vos déclarations à temps.",
      },
      {
        type: "p",
        text: "Ce guide s'adresse aux propriétaires uniques. Chaque règle provient de canada.ca, principalement du guide RC4022, et les règles de la TVQ, de Revenu Québec (sources à la fin). Les exemples sont fictifs.",
      },
      { type: "h2", text: "Quand vous devez vous inscrire : le critère du petit fournisseur" },
      {
        type: "p",
        text: "Vous n'avez pas à vous inscrire tant que vous êtes un petit fournisseur. Pour un propriétaire unique, cela signifie que vos revenus tirés de fournitures taxables effectuées dans le monde entier, provenant de toutes vos entreprises et de celles de vos associés, sont de 30 000 $ ou moins au cours d'un seul trimestre civil et au cours des quatre derniers trimestres civils consécutifs. Il s'agit des revenus avant dépenses, et ils comprennent les fournitures détaxées, comme la plupart des exportations. Ils excluent les services financiers, les ventes d'immobilisations et l'achalandage provenant de la vente d'une entreprise. Les trimestres civils commencent le 1er janvier, le 1er avril, le 1er juillet et le 1er octobre.",
      },
      {
        type: "p",
        text: "Dépasser 30 000 $ selon l'un ou l'autre critère met fin au statut de petit fournisseur, mais les deux critères font commencer l'inscription à des moments différents :",
      },
      {
        type: "ul",
        items: [
          "Plus de 30 000 $ au cours d'un seul trimestre civil : vous cessez immédiatement d'être un petit fournisseur. La date d'entrée en vigueur de votre inscription est au plus tard le jour de la vente qui vous a fait dépasser le seuil, et vous exigez la TPS/TVH sur cette vente.",
          "Plus de 30 000 $ sur quatre trimestres consécutifs, mais dans aucun trimestre pris isolément : vous restez un petit fournisseur jusqu'à la fin du mois qui suit le trimestre où vous avez dépassé le seuil. La date d'entrée en vigueur est au plus tard le jour de votre première vente après ce moment, et vous exigez la TPS/TVH à partir de là.",
          "Dans les deux cas, vous avez 29 jours à compter de la date d'entrée en vigueur pour vous inscrire.",
        ],
      },
      {
        type: "p",
        text: "Dans les exemples de l'ARC, un consultant dont le troisième trimestre a atteint 38 000 $ s'est inscrit à compter de la vente qui lui a fait dépasser 30 000 $, et a exigé la taxe sur cette vente. Un vendeur dont les quatre trimestres se terminant le 31 mars totalisaient 32 000 $, sans qu'aucun ne dépasse le seuil à lui seul, a cessé d'être un petit fournisseur le 30 avril et a commencé à exiger la taxe sur sa vente suivante, le 2 mai.",
      },
      {
        type: "p",
        text: "Les chauffeurs de taxi et de covoiturage commercial doivent s'inscrire même s'ils sont de petits fournisseurs.",
      },
      { type: "h2", text: "S'inscrire volontairement" },
      {
        type: "p",
        text: "Un petit fournisseur peut s'inscrire volontairement s'il effectue des ventes taxables au Canada; en général, vous ne pouvez pas vous inscrire si vous n'effectuez que des fournitures exonérées. La date d'entrée en vigueur est habituellement le jour où vous demandez votre compte de TPS/TVH, et elle peut remonter jusqu'à 30 jours avant cette date. Une fois inscrit, vous devez exiger, percevoir et verser la TPS/TVH sur vos fournitures taxables, produire une déclaration pour chaque période de déclaration et rester inscrit pendant au moins un an avant de pouvoir annuler votre inscription, sauf si vous cessez vos activités commerciales.",
      },
      {
        type: "p",
        text: "En contrepartie, vous pouvez demander des CTI. À titre de nouvel inscrit, vous pourriez aussi demander des CTI pour la TPS/TVH payée sur les biens que vous avez en main le jour de votre inscription, comme de l'équipement. Le compromis dépend de vos clients : les entreprises inscrites récupèrent la TPS/TVH que vous leur exigez, mais pas les consommateurs; pour eux, votre prix augmente du montant de la taxe.",
      },
      { type: "h2", text: "Exiger le bon taux selon la province" },
      {
        type: "p",
        text: "Le taux dépend du lieu où la vente est effectuée, et non de l'endroit où vous habitez. Pour la plupart des services, la règle générale du guide RC4022 est que la fourniture est effectuée dans la province de l'adresse domiciliaire ou d'affaires du client que vous obtenez dans le cours normal de vos activités. L'exemple du RC4022 : un cabinet comptable de Calgary dont la seule adresse pour son client se trouve à London, en Ontario, exige la TVH de 13 %, et non la TPS de 5 %. Les services personnels, les services liés à des immeubles et certains autres services ont leurs propres règles.",
      },
      {
        type: "table",
        caption:
          "Taux tirés de la page des taux de l'ARC. Le taux de 14 % de la Nouvelle-Écosse s'applique depuis le 1er avril 2025.",
        headers: ["Province ou territoire", "TPS/TVH à exiger", "Taxe provinciale distincte"],
        rows: [
          ["Ontario", "TVH de 13 %", "Aucune"],
          ["Nouvelle-Écosse", "TVH de 14 %", "Aucune"],
          [
            "Nouveau-Brunswick, Terre-Neuve-et-Labrador, Île-du-Prince-Édouard",
            "TVH de 15 %",
            "Aucune",
          ],
          ["Alberta, Territoires du Nord-Ouest, Nunavut, Yukon", "TPS de 5 %", "Aucune"],
          ["Colombie-Britannique", "TPS de 5 %", "TVP de 7 %"],
          ["Manitoba", "TPS de 5 %", "TVD de 7 %"],
          ["Saskatchewan", "TPS de 5 %", "TVP de 6 %"],
          ["Québec", "TPS de 5 %", "TVQ de 9,975 %"],
        ],
      },
      {
        type: "p",
        text: "Lorsque la TPS et une taxe provinciale s'appliquent toutes deux, la TPS est calculée sur le prix avant la taxe provinciale. Les services que vous rendez entièrement à l'extérieur du Canada ne sont généralement pas assujettis à la TPS/TVH, et certains services de consultation, de conseil ou professionnels fournis à un non-résident sont détaxés : taxables au taux de 0 %, de sorte que vous n'exigez rien, mais pouvez quand même demander des CTI sur les coûts engagés pour les fournir.",
      },
      {
        type: "p",
        text: "La Colombie-Britannique, la Saskatchewan, le Manitoba et le Québec ont chacun leurs propres règles d'inscription et de perception de la taxe provinciale.",
        link: {
          label: "Lisez notre guide sur les taxes de vente par province.",
          href: frArticle("sales-tax-by-province-self-employed-canada"),
        },
      },
      { type: "h2", text: "Crédits de taxe sur les intrants : ce que vous pouvez demander" },
      {
        type: "p",
        text: "Un CTI permet de récupérer la TPS/TVH payée ou payable sur les achats que vous utilisez dans le cadre de vos activités commerciales. Vous ne pouvez le demander que dans la mesure où l'achat sert à ces activités, et il doit être raisonnable quant à sa qualité, sa nature et son coût pour votre entreprise. Si 90 % ou plus d'une dépense d'exploitation sert à des fins commerciales, vous demandez 100 % de la taxe payée sur celle-ci. Si une dépense est partagée, la part de l'entreprise doit résulter d'une répartition juste et raisonnable appliquée de façon constante toute l'année. Si vos CTI d'une période dépassent la TPS/TVH que vous avez perçue, l'ARC vous rembourse la différence.",
      },
      { type: "p", text: "Vous ne pouvez pas demander de CTI pour :" },
      {
        type: "ul",
        items: [
          "Les achats à des fins personnelles, ou la part personnelle d'une dépense à usage mixte",
          "Les achats utilisés pour effectuer des fournitures exonérées",
          "Les droits d'adhésion ou cotisations à un club dont le but principal est d'offrir des loisirs, des repas ou des activités sportives, comme un centre de conditionnement physique ou un club de golf",
          "Certaines immobilisations (le RC4022 prévoit des règles distinctes pour les immobilisations)",
          "Les achats exonérés et détaxés, parce qu'aucune TPS/TVH n'a été exigée",
          "Les taxes de vente provinciales : la TVP et la TVD ne font jamais partie d'un CTI",
          "La TPS/TVH exigée par un fournisseur inscrit uniquement sous le régime simplifié visant les entreprises de l'économie numérique. Donnez votre numéro de TPS/TVH à ces fournisseurs pour qu'ils ne l'exigent pas.",
        ],
      },
      {
        type: "p",
        text: "Vous demandez normalement un CTI dans la déclaration de la période où vous avez fait l'achat, mais vous pouvez le faire plus tard. Pour la plupart des inscrits, la date limite est la date d'échéance de la déclaration visant la dernière période de déclaration qui se termine dans les quatre ans suivant la période où le CTI aurait pu être demandé pour la première fois.",
      },
      { type: "h2", text: "Ce qu'un reçu doit indiquer : les seuils de 100 $ et de 500 $" },
      {
        type: "p",
        text: "Vous devez avoir des preuves documentaires suffisantes avant de demander un CTI, et ce qui est exigé dépend du total de la vente. Ces seuils ont remplacé les anciens seuils de 30 $ et de 150 $ le 20 avril 2021 :",
      },
      {
        type: "ul",
        items: [
          "Moins de 100 $ : le nom ou le nom commercial du fournisseur (ou de l'intermédiaire), la date de la facture (ou la date à laquelle la TPS/TVH a été payée ou est devenue payable) et le montant total payé ou payable.",
          "De 100 $ à 499,99 $ : tout ce qui précède, plus la TPS/TVH exigée (ou une mention que le prix la comprend au taux applicable), le statut de chaque fourniture si des articles taxables et exonérés sont combinés, et le numéro d'inscription à la TPS/TVH du fournisseur ou de l'intermédiaire.",
          "500 $ ou plus : tout ce qui précède, plus votre nom ou votre nom commercial (ou celui de votre mandataire autorisé), une brève description des biens ou des services et les modalités de paiement.",
        ],
      },
      {
        type: "p",
        text: "Exemple fictif : une imprimante de 240 $ achetée chez un détaillant ontarien n'appuie un CTI que si le reçu indique la TVH (ou précise qu'elle est comprise) et le numéro d'inscription du détaillant. Vous pouvez vérifier un numéro dans le registre de la TPS/TVH de l'ARC, un service gratuit, avant de faire votre demande, et demander un reçu corrigé pendant que l'achat est récent.",
      },
      { type: "h2", text: "Repas et frais de représentation : la restriction de 50 %" },
      {
        type: "p",
        text: "Le CTI suit la limite de l'impôt sur le revenu. Lorsque votre déduction pour les repas et les frais de représentation est limitée à 50 % du coût, vous pouvez demander 50 % de la TPS/TVH payée sur ceux-ci comme CTI. Le RC4022 prévoit deux façons de procéder : demander 50 % de la taxe réelle pour chaque période de déclaration, sans rajustement en fin d'exercice, ou demander 100 % pendant l'année et rajouter l'excédent par la suite. Les déclarants annuels font ce rajustement dans la déclaration de la même année; les déclarants mensuels et trimestriels, dans la première déclaration de l'exercice suivant.",
      },
      { type: "h2", text: "Comment les CTI réduisent vos dépenses au T2125" },
      {
        type: "p",
        text: "Vous ne pouvez pas récupérer la même taxe deux fois. Le guide T4002 indique que lorsque vous demandez la TPS/TVH comme CTI, vous réduisez la dépense d'entreprise inscrite sur le formulaire T2125 du montant du crédit, au moment où la taxe a été payée ou est devenue payable, selon la première de ces dates, et vous inscrivez le montant net. Un CTI sur un bien amortissable réduit son coût en capital aux fins de la déduction pour amortissement. Si vous n'êtes pas inscrit, la TPS/TVH que vous payez fait simplement partie de chaque dépense.",
      },
      {
        type: "callout",
        text: "Exemple fictif, Ontario (TVH de 13 %) : un pigiste inscrit achète un logiciel de 1 000 $ plus 130 $ de TVH. Il demande un CTI de 130 $ et déduit 1 000 $ au T2125. Un pigiste non inscrit déduit 1 130 $ et ne récupère rien. Pour un dîner d'affaires de 200 $ plus 26 $ de TVH, le pigiste inscrit demande un CTI de 13 $ (50 % de la taxe), ce qui laisse un coût de 213 $, dont 50 %, soit 106,50 $, est déductible.",
      },
      { type: "h2", text: "La TVP : une affaire provinciale" },
      {
        type: "p",
        text: "La Colombie-Britannique (TVP de 7 %), le Manitoba (TVD de 7 %) et la Saskatchewan (TVP de 6 %) appliquent leurs propres taxes de vente en plus de la TPS de 5 %. L'ARC ne les administre pas : l'obligation de vous inscrire pour percevoir une taxe de vente provinciale, et ce à quoi elle s'applique, relèvent de chaque province, et le RC4022 vous invite à communiquer avec le bureau de la taxe de vente de votre province. L'Ontario et les provinces de l'Atlantique n'ont pas de TVP distincte, parce qu'elle est intégrée à la TVH.",
      },
      {
        type: "p",
        text: "Du côté des coûts, la TVP que vous payez sur vos achats d'entreprise ne se récupère pas au moyen d'un CTI dans votre déclaration de TPS/TVH; elle reste donc incluse dans la dépense que vous déduisez au T2125. Inscrivez la TPS/TVH et la TVP comme des montants distincts pour chaque reçu. Un seul montant de taxe combiné empêche de demander le bon CTI.",
      },
      { type: "h2", text: "La TVQ : le régime propre à Revenu Québec" },
      {
        type: "p",
        text: "La taxe de vente du Québec est administrée par Revenu Québec, et non par l'ARC, et si votre entreprise est physiquement située au Québec, Revenu Québec administre généralement aussi votre TPS/TVH : vous produisez donc vos déclarations auprès de Revenu Québec, sur ses formulaires. Selon Revenu Québec :",
      },
      {
        type: "ul",
        items: [
          "En règle générale, vous devez vous inscrire aux fichiers de la TPS et de la TVQ si vous exercez des activités commerciales au Québec et que vos fournitures taxables mondiales, avec celles de vos associés, dépassent 30 000 $ au cours d'un trimestre civil ou des quatre trimestres civils précédents. Le moment où le statut de petit fournisseur prend fin suit le critère fédéral.",
          "Une entreprise qui exerce des activités commerciales au Québec et s'inscrit au fichier de la TVQ doit aussi s'inscrire au fichier de la TPS/TVH, et rester inscrite pendant au moins un an.",
          "Les entreprises de taxi doivent s'inscrire aux deux, quel que soit leur revenu.",
          "Le taux de la TVQ est de 9,975 %, calculé sur le prix de vente, et non sur le prix majoré de la TPS. Ensemble, les deux taxes totalisent 14,975 %.",
          "Les inscrits récupèrent la TVQ payée sur leurs intrants d'entreprise en demandant des remboursements de la taxe sur les intrants (RTI), l'équivalent québécois des CTI, avec des exclusions semblables, comme les achats à des fins personnelles.",
          "Vous ne pouvez pas demander de RTI pour la TVQ payée à un fournisseur hors Québec inscrit selon le régime particulier (un numéro contenant les lettres NR). Donnez-lui votre numéro de TVQ, qui commence par les lettres TQ, avant la vente pour qu'il ne l'exige pas.",
        ],
      },
      { type: "h2", text: "La méthode rapide" },
      {
        type: "p",
        text: "La méthode rapide de comptabilité est une façon facultative de calculer le montant à verser. Vous exigez toujours la TPS/TVH au taux normal, mais au lieu de suivre la taxe sur chaque dépense, vous versez un pourcentage fixe de vos ventes, TPS/TVH comprise. En échange, vous renoncez aux CTI sur les dépenses d'exploitation; vous pouvez toutefois en demander sur les immobilisations, comme les ordinateurs et les véhicules. Vous obtenez aussi un crédit de 1 % sur la première tranche de 30 000 $ de ventes admissibles, TPS/TVH comprise, de chaque exercice.",
      },
      {
        type: "ul",
        items: [
          "Admissibilité : des fournitures taxables mondiales annuelles, y compris la TPS/TVH et celles de vos associés, de 400 000 $ ou moins, et un établissement stable au Canada.",
          "Exclusions : les personnes qui offrent des services de tenue de livres, de conseils financiers, de conseils fiscaux ou de préparation de déclarations de revenus, ainsi que les professionnels du droit, de la comptabilité ou de l'actuariat.",
          "Taux pour les entreprises de services selon l'emplacement de votre établissement stable : 3,6 % si votre établissement et la vente se trouvent tous deux dans une province où la TPS de 5 % s'applique; 8,8 % s'ils se trouvent tous deux en Ontario; 9,4 % pour la Nouvelle-Écosse; 10,0 % pour une province où la TVH de 15 % s'applique. Les autres combinaisons ont leurs propres taux dans le guide RC4058.",
          "Comment faire le choix : dans Mon dossier d'entreprise ou au moyen du formulaire GST74. Les déclarants annuels doivent faire ce choix au plus tard le premier jour de leur deuxième trimestre d'exercice.",
        ],
      },
      {
        type: "callout",
        text: "Exemple fictif : un graphiste de l'Alberta facture 50 000 $ plus 2 500 $ de TPS et paie 400 $ de TPS sur ses dépenses d'exploitation. Méthode ordinaire : 2 500 $ − 400 $ = 2 100 $ versés. Méthode rapide : 52 500 $ × 3,6 % = 1 890 $, moins le crédit de 1 % sur 30 000 $ (300 $), soit 1 590 $. Avant l'impôt sur le revenu, la méthode rapide est avantageuse pour ce graphiste, sauf si ses CTI sur les dépenses d'exploitation dépassent 910 $. Selon le T4002, la TPS/TVH perçue moins le montant calculé selon la méthode rapide est ajoutée au revenu sur le formulaire T2125.",
      },
      { type: "h2", text: "Dates limites de production et de paiement" },
      {
        type: "p",
        text: "L'ARC vous attribue une période de déclaration selon vos revenus annuels provenant de fournitures taxables : 1 500 000 $ ou moins, période annuelle; plus de 1 500 000 $ jusqu'à 6 000 000 $, période trimestrielle; au-delà, période mensuelle. Vous pouvez choisir de produire vos déclarations plus souvent.",
      },
      {
        type: "ul",
        items: [
          "Les déclarants mensuels et trimestriels produisent leur déclaration et paient un mois après la fin de chaque période.",
          "La plupart des déclarants annuels produisent leur déclaration et paient trois mois après la fin de leur exercice.",
          "Un propriétaire unique dont l'exercice se termine le 31 décembre et qui a un revenu d'entreprise pour l'année paie au plus tard le 30 avril et produit sa déclaration au plus tard le 15 juin. Selon les mêmes règles, les dates pour 2026 tombent le 30 avril et le 15 juin 2027, mais l'ARC n'avait pas encore publié son calendrier daté de 2026 au moment de la rédaction; vérifiez-les avant de produire votre déclaration.",
          "Si votre taxe nette était de 3 000 $ ou plus à la fois pour l'exercice précédent et pour l'exercice en cours, un déclarant annuel verse des acomptes provisionnels trimestriels, chacun dû un mois après la fin d'un trimestre d'exercice.",
          "Produisez une déclaration pour chaque période, y compris une « déclaration nulle » lorsque vous n'avez rien à déclarer.",
          "Les déclarations visant des périodes se terminant en 2024 ou après doivent être produites par voie électronique, sauf par les organismes de bienfaisance et certaines institutions financières désignées particulières; une déclaration papier entraîne une pénalité.",
        ],
      },
      { type: "h2", text: "Ce qu'il faut conserver" },
      {
        type: "ul",
        items: [
          "Chaque facture de vente que vous avez émise, indiquant la TPS/TVH exigée",
          "Chaque reçu ou facture d'achat, conforme au seuil de documentation applicable à son montant",
          "La TPS/TVH, la TVP et la TVQ inscrites comme montants distincts pour chaque dépense",
          "Vos déclarations produites, la confirmation de votre inscription et tout choix d'utiliser la méthode rapide",
        ],
      },
      {
        type: "p",
        text: "Conservez vos registres de TPS/TVH pendant six ans à partir de la fin de l'année à laquelle ils se rapportent. L'ARC peut vous demander de les conserver plus longtemps, et il vous faut son autorisation écrite pour les détruire plus tôt.",
      },
      {
        type: "callout",
        text: "ReceiptOne lit les montants de TPS/TVH et de TVP sur chaque reçu que vous numérisez et les conserve dans des champs distincts, la TVP étant marquée comme non remboursable, de sorte que la taxe que vous pouvez demander comme CTI ne se mêle jamais à celle que vous ne pouvez pas demander. Comparez ce qu'il a lu avec le reçu, et conservez l'original jusqu'à la fin des six ans.",
      },
      { type: "h2", text: FR_FAQ_HEADING },
      {
        type: "faq",
        q: "Les ventes à des clients à l'étranger comptent-elles dans le seuil de 30 000 $?",
        a: "Oui. Le critère du petit fournisseur tient compte des revenus tirés de fournitures taxables effectuées dans le monde entier, y compris les fournitures détaxées comme la plupart des services exportés. Un pigiste dont les clients sont surtout étrangers peut donc devoir s'inscrire même s'il exige peu ou pas de TPS/TVH.",
      },
      {
        type: "faq",
        q: "Devrais-je m'inscrire volontairement avant d'atteindre 30 000 $?",
        a: "Cela peut être avantageux si vous avez des dépenses d'entreprise importantes ou surtout des clients d'affaires inscrits, puisque vous récupérez la TPS/TVH au moyen des CTI et que vos clients récupèrent celle que vous leur exigez. Si vos clients sont des consommateurs, votre prix augmente pour eux du montant de la taxe. L'inscription volontaire signifie aussi produire des déclarations et rester inscrit pendant au moins un an.",
      },
      {
        type: "faq",
        q: "J'habite en Alberta. Dois-je exiger la TVH à un client de l'Ontario?",
        a: "En général, oui. Pour la plupart des services, la vente est effectuée dans la province de l'adresse du client que vous obtenez dans le cours normal de vos activités : un client dont l'adresse d'affaires est en Ontario se voit donc exiger la TVH de 13 %. Les services personnels et les services liés à des immeubles suivent d'autres règles.",
      },
      {
        type: "faq",
        q: "Puis-je demander la TVP ou la TVQ comme crédit de taxe sur les intrants?",
        a: "Non. Les CTI ne visent que la TPS et la TVH. La TVP et la TVD ne sont pas récupérables dans votre déclaration de TPS/TVH et restent incluses dans la dépense. La TVQ se récupère séparément, au moyen de remboursements de la taxe sur les intrants demandés auprès de Revenu Québec, si vous êtes inscrit au fichier de la TVQ.",
      },
      {
        type: "faq",
        q: "J'ai oublié de demander des CTI l'an dernier. Les ai-je perdus?",
        a: "Habituellement, non. La plupart des inscrits peuvent demander un CTI jusqu'à la date d'échéance de la déclaration visant la dernière période de déclaration qui se termine dans les quatre ans suivant la période où il aurait pu être demandé pour la première fois, à condition d'avoir des reçus conformes aux exigences en matière de documentation.",
      },
      {
        type: "faq",
        q: "Un teneur de livres ou un préparateur de déclarations peut-il utiliser la méthode rapide?",
        a: "Non. Les personnes qui offrent des services de tenue de livres, de conseils financiers, de conseils fiscaux ou de préparation de déclarations de revenus, ainsi que les professionnels du droit, de la comptabilité ou de l'actuariat, ne peuvent pas utiliser la méthode rapide. Elles calculent leur taxe nette selon la méthode ordinaire, avec les CTI.",
      },
      {
        type: "sources",
        links: [
          {
            label: "Quand s'inscrire et commencer à facturer la TPS/TVH",
            href: `${GST_FR}/quand-inscrire-facture.html`,
          },
          {
            label: "S'inscrire volontairement au compte de TPS/TVH",
            href: `${GST_FR}/compte-inscrire-volontairement.html`,
          },
          {
            label: "Calculatrice de la TPS/TVH (et tableau des taux)",
            href: `${GST_FR}/facturer-percevoir-quel-taux/calculatrice.html`,
          },
          {
            label: "Guide RC4022",
            href: `${CANADA_FR}/formulaires-publications/publications/rc4022/renseignements-generaux-tps-tvh-inscrits.html`,
          },
          {
            label: "Nouvelles sur l'accise et la TPS/TVH no 118",
            href: `${CANADA_FR}/formulaires-publications/publications/news118/news118-nouvelles-accise-tps-tvh-no-118.html`,
          },
          {
            label: "Avis 322 (régime simplifié)",
            href: `${CANADA_FR}/formulaires-publications/publications/notice322/recuperation-tps-tvh-application-mesures-matiere-economie-numerique.html`,
          },
          {
            label: "Guide RC4058, Méthode rapide de comptabilité",
            href: `${CANADA_FR}/formulaires-publications/publications/rc4058/methode-rapide-comptabilite-tps-tvh.html`,
          },
          {
            label: "Dates limites de la TPS/TVH",
            href: `${GST_FR}/produire-declaration-tps-tvh/exigences-dates-limites-matiere-declaration.html`,
          },
          { label: "T4002, chapitre 2", href: `${T4002_FR}/t4002-4.html` },
          { label: "T4002, chapitre 3", href: `${T4002_FR}/t4002-5.html` },
          {
            label: "Registre de la TPS/TVH",
            href: `${CANADA_FR}/services-electroniques/services-numeriques-entreprises/confirmation-numero-compte-tps-tvh.html`,
          },
          {
            label: "Revenu Québec : inscription aux fichiers de la TPS et de la TVQ",
            href: `${RQ_FR}/inscription-aux-fichiers-de-la-tps-et-de-la-tvq/`,
          },
          {
            label: "Revenu Québec : petit fournisseur",
            href: "https://www.revenuquebec.ca/fr/citoyens/taxes/biens-et-services-taxables-detaxes-ou-exoneres/tps-et-tvq/autres-situations/petit-fournisseur/",
          },
          {
            label: "Revenu Québec : CTI et RTI",
            href: `${RQ_FR}/credit-de-taxe-sur-les-intrants-et-remboursement-de-la-taxe-sur-les-intrants/`,
          },
          {
            label: "Revenu Québec : calcul des taxes",
            href: `${RQ_FR}/perception-de-la-tps-et-de-la-tvq/calcul-des-taxes/`,
          },
        ],
        checked: `Pages françaises de canada.ca et de revenuquebec.ca consultées le 16 novembre 2026. Les guides RC4022 et RC4058 en sont à la révision 25. ${DISCLAIMER}`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /* mileage-deduction-canada-freelancers                                */
  /* ------------------------------------------------------------------ */
  fr({
    enSlug: "mileage-deduction-canada-freelancers",
    title: "Déductions pour frais de véhicule et kilométrage au Canada (guide 2026)",
    displayTitle: "Déductions pour frais de véhicule et kilométrage au Canada",
    excerpt:
      "Comment les travailleurs autonomes du Canada déduisent leurs frais de véhicule pour 2026 : le registre de l'ARC, le tableau A, les plafonds d'intérêts et de location, les catégories de DPA 10 et 10.1, et l'utilisation pour l'entreprise.",
    category: "Kilométrage et automobile",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/mileage-deduction-canada-freelancers.webp",
      width: 1280,
      height: 720,
      alt: "Tableau de bord d'une voiture la nuit, avec un indicateur de vitesse en km/h et le compteur kilométrique",
    },
    tags: [
      "kilométrage",
      "frais de véhicule",
      "déduction pour automobile",
      "registre",
      "DPA",
      "location",
      "T2125",
      "ARC",
      "travailleur autonome",
    ],
    relatedSlugs: [
      "guide-formulaire-t2125",
      "deductions-travailleurs-autonomes-canada",
      "tps-tvh-travailleurs-autonomes",
    ],
    body: [
      {
        type: "p",
        text: "Si vous êtes travailleur autonome au Canada et utilisez votre propre véhicule pour le travail, vous déduisez la part d'entreprise de ce que le véhicule vous coûte réellement : les kilomètres parcourus pour l'entreprise divisés par le total des kilomètres, multipliés par vos dépenses admissibles, sur le formulaire T2125. Le taux par kilomètre que vous avez peut-être entendu citer (73 cents pour les 5 000 premiers kilomètres en 2026) n'est pas cette déduction. C'est le plafond des allocations exonérées d'impôt que les employeurs versent à leurs employés, et il ne vous concerne que si quelqu'un, par exemple votre propre société, vous verse une allocation.",
      },
      {
        type: "p",
        text: "Ce guide porte sur l'année d'imposition 2026 : les frais déductibles, le tableau A, les plafonds d'intérêts et de location, la déduction pour amortissement (DPA), le registre de l'ARC et le pourcentage d'utilisation pour l'entreprise. Chaque règle et chaque montant proviennent de canada.ca (sources à la fin); le guide T4002 et le formulaire T2125 les plus récents sont les éditions 2025, et nous signalons donc les montants de 2026 qui ne sont pas encore publiés. Les exemples sont fictifs.",
      },
      { type: "h2", text: "Les taux et plafonds de 2026" },
      {
        type: "p",
        text: "Le ministère des Finances a annoncé les plafonds de 2026 pour les automobiles le 14 janvier 2026. Ils s'appliquent à compter du 1er janvier 2026 :",
      },
      {
        type: "ul",
        items: [
          "Plafond des allocations par kilomètre, provinces : 73 cents pour les 5 000 premiers kilomètres et 67 cents par kilomètre supplémentaire (2025 : 72 cents et 66 cents)",
          "Plafond des allocations par kilomètre, territoires : 77 cents pour les 5 000 premiers kilomètres et 71 cents par kilomètre supplémentaire (2025 : 76 cents et 70 cents)",
          "Plafond du coût en capital des voitures de tourisme de la catégorie 10.1 : 39 000 $ avant taxes (contre 38 000 $ en 2025)",
          "Plafond du coût en capital des voitures de tourisme zéro émission de la catégorie 54 : 61 000 $ avant taxes (inchangé)",
          "Frais de location déductibles : 1 100 $ par mois avant taxes pour les nouveaux baux conclus le 1er janvier 2026 ou après (inchangé)",
          "Intérêts déductibles : 350 $ par mois pour les nouveaux prêts automobiles conclus le 1er janvier 2026 ou après (inchangé)",
        ],
      },
      {
        type: "p",
        text: "Les plafonds de location, d'intérêts et de coût en capital ne s'appliquent qu'aux « voitures de tourisme » : les véhicules que vous possédez (autres que les véhicules zéro émission) ou que vous louez, qui sont conçus principalement pour le transport de personnes et comptent un conducteur et au plus huit passagers. Le tableau Types de véhicule de l'ARC classe les camionnettes, les fourgonnettes et les VUS selon leur usage : par exemple, une camionnette utilisée à plus de 50 % pour transporter des marchandises ou du matériel n'est pas une voiture de tourisme.",
      },
      { type: "h2", text: "Deux méthodes : les dépenses réelles ou l'allocation par kilomètre" },
      {
        type: "p",
        text: "La méthode des dépenses réelles est la seule méthode prévue pour les véhicules sur le formulaire T2125 : additionnez ce que le véhicule vous a coûté pendant l'année, puis déduisez la part d'utilisation pour l'entreprise. La DPA sur un véhicule que vous possédez se demande séparément, selon le même pourcentage.",
      },
      {
        type: "p",
        text: "L'allocation par kilomètre est une règle d'emploi : un employeur verse à un employé un montant fixe par kilomètre parcouru pour affaires, exonéré d'impôt s'il est fondé uniquement sur les kilomètres parcourus pour affaires et que le taux est raisonnable. Si votre propre société vous en verse une, c'est cette méthode qui s'applique. Un propriétaire unique qui produit un formulaire T2125 ne peut pas la choisir.",
      },
      { type: "h2", text: "Quels frais de véhicule sont déductibles" },
      {
        type: "p",
        text: "Le T4002 énumère les dépenses que vous pouvez déduire pour faire fonctionner un véhicule à moteur que vous utilisez pour gagner un revenu d'entreprise. Chacune est ramenée à votre pourcentage d'utilisation pour l'entreprise, et l'ARC ne les accepte que si elles sont raisonnables et appuyées par des reçus :",
      },
      {
        type: "ul",
        items: [
          "Carburant et huile, avec chaque reçu, et pas seulement le relevé de carte",
          "Électricité pour un véhicule zéro émission",
          "Assurance",
          "Permis et droits d'immatriculation",
          "Entretien et réparations, avec chaque facture",
          "Intérêts sur l'argent emprunté pour acheter le véhicule, plafonnés pour les voitures de tourisme (tableau B)",
          "Frais de location, plafonnés pour les voitures de tourisme (tableau C). Conservez le bail : il indique le prix de liste.",
        ],
      },
      {
        type: "p",
        text: "Deux frais ne sont pas réduits selon le pourcentage d'utilisation pour l'entreprise. L'ARC vous permet de déduire la totalité des frais de stationnement liés à vos activités commerciales et de l'assurance commerciale supplémentaire du véhicule. Le prix d'achat d'un véhicule que vous possédez n'est jamais déduit comme une dépense. Il passe par la DPA, expliquée plus bas.",
      },
      { type: "h2", text: "Comment fonctionne le tableau A" },
      {
        type: "p",
        text: "Le tableau A, Dépenses relatives aux véhicules à moteur, fait partie du formulaire T2125. Sur le formulaire 2025, ses montants numérotés se présentent dans cet ordre :",
      },
      {
        type: "ul",
        items: [
          "Montants 1 et 2 : les kilomètres parcourus pendant l'exercice pour gagner un revenu d'entreprise, et le total des kilomètres parcourus. Les deux proviennent de votre registre et des relevés du compteur kilométrique.",
          "Montants 3 à 11 : carburant et huile, intérêts (tirés du tableau B), assurance, permis et immatriculation, entretien et réparations, location (tirée du tableau C), électricité pour les véhicules zéro émission, et autres dépenses que vous précisez.",
          "Montant 12 : le total des montants 3 à 11.",
          "Montant 13, la partie entreprise : montant 1 ÷ montant 2 × montant 12.",
          "Montants 14 et 15 : les frais de stationnement d'affaires et l'assurance commerciale supplémentaire, ajoutés en entier.",
          "Montant 16 : la somme des montants 13 à 15. C'est le montant que vous inscrivez à la ligne 9281, Dépenses relatives aux véhicules à moteur (sans la DPA).",
        ],
      },
      {
        type: "p",
        text: "Ce sont les montants plafonnés qui entrent dans le calcul, et non ce que vous avez payé : le résultat du tableau B va au montant 4 et celui du tableau C, au montant 8. La DPA sur le véhicule est calculée à la section A du formulaire et va à la ligne 9936. Les associés qui utilisent un véhicule personnel pour les affaires de la société de personnes font plutôt leur demande à la ligne 9943. Si vous utilisez plus d'un véhicule pour l'entreprise, tenez un registre distinct pour chacun et calculez les dépenses de chaque véhicule séparément.",
      },
      { type: "h2", text: "Le plafond des intérêts : tableau B" },
      {
        type: "p",
        text: "Si vous avez emprunté pour acheter une voiture de tourisme ou une voiture de tourisme zéro émission, le tableau B limite les intérêts qui entrent dans le tableau A. Les intérêts admissibles correspondent au moindre des intérêts à payer (méthode de comptabilité d'exercice) ou payés (méthode de comptabilité de caisse) pendant l'exercice, et de 350 $ ÷ 30 × le nombre de jours de l'exercice pour lesquels des intérêts étaient à payer ou ont été payés. Pour une année complète de 365 jours, cela donne 4 258 $. Le formulaire 2025 fixe ce montant à 350 $ pour les voitures de tourisme achetées après 2023, et à 300 $ pour celles achetées après 2000 et avant 2024. Les intérêts qui dépassent le plafond ne sont pas déductibles, et le montant plafonné est quand même ramené à votre part d'utilisation pour l'entreprise dans le tableau A.",
      },
      { type: "h2", text: "Le plafond de location : tableau C" },
      {
        type: "p",
        text: "Le tableau C, Frais de location admissibles pour les voitures de tourisme, applique le plafond mensuel de 1 100 $ et un deuxième plafond lié au prix de liste du véhicule, puis retient le moindre des deux. Sur le formulaire 2025 :",
      },
      {
        type: "ul",
        items: [
          "Montant 20 : les frais de location engagés pour le véhicule pendant l'exercice en cours.",
          "Montant 21 : les paiements de location déduits pour ce véhicule pendant les exercices précédents.",
          "Montant 22 : le nombre total de jours de location du véhicule pendant l'exercice en cours et les exercices précédents.",
          "Montant 23 : le prix de liste du fabricant.",
          "Montant 24 : le montant 23 ou 44 706 $ plus la taxe de vente, selon le plus élevé des deux, × 85 %.",
          "Montant 25 : (1 100 $ plus la taxe de vente) × montant 22 ÷ 30. Le montant 26 est le montant 25 moins le montant 21.",
          "Montant 27 : (38 000 $ plus la taxe de vente) × montant 20 ÷ montant 24.",
          "Montant 28, les frais de location admissibles : le montant 26 ou 27, selon le moins élevé des deux. Il va au montant 8 du tableau A.",
        ],
      },
      {
        type: "p",
        text: "Les montants de 44 706 $ et de 38 000 $ découlent du plafond de 2025 de la catégorie 10.1 (38 000 $ × 100 ÷ 85 = 44 706 $) : vérifiez donc les montants du formulaire 2026 avant de le remplir. Si un remboursement vous est dû en vertu du bail, ou si des intérêts réputés découlent de dépôts remboursables de plus de 1 000 $, l'ARC indique que vous ne pouvez pas utiliser le tableau tel qu'il est imprimé.",
      },
      {
        type: "callout",
        text: "Exemple fictif, selon les montants du formulaire 2025 : un pigiste de l'Ontario (TVH de 13 %) loue à compter du 1er janvier une voiture dont le prix de liste est de 60 000 $ et paie 12 000 $ de frais de location dans l'année. Le montant 24 est de 60 000 $ × 85 % = 51 000 $, parce que 60 000 $ dépasse 44 706 $ + TVH (50 517,78 $). Le montant 26 est de 1 243 $ × 365 ÷ 30 = 15 123,17 $. Le montant 27 est de 42 940 $ × 12 000 $ ÷ 51 000 $ = 10 103,53 $. Les frais de location admissibles correspondent au moindre des deux, soit 10 103,53 $. C'est ce montant, et non 12 000 $, qui entre dans le tableau A.",
      },
      { type: "h2", text: "Déduction pour amortissement : catégories 10 et 10.1" },
      {
        type: "p",
        text: "Si vous êtes propriétaire du véhicule, vous en récupérez le coût au moyen de la DPA plutôt que comme une dépense. La catégorie 10 a un taux de 30 % et comprend les véhicules à moteur et certaines voitures de tourisme. Vous utilisez la méthode du solde dégressif : la DPA de chaque année est un pourcentage du solde restant de la catégorie, de sorte que la déduction diminue avec le temps. Une voiture de tourisme qui coûte plus que le plafond de l'année où vous l'avez acquise va plutôt dans la catégorie 10.1, aussi au taux de 30 %, mais avec ses propres règles :",
      },
      {
        type: "ul",
        items: [
          "Coût plafonné : le coût en capital est limité au plafond plus la TPS/TVH ou la TVP sur ce montant. Les plafonds sont de 30 000 $ pour les véhicules acquis avant 2022, de 34 000 $ en 2022, de 36 000 $ en 2023, de 37 000 $ en 2024, de 38 000 $ en 2025 et de 39 000 $ à compter du 1er janvier 2026.",
          "Une catégorie par véhicule : chaque véhicule de la catégorie 10.1 est inscrit séparément, et non regroupé.",
          "Année de la vente : si vous possédiez le véhicule à la fin de l'année précédente, vous pourriez demander 50 % de la DPA de l'année au cours de l'année où vous le vendez.",
          "Ni récupération ni perte finale : ces règles ne s'appliquent pas aux voitures de tourisme de la catégorie 10.1, sauf si elles étaient des biens relatifs à la passation en charges immédiate désignés.",
        ],
      },
      {
        type: "p",
        text: "L'année où vous acquérez un bien, la règle de la demi-année limite habituellement la DPA à la moitié de l'ajout net. L'incitatif à l'investissement accéléré suspend cette règle pour les biens admissibles acquis après le 20 novembre 2018 et prêts à être mis en service avant 2028 : pour les biens prêts à être mis en service de 2024 à 2027, l'ARC fixe la déduction de la première année à deux fois la déduction normale de la première année. Le T4002 de 2025 décrit aussi un incitatif proposé de réaccélération pour les biens acquis après 2024 : vérifiez donc dans le guide de 2026 le traitement de votre véhicule pour la première année.",
      },
      {
        type: "p",
        text: "Les véhicules zéro émission ont leurs propres catégories : la catégorie 54 (30 %) pour ceux qui feraient autrement partie de la catégorie 10 ou 10.1, et la catégorie 55 (40 %) pour ceux qui feraient autrement partie de la catégorie 16. Chaque voiture de tourisme zéro émission de la catégorie 54 a un plafond de coût en capital de 61 000 $ plus la taxe de vente.",
      },
      {
        type: "p",
        text: "Dans chaque catégorie, la DPA sur un véhicule que vous utilisez aussi à des fins personnelles est ramenée à la part d'utilisation pour l'entreprise : dans l'exemple du T4002, 12 000 km sur 18 000 km appliqués à 3 000 $ de DPA donnent 2 000 $.",
      },
      {
        type: "callout",
        text: "Exemple fictif : un pigiste de l'Ontario achète une voiture de tourisme de 45 000 $ en 2026. Elle va dans sa propre catégorie 10.1, et son coût en capital est plafonné à 39 000 $ + TVH de 13 % = 44 070 $. Une année complète de DPA à 30 % sur ce montant serait de 13 221 $ et, à 40 % d'utilisation pour l'entreprise, la déduction serait de 5 288,40 $. Le montant de la première année dépend de la règle qui s'applique à la première année, comme expliqué plus haut.",
      },
      { type: "h2", text: "Exemple détaillé en dollars canadiens" },
      {
        type: "p",
        text: "Les montants ci-dessous sont fictifs et choisis pour illustrer le calcul. Supposons qu'un propriétaire unique dont l'exercice se termine le 31 décembre parcourt 20 000 km en 2026, dont 8 000 km pour des déplacements d'affaires inscrits dans un registre. L'utilisation pour l'entreprise est de 8 000 ÷ 20 000 = 40 %. Les frais de véhicule de l'année sont les suivants :",
      },
      {
        type: "ul",
        items: [
          "Carburant : 2 600 $",
          "Assurance : 1 800 $",
          "Entretien et réparations : 900 $",
          "Permis et immatriculation : 150 $",
          "Intérêts sur le prêt : 1 500 $, sous le plafond annuel de 4 258 $, donc entièrement pris en compte",
          "Total (montant 12) : 6 950 $ × 40 % = 2 780 $",
          "Stationnement d'affaires : 240 $, déduit en entier plutôt qu'à 40 %",
          "Montant inscrit à la ligne 9281 : 3 020 $",
        ],
      },
      {
        type: "p",
        text: "La DPA sur le véhicule va à la ligne 9936, elle aussi ramenée à 40 %. À titre de comparaison, une allocation d'employeur pour les mêmes 8 000 kilomètres d'affaires aux taux provinciaux de 2026 pourrait être d'au plus 5 000 × 0,73 $ + 3 000 × 0,67 $ = 5 660 $. Il s'agit d'un paiement exonéré d'impôt versé par un employeur, utile si vous vous demandez si votre société devrait vous rembourser, mais pas d'une déduction qu'un propriétaire unique peut demander.",
      },
      { type: "h2", text: "Le registre attendu par l'ARC" },
      {
        type: "p",
        text: "Selon l'ARC, « la meilleure façon de démontrer qu'un véhicule est utilisé à des fins commerciales » est de tenir un registre exact des déplacements d'affaires pour toute l'année. Pour chaque déplacement d'affaires, inscrivez :",
      },
      {
        type: "ul",
        items: ["La date", "La destination", "Le but", "Le nombre de kilomètres parcourus"],
      },
      {
        type: "p",
        text: "Notez aussi le relevé du compteur kilométrique de chaque véhicule au début et à la fin de votre exercice et, si vous achetez, vendez ou échangez un véhicule pendant l'année, son relevé à cette date. Les deux relevés donnent le total des kilomètres, le dénominateur de votre pourcentage d'utilisation pour l'entreprise. Le point de départ ne figure pas dans la liste de l'ARC, mais l'inscrire rend chaque entrée plus facile à vérifier.",
      },
      {
        type: "p",
        text: "Précisez le but : « visite de chantier, soumission pour une rénovation de cuisine » rattache un déplacement à l'entreprise d'une façon que « rencontre avec un client » ne permet pas. Inscrivez les déplacements au moment où ils ont lieu plutôt que de mémoire à la fin du mois, incluez les courts trajets et, si un déplacement d'affaires comprend une course personnelle, n'inscrivez que les kilomètres d'affaires.",
      },
      {
        type: "p",
        text: "Vous voulez un registre tout prêt avec ces colonnes?",
        link: {
          label: "Téléchargez un modèle gratuit de registre de kilométrage",
          href: "/fr/modele-registre-kilometrage",
        },
      },
      { type: "h2", text: "L'année de base et la période d'échantillonnage de trois mois" },
      {
        type: "p",
        text: "Vous n'avez pas à inscrire chaque déplacement indéfiniment. La règle simplifiée de l'ARC sur le registre fonctionne ainsi :",
      },
      {
        type: "ul",
        items: [
          "Tenez un registre complet pendant une période complète de 12 mois. C'est votre année de base.",
          "Les années suivantes, tenez plutôt un registre pendant une période d'échantillonnage de trois mois.",
          "Calculez l'utilisation annuelle pour l'entreprise ainsi : (% de la période d'échantillonnage ÷ % de l'année de base pour les mêmes mois) × % annuel de l'année de base.",
          "L'échantillon tient lieu de l'année seulement si le résultat se situe à 10 points de pourcentage près de l'année de base, et si l'année de base reflète toujours votre utilisation habituelle du véhicule.",
          "Si le résultat varie de plus de 10 points, l'échantillon ne vaut que pour ses trois mois. Pour le reste de l'année, il vous faut un registre réel des déplacements, et l'ARC suggère de commencer une nouvelle année de base de 12 mois.",
        ],
      },
      {
        type: "p",
        text: "L'exemple de l'ARC : une année de base avec une utilisation annuelle pour l'entreprise de 49 %, et de 46 % pour la période d'avril à juin. L'échantillon d'avril à juin d'une année ultérieure indique 51 %. L'utilisation calculée est de (51 % ÷ 46 %) × 49 % = 54 %. Ce résultat se situe dans l'intervalle de 39 % à 59 %; l'ARC accepterait donc 54 % en l'absence de preuve contraire. Choisissez les mois de l'échantillon à l'avance. Comme l'année de base continue de servir les années suivantes, son registre doit être conservé pendant six ans à partir de la fin de la dernière année d'imposition qu'il sert à appuyer. Tous les autres registres suivent la règle habituelle de six ans à partir de la fin de l'année d'imposition à laquelle ils se rapportent.",
      },
      { type: "h2", text: "Comment calculer votre pourcentage d'utilisation pour l'entreprise" },
      {
        type: "p",
        text: "La formule est : kilomètres parcourus pour l'entreprise ÷ total des kilomètres. À la fin de l'année, votre registre devrait vous fournir :",
      },
      {
        type: "ul",
        items: [
          "Le total des kilomètres parcourus : le relevé du compteur kilométrique à la fin de l'année moins celui du début de l'année.",
          "Les kilomètres parcourus pour l'entreprise : la somme de tous les déplacements d'affaires inscrits.",
          "Le pourcentage d'utilisation pour l'entreprise : kilomètres d'affaires ÷ total des kilomètres × 100.",
        ],
      },
      {
        type: "p",
        text: "Ce pourcentage s'applique à chaque dépense du tableau A et à la DPA du véhicule. L'exemple publié par l'ARC : 27 000 kilomètres d'affaires sur 30 000 au total, avec 5 400 $ de dépenses, donnent 27 000 ÷ 30 000 × 5 400 $ = 4 860 $. L'ajout en entier de 40 $ de stationnement et de 100 $ d'assurance commerciale supplémentaire porte la déduction à 5 000 $.",
      },
      {
        type: "p",
        text: "La question délicate est de savoir quels déplacements sont des déplacements d'affaires. La position de longue date de l'ARC, énoncée dans le Bulletin d'interprétation IT-521R archivé, est que les déplacements entre votre domicile et votre lieu d'affaires sont personnels, sauf si votre domicile est la base de vos activités commerciales. Si vous avez un bureau ou un autre lieu de travail fixe ailleurs, votre domicile n'est normalement pas admissible. Si vous exploitez l'entreprise à partir de chez vous et vous rendez chez des clients ou sur des chantiers, ces déplacements peuvent être des déplacements d'affaires. Les déplacements entre différents locaux de la même entreprise sont déductibles.",
      },
      {
        type: "callout",
        text: "ReceiptOne enregistre la date et la distance de l'itinéraire de chaque déplacement, soit par GPS dans l'application mobile, en arrière-plan, une fois le suivi des déplacements activé, soit en la calculant à partir des adresses de départ et d'arrivée que vous entrez, avec votre note sur le but. Marquez chaque déplacement comme professionnel ou personnel, et le rapport T2125 indique les kilomètres d'affaires divisés par tous les kilomètres que vous avez inscrits dans l'application. Il n'utilise pas les relevés de votre compteur kilométrique : ce pourcentage n'est donc exact que si vous inscrivez aussi vos déplacements personnels. Notez vous-même les relevés du compteur au début et à la fin de l'année.",
      },
      { type: "h2", text: "Dates limites pour l'année d'imposition 2026" },
      {
        type: "p",
        text: "Les travailleurs autonomes produisent leur déclaration au plus tard le 15 juin, mais tout solde dû doit être payé au plus tard le 30 avril. Pour les déclarations de 2025, ces dates étaient le 30 avril et le 15 juin 2026. Selon les mêmes règles, elles tombent le 30 avril et le 15 juin 2027 pour 2026, mais l'ARC n'avait pas encore publié son calendrier daté de 2026 au moment de la rédaction; vérifiez-les avant de produire votre déclaration.",
      },
      {
        type: "p",
        text: "Vous conduisez pour une application de covoiturage ou de livraison?",
        link: enOnly("Découvrez comment ReceiptOne fonctionne pour les chauffeurs", "/ca/drivers"),
      },
      {
        type: "p",
        text: "Les chauffeurs de covoiturage et de livraison ont leurs propres règles de TPS/TVH.",
        link: enOnly(
          "Lisez notre guide sur les déductions fiscales des chauffeurs de covoiturage et de livraison",
          "/articles/tax-deductions-rideshare-delivery-drivers-canada",
        ),
      },
      { type: "h2", text: FR_FAQ_HEADING },
      {
        type: "faq",
        q: "Puis-je simplement déduire le taux de 73 cents le kilomètre sur mon T2125?",
        a: "Non. Ce taux est le plafond des allocations exonérées d'impôt que les employeurs versent à leurs employés. Un propriétaire unique déduit la part d'entreprise des frais réels du véhicule au moyen du tableau A et de la ligne 9281, plus la DPA à la ligne 9936.",
      },
      {
        type: "faq",
        q: "Les déplacements entre mon domicile et le bureau d'un client sont-ils déductibles?",
        a: "Cela dépend de l'endroit où votre entreprise est établie. Si votre domicile est la base de vos activités commerciales et que vous n'avez pas de bureau ailleurs, les déplacements vers vos clients peuvent compter comme des déplacements d'affaires. Si vous avez un bureau ou un autre lieu de travail fixe, les déplacements entre votre domicile et ce lieu de travail sont personnels.",
      },
      {
        type: "faq",
        q: "Dois-je tenir un registre chaque année?",
        a: "Il vous faut un registre complet de 12 mois pour établir une année de base. Ensuite, un registre d'échantillonnage de trois mois chaque année suffit, tant que l'utilisation annuelle calculée pour l'entreprise reste à 10 points de pourcentage près de l'année de base.",
      },
      {
        type: "faq",
        q: "Les frais de stationnement sont-ils réduits selon mon pourcentage d'utilisation pour l'entreprise?",
        a: "Non. L'ARC vous permet de déduire la totalité des frais de stationnement liés à votre entreprise, ainsi que l'assurance commerciale supplémentaire, sans les répartir.",
      },
      {
        type: "faq",
        q: "Puis-je déduire la totalité de mes paiements de location?",
        a: "Pas toujours. Pour une voiture de tourisme, le tableau C plafonne les frais de location admissibles au moindre d'un plafond de 1 100 $ par mois et d'un plafond lié au prix de liste du fabricant. Le montant plafonné est ensuite ramené à votre part d'utilisation pour l'entreprise.",
      },
      {
        type: "faq",
        q: "J'ai acheté une voiture de 45 000 $ en 2026. Que puis-je déduire?",
        a: "S'il s'agit d'une voiture de tourisme, elle va dans sa propre catégorie 10.1, et son coût en capital est plafonné à 39 000 $ plus la TPS/TVH ou la TVP sur ce montant. La DPA se demande au taux de 30 % sur le montant plafonné, sous réserve des règles de la première année du guide T4002, et elle est ramenée à votre part d'utilisation pour l'entreprise. Une voiture de tourisme zéro émission va plutôt dans la catégorie 54, avec un plafond de 61 000 $.",
      },
      {
        type: "faq",
        q: "Je suis employé, pas travailleur autonome. Ces règles s'appliquent-elles?",
        a: "En partie. Les employés font leur demande à la ligne 22900 au moyen du formulaire T777, et seulement si les conditions de l'ARC sont remplies, notamment un formulaire T2200 signé par l'employeur et aucune allocation non imposable pour l'usage d'un véhicule. Les règles sur le registre et l'utilisation pour l'entreprise sont les mêmes.",
      },
      {
        type: "sources",
        links: [
          {
            label: "Plafonds de 2026 pour les automobiles",
            href: "https://www.canada.ca/fr/ministere-finances/nouvelles/2026/01/le-gouvernement-annonce-les-plafonds-de-deduction-des-frais-dautomobile-et-les-taux-des-avantages-relatifs-a-lutilisation-dune-automobile-pour-les-.html",
          },
          { label: "T4002, chapitre 3 (ligne 9281)", href: `${T4002_FR}/t4002-5.html` },
          { label: "T4002, chapitre 4 (DPA)", href: `${T4002_FR}/t4002-6.html` },
          {
            label: "Formulaire T2125 (2025)",
            href: "https://www.canada.ca/content/dam/cra-arc/formspubs/pbg/t2125/t2125-25f.pdf",
          },
          {
            label: "Registres pour les véhicules à moteur",
            href: `${VEHICLE_FR}/registres-vehicules-a-moteur.html`,
          },
          { label: "Types de véhicule", href: `${VEHICLE_FR}/types-vehicule.html` },
          {
            label: "Calculer vos dépenses relatives aux véhicules à moteur",
            href: `${SOLE_PROP_FR}/declarer-vos-revenus-depenses-entreprise/comment-remplir-formulaire-t2125/calculer-vos-depenses-relatives-vehicules-a-moteur.html`,
          },
          {
            label: "Véhicule à moteur – frais de location",
            href: `${VEHICLE_FR}/frais-deductibles/vehicule-a-moteur-frais-location.html`,
          },
          {
            label: "Incitatif à l'investissement accéléré",
            href: `${SOLE_PROP_FR}/declarer-vos-revenus-depenses-entreprise/reclamer-deduction-amortissement/incitatif-investissement-accelere.html`,
          },
          {
            label: "IT-521R (archivé)",
            href: `${CANADA_FR}/formulaires-publications/publications/it521r/archivee-frais-vehicule-a-moteur-deduits-travailleurs-independants.html`,
          },
        ],
        checked: `Pages françaises de canada.ca consultées le 16 novembre 2026. Le guide T4002 et le formulaire T2125 les plus récents sont les éditions 2025. ${DISCLAIMER}`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /* sales-tax-by-province-self-employed-canada                          */
  /* ------------------------------------------------------------------ */
  fr({
    enSlug: "sales-tax-by-province-self-employed-canada",
    title:
      "TPS, TVH, TVP et TVQ : les taxes de vente par province pour les travailleurs autonomes (guide 2026)",
    displayTitle:
      "TPS, TVH, TVP et TVQ : les taxes de vente par province pour les travailleurs autonomes",
    excerpt:
      "Les taux de TPS, de TVH et de taxe de vente provinciale dans les 13 provinces et territoires, quand un travailleur autonome doit s'inscrire, quelles taxes provinciales vous pouvez récupérer et quel taux exiger aux clients d'ailleurs.",
    category: "TPS/TVH",
    publishedAt: "2026-11-16",
    updatedAt: "2026-11-16",
    image: {
      path: "/articles/sales-tax-by-province-self-employed-canada.webp",
      width: 1280,
      height: 720,
      alt: "Une calculatrice noire et deux pièces de monnaie éclairées par un faisceau de lumière rasant sur une table sombre",
    },
    tags: [
      "TPS/TVH",
      "TVP",
      "TVQ",
      "TVD",
      "taxe de vente",
      "provinces",
      "ARC",
      "travailleur autonome",
    ],
    relatedSlugs: ["tps-tvh-travailleurs-autonomes", "regles-recus-arc"],
    quickAnswer:
      "L'Alberta et les trois territoires n'exigent que la TPS de 5 %; l'Ontario exige la TVH de 13 %, la Nouvelle-Écosse, de 14 %, et le Nouveau-Brunswick, Terre-Neuve-et-Labrador et l'Île-du-Prince-Édouard, de 15 %; la Colombie-Britannique, la Saskatchewan, le Manitoba et le Québec exigent la TPS de 5 % plus leur propre taxe provinciale. En tant que travailleur autonome, vous devez vous inscrire à la TPS/TVH dès que vos ventes taxables dépassent 30 000 $ au cours d'un seul trimestre civil ou sur quatre trimestres consécutifs, et chaque taxe provinciale a ses propres règles d'inscription. Pour la plupart des services, le taux que vous exigez est celui de la province de l'adresse de votre client.",
    receiptOneHelps: {
      items: [
        "Photographiez un reçu papier ou téléversez une photo ou un PDF : ReceiptOne lit le commerçant, la date, le total et les montants de TPS/TVH et de TVP, que vous vérifiez ensuite.",
        "Taxes remboursables estimées tient un total courant de la TPS/TVH et, s'il y a lieu, de la TVQ de vos reçus, tandis que la TVP est signalée séparément comme non remboursable.",
        "Si vous êtes inscrit, la feuille de travail de déclaration de TPS/TVH remplit la ligne 106 à partir de vos reçus; vous entrez vos ventes et la taxe perçue, et elle ajoute les lignes de la TVQ lorsque la TVQ s'applique. Elle ne produit rien auprès de l'ARC ni de Revenu Québec.",
        "Le Calendrier fiscal affiche vos échéances de l'ARC pour les 12 prochains mois, selon la fréquence de production de vos déclarations de TPS/TVH et vos acomptes provisionnels.",
        "Exportez vos registres, ou une feuille de travail de déclaration terminée, en PDF ou en CSV pour votre comptable.",
      ],
      link: { label: "Découvrez comment fonctionne ReceiptOne.", href: "/fr" },
    },
    body: [
      {
        type: "p",
        text: "Au Canada, les taxes de vente s'empilent : la TPS fédérale partout, une taxe de vente harmonisée (TVH) dans cinq provinces, et une taxe provinciale distincte qui s'ajoute à la TPS dans quatre autres. Ce guide couvre les taux, l'inscription, les taxes provinciales et le taux à exiger aux clients d'ailleurs. Les règles fédérales proviennent de canada.ca, et chaque règle provinciale, du site gouvernemental de la province concernée; les sources sont énumérées à la fin.",
      },
      { type: "h2", text: "Taux des taxes de vente dans chaque province et territoire" },
      {
        type: "p",
        text: "La page des taux de l'ARC indique la TPS ou la TVH de chaque province et territoire, ainsi que toute taxe provinciale distincte. Le seul changement récent qu'elle signale : le taux de la TVH de la Nouvelle-Écosse a diminué à 14 % le 1er avril 2025. Les taux ci-dessous sont ceux qu'indiquent les pages citées.",
      },
      {
        type: "table",
        caption:
          "TPS, TVH et taux de la TVQ : page des taux de TPS/TVH de l'ARC. Taux provinciaux : sites gouvernementaux de la Colombie-Britannique, de la Saskatchewan et du Manitoba. Consultés le 16 novembre 2026.",
        headers: ["Province ou territoire", "Taxes applicables", "TPS ou TVH", "Taxe provinciale"],
        rows: [
          ["Alberta", "TPS seulement", "TPS de 5 %", "Aucune"],
          ["Colombie-Britannique", "TPS + TVP", "TPS de 5 %", "TVP de 7 % (taux général)"],
          ["Manitoba", "TPS + TVD", "TPS de 5 %", "TVD de 7 % (taux général)"],
          ["Nouveau-Brunswick", "TVH", "TVH de 15 %", "Comprise dans la TVH"],
          ["Terre-Neuve-et-Labrador", "TVH", "TVH de 15 %", "Comprise dans la TVH"],
          ["Territoires du Nord-Ouest", "TPS seulement", "TPS de 5 %", "Aucune"],
          [
            "Nouvelle-Écosse",
            "TVH",
            "TVH de 14 %, depuis le 1er avril 2025",
            "Comprise dans la TVH",
          ],
          ["Nunavut", "TPS seulement", "TPS de 5 %", "Aucune"],
          ["Ontario", "TVH", "TVH de 13 %", "Comprise dans la TVH"],
          ["Île-du-Prince-Édouard", "TVH", "TVH de 15 %", "Comprise dans la TVH"],
          ["Québec", "TPS + TVQ", "TPS de 5 %", "TVQ de 9,975 %"],
          ["Saskatchewan", "TPS + TVP", "TPS de 5 %", "TVP de 6 %"],
          ["Yukon", "TPS seulement", "TPS de 5 %", "Aucune"],
        ],
      },
      {
        type: "p",
        text: "Lorsqu'une taxe de vente provinciale s'applique, l'ARC indique de calculer la TPS sur le prix sans cette taxe. Lorsque la TVH s'applique, votre reçu ou votre facture indique le taux total de la TVH, et non ses parties fédérale et provinciale.",
      },
      { type: "h2", text: "Inscription à la TPS/TVH pour les travailleurs autonomes" },
      { type: "h3", text: "Le critère du petit fournisseur de 30 000 $" },
      {
        type: "p",
        text: "Vous n'avez pas à vous inscrire à la TPS/TVH tant que vous êtes un petit fournisseur : vos ventes taxables n'ont pas dépassé 30 000 $ au cours d'un seul trimestre civil ni sur quatre trimestres civils consécutifs. En tant que propriétaire unique, vous comptez les revenus avant dépenses tirés de vos fournitures taxables effectuées dans le monde entier, provenant de toutes vos entreprises et de celles de vos associés. Les trimestres civils commencent le 1er janvier, le 1er avril, le 1er juillet et le 1er octobre.",
      },
      {
        type: "p",
        text: "Dépasser 30 000 $ au cours d'un trimestre met fin au statut de petit fournisseur au moment de cette vente : votre inscription entre en vigueur au plus tard ce jour-là, et vous exigez la TPS/TVH sur cette vente. Dépasser le seuil sur quatre trimestres y met fin à la fin du mois qui suit le trimestre où vous l'avez dépassé, avec une inscription en vigueur au plus tard à votre vente suivante. Dans les exemples de l'ARC, vous avez ensuite 29 jours à compter de la date d'entrée en vigueur pour vous inscrire.",
      },
      { type: "h3", text: "S'inscrire volontairement" },
      {
        type: "p",
        text: "Sous le seuil, vous pouvez vous inscrire volontairement si vous effectuez des ventes taxables au Canada; l'inscription prend habituellement effet le jour où vous demandez votre compte, ou jusqu'à 30 jours plus tôt. Vous exigez, percevez et versez alors la taxe, produisez des déclarations et restez inscrit pendant au moins un an, sauf si vous cessez vos activités commerciales. Si vous ne vous inscrivez pas, vous n'exigez pas de TPS/TVH et ne demandez pas de crédits de taxe sur les intrants.",
      },
      { type: "h3", text: "Les chauffeurs de covoiturage s'inscrivent dès la première course" },
      {
        type: "p",
        text: "Le seuil ne s'applique pas au covoiturage commercial. Un chauffeur de taxi ou de covoiturage travaillant de façon autonome doit s'inscrire à la TPS/TVH même s'il est un petit fournisseur, et la date d'entrée en vigueur de l'inscription est le jour où vous commencez à fournir des services taxables de transport de passagers.",
        link: enOnly(
          "Lisez notre guide fiscal pour les chauffeurs de covoiturage et de livraison",
          "/articles/tax-deductions-rideshare-delivery-drivers-canada",
        ),
      },
      { type: "h3", text: "Une fois inscrit" },
      {
        type: "p",
        text: "Vous exigez la TPS/TVH au taux du lieu de fourniture, la détenez en fiducie jusqu'à ce que vous la versiez et produisez une déclaration pour chaque période de déclaration. La date de la facture détermine dans quelle déclaration une vente doit figurer, que vous ayez été payé ou non.",
        link: {
          label: "Consultez les échéances actuelles de l'ARC.",
          href: "/fr/echeances-fiscales",
        },
      },
      {
        type: "p",
        text: "Vous récupérez la TPS/TVH payée sur vos achats d'entreprise en demandant des crédits de taxe sur les intrants (CTI) à la ligne 106, dans la mesure où ces achats servent à vos activités commerciales. Selon la méthode rapide de comptabilité, vous ne pouvez pas demander de CTI pour les dépenses d'exploitation. Pour la plupart des inscrits, un CTI oublié peut être demandé jusqu'à la date d'échéance de la déclaration visant la dernière période de déclaration qui se termine dans les quatre ans suivant la période où il aurait pu être demandé pour la première fois.",
        link: {
          label: "Lisez notre guide sur le suivi de la TPS/TVH sur les dépenses d'entreprise.",
          href: frArticle("track-gst-hst-business-expenses"),
        },
      },
      { type: "h2", text: "Taxes de vente provinciales : inscription et récupération" },
      { type: "h3", text: "La TVP de la Colombie-Britannique" },
      {
        type: "p",
        text: "Vous devez vous inscrire pour percevoir la TVP si vous êtes situé en Colombie-Britannique et que, dans le cours normal de vos activités dans la province, vous vendez ou louez des biens taxables, ou fournissez des logiciels ou des services taxables, comme la réparation de biens taxables ou des services juridiques. Le taux général est de 7 %.",
        link: enOnly(
          "Lisez notre guide sur la TVP de la Colombie-Britannique pour les travailleurs autonomes",
          "/articles/bc-pst-self-employed",
        ),
      },
      {
        type: "p",
        text: "Un petit vendeur (« small seller ») n'a pas à s'inscrire : il est situé en Colombie-Britannique, ne vend pas régulièrement à partir de locaux commerciaux établis et a tiré 10 000 $ ou moins de revenus bruts de ventes au détail de biens, de logiciels et de services admissibles au cours des 12 mois précédents, et prévoit la même chose pour les 12 prochains mois. La province précise que cette liste de conditions n'est pas complète. Ses pages sur la TVP indiquent aussi que l'extension prévue de la TVP aux services de comptabilité, d'architecture, d'ingénierie, de géoscience, d'immobilier non résidentiel et de sécurité est suspendue.",
      },
      {
        type: "p",
        text: "En matière de récupération, la province est claire : contrairement à la TPS/TVH, il n'existe pas de crédits de taxe sur les intrants pour la TVP payée sur les biens achetés par une entreprise. La TVP s'applique aux biens taxables que vous achetez ou louez pour votre entreprise et, si un fournisseur ne l'exige pas, vous devez l'autocotiser.",
      },
      { type: "h3", text: "La TVP de la Saskatchewan" },
      {
        type: "p",
        text: "La TVP de la Saskatchewan est une taxe de six pour cent sur les biens et services taxables consommés ou utilisés dans la province. Les entreprises qui y exercent leurs activités doivent s'inscrire pour obtenir un numéro de TVP, soit un numéro de permis de vendeur (« vendor's licence »), soit un numéro de consommateur inscrit (« registered consumer »); les pages que nous avons consultées ne décrivent aucune exception pour les petits vendeurs. Les entreprises paient la TVP sur les biens qu'elles achètent et l'autocotisent lorsqu'un fournisseur ne l'a pas perçue.",
      },
      { type: "h3", text: "La TVD du Manitoba" },
      {
        type: "p",
        text: "La taxe sur les ventes au détail (TVD) du Manitoba s'applique à la vente au détail ou à la location de la plupart des biens et de certains services, à un taux général de 7 % calculé sur le prix avant la TPS. Depuis avril 2024, les entreprises dont les ventes taxables annuelles sont inférieures à 30 000 $ n'ont pas à s'inscrire, sauf si elles font appel à des fournisseurs de l'extérieur de la province qui ne perçoivent pas la TVD du Manitoba ou vendent du tabac ou de l'alcool. Une entreprise qui dépasse 30 000 $ dispose d'un mois pour s'inscrire.",
      },
      {
        type: "p",
        text: "Les petites entreprises non inscrites paient la TVD sur ce qu'elles achètent, pour leur propre usage comme pour la revente. L'inscription ne change rien pour vos propres achats : le Manitoba précise qu'un numéro de TVD ne permet pas d'acheter des biens ou des services taxables sans payer la TVD, sauf s'ils sont destinés à la revente ou à une autre fin exonérée.",
      },
      { type: "h3", text: "La TVQ du Québec" },
      {
        type: "p",
        text: "Au Québec, la TPS et la taxe de vente du Québec (TVQ) sont toutes deux perçues sur la plupart des biens et des services. Revenu Québec présente les obligations ensemble : s'inscrire aux fichiers de la TPS et de la TVQ, percevoir les taxes, calculer vos crédits de taxe sur les intrants (CTI) et vos remboursements de la taxe sur les intrants (RTI), et produire les déclarations de TPS et de TVQ. La page des taux de l'ARC indique que le taux de la TVQ est de 9,975 %.",
      },
      {
        type: "p",
        text: "Le seuil du petit fournisseur est le même, soit 30 000 $, au cours d'un trimestre civil ou des quatre trimestres précédents. Un inscrit perçoit les taxes et peut demander des CTI et des RTI sur les achats faits pour effectuer des fournitures taxables : contrairement à la TVP et à la TVD, la TVQ que vous payez sur vos achats d'entreprise peut donc être récupérée. Une entreprise qui s'inscrit au fichier de la TVQ doit aussi s'inscrire au fichier de la TPS/TVH et rester inscrite pendant au moins un an.",
      },
      { type: "h2", text: "Quel taux exiger aux clients d'autres provinces" },
      {
        type: "p",
        text: "Le taux dépend du lieu de fourniture, et non de l'endroit où vous habitez. Pour les services, si vous obtenez l'adresse domiciliaire ou d'affaires de votre client au Canada dans le cours normal de vos activités, le lieu de fourniture est la province de cette adresse. L'exemple de l'ARC : un fournisseur qui travaille entièrement au Québec conçoit un site Web pour une société dont l'adresse d'affaires est en Ontario; la TVH s'applique donc au taux de l'Ontario.",
      },
      {
        type: "p",
        text: "Sans adresse, le lieu de fourniture dépend de l'endroit où vous rendez le service : la TPS seulement si la partie canadienne n'est pas rendue principalement (plus de 50 %) dans des provinces participantes, celles qui exigent la TVH, et sinon la province participante où elle est rendue dans la plus grande proportion. Les services personnels, généralement ceux qui sont rendus à 90 % ou plus en présence du client, ont leurs propres règles, tout comme les services liés à des biens ou à des immeubles.",
        link: {
          label: "Lisez les règles de l'ARC sur le lieu de fourniture.",
          href: `${GST_FR}/facturer-percevoir-lieu-fourniture.html`,
        },
      },
      {
        type: "p",
        text: "Ces règles ne déterminent que la TPS ou la TVH. Une taxe de vente provinciale a sa propre portée : la Colombie-Britannique, par exemple, indique qu'une entreprise située à l'extérieur de la province qui vend à des clients de la province pourrait devoir s'inscrire à sa TVP.",
      },
      { type: "h2", text: "Conservez des reçus qui indiquent la taxe" },
      {
        type: "p",
        text: "Pour demander un CTI, il vous faut des documents qui indiquent la taxe. Pour un achat de 100 $ à 499,99 $, le reçu ou la facture doit notamment indiquer la TPS/TVH exigée (ou qu'elle est comprise) et le numéro d'inscription à la TPS/TVH du fournisseur; à partir de 500 $, il doit aussi indiquer votre nom ou votre nom commercial. Vous pouvez confirmer un numéro de TPS/TVH auprès de l'ARC, et un numéro de TVQ auprès de Revenu Québec. Conservez vos registres pendant six ans à partir de la fin de la dernière année à laquelle ils se rapportent.",
        link: {
          label: "Lisez notre guide sur les règles de l'ARC concernant les reçus.",
          href: frArticle("cra-receipt-rules-canada"),
        },
      },
      { type: "h2", text: FR_FAQ_HEADING },
      {
        type: "faq",
        q: "Quelles provinces exigent la TVH?",
        a: "L'Ontario (13 %), la Nouvelle-Écosse (14 % depuis le 1er avril 2025), et le Nouveau-Brunswick, Terre-Neuve-et-Labrador et l'Île-du-Prince-Édouard (15 %). L'Alberta et les trois territoires n'exigent que la TPS de 5 %, et la Colombie-Britannique, la Saskatchewan, le Manitoba et le Québec exigent la TPS de 5 % plus leur propre taxe provinciale.",
      },
      {
        type: "faq",
        q: "Dois-je exiger la TPS/TVH si je gagne moins de 30 000 $?",
        a: "Pas tant que vous êtes un petit fournisseur, sauf si vous êtes chauffeur pour un service de covoiturage commercial, qui exige l'inscription dès le départ. Vous pouvez quand même vous inscrire volontairement, ce qui vous permet de demander des crédits de taxe sur les intrants, mais vous oblige à exiger et à verser la taxe.",
      },
      {
        type: "faq",
        q: "Puis-je récupérer la TVP que je paie sur mes achats d'entreprise?",
        a: "Pas comme vous récupérez la TPS/TVH. La Colombie-Britannique indique qu'il n'existe pas de crédits de taxe sur les intrants pour la TVP sur les biens achetés par une entreprise, et le Manitoba précise qu'un numéro de TVD ne vous permet pas d'acheter des biens ou des services taxables sans payer la TVD, sauf s'ils sont destinés à la revente ou à une autre fin exonérée. La TVQ est différente : les inscrits peuvent demander des remboursements de la taxe sur les intrants.",
      },
      {
        type: "faq",
        q: "Quel taux dois-je exiger à un client d'une autre province?",
        a: "Pour la plupart des services, le taux de la province de l'adresse domiciliaire ou d'affaires de votre client, si vous obtenez cette adresse dans le cours normal de vos activités. Dans l'exemple de l'ARC, un fournisseur du Québec qui conçoit un site Web pour une société dont l'adresse d'affaires est en Ontario exige la TVH au taux de l'Ontario.",
      },
      {
        type: "faq",
        q: "Existe-t-il une exception pour les petits vendeurs à l'égard de la TVP?",
        a: "En Colombie-Britannique, un petit vendeur dont les ventes au détail admissibles sont de 10 000 $ ou moins au cours des 12 mois précédents, et qui prévoit la même chose pour les 12 prochains mois, n'a pas à s'inscrire. Au Manitoba, les entreprises dont les ventes taxables annuelles sont inférieures à 30 000 $ n'ont généralement pas à s'inscrire à la TVD. La Saskatchewan indique que les entreprises qui y exercent leurs activités doivent s'inscrire.",
      },
      {
        type: "sources",
        links: [
          {
            label: "Calculatrice de la TPS/TVH (et tableau des taux)",
            href: `${GST_FR}/facturer-percevoir-quel-taux/calculatrice.html`,
          },
          {
            label: "Facturer ou percevoir la TPS/TVH",
            href: `${GST_FR}/facturer-percevoir-quel-taux.html`,
          },
          {
            label: "La TPS/TVH et les règles sur le lieu de fourniture",
            href: `${GST_FR}/facturer-percevoir-lieu-fourniture.html`,
          },
          {
            label: "Quand s'inscrire et commencer à facturer la TPS/TVH",
            href: `${GST_FR}/quand-inscrire-facture.html`,
          },
          {
            label: "S'inscrire volontairement au compte de TPS/TVH",
            href: `${GST_FR}/compte-inscrire-volontairement.html`,
          },
          {
            label: "Crédits de taxe sur les intrants pour la TPS/TVH",
            href: `${GST_FR}/calculer-preparer-declarer/credits-taxe-intrants.html`,
          },
          enOnly(
            "C.-B. : taxe de vente provinciale (PST)",
            `${BC_EN}/gov/content/taxes/sales-taxes/pst`,
          ),
          enOnly(
            "C.-B. : s'inscrire pour percevoir la PST",
            `${BC_EN}/gov/content/taxes/sales-taxes/pst/register`,
          ),
          enOnly(
            "C.-B. : guide de la PST pour les petites entreprises",
            `${BC_EN}/gov/content/taxes/sales-taxes/pst/publications/small-business-guide`,
          ),
          enOnly(
            "C.-B. : bulletin PST 003, Small Sellers",
            `${BC_EN}/assets/gov/taxes/sales-taxes/publications/pst-003-small-sellers.pdf`,
          ),
          enOnly("Saskatchewan : taxe de vente provinciale (PST)", SK_EN),
          enOnly("Saskatchewan : demande de numéro de PST", `${SK_EN}/apply-for-a-pst-number`),
          enOnly(
            "Saskatchewan : payer la PST sur les biens de votre entreprise",
            `${SK_EN}/pay-pst-on-your-business-assets`,
          ),
          {
            label: "Manitoba : la taxe sur les ventes au détail",
            href: `${MB}/taxes/retail.fr.html`,
          },
          enOnly(
            "Manitoba : avis RST 24-01, fin de l'obligation d'inscription pour les petites entreprises",
            `${MB}/pubs/bulletins/noticerst2401.pdf`,
          ),
          enOnly("Manitoba : dois-je m'inscrire?", `${MB}/pubs/bulletins/register.pdf`),
          enOnly(
            "Manitoba : bulletin RST 004, renseignements pour les vendeurs",
            `${MB}/pubs/bulletins/004.pdf`,
          ),
          { label: "Revenu Québec : TPS/TVH et TVQ", href: `${RQ_FR}/` },
          {
            label: "Revenu Québec : particularités concernant le petit fournisseur",
            href: `${RQ_FR}/inscription-aux-fichiers-de-la-tps-et-de-la-tvq/petit-fournisseur/`,
          },
        ],
        checked: `Tous consultés le 16 novembre 2026, sur canada.ca et les sites officiels de la Colombie-Britannique, de la Saskatchewan, du Manitoba et de Revenu Québec. Les pages de la Colombie-Britannique et de la Saskatchewan sur la taxe de vente et les bulletins du Manitoba n'existent qu'en anglais. ${DISCLAIMER}`,
      },
    ],
  }),
];

/* ----------------------------- Helpers ------------------------------------ */

export function getFrArticle(slug: string): FrArticle | undefined {
  return FR_ARTICLES.find((a) => a.slug === slug);
}

/** Related French articles: the article's relatedSlugs, then the rest, up to `count`. */
export function getFrRelatedArticles(slug: string, count = 3): FrArticle[] {
  const article = getFrArticle(slug);
  const ordered = [...(article?.relatedSlugs ?? []).map(getFrArticle), ...FR_ARTICLES].filter(
    (a): a is FrArticle => !!a && a.slug !== slug,
  );
  return [...new Map(ordered.map((a) => [a.slug, a])).values()].slice(0, count);
}

/** An article date ("2026-11-16") in Canadian French: "16 nov. 2026", in UTC. */
export function formatFrArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
