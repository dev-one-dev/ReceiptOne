/**
 * The single source of truth for whether a tax is refundable, used
 * everywhere a tax list item is created or recreated in this pipeline
 * (JSON parsing, regex salvage, province disambiguation, settings
 * application). Ported verbatim from the mobile app's client-side
 * override -- this is NOT the same rule the AI system prompt states
 * (the prompt tells Gemini "HST -> ALWAYS false", but the real mobile
 * client overrides the model's own is_refundable output with this
 * fixed name-based list, and HST reads as refundable here). That
 * inconsistency is real and load-bearing: the client override is what
 * actually determines production Firestore data today, so it wins.
 * Don't "fix" it to match the prompt text.
 */
const REFUNDABLE_TAX_NAMES = new Set(["GST", "HST", "TPS", "QST", "TVQ"]);

export function isRefundableByName(taxName: string): boolean {
  return REFUNDABLE_TAX_NAMES.has(taxName.toUpperCase().trim());
}
