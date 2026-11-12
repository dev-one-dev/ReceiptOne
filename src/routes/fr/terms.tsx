import { Link, createFileRoute } from "@tanstack/react-router";
import { BulletList } from "@/components/site/PolicyHelpers";
import { RegionParagraph, type SummaryItem } from "@/components/site/legal/shared";
import { RegionInline, TermsDocument, type PartEntry } from "@/components/site/legal/TermsDocument";
import { FrenchPrecedenceNote } from "@/components/site/legal/FrenchPrecedenceNote";
import { pageSEO, breadcrumbJsonLd, regionHreflang } from "@/lib/seo";

/**
 * French (fr-CA) translation of routes/terms.tsx: the same parts, sections,
 * numbering, links and dates. Keep the two in step -- any change to the
 * English terms must be made here too, and vice versa.
 */

export const Route = createFileRoute("/fr/terms")({
  head: () => {
    const seo = pageSEO({
      path: "/fr/terms",
      hreflang: regionHreflang("/terms"),
      title: "Conditions d’utilisation | ReceiptOne",
      description:
        "Consultez les conditions d’utilisation de ReceiptOne pour les utilisateurs au Canada et aux États-Unis.",
      ogTitle: "Conditions d’utilisation | ReceiptOne",
      ogDescription:
        "Conditions d’utilisation juridiquement contraignantes qui régissent l’accès à ReceiptOne, y compris la facturation, le règlement des différends et les coordonnées.",
    });
    return {
      meta: [...seo.meta, { property: "og:locale", content: "fr_CA" }],
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", path: "/fr" },
              { name: "Conditions d’utilisation", path: "/fr/terms" },
            ]),
          ),
        },
      ],
    };
  },
  component: FrenchTermsPage,
});

/* ----------------------------- Content model ----------------------------- */

const TERMS_SUMMARY: SummaryItem[] = [
  {
    title: "Qui peut l’utiliser",
    body: "Les travailleurs autonomes, les entrepreneurs et les petites entreprises. Vous devez avoir l’âge légal et accepter les présentes Conditions.",
  },
  {
    title: "Votre compte",
    body: "Protégez vos identifiants de connexion. Vous êtes responsable des activités effectuées dans votre compte et de l’exactitude des données que vous téléversez.",
  },
  {
    title: "Abonnements et facturation",
    body: "Les forfaits payants sont facturés par l’Apple App Store ou Google Play. Les renouvellements, remboursements et annulations sont régis par les politiques de chaque magasin.",
  },
  {
    title: "Utilisation acceptable",
    body: "Aucune utilisation abusive, ingénierie inverse, extraction automatisée de données (scraping) ni téléversement de contenu illégal. Nous pouvons suspendre les comptes qui enfreignent les Conditions.",
  },
  {
    title: "Résultats de la ROC et de l’IA",
    body: "La ROC et l’IA facilitent le classement et l’extraction. Vérifiez toujours les résultats — vous êtes responsable de vos décisions fiscales et comptables.",
  },
  {
    title: "Aucun conseil professionnel",
    body: "ReceiptOne est un outil de tenue de registres, et non un conseil juridique, fiscal ou comptable. Consultez un professionnel pour votre situation.",
  },
  {
    title: "Responsabilité",
    body: "Les Services sont fournis « tels quels ». La responsabilité est limitée dans toute la mesure permise par la loi applicable.",
    region: "all",
  },
  {
    title: "Droit applicable",
    body: "Les présentes Conditions sont régies par les lois de la Colombie-Britannique (Canada). Les protections impératives des consommateurs de votre lieu de résidence, y compris celles du Québec, continuent de s’appliquer.",
    region: "all",
  },
  {
    title: "États-Unis — arbitrage",
    body: "Les différends sont réglés par voie d’arbitrage individuel exécutoire, avec renonciation aux recours collectifs, sauf lorsque la loi l’interdit.",
    region: "us",
  },
  {
    title: "Modifications et résiliation",
    body: "Nous pouvons mettre à jour les Conditions; les modifications importantes seront notifiées. Vous pouvez cesser d’utiliser les Services en tout temps.",
  },
];

const PARTS: PartEntry[] = [
  {
    id: "part-a",
    label: "Partie A",
    title: "Conditions générales d’utilisation",
    sections: [
      {
        number: "1",
        title: "Acceptation et portée",
        content: () => (
          <>
            <p>
              Les présentes Conditions s’appliquent à votre accès à ReceiptOne et à votre
              utilisation de ReceiptOne ainsi que de l’ensemble des fonctions, contenus, outils de
              soutien et services associés que nous mettons à votre disposition de temps à autre
              (collectivement, les « Services »). En créant un compte, en cliquant pour accepter, en
              téléchargeant, en installant, en consultant ou en utilisant les Services, vous
              acceptez d’être lié par les présentes Conditions et par nos dispositions sur la
              protection de la vie privée et des données figurant à la partie B.
            </p>
            <p>
              Si vous n’acceptez pas les présentes Conditions, vous ne devez pas accéder aux
              Services ni les utiliser.
            </p>
          </>
        ),
      },
      {
        number: "2",
        title: "Renseignements sur l’entreprise",
        content: () => (
          <BulletList
            items={[
              "Fournisseur de services : Flutter Horizon, une entreprise individuelle immatriculée en Colombie-Britannique (Canada), qui exploite le service ReceiptOne (receipt-one.com et les applications mobiles et Web ReceiptOne).",
              "Adresse d’affaires : 6555 Bonsor Ave, Burnaby, BC V5H 3E9, Canada.",
              "Territoire desservi : États-Unis et Canada.",
              "Soutien, demandes relatives à la protection des renseignements personnels et avis juridiques : support@receipt-one.com.",
              "Formulaire de contact : receipt-one.com/fr/contact.",
            ]}
          />
        ),
      },
      {
        number: "3",
        title: "Admissibilité et portée géographique",
        content: () => (
          <>
            <p>Vous devez avoir au moins 18 ans pour utiliser les Services.</p>
            <p>
              Les Services sont destinés uniquement aux utilisateurs situés aux États-Unis et au
              Canada. Nous n’offrons pas activement les Services dans l’Espace économique européen,
              au Royaume-Uni ni en Suisse. Si vous accédez aux Services à partir d’un autre
              territoire, vous le faites à vos propres risques et êtes responsable du respect des
              lois locales dans la mesure où elles s’appliquent.
            </p>
            <p>
              Vous déclarez et garantissez que vous avez la capacité juridique de conclure une
              entente contraignante et que votre utilisation des Services n’enfreint aucune loi
              applicable ni aucune restriction contractuelle.
            </p>
          </>
        ),
      },
      {
        number: "4",
        title: "Description des Services",
        content: () => (
          <>
            <p>
              ReceiptOne est une plateforme polyvalente de suivi des dépenses et de production de
              rapports. Selon votre forfait et la version du produit, les Services peuvent
              comprendre la numérisation de reçus, l’extraction de texte par reconnaissance optique
              de caractères (ROC), la catégorisation et l’étiquetage des dépenses, le suivi du
              kilométrage, des outils de répartition des frais de bureau à domicile, des analyses,
              des outils de téléversement en lot, une fonction de parrainage ainsi que la production
              et l’exportation de rapports dans des formats comme PDF et CSV.
            </p>
            <p>
              Les Services sont uniquement des outils de productivité et d’organisation de
              registres. Ils ne remplacent pas des conseils professionnels ni un examen indépendant
              de vos registres.
            </p>
          </>
        ),
      },
      {
        number: "5",
        title: "Aucun conseil fiscal, comptable, juridique ou financier",
        content: () => (
          <>
            <p>
              ReceiptOne n’est pas un préparateur de déclarations de revenus, un cabinet comptable,
              un cabinet d’avocats, un service de tenue de livres, un fournisseur de services de
              paie, un conseiller en placement ni un conseiller financier.
            </p>
            <p>
              Les Services ne fournissent aucun conseil fiscal, comptable, juridique ou financier;
              ne garantissent pas le respect des exigences de l’IRS, de l’ARC ou d’autres autorités;
              et ne garantissent pas qu’une déduction, un classement de dépense, une position
              fiscale, un rapport ou une estimation soit exact, complet ou légalement accessible
              pour vous.
            </p>
            <p>
              Tous les résultats de la ROC, les catégorisations générées par l’IA, les classements,
              les applications de taux, les calculs, les recommandations et les rapports ne sont que
              des estimations et peuvent comporter des erreurs, des omissions, des hypothèses
              dépassées ou des interprétations inexactes des renseignements fournis par
              l’utilisateur.
            </p>
            <p>
              Vous êtes seul responsable de vérifier les résultats des Services, de valider toutes
              les données, de décider si une déduction ou un crédit s’applique, de déterminer la
              façon de qualifier une dépense, de respecter vos obligations de déclaration et de
              tenue de registres, et de consulter un comptable, un préparateur de déclarations de
              revenus, un avocat ou un autre conseiller qualifié et autorisé, s’il y a lieu.
            </p>
          </>
        ),
      },
      {
        number: "6",
        title: "Comptes d’utilisateur et sécurité",
        content: () => (
          <>
            <p>
              Vous êtes responsable de préserver la confidentialité de vos identifiants de connexion
              et de toutes les activités effectuées dans votre compte. Vous devez nous aviser sans
              délai si vous croyez que votre compte a été compromis ou utilisé sans autorisation.
            </p>
            <p>
              Vous acceptez de fournir des renseignements exacts, à jour et complets et de tenir les
              renseignements de votre compte raisonnablement à jour.
            </p>
          </>
        ),
      },
      {
        number: "7",
        title: "Contenu de l’utilisateur; licence d’exploitation des Services",
        content: () => (
          <>
            <p>
              Vous demeurez propriétaire du contenu que vous téléversez, soumettez, stockez ou
              produisez au moyen des Services, y compris les images de reçus, les données de
              dépenses, les registres de kilométrage, les fichiers et les notes (le « Contenu de
              l’utilisateur »).
            </p>
            <p>
              Vous accordez à ReceiptOne une licence limitée, non exclusive, révocable et mondiale
              lui permettant d’héberger, de stocker, de reproduire, de transmettre, de traiter,
              d’analyser et d’afficher le Contenu de l’utilisateur uniquement dans la mesure
              raisonnablement nécessaire pour vous fournir les Services, les sécuriser, les
              maintenir, en assurer le soutien, les dépanner et les améliorer, pour respecter la loi
              et pour faire respecter les présentes Conditions.
            </p>
            <p>
              Sauf de la manière décrite dans les présentes Conditions, ReceiptOne ne revendique
              aucun droit de propriété sur votre Contenu de l’utilisateur.
            </p>
          </>
        ),
      },
      {
        number: "8",
        title: "Limitation de l’utilisation des données pour l’IA et l’apprentissage automatique",
        content: () => (
          <>
            <p>
              ReceiptOne peut utiliser des outils automatisés, y compris la ROC, des systèmes fondés
              sur des règles et le classement assisté par l’IA, pour exploiter les Services.
            </p>
            <p>
              Nous n’utilisons pas votre Contenu de l’utilisateur pour entraîner ou affiner des
              modèles de fondation tiers publics ou partagés destinés à un usage général. Lorsque
              nous faisons appel à des sous-traitants tiers pour fournir des fonctions de ROC ou
              d’IA, nous configurons ces services aux fins de la prestation des services et d’un
              traitement contractuel pour notre compte, sous réserve des conditions applicables des
              fournisseurs et des mesures de protection des données.
            </p>
            <p>
              Nous pouvons utiliser la télémétrie du service, des renseignements dépersonnalisés ou
              agrégés et des données sur le rendement opérationnel pour déboguer, sécuriser,
              maintenir, mesurer et améliorer les Services, à condition que cette utilisation ne
              modifie pas de façon importante la propriété de votre Contenu de l’utilisateur.
            </p>
          </>
        ),
      },
      {
        number: "9",
        title: "Utilisation acceptable; conduite interdite",
        content: () => (
          <>
            <p>
              Vous acceptez de ne pas utiliser les Services à des fins illégales, frauduleuses,
              trompeuses, contrefaisantes ou abusives.
            </p>
            <p>
              Vous ne devez pas téléverser de registres faux, fabriqués, altérés ou trompeurs dans
              le but de faire une fausse déclaration, d’éluder l’impôt ou de frauder une autre
              personne ou une autorité.
            </p>
            <p>
              Vous ne devez pas faire d’ingénierie inverse, entraver, désactiver, surcharger,
              extraire de manière automatisée (scraping), sonder ou exploiter les Services, ni
              tenter de contourner leurs protections de sécurité ou techniques, sauf dans la mesure
              limitée où une telle restriction est interdite par la loi applicable.
            </p>
            <p>
              Vous ne pouvez pas utiliser les Services d’une manière qui obligerait ReceiptOne à
              être assujettie à la HIPAA, à la GLBA, à la FISMA, à la norme PCI DSS ou à d’autres
              obligations réglementaires sectorielles que les Services ne sont pas conçus pour
              respecter.
            </p>
          </>
        ),
      },
      {
        number: "10",
        title: "Abonnements, facturation, renouvellement automatique et remboursements",
        content: () => (
          <>
            <p>
              Certaines fonctions nécessitent un abonnement payant. Si vous effectuez un achat par
              l’intermédiaire de l’Apple App Store ou du Google Play Store, la facturation,
              l’annulation, le traitement des remboursements et la gestion du mode de paiement sont
              régis principalement par les conditions et politiques du magasin applicable.
            </p>
            <p>
              Sauf indication contraire au moment de l’achat, les abonnements se renouvellent
              automatiquement à la fin de chaque cycle de facturation jusqu’à leur annulation.
              L’annulation prend généralement effet à la fin de la période payée en cours, sauf
              disposition contraire du magasin applicable ou de la loi.
            </p>
            <p>
              ReceiptOne ne reçoit, ne stocke ni ne traite les renseignements complets de votre
              carte de paiement lorsque les achats sont effectués par l’intermédiaire d’Apple ou de
              Google. Nous pouvons recevoir des métadonnées d’abonnement limitées, comme le type de
              forfait, l’état du renouvellement, les identifiants d’opération, le pays et l’état de
              l’abonnement, nécessaires pour fournir l’accès, détecter la fraude et soutenir la
              logique du service liée à la facturation.
            </p>
            <p>
              Sauf si la loi, la boutique d’applications concernée ou une offre le prévoit
              expressément, les frais ne sont pas remboursables.
            </p>
          </>
        ),
      },
      {
        number: "11",
        title: "Crédits promotionnels et récompenses de parrainage",
        content: () => (
          <>
            <p>
              Si ReceiptOne offre des récompenses de parrainage, des crédits promotionnels, des
              jours en prime, des rabais, des essais ou des incitatifs semblables, ces offres sont
              assujetties à des conditions supplémentaires propres au programme, qui peuvent figurer
              dans l’application ou sur le site Web.
            </p>
            <p>
              Sauf indication expresse contraire, les récompenses promotionnelles : a) n’ont aucune
              valeur monétaire; b) ne sont pas transférables; c) peuvent être révoquées en cas de
              fraude, d’abus, de rétrofacturation, de remboursement, d’activité liée à des comptes
              en double, d’autoparrainage ou de violation des règles du programme; et d) peuvent
              être modifiées, suspendues ou abandonnées en tout temps dans la mesure permise par la
              loi.
            </p>
            <p>
              Lorsqu’un programme de parrainage applique un avantage à une période de renouvellement
              future plutôt qu’à la période payée en cours, c’est ce moment d’application futur qui
              prévaut.
            </p>
          </>
        ),
      },
      {
        number: "12",
        title: "Propriété intellectuelle",
        content: () => (
          <>
            <p>
              À l’exception du Contenu de l’utilisateur, les Services et l’ensemble des logiciels,
              codes, bases de données, interfaces, conceptions, textes, éléments graphiques, logos,
              marques de commerce, marques de service, compilations et autres éléments connexes
              appartiennent à ReceiptOne ou à ses concédants de licence et sont protégés par les
              lois sur la propriété intellectuelle et d’autres lois.
            </p>
            <p>
              Sous réserve de votre respect des présentes Conditions, ReceiptOne vous accorde un
              droit limité, non exclusif, non transférable et révocable d’utiliser les Services pour
              vos besoins internes de gestion de registres personnels ou d’affaires.
            </p>
          </>
        ),
      },
      {
        number: "13",
        title: "Services et intégrations de tiers",
        content: () => (
          <>
            <p>
              Les Services peuvent interagir avec des services, plateformes, fournisseurs
              d’hébergement, outils d’analyse, boutiques d’applications, fournisseurs de
              cartographie ou de ROC, fournisseurs d’IA, fournisseurs de stockage ou autres
              intégrations de tiers, ou en dépendre. ReceiptOne n’est pas responsable des services
              de tiers, et votre utilisation de fonctions de tiers peut aussi être régie par des
              conditions et des avis de confidentialité distincts de ces tiers.
            </p>
            <p>
              Nous ne sommes pas responsables des pannes, erreurs, retards, indisponibilités,
              changements de prix, changements de politiques ou pratiques de traitement des données
              des plateformes de tiers, sauf dans la mesure exigée par la loi applicable.
            </p>
          </>
        ),
      },
      {
        number: "14",
        title: "Exclusion de garanties",
        content: () => (
          <>
            <p>
              DANS TOUTE LA MESURE PERMISE PAR LA LOI, LES SERVICES SONT FOURNIS « TELS QUELS » ET «
              SELON LEUR DISPONIBILITÉ », SANS GARANTIE D’AUCUNE SORTE, QU’ELLE SOIT EXPRESSE,
              IMPLICITE, LÉGALE OU AUTRE.
            </p>
            <p>
              DANS TOUTE LA MESURE PERMISE PAR LA LOI, RECEIPTONE EXCLUT TOUTE GARANTIE IMPLICITE, Y
              COMPRIS LES GARANTIES DE QUALITÉ MARCHANDE, D’ADÉQUATION À UN USAGE PARTICULIER, DE
              TITRE, D’ABSENCE DE CONTREFAÇON, DE JOUISSANCE PAISIBLE, D’EXACTITUDE ET
              D’EXHAUSTIVITÉ, AINSI QUE TOUTE GARANTIE DÉCOULANT DU COURS DES AFFAIRES OU DES USAGES
              DU COMMERCE.
            </p>
            <p>
              Sans limiter ce qui précède, ReceiptOne ne garantit pas que les Services seront
              ininterrompus, exempts d’erreurs, sécuritaires, à jour ou adaptés à une fin fiscale,
              comptable, de vérification, de financement, juridique ou réglementaire.
            </p>
          </>
        ),
      },
      {
        number: "15",
        title: "Limitation de responsabilité",
        content: (region) => (
          <>
            <p>
              DANS TOUTE LA MESURE PERMISE PAR LA LOI, RECEIPTONE ET SES SOCIÉTÉS AFFILIÉES,
              DIRIGEANTS, ADMINISTRATEURS, EMPLOYÉS, ENTREPRENEURS, CONCÉDANTS DE LICENCE ET
              FOURNISSEURS DE SERVICES NE PEUVENT ÊTRE TENUS RESPONSABLES DES DOMMAGES INDIRECTS,
              ACCESSOIRES, SPÉCIAUX, EXEMPLAIRES, CONSÉCUTIFS OU PUNITIFS, NI DE TOUTE PERTE DE
              PROFITS, DE REVENUS, DE DONNÉES, D’ACHALANDAGE, D’AVANTAGES FISCAUX OU D’OCCASIONS
              D’AFFAIRES, DÉCOULANT DES SERVICES OU DES PRÉSENTES CONDITIONS OU S’Y RAPPORTANT.
            </p>
            <p>
              DANS TOUTE LA MESURE PERMISE PAR LA LOI, RECEIPTONE NE PEUT ÊTRE TENUE RESPONSABLE DES
              PÉNALITÉS FISCALES, DES DÉDUCTIONS MANQUÉES, DES MANQUEMENTS EN MATIÈRE DE CONFORMITÉ,
              DE L’ISSUE DES VÉRIFICATIONS, DES DÉCISIONS DE DÉCLARATION DE L’UTILISATEUR NI DU FAIT
              DE S’ÊTRE FIÉ À LA ROC, À L’IA, À LA CATÉGORISATION, AUX ESTIMATIONS OU AUX RAPPORTS
              PRODUITS.
            </p>
            <p>
              DANS TOUTE LA MESURE PERMISE PAR LA LOI, LA RESPONSABILITÉ GLOBALE TOTALE DE
              RECEIPTONE POUR L’ENSEMBLE DES RÉCLAMATIONS DÉCOULANT DES SERVICES OU DES PRÉSENTES
              CONDITIONS OU S’Y RAPPORTANT NE PEUT DÉPASSER LE PLUS ÉLEVÉ DES MONTANTS SUIVANTS : A)
              LE MONTANT QUE VOUS AVEZ PAYÉ À RECEIPTONE POUR LES SERVICES AU COURS DES 12 MOIS
              PRÉCÉDANT L’ÉVÉNEMENT À L’ORIGINE DE LA RÉCLAMATION; OU B){" "}
              <RegionInline
                region={region}
                us="100 $ US"
                ca="l’équivalent en dollars canadiens de 100 $ US"
                both="100 $ US (ou l’équivalent en dollars canadiens)"
              />
              .
            </p>
            <p>
              Aucune disposition des présentes Conditions n’exclut ni ne limite une responsabilité
              qui ne peut être légalement exclue ou limitée, y compris la responsabilité pour faute
              lourde, inconduite volontaire, fraude, ou décès ou préjudice corporel causé par la
              négligence lorsqu’une telle exclusion est interdite.
            </p>
          </>
        ),
      },
      {
        number: "16",
        title: "Suspension et résiliation",
        content: () => (
          <>
            <p>
              ReceiptOne peut suspendre ou résilier votre accès aux Services, en tout ou en partie,
              immédiatement ou à une date ultérieure, si nous croyons raisonnablement que vous avez
              enfreint les présentes Conditions, créé un risque pour ReceiptOne ou pour d’autres
              personnes, commis une fraude ou un abus, ou si la loi ou une plateforme tierce dont
              dépendent les Services nous y oblige.
            </p>
            <p>
              Vous pouvez cesser d’utiliser les Services en tout temps. Si une fonction de
              suppression libre-service est offerte dans le produit, vous pouvez aussi demander la
              suppression dans les paramètres du compte ou en communiquant avec nous au moyen des
              coordonnées figurant dans les présentes Conditions.
            </p>
            <p>
              Les dispositions qui, de par leur nature, devraient survivre à la résiliation
              survivront, y compris celles relatives à la propriété, aux exclusions de garanties, à
              la limitation de responsabilité, au règlement des différends, aux obligations de
              paiement échues et à la conservation des données exigée par la loi.
            </p>
          </>
        ),
      },
      {
        number: "17",
        title:
          "Règlement des différends; arbitrage; renonciation aux recours collectifs (États-Unis)",
        regions: ["us"],
        content: () => (
          <>
            <p>
              Si vous êtes situé aux États-Unis, tout différend, toute réclamation ou toute
              controverse découlant des présentes Conditions ou des Services, ou s’y rapportant,
              sera réglé par voie d’arbitrage individuel définitif et exécutoire, sauf que chaque
              partie peut intenter une réclamation admissible devant une cour des petites créances
              et que chaque partie peut demander une injonction ou une autre réparation en equity en
              cas d’utilisation abusive de la propriété intellectuelle ou de renseignements
              confidentiels, ou d’accès non autorisé aux systèmes.
            </p>
            <p>
              L’arbitrage sera administré par l’American Arbitration Association conformément à ses
              Consumer Arbitration Rules. L’arbitrage peut se dérouler à distance, dans le comté de
              votre résidence ou dans un autre lieu convenu d’un commun accord.
            </p>
            <p>
              Vous et ReceiptOne renoncez à tout droit de participer à un recours collectif, à un
              arbitrage collectif, à un arbitrage de masse dans toute la mesure permise par la loi,
              ou à une procédure représentative.
            </p>
            <p>
              Vous pouvez vous retirer de l’arbitrage dans les 30 jours suivant votre première
              acceptation des présentes Conditions en envoyant un courriel à support@receipt-one.com
              avec l’objet « Arbitration Opt-Out » (Retrait de l’arbitrage) et l’adresse courriel de
              votre compte. Si une partie de la présente section est jugée inapplicable, cette
              partie sera retranchée et le reste sera appliqué dans toute la mesure permise par la
              loi.
            </p>
          </>
        ),
      },
      {
        number: "18",
        title: "Droit applicable",
        content: (region) => (
          <div className="space-y-4">
            {(region === "all" || region === "us") && (
              <RegionParagraph active={region === "us"} label="États-Unis">
                Pour les utilisateurs situés aux États-Unis, les présentes Conditions sont régies
                par les lois de la province de la Colombie-Britannique et les lois fédérales du
                Canada qui s’y appliquent, à l’exclusion des règles de conflit de lois, sauf dans la
                mesure où s’appliquent les lois impératives de protection des consommateurs de votre
                État de résidence. Les différends sont réglés de la manière prévue à la section 17.
              </RegionParagraph>
            )}
            {(region === "all" || region === "ca") && (
              <RegionParagraph active={region === "ca"} label="Canada">
                Pour les utilisateurs situés au Canada, les présentes Conditions sont régies par les
                lois de la province de la Colombie-Britannique et les lois fédérales du Canada qui
                s’y appliquent, à l’exclusion des règles de conflit de lois, sauf dans la mesure où
                s’appliquent les lois impératives de protection des consommateurs de votre province
                ou territoire, y compris, pour les résidents du Québec, la Loi sur la protection du
                consommateur (Québec).
              </RegionParagraph>
            )}
          </div>
        ),
      },
      {
        number: "19",
        title: "Modifications des Conditions",
        content: () => (
          <>
            <p>
              Nous pouvons réviser les présentes Conditions de temps à autre. Si nous y apportons
              des modifications importantes, nous en donnerons avis par des moyens raisonnables,
              comme un avis dans l’application, un courriel ou une autre communication bien en vue,
              avant leur entrée en vigueur lorsque la loi l’exige.
            </p>
            <p>
              Sauf si la loi l’exige autrement, le fait de continuer à utiliser les Services après
              la date d’entrée en vigueur des Conditions révisées constitue une acceptation de
              celles-ci. Si vous n’acceptez pas les Conditions révisées, vous devez cesser
              d’utiliser les Services et annuler tout abonnement avant leur entrée en vigueur.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "part-b",
    label: "Partie B",
    title: "Protection de la vie privée et des données",
    sections: [
      {
        number: "20",
        title: "Portée de l’avis de confidentialité",
        content: () => (
          <p>
            La présente partie B décrit comment ReceiptOne recueille, utilise, communique, conserve
            et protège les renseignements personnels dans le cadre des Services. Elle vise à
            répondre aux attentes en matière de divulgation des utilisateurs aux États-Unis et au
            Canada et devrait être complétée si les fonctions du produit, les intégrations ou les
            territoires ciblés changent de façon importante.
          </p>
        ),
      },
      {
        number: "21",
        title: "Catégories de renseignements que nous recueillons",
        content: () => (
          <>
            <p>
              <strong>Identifiants et renseignements de profil :</strong> comme le nom, l’adresse
              courriel, l’identifiant de compte, le pays, la province ou l’État, et les préférences
              du compte.
            </p>
            <p>
              <strong>Renseignements financiers et registres :</strong> comme les images de reçus,
              le texte extrait par ROC, les renseignements sur les commerçants, les dates, les
              catégories de dépenses, les registres de kilométrage, les rapports, les fichiers
              téléversés ainsi que les notes ou métadonnées connexes saisies par l’utilisateur.
            </p>
            <p>
              <strong>Renseignements techniques et sur l’appareil :</strong> comme l’adresse IP, les
              identifiants d’appareil, les identifiants d’application, le type de navigateur, le
              système d’exploitation, les journaux de plantage, les diagnostics, la télémétrie, les
              événements d’authentification et les journaux d’utilisation.
            </p>
            <p>
              <strong>Métadonnées d’abonnement et d’opération :</strong> comme le type de forfait,
              l’état dans le magasin d’applications, l’état du renouvellement, les jetons d’achat ou
              références d’opération, et les événements de facturation connexes provenant d’Apple ou
              de Google.
            </p>
            <p>
              <strong>Données de soutien et de communication :</strong> comme les messages que vous
              envoyez au soutien, les commentaires, les réponses aux sondages et les renseignements
              de dépannage.
            </p>
          </>
        ),
      },
      {
        number: "22",
        title: "Sources des renseignements",
        content: () => (
          <p>
            Nous recueillons des renseignements directement auprès de vous, automatiquement lors de
            votre utilisation des Services et de votre appareil, auprès des fournisseurs de
            boutiques d’applications relativement à l’état de l’abonnement, et auprès des
            fournisseurs de services ou des intégrations que vous utilisez par l’intermédiaire des
            Services.
          </p>
        ),
      },
      {
        number: "23",
        title: "Fins du traitement des renseignements",
        content: () => (
          <>
            <p>
              Nous traitons les renseignements personnels pour fournir, exploiter, authentifier,
              sécuriser, maintenir, soutenir, dépanner et améliorer les Services; effectuer la ROC
              et la catégorisation assistée par l’IA; produire les rapports demandés par les
              utilisateurs; administrer les abonnements et l’état des comptes; détecter la fraude et
              les abus; communiquer avec les utilisateurs; respecter la loi; faire respecter nos
              Conditions; et établir, exercer ou défendre des droits en justice.
            </p>
            <p>
              Lorsque la loi l’exige, nous demanderons votre consentement pour certaines activités
              de traitement ou fournirons des avis et des choix supplémentaires.
            </p>
          </>
        ),
      },
      {
        number: "24",
        title: "Communication des renseignements personnels",
        content: () => (
          <>
            <p>
              Nous pouvons communiquer des renseignements personnels à des fournisseurs de services
              et à des sous-traitants qui fournissent des services pour notre compte, comme
              l’hébergement, l’authentification, le stockage, la ROC, le traitement par l’IA, les
              diagnostics, le soutien à la clientèle, l’analyse, les communications et la
              surveillance de la sécurité.
            </p>
            <p>
              Nous pouvons aussi communiquer des renseignements : a) si la loi, une assignation, une
              ordonnance judiciaire ou une demande légitime l’exige; b) dans le cadre d’une fusion,
              d’une acquisition, d’un financement, d’une réorganisation, d’une vente d’actifs, d’une
              faillite ou d’une opération semblable; c) pour protéger des droits, des biens, la
              sécurité ou la sûreté; ou d) selon vos directives ou avec votre consentement.
            </p>
            <p>
              ReceiptOne ne vend pas de renseignements personnels contre de l’argent. ReceiptOne ne
              partage pas non plus de renseignements personnels à des fins de publicité
              comportementale intercontextuelle selon la portée actuelle du produit, à moins que
              nous ne fournissions un avis précis et tout mécanisme de refus exigé par la loi, et
              jusqu’à ce que nous le fassions.
            </p>
          </>
        ),
      },
      {
        number: "25",
        title: "Sous-traitants et sous-traitants ultérieurs tiers",
        content: () => (
          <>
            <p>
              À la date d’entrée en vigueur des présentes Conditions, ReceiptOne peut faire appel
              aux catégories de sous-traitants ultérieurs suivantes : fournisseurs
              d’authentification et de services dorsaux (comme Firebase/Google Cloud), fournisseurs
              de ROC et d’apprentissage automatique (comme Google Cloud Vision et Vertex AI),
              fournisseurs de classement assisté par l’IA (comme OpenAI) et outils d’affichage de
              logos ou de contenu (comme Logo.dev), ainsi que les fournisseurs d’infrastructure, de
              journalisation, de surveillance et de communication raisonnablement nécessaires à
              l’exploitation des Services.
            </p>
            <p>
              Les renseignements personnels traités par ces fournisseurs peuvent comprendre des
              images de reçus, le texte extrait par ROC, des noms de commerçants, des montants, des
              dates, des journaux d’utilisation, des identifiants et des métadonnées d’abonnement,
              selon la fonction précise exécutée.
            </p>
            <p>
              La liste actuelle des fournisseurs de services, les renseignements que chacun reçoit
              et le lieu où chacun les traite figurent à la section 5 de notre{" "}
              <Link
                to="/fr/privacy"
                className="font-medium text-foreground underline underline-offset-4"
              >
                politique de confidentialité
              </Link>
              .
            </p>
            <p>
              Nous exigeons que les fournisseurs de services agissant pour notre compte traitent les
              renseignements selon des mesures contractuelles ou de plateforme adaptées à leur rôle.
            </p>
          </>
        ),
      },
      {
        number: "26",
        title: "Traitement international et transfrontalier",
        content: () => (
          <>
            <p>
              Vos renseignements personnels sont stockés et traités aux États-Unis : notre base de
              données (Cloud Firestore) dans la multirégion nam5 (Iowa et Caroline du Sud), les
              fichiers dans Cloud Storage aux États-Unis, et le traitement côté serveur (Cloud
              Functions) dans us-central1 (Iowa). Certains fournisseurs de services peuvent aussi
              les traiter dans d’autres territoires où eux-mêmes ou leur infrastructure exercent
              leurs activités, comme il est indiqué à la section 5 de notre politique de
              confidentialité. Ces territoires peuvent avoir des lois sur la protection des
              renseignements personnels différentes de celles de votre lieu de résidence.
            </p>
            <p>
              En utilisant les Services, vous comprenez que vos renseignements peuvent être
              transférés et traités dans des pays situés à l’extérieur de votre territoire de
              résidence, sous réserve des mesures de protection juridiques applicables et des
              ententes contractuelles que nous concluons avec les fournisseurs de services lorsque
              cela est requis.
            </p>
          </>
        ),
      },
      {
        number: "27",
        title: "Conservation des renseignements personnels",
        content: () => (
          <>
            <p>
              Nous conservons les renseignements personnels aussi longtemps que cela est
              raisonnablement nécessaire aux fins décrites dans les présentes Conditions, notamment
              pour maintenir votre compte, fournir les Services, respecter les obligations de
              conservation légales et fiscales, régler les différends, faire respecter les ententes
              et soutenir la gestion légitime des documents de l’entreprise.
            </p>
            <p>
              Lorsque cela est réalisable sur le plan opérationnel, les demandes de suppression de
              compte entraîneront la suppression ou l’anonymisation des renseignements personnels
              dans un délai commercialement raisonnable. Certains renseignements peuvent être
              conservés plus longtemps dans des sauvegardes, des journaux, des conservations à des
              fins juridiques, des registres de prévention de la fraude, des registres fiscaux ou
              lorsque la loi l’exige ou le permet.
            </p>
          </>
        ),
      },
      {
        number: "28",
        title: "Droits et choix en matière de protection des renseignements personnels",
        content: () => (
          <>
            <p>
              Selon votre territoire, vous pourriez avoir le droit de demander l’accès aux
              renseignements personnels que nous détenons à votre sujet, leur rectification, leur
              suppression ou des renseignements à leur sujet, ainsi que de retirer votre
              consentement lorsque le consentement est le fondement juridique du traitement, sous
              réserve des limites juridiques et contractuelles.
            </p>
            <p>
              Les utilisateurs de certains territoires des États-Unis peuvent avoir des droits
              supplémentaires concernant les catégories de renseignements, les catégories de
              destinataires et la non-discrimination pour l’exercice de leurs droits en matière de
              protection des renseignements personnels. Les résidents de la Californie peuvent aussi
              avoir des droits concernant le partage ou la vente si ces notions devenaient
              applicables à ReceiptOne à l’avenir.
            </p>
            <p>
              Pour exercer vos droits en matière de protection des renseignements personnels,
              écrivez à{" "}
              <a
                className="font-medium text-foreground underline underline-offset-4"
                href="mailto:support@receipt-one.com"
              >
                support@receipt-one.com
              </a>
              , utilisez notre{" "}
              <Link
                to="/fr/contact"
                className="font-medium text-foreground underline underline-offset-4"
              >
                formulaire de contact
              </Link>
              , ou utilisez tout mécanisme de demande intégré à l’application que nous mettons à
              votre disposition. Nous pourrions devoir vérifier votre identité avant de donner suite
              à une demande. Les mandataires autorisés peuvent être tenus de fournir une preuve de
              leur pouvoir, s’il y a lieu.
            </p>
          </>
        ),
      },
      {
        number: "29",
        title: "Sécurité",
        content: () => (
          <p>
            ReceiptOne utilise des mesures de protection administratives, techniques et
            organisationnelles raisonnables conçues pour protéger les renseignements personnels, y
            compris le chiffrement en transit, les contrôles d’accès, la journalisation et les
            restrictions fondées sur les rôles. Aucune méthode de transmission ou de stockage n’est
            totalement sécuritaire, et nous ne pouvons pas garantir une sécurité absolue.
          </p>
        ),
      },
      {
        number: "30",
        title: "Avis d’incident et d’atteinte",
        content: () => (
          <p>
            Si ReceiptOne confirme un incident de sécurité touchant des renseignements personnels
            pour lequel la loi applicable exige un avis, nous aviserons les personnes concernées et
            les organismes de réglementation conformément à la loi applicable et dans les délais
            qu’elle prévoit. Tout délai d’avis précis indiqué dans une politique ou une
            communication du soutien est subordonné aux faits de l’incident, au temps d’enquête
            nécessaire et aux obligations légales.
          </p>
        ),
      },
      {
        number: "31",
        title: "Protection des renseignements personnels des enfants",
        content: () => (
          <p>
            Les Services ne sont pas destinés aux personnes de moins de 18 ans, et nous ne
            recueillons pas sciemment de renseignements personnels auprès d’enfants. Si nous
            apprenons qu’un enfant a fourni des renseignements personnels en violation des présentes
            Conditions, nous prendrons des mesures commercialement raisonnables pour les supprimer.
          </p>
        ),
      },
      {
        number: "32",
        title: "Modifications des renseignements sur la protection de la vie privée",
        content: () => (
          <p>
            Nous pouvons mettre à jour de temps à autre les renseignements sur la protection de la
            vie privée figurant dans les présentes Conditions pour tenir compte de changements
            touchant les Services, nos obligations légales ou nos pratiques de traitement. Les
            modifications importantes seront communiquées conformément à la loi.
          </p>
        ),
      },
    ],
  },
  {
    id: "part-c",
    label: "Partie C",
    title: "Dispositions finales",
    sections: [
      {
        number: "33",
        title: "Intégralité de l’entente; divisibilité; absence de renonciation",
        content: () => (
          <>
            <p>
              Les présentes Conditions constituent l’entente intégrale entre vous et ReceiptOne
              concernant les Services et remplacent toute entente antérieure ou concomitante portant
              sur le même objet, à l’exception des conditions supplémentaires expressément intégrées
              par renvoi ou présentées pour une fonction particulière.
            </p>
            <p>
              Si une disposition des présentes Conditions est jugée inapplicable, cette disposition
              sera appliquée dans toute la mesure permise et les autres dispositions demeureront
              pleinement en vigueur.
            </p>
            <p>
              Le fait de ne pas faire respecter une disposition ne constitue pas une renonciation à
              la faire respecter à l’avenir.
            </p>
          </>
        ),
      },
      {
        number: "34",
        title: "Coordonnées",
        content: (region) => (
          <>
            <BulletList
              items={[
                "Soutien, demandes relatives à la protection des renseignements personnels et avis juridiques : support@receipt-one.com.",
                "Formulaire de contact : receipt-one.com/fr/contact.",
              ]}
            />
            {(region === "all" || region === "us") && (
              <p>
                Retrait de l’arbitrage (États-Unis seulement) : support@receipt-one.com, objet : «
                Arbitration Opt-Out » (Retrait de l’arbitrage).
              </p>
            )}
            <BulletList
              items={[
                "Avis juridiques écrits : Flutter Horizon, 6555 Bonsor Ave, Burnaby, BC V5H 3E9, Canada.",
              ]}
            />
          </>
        ),
      },
    ],
  },
];

/* --------------------------------- Page --------------------------------- */

function FrenchTermsPage() {
  return (
    <TermsDocument
      lang="fr"
      storageKey="legal:terms-fr"
      parts={PARTS}
      summary={TERMS_SUMMARY}
      header={
        <>
          <FrenchPrecedenceNote />
          <p className="text-sm font-medium text-muted-foreground">
            Dernière mise à jour : 18 octobre 2026 · Date d’entrée en vigueur : 18 octobre 2026
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-normal sm:text-5xl">
            ReceiptOne — Conditions d’utilisation
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              Les présentes conditions juridiques (les « Conditions ») constituent une entente
              juridiquement contraignante entre vous et Flutter Horizon, une entreprise individuelle
              immatriculée en Colombie-Britannique (Canada), qui exploite le service ReceiptOne («
              ReceiptOne », « nous », « notre » ou « nos »), et régissent votre accès à
              l’application mobile ReceiptOne, à l’application Web et aux services connexes, ainsi
              que votre utilisation de ceux-ci.
            </p>
          </div>
        </>
      }
    />
  );
}
