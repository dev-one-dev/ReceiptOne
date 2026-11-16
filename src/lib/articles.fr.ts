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
    body: article.body.map(typesetBlock),
  };
}

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
