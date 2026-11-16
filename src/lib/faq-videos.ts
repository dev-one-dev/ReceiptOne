/**
 * How-to clips embedded under FAQ answers. The files live in
 * public/videos/faq/ and come from the receiptone-demo recorder
 * (out/faq/faq-clips.json): durations are that file's, rounded to whole
 * seconds; descriptions are its descriptions without the recording notes
 * ("blurred here" and the like).
 *
 * Region: report, home-office and add-trip show kilometres, T2125 or the
 * Canadian (CRA) home-office wizard; settings shows a Canadian province; and
 * accountant is attached on the CA list only. None of those may be attached
 * to a US question.
 */
export type FaqVideo = {
  id: string;
  /** Site-relative URL of the mp4. */
  src: string;
  /** Site-relative URL of the poster frame. */
  poster: string;
  title: string;
  description: string;
  /** Whole seconds. */
  duration: number;
  /** BCP 47 language of the clip's on-screen text, when not English. */
  inLanguage?: string;
};

/** Every clip is 1280×720. */
export const FAQ_VIDEO_WIDTH = 1280;
export const FAQ_VIDEO_HEIGHT = 720;
/** Shown in each clip's VideoObject JSON-LD. */
export const FAQ_VIDEO_UPLOAD_DATE = "2026-11-15";

const clip = (id: string, title: string, description: string, duration: number): FaqVideo => ({
  id,
  src: `/videos/faq/${id}.mp4`,
  poster: `/videos/faq/${id}-poster.jpg`,
  title,
  description,
  duration,
});

export const FAQ_VIDEOS = {
  "add-receipt-manual": clip(
    "add-receipt-manual",
    "Add a receipt by hand",
    "Add a receipt by hand: Add receipt → Manual entry, fill in merchant, date, price, tax and category, save, and see it in the receipts list.",
    26,
  ),
  "upload-receipt": clip(
    "upload-receipt",
    "Upload a receipt photo",
    "Upload a receipt photo: Add receipt → Choose from file, the AI fills in merchant, date, total and tax, then save. Bulk Upload reads several files dropped at once.",
    38,
  ),
  "telegram-connect": clip(
    "telegram-connect",
    "Connect Telegram",
    "Connect Telegram: Integrations → Connect Telegram shows a QR code and an Open in Telegram button; close it to connect later.",
    16,
  ),
  "add-trip": clip(
    "add-trip",
    "Log a trip",
    "Log a trip: Mileage → Log Trip with start and end address, vehicle and purpose, save it to the trip log, then check the vehicle's odometer start and end readings.",
    38,
  ),
  "home-office": clip(
    "home-office",
    "Calculate the home office deduction",
    "Calculate the home office deduction: walk the Canadian (CRA) wizard — year and form, space, expenses — and see the T2125 line 9945 result.",
    38,
  ),
  settings: clip(
    "settings",
    "Change your language and region settings",
    "Settings: switch the interface language to French and back to English, check the country and province, and see the trip-tracking work hours.",
    28,
  ),
  accountant: clip(
    "accountant",
    "Send your report to your accountant",
    "Work with your accountant: My accountant → invite them by e-mail, then Reports → Annual Tax Report → Send to accountant e-mails them the PDF.",
    37,
  ),
  report: clip(
    "report",
    "Download your reports",
    "Download reports: Reports → Annual Tax Report as PDF (preview, then download), the same report as CSV, and the mileage log from Mileage → Export.",
    37,
  ),
} satisfies Record<string, FaqVideo>;

const clipFR = (id: string, title: string, description: string, duration: number): FaqVideo => ({
  id,
  src: `/videos/faq/fr/${id}.mp4`,
  poster: `/videos/faq/fr/${id}-poster.jpg`,
  title,
  description,
  duration,
  inLanguage: "fr-CA",
});

/**
 * French (fr-CA) recordings of the same eight clips, for /fr/faq only. The
 * files live in public/videos/faq/fr/ and come from the recorder's
 * out/faq-fr/faq-clips-fr.json: titles are its titles, durations its
 * durations rounded to whole seconds, descriptions its descriptions without
 * the recording notes ("flouté ici" and the like), as for the English set.
 */
export const FAQ_VIDEOS_FR = {
  "add-receipt-manual": clipFR(
    "add-receipt-manual",
    "Ajouter un reçu manuellement",
    "Ajoutez un reçu à la main : Ajouter un reçu → Saisie manuelle, remplissez le commerçant, la date, le prix, les taxes et la catégorie, enregistrez, puis retrouvez-le dans la liste des reçus.",
    28,
  ),
  "upload-receipt": clipFR(
    "upload-receipt",
    "Téléverser la photo d’un reçu",
    "Téléversez la photo d’un reçu : Ajouter un reçu → Choisir un fichier, l’IA remplit le commerçant, la date, le total et les taxes, puis enregistrez. Téléversement groupé lit plusieurs fichiers déposés en une fois.",
    42,
  ),
  "telegram-connect": clipFR(
    "telegram-connect",
    "Connecter Telegram",
    "Connectez Telegram : Intégrations → Connecter Telegram affiche un code QR et un bouton « Ouvrir dans Telegram »; fermez la fenêtre pour vous connecter plus tard.",
    17,
  ),
  "add-trip": clipFR(
    "add-trip",
    "Enregistrer un trajet",
    "Enregistrez un trajet : Kilométrage → Enregistrer un trajet avec les adresses de départ et d’arrivée, le véhicule et le but, ajoutez-le au journal des trajets, puis vérifiez les relevés d’odomètre de début et de fin du véhicule.",
    39,
  ),
  "home-office": clipFR(
    "home-office",
    "Calculer la déduction pour bureau à domicile",
    "Calculez la déduction pour bureau à domicile : suivez l’assistant canadien (ARC), soit l’année et le formulaire, l’espace, puis les dépenses, et voyez le résultat à la ligne 9945 du T2125.",
    40,
  ),
  settings: clipFR(
    "settings",
    "Changer la langue et les paramètres",
    "Paramètres : passez l’interface en anglais puis revenez au français, vérifiez le pays et la province, et voyez les heures de travail du suivi des trajets.",
    27,
  ),
  accountant: clipFR(
    "accountant",
    "Travailler avec votre comptable",
    "Travaillez avec votre comptable : Mon comptable → invitez-le par courriel, puis Rapports → Rapport fiscal annuel → Envoyer au comptable lui envoie le PDF par courriel.",
    41,
  ),
  report: clipFR(
    "report",
    "Télécharger vos rapports",
    "Téléchargez vos rapports : Rapports → Rapport fiscal annuel 2026 en PDF (aperçu, puis téléchargement), le même rapport en CSV, et le journal des trajets depuis Kilométrage → Exporter.",
    38,
  ),
} satisfies Record<string, FaqVideo>;

/**
 * Clips that show kilometres, T2125, the CRA home-office wizard or a Canadian
 * province, or are CA-only.
 */
export const CA_ONLY_FAQ_VIDEO_IDS = [
  "add-trip",
  "home-office",
  "report",
  "accountant",
  "settings",
];

/** Seconds → ISO 8601 duration, e.g. 26 → "PT26S", 75 → "PT1M15S". */
export function isoDuration(seconds: number): string {
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  return `PT${m ? `${m}M` : ""}${s % 60 || !m ? `${s % 60}S` : ""}`;
}
