import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BulletList,
  DataTable,
  PrivacyDocument,
  Section,
  SubSection,
  type PrivacySectionMeta,
} from "@/components/site/legal/PrivacyDocument";
import type { SummaryItem } from "@/components/site/legal/shared";
import { FrenchPrecedenceNote } from "@/components/site/legal/FrenchPrecedenceNote";
import { pageSEO, breadcrumbJsonLd, regionHreflang } from "@/lib/seo";
import { openConsentSettings } from "@/lib/consent";

/**
 * French (fr-CA) translation of routes/privacy.tsx: the same sections,
 * numbering, lists, tables, links and "Last updated" date. Keep the two in
 * step -- any change to the English policy must be made here too, and vice
 * versa.
 */

/* ----------------------------- Section catalog ---------------------------- */

const SECTIONS: PrivacySectionMeta[] = [
  { number: "1", title: "Portée" },
  {
    number: "2",
    title: "Renseignements que nous recueillons",
    subsections: [
      { id: "2.1", title: "2.1 Renseignements que vous nous fournissez directement" },
      { id: "2.2", title: "2.2 Données relatives aux reçus, aux dépenses et à l’impôt" },
      { id: "2.3", title: "2.3 Renseignements de paiement" },
      { id: "2.4", title: "2.4 Renseignements recueillis automatiquement" },
      { id: "2.5", title: "2.5 Autorisations de l’appareil" },
      { id: "2.6", title: "2.6 Renseignements de localisation et localisation en arrière-plan" },
      {
        id: "2.7",
        title: "2.7 Catégories de renseignements personnels pour les résidents de la Californie",
        region: "us",
      },
    ],
  },
  { number: "3", title: "Comment nous utilisons les renseignements personnels" },
  { number: "4", title: "Traitement automatisé et assisté par l’IA" },
  { number: "5", title: "Comment nous communiquons les renseignements personnels" },
  { number: "6", title: "Traitement international et transfrontalier" },
  { number: "7", title: "Conservation des données" },
  {
    number: "8",
    title: "Vos droits en matière de protection des renseignements personnels",
    subsections: [
      { id: "8.1", title: "8.1 Canada (LPRPDE et Loi 25 du Québec)", region: "ca" },
      { id: "8.2", title: "8.2 États-Unis (Californie et autres États)", region: "us" },
      { id: "8.3", title: "8.3 Comment présenter une demande" },
      { id: "8.4", title: "8.4 Vérification et appels" },
    ],
  },
  {
    number: "9",
    title: "Consentement",
    subsections: [
      { id: "9.1", title: "9.1 Consentement général" },
      {
        id: "9.2",
        title:
          "9.2 Consentement exprès pour les résidents du Québec et les renseignements sensibles",
        region: "ca",
      },
      { id: "9.3", title: "9.3 Retrait du consentement" },
    ],
  },
  { number: "10", title: "Mesures de sécurité" },
  { number: "11", title: "Protection des renseignements personnels des enfants" },
  { number: "12", title: "Modifications de la présente politique de confidentialité" },
  { number: "13", title: "Coordonnées" },
];

const PRIVACY_SUMMARY: SummaryItem[] = [
  {
    title: "Ce que nous recueillons",
    body: "Renseignements de compte, reçus et dépenses que vous téléversez, données extraites par ROC, position de l’appareil pendant l’enregistrement d’un trajet, diagnostics d’appareil et d’utilisation, et métadonnées d’abonnement limitées provenant d’Apple et de Google.",
  },
  {
    title: "Localisation",
    body: "Recueillie uniquement pendant l’enregistrement d’un trajet, y compris en arrière-plan, et utilisée uniquement pour vos registres de kilométrage. Jamais vendue ni utilisée à des fins publicitaires.",
  },
  {
    title: "Utilisation",
    body: "Pour exploiter les Services, traiter les reçus par ROC et IA, produire des rapports, sécuriser les comptes et respecter la loi. Aucune vente de renseignements personnels.",
  },
  {
    title: "Traitement par l’IA",
    body: "Les fonctions de ROC et d’assistance par l’IA extraient et classent les données pour vous. Vous pouvez vérifier et corriger les résultats.",
  },
  {
    title: "Communication",
    body: "Limitée aux fournisseurs de services énumérés à la section 5 (hébergement, traitement par l’IA, cartographie, abonnements, courriel, messagerie), situés pour la plupart aux États-Unis, ainsi qu’aux communications exigées par la loi ou à des fins de conformité.",
  },
  {
    title: "Vos droits",
    body: "Accès, rectification, suppression, portabilité et droit de retirer votre consentement. Envoyez vos demandes à support@receipt-one.com.",
    region: "all",
  },
  {
    title: "Droits au Québec et en vertu de la LPRPDE",
    body: "Comprend la portabilité des données, le droit d’être informé des décisions automatisées et le droit de porter plainte auprès du CPVP ou de la CAI.",
    region: "ca",
  },
  {
    title: "Californie (CCPA/CPRA)",
    body: "Droit de savoir, de supprimer, de corriger et de limiter l’utilisation des renseignements personnels sensibles. Nous ne vendons ni ne partageons de renseignements à des fins de publicité comportementale intercontextuelle.",
    region: "us",
  },
  {
    title: "Conservation et sécurité",
    body: "Conservés seulement le temps nécessaire aux Services et au respect des obligations légales. Chiffrés en transit et au repos, avec contrôles d’accès.",
  },
  {
    title: "Nous joindre",
    body: "Responsable de la protection des renseignements personnels, Flutter Horizon : support@receipt-one.com ou le formulaire de contact à receipt-one.com/fr/contact.",
  },
];

export const Route = createFileRoute("/fr/privacy")({
  head: () => {
    const seo = pageSEO({
      path: "/fr/privacy",
      hreflang: regionHreflang("/privacy"),
      title: "Politique de confidentialité | ReceiptOne",
      description:
        "Découvrez comment ReceiptOne recueille, utilise, protège et gère les renseignements personnels des utilisateurs au Canada et aux États-Unis.",
      ogTitle: "Politique de confidentialité | ReceiptOne",
      ogDescription:
        "Comment ReceiptOne recueille, utilise, communique, conserve et protège les renseignements personnels des utilisateurs au Canada et aux États-Unis.",
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
              { name: "Politique de confidentialité", path: "/fr/privacy" },
            ]),
          ),
        },
      ],
    };
  },
  component: FrenchPrivacyPage,
});

function FrenchPrivacyPage() {
  return (
    <PrivacyDocument
      lang="fr"
      storageKey="legal:privacy-fr"
      sections={SECTIONS}
      summary={PRIVACY_SUMMARY}
      header={
        <>
          <FrenchPrecedenceNote />
          <p className="text-sm font-medium text-muted-foreground">
            Dernière mise à jour : 9 novembre 2026
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-normal sm:text-5xl">
            ReceiptOne — Politique de confidentialité
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              La présente politique de confidentialité explique comment Flutter Horizon, une
              entreprise individuelle immatriculée en Colombie-Britannique (Canada), qui exploite le
              service ReceiptOne (« ReceiptOne », « nous », « notre » ou « nos »), recueille,
              utilise, communique, conserve et protège les renseignements personnels lorsque vous
              utilisez les applications mobiles ReceiptOne (iOS et Android), l’application Web
              ReceiptOne et les services connexes (collectivement, les « Services »).
            </p>
            <p>
              ReceiptOne est conçu pour les travailleurs autonomes, les entrepreneurs et les petites
              entreprises.
            </p>
            <p>
              La présente politique de confidentialité vise à respecter les lois applicables en
              matière de protection des renseignements personnels au Canada et aux États-Unis,
              notamment :
            </p>
            <BulletList
              items={[
                "La Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE) (Canada, fédéral)",
                "La Loi 25 du Québec (modifiant la Loi sur la protection des renseignements personnels dans le secteur privé) (Québec, Canada)",
                "La California Consumer Privacy Act (CCPA), telle que modifiée par la California Privacy Rights Act (CPRA) (Californie, États-Unis)",
                "Les autres lois des États américains applicables en matière de protection des renseignements personnels (Colorado, Connecticut, Utah, Virginie et autres)",
              ]}
            />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            <strong className="text-foreground">
              Demandes et questions relatives à la protection des renseignements personnels :
            </strong>{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="mailto:support@receipt-one.com"
            >
              support@receipt-one.com
            </a>
          </p>
        </>
      }
    >
      <Section number="1" title="Portée">
        <p>
          La présente politique de confidentialité s’applique aux renseignements personnels
          recueillis par l’intermédiaire des Services, notamment lorsque vous :
        </p>
        <BulletList
          items={[
            "Créez un compte",
            "Téléversez des reçus, des factures ou d’autres documents",
            "Enregistrez ou saisissez des trajets (kilométrage)",
            "Utilisez les fonctions de rapports, d’analyse ou de configuration fiscale",
            "Communiquez avec le soutien",
            "Interagissez autrement avec les Services",
          ]}
        />
      </Section>

      <Section number="2" title="Renseignements que nous recueillons">
        <SubSection title="2.1 Renseignements que vous nous fournissez directement">
          <BulletList
            items={[
              "Nom",
              "Adresse courriel",
              "Identifiants de connexion au compte",
              "Renseignements sur l’état de l’abonnement et de la facturation reçus des plateformes de magasins d’applications (Apple App Store, Google Play Store)",
              "Préférences et paramètres de l’application",
              "Pays, province ou État, et autres données de configuration utiles à la logique fiscale et aux rapports",
              "Demandes de soutien et communications que vous nous envoyez",
            ]}
          />
        </SubSection>

        <SubSection title="2.2 Données relatives aux reçus, aux dépenses et à l’impôt">
          <p>
            Pour fournir les fonctions de suivi, d’organisation et de rapports des dépenses, nous
            pouvons recueillir et traiter :
          </p>
          <BulletList
            items={[
              "Les images de reçus et de documents que vous téléversez",
              "Les données extraites des reçus ou des documents par reconnaissance optique de caractères (ROC), comme le nom du commerçant, la date de l’opération, le montant, les taxes et la devise",
              "Les dépenses saisies manuellement et les notes connexes",
              "Les registres de kilométrage et de trajets",
              "Les renseignements sur le bureau à domicile, comme la superficie, les pourcentages de répartition et les données de dépenses connexes",
              "Les formulaires, rapports ou documents fiscaux que vous téléversez ou produisez au moyen des Services",
            ]}
          />
          <p>
            <strong>Renseignements personnels sensibles :</strong> Les images de reçus, les
            registres de dépenses et les documents téléversés peuvent contenir des renseignements
            financiers et d’autres renseignements commerciaux sensibles. Nous traitons ces
            renseignements uniquement dans la mesure raisonnablement nécessaire pour fournir,
            sécuriser, maintenir et améliorer les Services, et aux autres fins décrites dans la
            présente politique de confidentialité.
          </p>
        </SubSection>

        <SubSection title="2.3 Renseignements de paiement">
          <p>
            ReceiptOne ne recueille ni ne conserve de numéros complets de cartes de paiement au
            moyen de l’application mobile.
          </p>
          <p>
            Les paiements des abonnements mobiles sont traités par des plateformes tierces comme
            l’Apple App Store et le Google Play Store. Nous recevons de ces plateformes des
            métadonnées d’abonnement limitées, notamment :
          </p>
          <BulletList
            items={[
              "Le type de forfait",
              "L’état du renouvellement",
              "Le pays",
              "Les identifiants d’opération",
              "L’état de l’abonnement",
            ]}
          />
          <p>
            Si d’autres modes de facturation Web ou d’autres processeurs de paiement sont ajoutés à
            l’avenir, la présente politique de confidentialité sera mise à jour en conséquence.
          </p>
        </SubSection>

        <SubSection title="2.4 Renseignements recueillis automatiquement">
          <BulletList
            items={[
              "Type d’appareil, système d’exploitation et version de l’application",
              "Adresse IP et position approximative déduite de l’adresse IP",
              "Données d’utilisation, d’interaction et d’activité des fonctions",
              "Rapports de plantage, diagnostics et renseignements sur le rendement",
              "Renseignements de sécurité et journaux nécessaires pour détecter les utilisations abusives, la fraude ou les erreurs de service",
            ]}
          />
          <p>
            <strong>
              Sur notre site Web (receipt-one.com) — témoins et technologies semblables :
            </strong>{" "}
            les témoins d’analyse ne sont utilisés que si vous les acceptez dans notre bandeau sur
            les témoins. Tant que vous ne les avez pas acceptés, rien n’est transmis à Google
            Analytics. Vous pouvez modifier votre choix en tout temps au moyen du lien « Paramètres
            des témoins » dans le pied de page du site Web ou{" "}
            <button
              type="button"
              onClick={openConsentSettings}
              className="font-medium text-foreground underline underline-offset-4"
            >
              ici
            </button>
            . Les témoins de receipt-one.com peuvent être partagés avec app.receipt-one.com, notre
            application Web. Le site Web utilise :
          </p>
          <BulletList
            items={[
              "Un témoin interne nommé « ro_consent », qui conserve votre choix relatif aux témoins (« granted » [accepté] ou « denied » [refusé]) pendant 12 mois, afin que nous ne vous le redemandions pas à chaque visite.",
              "Un témoin interne nommé « ro_attr », placé uniquement lorsque vous arrivez par un lien comportant des paramètres de campagne publicitaire (comme utm_source, utm_campaign ou des identifiants de clic comme gclid), qui conserve ces paramètres, la page sur laquelle vous êtes arrivé et l’heure pendant 90 jours, afin que nous sachions quelle campagne a amené un visiteur et puissions la créditer si vous vous inscrivez.",
              "Des témoins de Google Analytics nommés « _ga » et « _ga_<ID> », placés uniquement après que vous avez accepté les témoins d’analyse. Google Analytics (Google LLC) reçoit votre adresse IP, des renseignements sur votre navigateur et votre appareil, les pages que vous consultez et les boutons sur lesquels vous cliquez (comme les liens d’inscription ou vers les magasins d’applications), et nous l’utilisons pour mesurer les visites et le rendement de nos publicités. Si vous refusez par la suite, nous supprimons ces témoins et Google Analytics cesse la collecte.",
              "Google reCAPTCHA v3, par l’intermédiaire de Firebase App Check, sur chaque page, pour protéger notre formulaire de contact et nos services contre les abus automatisés. reCAPTCHA recueille votre adresse IP, des renseignements sur votre navigateur et votre appareil ainsi que des signaux d’interaction, et peut placer des témoins de Google.",
              "Google Fonts, qui reçoit votre adresse IP et des renseignements sur votre navigateur lorsque la page charge ses polices.",
              "Un témoin interne et une entrée de stockage local nommés « ro_referral », placés uniquement lorsque vous ouvrez un lien de parrainage (receipt-one.com/r/...), qui conservent le code de parrainage pendant 30 jours afin que le parrainage soit crédité si vous vous inscrivez plus tard.",
              "Le stockage local de votre navigateur, pour mémoriser vos préférences d’interface, comme les sections de nos pages juridiques que vous avez développées. Ces renseignements restent sur votre appareil.",
            ]}
          />
        </SubSection>

        <SubSection title="2.5 Autorisations de l’appareil">
          <DataTable
            headers={["Autorisation", "Fin", "Peut-elle être révoquée?"]}
            rows={[
              [
                "Appareil photo",
                "Prendre des images de reçus ou de documents lorsque vous lancez une numérisation",
                "Oui",
              ],
              [
                "Photothèque / Stockage",
                "Sélectionner les fichiers ou les images que vous choisissez de téléverser",
                "Oui",
              ],
              [
                "Notifications push",
                "Envoyer des rappels, des alertes et des mises à jour liés au service",
                "Oui",
              ],
              [
                "Localisation (pendant l’utilisation de l’application)",
                "Enregistrer un trajet que vous lancez et rechercher les adresses des trajets (voir la section 2.6)",
                "Oui",
              ],
              [
                "Localisation en arrière-plan (« Toujours autoriser » sur Android, « Toujours » sur iOS)",
                "Continuer d’enregistrer un trajet que vous avez lancé lorsque l’application est en arrière-plan ou fermée (voir la section 2.6)",
                "Oui",
              ],
            ]}
          />
          <p>
            Vous pouvez révoquer les autorisations de l’appareil dans les paramètres de votre
            appareil. Dans ce cas, certaines fonctions pourraient être limitées ou non disponibles.
          </p>
        </SubSection>

        <SubSection title="2.6 Renseignements de localisation et localisation en arrière-plan">
          <p>
            L’application mobile ReceiptOne peut enregistrer un trajet d’affaires à l’aide de la
            position de votre appareil, afin que votre registre de kilométrage indique l’itinéraire
            et la distance parcourue.
          </p>
          <p>
            <strong>Ce que nous recueillons :</strong> pendant l’enregistrement d’un trajet,
            l’application recueille la position précise de votre appareil (latitude et longitude)
            avec l’heure de chaque relevé, et calcule à partir de celle-ci la distance du trajet.
            Nous conservons aussi les adresses de départ et d’arrivée ainsi que la note sur l’objet
            du trajet enregistrée avec celui-ci.
          </p>
          <p>
            <strong>Collecte en arrière-plan :</strong> Lorsque vous activez le suivi des trajets
            dans l’application mobile, nous recueillons la position de votre appareil en
            arrière-plan pour enregistrer vos trajets, soit en tout temps, soit selon l’horaire que
            vous choisissez. L’application affiche une notification sur votre appareil pendant
            l’enregistrement d’un trajet.
          </p>
          <p>
            <strong>Pourquoi nous la recueillons :</strong> uniquement pour créer vos registres de
            kilométrage, soit l’itinéraire, la distance et la date du trajet dans votre registre,
            ainsi que les données d’utilisation à des fins professionnelles et les rapports de
            kilométrage établis à partir de celui-ci.
          </p>
          <p>
            <strong>Ce que nous ne faisons pas :</strong> nous ne vendons pas les données de
            localisation, nous ne les utilisons pas à des fins publicitaires ni pour établir des
            profils publicitaires, et nous ne les communiquons pas à des courtiers en données. Elles
            ne sont communiquées qu’aux fournisseurs de services qui les stockent et calculent les
            itinéraires et les distances pour notre compte (Google Cloud / Firebase et Google Maps
            Platform; voir la section 5).
          </p>
          <p>
            <strong>Comment la désactiver :</strong> Vous pouvez suspendre ou désactiver le suivi
            des trajets en tout temps dans les paramètres de trajet de l’application, et vous pouvez
            retirer l’autorisation de localisation en tout temps dans les paramètres de votre
            appareil. Lorsque le suivi des trajets est désactivé ou suspendu, nous ne recueillons
            pas de données de localisation pour les trajets. Pour mettre fin complètement à la
            collecte en arrière-plan, modifiez l’autorisation de localisation de ReceiptOne dans les
            paramètres de votre appareil (Android : Paramètres → Applications → ReceiptOne →
            Autorisations → Position; iOS : Réglages → ReceiptOne → Position) pour choisir «
            Autoriser seulement pendant l’utilisation de l’application », « Lorsque l’app est active
            » ou « Ne pas autoriser ». Vous pouvez toujours saisir des trajets manuellement en
            tapant les adresses de départ et d’arrivée.
          </p>
          <p>
            <strong>Durée de conservation :</strong> les données de localisation enregistrées pour
            un trajet sont conservées avec ce trajet jusqu’à ce que vous supprimiez le trajet ou
            votre compte, sous réserve des règles de conservation de la section 7.
          </p>
        </SubSection>

        <SubSection title="2.7 Catégories de renseignements personnels pour les résidents de la Californie">
          <p>
            Aux fins de la CCPA/CPRA, nous pouvons recueillir les catégories de renseignements
            personnels suivantes :
          </p>
          <DataTable
            headers={["Catégorie", "Exemples"]}
            rows={[
              [
                "Identifiants",
                "Nom, adresse courriel, identifiants de compte, identifiants liés à l’appareil",
              ],
              ["Dossiers clients", "État de l’abonnement, historique du service"],
              [
                "Renseignements commerciaux",
                "Métadonnées des opérations, détails du forfait d’abonnement",
              ],
              [
                "Activité Internet",
                "Utilisation de l’application, diagnostics, données d’interaction",
              ],
              ["Géolocalisation approximative", "Déduite de l’adresse IP"],
              [
                "Renseignements personnels sensibles",
                "Renseignements financiers ou liés aux dépenses contenus dans les reçus, les rapports et les documents téléversés; géolocalisation précise enregistrée pendant l’enregistrement d’un trajet que vous avez lancé",
              ],
            ]}
          />
          <p>
            Nous n’utilisons pas les renseignements personnels sensibles pour inférer des
            caractéristiques sur des personnes. Nous les utilisons uniquement à des fins limitées
            raisonnablement nécessaires pour fournir les Services, assurer la sécurité, détecter les
            erreurs ou la fraude, respecter la loi et accomplir d’autres fins commerciales permises.
          </p>
        </SubSection>
      </Section>

      <Section number="3" title="Comment nous utilisons les renseignements personnels">
        <p>Nous utilisons les renseignements personnels aux fins suivantes :</p>
        <BulletList
          items={[
            "Créer, administrer et sécuriser votre compte",
            "Fournir, exploiter, maintenir et améliorer les Services",
            "Traiter les images de reçus et les documents au moyen de la ROC et d’outils assistés par l’IA",
            "Organiser, classer et résumer les dépenses et les registres fiscaux",
            "Produire des rapports, des exportations et les résultats que vous demandez",
            "Synchroniser les données entre les appareils et les plateformes prises en charge",
            "Communiquer avec vous au sujet des avis liés au service, du soutien, des mises à jour et des questions de sécurité",
            "Détecter, examiner et prévenir la fraude, les abus, les incidents de sécurité ou les problèmes techniques, ou y répondre",
            "Respecter nos obligations légales, faire respecter nos ententes et protéger les droits, la sécurité et les biens",
          ]}
        />
        <p>
          Lorsque la loi le permet, nous pouvons aussi utiliser des renseignements dépersonnalisés
          ou agrégés à des fins d’analyse, de recherche, d’amélioration du service et d’exploitation
          de l’entreprise.
        </p>
        <p>
          <strong>Important :</strong> ReceiptOne fournit uniquement des outils d’organisation et
          d’information et ne fournit aucun conseil juridique, comptable, fiscal ou financier.
        </p>
      </Section>

      <Section number="4" title="Traitement automatisé et assisté par l’IA">
        <p>ReceiptOne utilise des outils automatisés et un traitement assisté par l’IA pour :</p>
        <BulletList
          items={[
            "Extraire des données structurées des images de reçus et de documents",
            "Suggérer des catégories de commerçants ou de dépenses",
            "Appliquer des règles de logique fiscale propres à chaque pays et fournir une aide au calcul",
            "Faciliter la reconnaissance, la normalisation et l’organisation du contenu téléversé",
          ]}
        />
        <p>
          <strong>Limites du traitement par l’IA :</strong>
        </p>
        <BulletList
          items={[
            "Ces traitements ne prennent pas de décisions juridiques, de crédit, d’emploi, d’assurance ou d’autres décisions d’importance similaire concernant des personnes",
            "Les utilisateurs peuvent en tout temps vérifier, modifier, remplacer ou supprimer les registres qui en résultent dans les Services",
            "Les suggestions de l’IA sont fournies à titre informatif seulement et ne doivent pas être considérées comme des conseils fiscaux ou financiers définitifs",
          ]}
        />
      </Section>

      <Section number="5" title="Comment nous communiquons les renseignements personnels">
        <p>
          <strong>
            Nous ne vendons pas de renseignements personnels. Nous ne partageons pas de
            renseignements personnels à des fins de publicité comportementale intercontextuelle.
          </strong>
        </p>
        <p>
          Nous pouvons communiquer des renseignements personnels aux catégories de destinataires
          suivantes à des fins commerciales ou opérationnelles :
        </p>
        <BulletList
          items={[
            "Fournisseurs d’hébergement infonuagique et d’infrastructure",
            "Fournisseurs de services d’authentification, de stockage, de base de données, de messagerie et de plateforme",
            "Fournisseurs de services de ROC, d’analyse de documents et d’IA",
            "Fournisseurs de services de journalisation, de diagnostic et de rapports de plantage",
            "Fournisseurs de services de cartographie et de recherche d’adresses",
            "Fournisseurs de services de gestion des abonnements",
            "Fournisseurs de services de courriel, de messagerie et de communication avec la clientèle",
            "Conseillers professionnels, vérificateurs, assureurs et fournisseurs de services de conformité juridique, lorsque cela est raisonnablement nécessaire",
            "Autorités gouvernementales, tribunaux, organismes de réglementation, forces de l’ordre ou autres tiers, lorsque la loi ou une procédure judiciaire l’exige",
          ]}
        />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Fournisseurs de services (sous-traitants) auxquels nous faisons appel
        </h3>
        <p>
          Les fournisseurs de services suivants traitent des renseignements personnels pour notre
          compte. Chacun ne reçoit que les renseignements nécessaires à sa fonction. La plupart
          d’entre eux traitent les renseignements à l’extérieur du Canada, principalement aux
          États-Unis.
        </p>
        <DataTable
          headers={["Fournisseur", "Renseignements reçus", "Fin", "Lieu de traitement"]}
          rows={[
            [
              "Google Cloud / Firebase (Google LLC) : Authentication, Cloud Firestore, Cloud Storage, Cloud Functions, Cloud Messaging",
              "Renseignements de compte (nom, courriel, identifiants de connexion), reçus et documents téléversés, registres de dépenses, de kilométrage, de localisation des trajets et de bureau à domicile, demandes de soutien, jetons d’appareil et journaux de service",
              "Hébergement, connexion, stockage de la base de données et des fichiers, traitement côté serveur et notifications push",
              "États-Unis — à l’extérieur du Canada. Cloud Firestore : multirégion nam5 (Iowa et Caroline du Sud). Cloud Functions : us-central1 (Iowa). Cloud Storage : États-Unis.",
            ],
            [
              "Google Vertex AI — Gemini (Google LLC)",
              "Images et PDF de reçus et le texte qui en est extrait; pour l’assistant IA, vos questions et les registres de dépenses nécessaires pour y répondre",
              "Reconnaissance des reçus et extraction des données, et assistant IA intégré à l’application",
              "Point de terminaison mondial de Google, qui peut acheminer les requêtes vers n’importe quelle région Google, y compris les États-Unis — à l’extérieur du Canada",
            ],
            [
              "Google Cloud Vision API (Google LLC)",
              "Images de reçus prises dans l’application mobile",
              "Extraction du texte des images de reçus",
              "Point de terminaison mondial de Google, qui peut acheminer les requêtes vers n’importe quelle région Google, y compris les États-Unis — à l’extérieur du Canada",
            ],
            [
              "OpenAI, LLC",
              "Noms de commerçants et texte extrait des reçus; s’il est configuré comme solution de rechange, contenu des reçus et questions posées à l’assistant",
              "Identification des commerçants dans l’application mobile, et fournisseur de relève pour la reconnaissance des reçus et l’assistant IA",
              "États-Unis — à l’extérieur du Canada",
            ],
            [
              "Google Maps Platform (Google LLC)",
              "Adresses et recherches de lieux que vous saisissez, points de départ et d’arrivée des trajets, votre adresse IP",
              "Recherche d’adresses et calcul des itinéraires et des distances pour les trajets",
              "États-Unis et autres emplacements de Google — à l’extérieur du Canada",
            ],
            [
              "RevenueCat, Inc.",
              "Votre identifiant de compte, les identifiants d’opération des magasins d’applications, le forfait, l’état du renouvellement et de l’abonnement, et le pays",
              "Gestion des abonnements et de l’accès aux fonctions payantes",
              "États-Unis — à l’extérieur du Canada",
            ],
            [
              "Telegram (uniquement si vous connectez le robot ReceiptOne)",
              "Vos identifiants d’utilisateur et de conversation Telegram, les photos de reçus, fichiers et messages que vous envoyez au robot, et nos réponses",
              "Réception de reçus et de messages de soutien par Telegram",
              "Centres de données de Telegram situés dans plusieurs pays — à l’extérieur du Canada",
            ],
            [
              "Resend",
              "Votre adresse courriel et votre nom, le contenu des messages et tout rapport que vous choisissez d’envoyer par courriel",
              "Envoi de courriels transactionnels, de réponses du soutien et de rapports par courriel",
              "États-Unis — à l’extérieur du Canada",
            ],
            [
              "Logo.dev (Simple Casual, LLC)",
              "Noms ou domaines de commerçants; votre adresse IP et des renseignements sur votre navigateur lorsqu’un logo se charge dans votre navigateur",
              "Affichage des logos des commerçants à côté de vos dépenses",
              "États-Unis — à l’extérieur du Canada",
            ],
            [
              "Vercel Inc.",
              "Votre adresse IP, des renseignements sur votre navigateur, les pages que vous demandez et les renseignements que vous soumettez sur notre site Web et dans notre application Web",
              "Hébergement de receipt-one.com et de l’application Web ReceiptOne",
              "États-Unis et réseau périphérique mondial de Vercel — à l’extérieur du Canada",
            ],
            [
              "Google reCAPTCHA par l’intermédiaire de Firebase App Check (Google LLC)",
              "Votre adresse IP, des renseignements sur votre navigateur et votre appareil, des signaux d’interaction et des témoins de Google",
              "Protection de notre site Web, de notre formulaire de contact et de nos services contre les abus automatisés",
              "États-Unis — à l’extérieur du Canada",
            ],
            [
              "Google Analytics (Google LLC) — uniquement si vous acceptez les témoins d’analyse",
              "Votre adresse IP, des renseignements sur votre navigateur et votre appareil, les pages que vous consultez sur receipt-one.com, les boutons sur lesquels vous cliquez et les témoins de Google Analytics",
              "Mesure des visites du site Web et du rendement de nos publicités",
              "États-Unis — à l’extérieur du Canada",
            ],
            [
              "Google Fonts (Google LLC)",
              "Votre adresse IP et des renseignements sur votre navigateur",
              "Fourniture des polices utilisées par notre site Web",
              "États-Unis — à l’extérieur du Canada",
            ],
            [
              "ExchangeRate-API (open.er-api.com)",
              "Votre adresse IP et des renseignements sur votre navigateur; aucune donnée de compte ni de dépenses",
              "Taux de change des devises dans l’application Web",
              "Non précisé par le fournisseur",
            ],
          ]}
        />
        <p>
          Apple (App Store) et Google (Google Play) traitent les paiements des abonnements mobiles
          selon leurs propres conditions et politiques de confidentialité, comme il est décrit à la
          section 2.3.
        </p>
        <p>
          Nous demandons à tous les fournisseurs de services de traiter les renseignements
          personnels pour notre compte et à des fins limitées liées à la fourniture et au soutien
          des Services, sous réserve des contrats applicables, des obligations de confidentialité et
          des exigences de sécurité.
        </p>
        <p>
          <strong>Opérations d’entreprise :</strong> Nous pouvons aussi communiquer des
          renseignements personnels dans le cadre d’une fusion, d’un financement, d’une acquisition,
          d’une réorganisation, d’une vente d’actifs, d’une faillite ou d’une opération d’entreprise
          semblable, sous réserve de mesures de protection appropriées lorsque la loi l’exige.
        </p>
      </Section>

      <Section number="6" title="Traitement international et transfrontalier">
        <p>
          <strong>Lieu de stockage de vos renseignements :</strong> La base de données, les fichiers
          et le traitement côté serveur de ReceiptOne sont hébergés sur Google Cloud / Firebase aux
          États-Unis :
        </p>
        <BulletList
          items={[
            "Cloud Firestore (registres de compte, de dépenses, de kilométrage et de bureau à domicile) : nam5, une multirégion aux États-Unis (Iowa et Caroline du Sud)",
            "Cloud Storage (images de reçus et documents téléversés) : États-Unis",
            "Cloud Functions (traitement côté serveur) : us-central1 (Iowa, États-Unis)",
          ]}
        />
        <p>
          <strong>
            Si vous êtes au Canada, vos renseignements personnels sont stockés et traités aux
            États-Unis.
          </strong>{" "}
          D’autres fournisseurs de services énumérés à la section 5 traitent aussi des
          renseignements personnels à l’extérieur du Canada, principalement aux États-Unis; ce
          tableau indique le lieu de traitement de chacun.
        </p>
        <p>
          <strong>Pour les résidents du Québec :</strong> vos renseignements personnels sont
          communiqués à l’extérieur du Québec, aux États-Unis, aux fins décrites dans la présente
          politique de confidentialité.
        </p>
        <p>
          <strong>Conséquences juridiques :</strong> Par conséquent, les renseignements personnels
          peuvent être assujettis aux lois de ces territoires, y compris aux demandes d’accès
          légitimes des tribunaux, des organismes de réglementation ou des forces de l’ordre (par
          exemple, en vertu du CLOUD Act américain ou d’une loi canadienne équivalente).
        </p>
        <p>
          Nous utilisons des mesures de protection contractuelles, techniques et organisationnelles
          adaptées à la sensibilité des renseignements et à la nature du traitement, y compris des
          clauses contractuelles types ou des mécanismes équivalents lorsque la loi l’exige.
        </p>
      </Section>

      <Section number="7" title="Conservation des données">
        <p>
          Nous conservons les renseignements personnels aussi longtemps que cela est raisonnablement
          nécessaire aux fins décrites dans la présente politique de confidentialité, notamment pour
          fournir les Services et respecter nos obligations juridiques, comptables, fiscales, de
          sécurité, de règlement des différends et d’application.
        </p>
        <p>
          <strong>Durées de conservation générales :</strong>
        </p>
        <DataTable
          headers={["Type de données", "Durée de conservation"]}
          rows={[
            [
              "Renseignements de compte",
              "Pendant que le compte est actif + une période raisonnable par la suite à des fins juridiques ou de sécurité",
            ],
            [
              "Reçus, dépenses, kilométrage, rapports, documents téléversés",
              "Jusqu’à ce que vous les supprimiez, que vous en demandiez la suppression ou que le compte soit supprimé (sauf si la loi exige une conservation plus longue)",
            ],
            [
              "Données de localisation des trajets",
              "Conservées avec le trajet jusqu’à ce que vous supprimiez le trajet ou votre compte",
            ],
            [
              "Communications avec le soutien",
              "Période raisonnable pour gérer l’historique du soutien, les différends et la qualité du service",
            ],
            [
              "Journaux, registres de sécurité, analyses, diagnostics",
              "Période limitée nécessaire au dépannage, à la prévention de la fraude, à la sécurité et à la surveillance du rendement",
            ],
            [
              "Copies de sauvegarde",
              "Période limitée conformément aux processus de sauvegarde, de reprise après sinistre et de gestion des documents",
            ],
          ]}
        />
        <p>
          <strong>
            Remarque importante concernant la mise en cache par les fournisseurs de services :
          </strong>{" "}
          Malgré la suppression de nos systèmes actifs, nos fournisseurs de services (y compris
          Google Cloud et OpenAI) peuvent conserver des copies hachées, journalisées ou mises en
          cache des données pendant une période limitée (généralement jusqu’à 30 jours) à des fins
          de sécurité, de prévention des abus et de détection de la fraude. Cela est permis par
          leurs conditions de service respectives et par la loi applicable. Après cette période, les
          copies résiduelles sont supprimées ou rendues illisibles.
        </p>
      </Section>

      <Section number="8" title="Vos droits en matière de protection des renseignements personnels">
        <SubSection title="8.1 Canada (LPRPDE et Loi 25 du Québec)">
          <p>Vous avez le droit :</p>
          <BulletList
            items={[
              "D’accéder aux renseignements personnels que nous détenons à votre sujet",
              "De faire rectifier les renseignements personnels inexacts ou incomplets",
              "De retirer votre consentement (sous réserve de restrictions juridiques ou contractuelles et d’un préavis raisonnable)",
              "De faire supprimer vos renseignements personnels (sous réserve des exceptions prévues par la loi)",
              "De porter plainte auprès du Commissariat à la protection de la vie privée du Canada ou, pour les résidents du Québec, auprès de la Commission d’accès à l’information du Québec (CAI)",
            ]}
          />
        </SubSection>

        <SubSection title="8.2 États-Unis (Californie et autres États)">
          <p>
            Selon votre État de résidence et sous réserve des exceptions applicables, vous pourriez
            avoir le droit :
          </p>
          <BulletList
            items={[
              "De savoir quelles catégories de renseignements personnels nous recueillons, utilisons, communiquons et conservons",
              "D’accéder à des éléments précis de renseignements personnels",
              "De faire supprimer des renseignements personnels",
              "De faire corriger des renseignements personnels inexacts",
              "De refuser la vente ou le partage de renseignements personnels (ReceiptOne ne vend ni ne partage de renseignements à des fins de publicité comportementale intercontextuelle)",
              "De limiter l’utilisation des renseignements personnels sensibles (ReceiptOne n’utilise ces renseignements qu’à des fins limitées permises)",
              "À la non-discrimination — vous ne ferez l’objet d’aucune discrimination pour avoir exercé vos droits en matière de protection des renseignements personnels",
            ]}
          />
          <p>
            Comme ReceiptOne ne vend pas de renseignements personnels et ne partage pas de
            renseignements personnels à des fins de publicité comportementale intercontextuelle,
            nous n’offrons pas de mécanisme « Ne pas vendre ni partager » (« Do Not Sell or Share »)
            pour des activités que nous n’exerçons pas.
          </p>
        </SubSection>

        <SubSection title="8.3 Comment présenter une demande">
          <p>
            Vous pouvez présenter une demande relative à la protection des renseignements personnels
            en communiquant avec nous :
          </p>
          <p>
            <strong>Courriel :</strong>{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="mailto:support@receipt-one.com"
            >
              support@receipt-one.com
            </a>{" "}
            <strong>Objet :</strong> « Privacy Request » (Demande relative à la protection des
            renseignements personnels)
          </p>
          <p>
            <strong>Formulaire de contact :</strong> si vous préférez ne pas utiliser le courriel,
            présentez votre demande au moyen de notre{" "}
            <Link
              to="/fr/contact"
              className="font-medium text-foreground underline underline-offset-4"
            >
              formulaire de contact
            </Link>
            .
          </p>
          <p>
            <strong>Courrier :</strong> Responsable de la protection des renseignements personnels,
            Flutter Horizon, 6555 Bonsor Ave, Burnaby, BC V5H 3E9, Canada.
          </p>
          <p>Dans votre demande, veuillez indiquer :</p>
          <BulletList
            items={[
              "Votre nom complet",
              "L’adresse courriel associée à votre compte",
              "Les détails précis de votre demande",
              "Toute pièce justificative (s’il y a lieu)",
            ]}
          />
          <p>
            <strong>Mandataires autorisés :</strong> Lorsque la loi l’exige, des mandataires
            autorisés peuvent présenter des demandes au nom de personnes, sous réserve d’une
            vérification appropriée et d’une autorisation écrite.
          </p>
        </SubSection>

        <SubSection title="8.4 Vérification et appels">
          <p>
            <strong>Processus de vérification :</strong> Pour protéger vos renseignements
            personnels, nous vérifierons votre identité avant de donner suite à une demande. La
            vérification peut comprendre :
          </p>
          <BulletList
            items={[
              "La confirmation de votre accès à l’adresse courriel associée à votre compte",
              "La demande de renseignements correspondant à nos dossiers",
              "Le recours à d’autres mesures d’authentification raisonnables",
            ]}
          />
          <p>
            Si nous ne pouvons pas vérifier votre identité ou votre pouvoir d’agir, nous pouvons
            refuser ou limiter la demande dans la mesure permise par la loi.
          </p>
          <p>
            <strong>Processus d’appel :</strong> Si nous refusons une demande, nous vous fournirons
            :
          </p>
          <BulletList
            items={[
              "Une explication claire des motifs du refus",
              "Des renseignements sur la façon de faire appel de cette décision",
            ]}
          />
          <p>
            Pour faire appel, veuillez répondre à notre avis de refus ou nous écrire à
            support@receipt-one.com en indiquant « Appeal » (Appel) dans l’objet.
          </p>
          <p>
            <strong>Délai de réponse :</strong> Nous répondrons aux demandes vérifiées dans les
            délais prévus par la loi applicable (généralement 30 jours en vertu de la LPRPDE et 45
            jours en vertu de la CCPA/CPRA, avec possibilité de prolongation lorsque cela est
            permis).
          </p>
        </SubSection>
      </Section>

      <Section number="9" title="Consentement">
        <SubSection title="9.1 Consentement général">
          <p>
            En créant un compte, en téléversant des reçus ou des documents, en activant des
            fonctions facultatives ou en utilisant autrement les Services, vous consentez à la
            collecte, à l’utilisation et à la communication de renseignements personnels de la
            manière décrite dans la présente politique de confidentialité, sauf lorsque la loi
            applicable exige une autre forme de consentement.
          </p>
        </SubSection>

        <SubSection title="9.2 Consentement exprès pour les résidents du Québec et les renseignements sensibles">
          <p>
            <strong>Pour les résidents du Québec (Canada) :</strong> Lorsque la Loi 25 du Québec
            l’exige, nous obtenons votre <strong>consentement exprès</strong> avant de recueillir,
            d’utiliser ou de communiquer vos renseignements personnels.
          </p>
          <p>
            <strong>Pour les renseignements personnels sensibles (tous les utilisateurs) :</strong>{" "}
            Lorsque la loi applicable l’exige (y compris la CPRA pour les renseignements personnels
            sensibles), nous obtenons votre <strong>consentement exprès</strong> avant de
            recueillir, d’utiliser ou de communiquer les données financières ou liées aux dépenses
            contenues dans les reçus, les rapports et les documents téléversés.
          </p>
          <p>
            <strong>Comment le consentement exprès est obtenu :</strong> Le consentement exprès est
            obtenu lorsque vous :
          </p>
          <BulletList
            items={[
              "Cochez une case indiquant votre accord lors de la création du compte, OU",
              "Accomplissez un geste positif (comme cliquer sur « J’accepte » ou « Accepter ») avant d’utiliser les fonctions de numérisation des reçus ou de suivi des dépenses",
            ]}
          />
          <p>
            Vous pouvez retirer votre consentement exprès en tout temps en communiquant avec nous.
            Si vous retirez votre consentement à un traitement nécessaire à la fourniture des
            Services, certaines fonctions, ou les Services eux-mêmes, pourraient ne plus être
            disponibles.
          </p>
        </SubSection>

        <SubSection title="9.3 Retrait du consentement">
          <p>Vous pouvez retirer votre consentement à certains traitements :</p>
          <BulletList
            items={[
              "En supprimant un contenu précis (reçus, dépenses, documents)",
              "En désactivant les autorisations facultatives de l’appareil",
              "En supprimant votre compte",
              "En communiquant directement avec nous",
            ]}
          />
          <p>
            Si vous retirez votre consentement à un traitement nécessaire à la fourniture des
            Services, certaines fonctions, ou les Services eux-mêmes, pourraient ne plus être
            disponibles.
          </p>
        </SubSection>
      </Section>

      <Section number="10" title="Mesures de sécurité">
        <p>
          Nous mettons en œuvre des mesures de protection administratives, techniques et
          organisationnelles conçues pour protéger les renseignements personnels, notamment :
        </p>
        <DataTable
          headers={["Mesure", "Description"]}
          rows={[
            [
              "Chiffrement en transit",
              "TLS ou protocoles semblables pour toutes les données transmises sur les réseaux",
            ],
            [
              "Contrôles d’accès",
              "Accès selon le principe du moindre privilège, authentification fondée sur les rôles",
            ],
            [
              "Journalisation et surveillance",
              "Mesures de vérification pour les activités sensibles sur le plan de la sécurité",
            ],
            [
              "Sécurité de l’infrastructure",
              "Mesures raisonnables pour sécuriser les environnements infonuagiques (Firebase, Google Cloud)",
            ],
          ]}
        />
        <p>
          <strong>Limite :</strong> Aucune méthode de transmission sur Internet ni aucune méthode de
          stockage électronique n’est totalement sécuritaire. Par conséquent, nous ne pouvons pas
          garantir une sécurité absolue. En cas d’atteinte à la sécurité des données touchant vos
          renseignements personnels, nous vous aviserons, ainsi que les autorités compétentes,
          conformément à la loi applicable.
        </p>
      </Section>

      <Section number="11" title="Protection des renseignements personnels des enfants">
        <p>
          Les Services sont destinés aux adultes et aux utilisateurs professionnels et ne
          s’adressent pas aux enfants de moins de 18 ans (ou de l’âge de la majorité dans votre
          territoire).
        </p>
        <p>
          Nous ne recueillons pas sciemment de renseignements personnels auprès d’enfants. Si vous
          croyez qu’un enfant nous a fourni des renseignements personnels, veuillez communiquer avec
          nous immédiatement afin que nous puissions examiner et supprimer ces renseignements.
        </p>
      </Section>

      <Section number="12" title="Modifications de la présente politique de confidentialité">
        <p>
          Nous pouvons mettre à jour la présente politique de confidentialité de temps à autre pour
          tenir compte de changements touchant :
        </p>
        <BulletList
          items={[
            "Nos pratiques ou nos technologies",
            "Les exigences légales",
            "Les Services eux-mêmes",
          ]}
        />
        <p>
          <strong>Avis de modifications importantes :</strong>
        </p>
        <BulletList
          items={[
            "Nous modifierons la date de « Dernière mise à jour » figurant en haut de la présente politique",
            "En cas de modifications importantes, nous fournirons un avis supplémentaire au moyen des Services (p. ex., notification dans l’application ou courriel)",
            "Le fait de continuer à utiliser les Services après les modifications constitue une acceptation de la politique mise à jour, sauf lorsque la loi applicable exige un nouveau consentement explicite",
          ]}
        />
      </Section>

      <Section number="13" title="Coordonnées">
        <p>
          <strong>Personne responsable de la protection des renseignements personnels</strong> (y
          compris aux fins de la Loi 25 du Québec) : Responsable de la protection des renseignements
          personnels, Flutter Horizon —{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href="mailto:support@receipt-one.com"
          >
            support@receipt-one.com
          </a>
        </p>
        <p>
          <strong>Courriel :</strong>{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4"
            href="mailto:support@receipt-one.com"
          >
            support@receipt-one.com
          </a>{" "}
          <strong>Objet pour les questions de protection des renseignements personnels :</strong> «
          Privacy Request » (Demande relative à la protection des renseignements personnels)
        </p>
        <p>
          <strong>Formulaire de contact :</strong>{" "}
          <Link
            to="/fr/contact"
            className="font-medium text-foreground underline underline-offset-4"
          >
            receipt-one.com/fr/contact
          </Link>
        </p>
        <p>
          <strong>Courrier :</strong> Flutter Horizon, 6555 Bonsor Ave, Burnaby, BC V5H 3E9, Canada
        </p>
        <div className="space-y-3">
          <p>
            <strong>Plaintes auprès des organismes de réglementation (Canada) :</strong>{" "}
            Commissariat à la protection de la vie privée du Canada{" "}
            <a
              className="underline underline-offset-4"
              href="https://www.priv.gc.ca/en/report-a-concern/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.priv.gc.ca/en/report-a-concern/
            </a>
          </p>
          <p>
            <strong>Plaintes auprès des organismes de réglementation (Québec) :</strong> Commission
            d’accès à l’information du Québec (CAI){" "}
            <a
              className="underline underline-offset-4"
              href="https://www.cai.gouv.qc.ca/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.cai.gouv.qc.ca/
            </a>
          </p>
          <p>
            <strong>Plaintes auprès des organismes de réglementation (Californie) :</strong>{" "}
            Procureur général de la Californie (California Attorney General){" "}
            <a
              className="underline underline-offset-4"
              href="https://oag.ca.gov/privacy"
              target="_blank"
              rel="noreferrer"
            >
              https://oag.ca.gov/privacy
            </a>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2026 Flutter Horizon. ReceiptOne est exploité par Flutter Horizon. Tous droits réservés.
        </p>
      </Section>
    </PrivacyDocument>
  );
}
