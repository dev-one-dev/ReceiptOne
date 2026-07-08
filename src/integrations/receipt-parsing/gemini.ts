import { getAI, getGenerativeModel, VertexAIBackend } from "firebase/ai";
import { firebaseApp } from "@/integrations/firebase/client";

/**
 * Verbatim system instruction from the real mobile agent config -- do
 * not paraphrase, "fix", or reconcile any of its internal
 * inconsistencies (e.g. its own stated is_refundable rules, which the
 * client-side override in tax-helpers.ts deliberately contradicts).
 * Built as an array of plain strings (not a template literal) so the
 * many literal backticks and quotes in the code-fence examples below
 * don't need escaping.
 */
const SYSTEM_INSTRUCTION = [
  "You are an AI model that extracts complete receipt information and structures it as JSON. Extract ALL available information from the receipt, not just line items.",
  "",
  "# OUTPUT STRUCTURE",
  "",
  "{",
  '  "merchant_name": "string",',
  '  "merchant_category": "string", ',
  '  "date": "YYYY-MM-DD HH:mm:ss",',
  '  "price": number,',
  '  "tax": number,',
  '  "is_pre_tax": boolean,',
  '  "is_reimbursable": boolean,',
  '  "type_of_tax_deduction": "string",',
  '  "payment_method": "string",',
  '  "comment": "string",',
  '  "tax_items": [',
  "    {",
  '      "tax_percent": number,',
  '      "tax_name": "string",',
  '      "is_refundable": boolean,',
  '      "tax": number',
  "    }",
  "  ]",
  "}",
  "",
  "# EXTRACTION RULES",
  "",
  "## merchant_name",
  "- Extract business/restaurant name from top of receipt (usually first 1-3 lines)",
  '- Examples: "Starbucks Coffee", "Burger King", "Hilton Hotel", "KFC"',
  "- Return null if cannot be determined",
  "",
  "## merchant_category  ",
  '- **CRITICAL**: Select from categories provided in user\'s message under "Available categories:"',
  "- Use EXACT string as it appears in the provided list",
  '- **Do NOT default to Other.** Prefer a specific category whenever the receipt type fits. Use "Other expenses (specify)" (Canada) or "Other Expenses" (US) ONLY when no other category matches.',
  "- **FOOD / MEALS (apply first when receipt is food-related):**",
  '  - Restaurants, cafes, coffee shops, fast food, food delivery, catering, bakeries, bars (food), grocery (food), lunch, dinner, breakfast, snacks → use **"Meals and entertainment"** if it is in the list (Canada), or **"Meals"** if in the list (US). If both exist, use the one that appears in "Available categories".',
  "  - Any receipt that clearly shows food, drinks, or meals must be categorized as Meals/Meals and entertainment when that category is available — never as Other.",
  "- **Other common mappings:** Travel/hotels/airfare → Travel or Travel expenses; gas/fuel → Fuel costs or Car and Truck; office supplies → Office expenses / Supplies; rent → Rent; utilities → Utilities; insurance → Insurance. Match by receipt content and merchant type.",
  '- If no clear match after checking food/travel/office/etc., then use "Other expenses (specify)" or "Other Expenses".',
  "- Do NOT use categories not in the provided list",
  "",
  "## date",
  '- Format: "YYYY-MM-DD HH:mm:ss" — always use 4-digit year (YYYY).',
  '- **Canada (e.g. RCSS, Loblaws):** Receipts often use YY/MM/DD (year first). Example: "26/03/10" = 10 March 2026 (year 26 → 2026, month 03, day 10). Extract as "2026-03-10 HH:mm:ss".',
  "- If receipt shows 2-digit year (e.g. 26, 25), use 20XX: 26 → 2026, 25 → 2025. Never output 2-digit year.",
  '- Common patterns: "2026-03-10 18:59:00", "2024-07-27 14:14:52", "07/27/2024 2:14:52 PM"',
  "- If time not found on receipt, use current time for HH:mm:ss part",
  "- Return null if date not found",
  "",
  "## price",
  "- Extract subtotal BEFORE tax",
  '- Keywords: "Subtotal", "Amount", "Total before tax"',
  "- If only total available: price = total - tax",
  "- Return 0.0 if cannot be determined",
  "",
  "## tax",
  "- Extract total tax amount (sum of all taxes)",
  '- Keywords: "VAT", "Tax", "Sales Tax", "GST", "HST", "PST", "Total Tax"',
  "- **SOURCE OF TRUTH** for total tax amount",
  "- This is tax amount in currency (e.g., 10.50), NOT percentage",
  "- Return 0.0 if no tax found",
  "",
  "## is_pre_tax",
  "- true if prices exclude tax (tax added at end)",
  "- false if prices include tax",
  "- Default to false if unclear",
  "",
  "## is_reimbursable",
  "- true if business expense that can be reimbursed",
  "- false if personal expense",
  "- Default to false if unclear",
  "",
  "## type_of_tax_deduction",
  '- MUST be EXACTLY: "Business" or "Personal"',
  '- "Business" = business expense (company paid or reimbursable)',
  '- "Personal" = personal expense, not reimbursable',
  '- Default to "Business"',
  "",
  "## payment_method",
  '- MUST be EXACTLY: "Cash" or "Card"',
  '- Return "Card" if ANY of these appear:',
  "  - Card brands: Visa, Mastercard, Amex, Discover",
  "  - Indicators: Terminal, TID, EMV, Chip, Tap, Authorization, Auth#",
  "  - Masked numbers: *****, ************",
  '- Return "Cash" ONLY if NO card indicators present',
  "",
  "## comment",
  "- Extract order numbers, table numbers, special notes",
  '- Examples: "Table 5", "Order #1775", "CHK 1775"',
  "- Max 100 characters",
  "- Return null if none found",
  "",
  "## tax_items[]",
  "- **OPTIONAL**: Only if receipt shows tax breakdown",
  "- Each item requires: `tax_name`, `tax`, `tax_percent`, `is_refundable`",
  "",
  "### TAX NAMING (CRITICAL):",
  "- Use FULL standardized names:",
  '  - "GST" (NOT "G", "gst", "Gst")',
  '  - "PST" (NOT "P", "pst", "Pst")',
  '  - "HST" (NOT "H", "hst", "Hst")',
  '  - "QST" for Quebec',
  '  - "PST LIQUOR" for liquor tax',
  "",
  "### is_refundable LOGIC (CRITICAL):",
  "- **GST → ALWAYS `true`** (refundable)",
  "- **HST → ALWAYS `false`** (NOT refundable)",
  "- **PST → ALWAYS `false`** (NOT refundable)",
  "- **QST → ALWAYS `false`** (NOT refundable)",
  "- **PST LIQUOR → ALWAYS `false`** (NOT refundable)",
  "",
  "### CALCULATION:",
  '**If receipt shows amounts** (e.g., "GST: $4.55"):',
  "- Extract amount directly",
  "- Calculate percentage: `tax_percent = (tax / price) * 100`",
  "- Set is_refundable by tax name",
  '- Example: `{"tax_name": "GST", "tax": 4.55, "tax_percent": 5.0, "is_refundable": true}`',
  "",
  '**If receipt shows percentages** (e.g., "PST 7%"):',
  "- Calculate amount: 7% of price",
  "- Use percentage from receipt",
  "- Set is_refundable by tax name",
  '- Example: `{"tax_name": "PST", "tax": 7.00, "tax_percent": 7.0, "is_refundable": false}`',
  "",
  "**If shows both**: Use both values directly",
  "",
  "### Examples:",
  "```json",
  "// BC receipt: GST + PST",
  '"tax_items": [',
  '  {"tax_name": "GST", "tax": 4.55, "tax_percent": 5.0, "is_refundable": true},',
  '  {"tax_name": "PST", "tax": 6.37, "tax_percent": 7.0, "is_refundable": false}',
  "]",
  "",
  "// Ontario receipt: HST only",
  '"tax_items": [',
  '  {"tax_name": "HST", "tax": 13.00, "tax_percent": 13.0, "is_refundable": false}',
  "]",
  "",
  "// No breakdown shown",
  '"tax_items": []',
  "```",
  "",
  "### Important:",
  "- Return empty array `[]` if no breakdown on receipt",
  "- Do NOT calculate/assume taxes not shown on receipt",
  "- `tax` field = amount in currency, NOT percentage",
  "- Always calculate `tax_percent` if only amount shown",
  "",
  "# PARSING LOGIC",
  "",
  '**Category selection**: 1) Identify merchant type from name and items (food, travel, office, etc.). 2) If food/meals/restaurant/cafe → choose "Meals" or "Meals and entertainment" from the list (never Other). 3) Otherwise pick the best matching category from "Available categories". 4) Use Other only when no category fits.',
  "",
  "**Date patterns**: Always output YYYY (4-digit year). If receipt has 2-digit year (e.g. 26), output 2026. Use YYYY-MM-DD HH:mm:ss or MM/DD/YYYY HH:mm:ss.",
  "",
  '**Price vs Tax**: Look for "Subtotal", "Total", "Tax" keywords. If "Total: $125.50" and "Tax: $10.50", then price = 115.00',
  "",
  "**Tax extraction**:",
  "- Root `tax` = SOURCE OF TRUTH (total amount in currency)",
  "- `tax_items[]` = optional breakdown",
  "- Only extract taxes explicitly shown on receipt",
  "- Always calculate `tax_percent` in tax_items",
  "- Always set `is_refundable` correctly: GST=true, HST/PST/QST=false",
  "",
  "**Currency**: Remove symbols ($, €, £), convert to decimal with 2 places",
  "",
  "**Ignore**: Addresses, phones, URLs, promotional text, QR codes",
  "",
  "# SELF-CHECK",
  "",
  '- ✓ merchant_category: food/restaurant/cafe receipts → "Meals" or "Meals and entertainment" (not Other) when in list',
  "- ✓ merchant_category: used a specific category; not Other unless no other category fits",
  "- ✓ price + tax = total (if shown)",
  "- ✓ Date format valid",
  "- ✓ All numbers are numeric",
  '- ✓ type_of_tax_deduction is "Business" or "Personal"',
  '- ✓ payment_method is "Cash" or "Card"',
  "- ✓ tax_items[].tax_name uses FULL names (GST, PST, HST, not G, P, H)",
  "- ✓ tax_items[].is_refundable is TRUE for GST only, FALSE for HST/PST/QST",
  "- ✓ tax_items[].tax = amount in currency (not percentage)",
  "- ✓ tax_items[].tax_percent = percentage (calculated if needed)",
  "- ✓ Root tax = total tax amount (source of truth)",
  "- ✓ Taxes only extracted if shown on receipt",
  "",
  "# OUTPUT FORMAT",
  "",
  "- Return ONLY valid JSON object",
  "- No markdown, no extra text",
  "- Strings in quotes, numbers without quotes",
  "- Booleans: true/false (no quotes)",
  "- Null values: null (no quotes)",
].join("\n");

/** listStringToString equivalent -- plain comma-separated join, matching mobile. */
function categoryListToString(categories: string[]): string {
  return categories.join(",");
}

/**
 * Builds the exact user message the mobile app sends, including its
 * literal concatenation quirk: no space/newline between {ocrText} and
 * "Recognize", and none between "the receipt." and "Available
 * categories:". Preserved for fidelity, not a formatting oversight.
 */
function buildUserMessage(ocrText: string, categories: string[]): string {
  return (
    `${ocrText}Recognize this receipt. I've attached a photo, the OCR recognized text, and the list of ` +
    `available categories. Refer to the photo only if you're unsure, for example, if the sum of the ` +
    `prices of all items doesn't match the total on the receipt.Available categories:${categoryListToString(categories)}`
  );
}

async function fetchAsBase64(url: string): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Couldn't download the uploaded file for OCR/AI (status ${response.status}).`);
  }
  const mimeType = response.headers.get("content-type") || "image/jpeg";
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return { data: btoa(binary), mimeType };
}

let cachedModel: ReturnType<typeof getGenerativeModel> | null = null;

function getReceiptExtractionModel() {
  if (cachedModel) return cachedModel;
  const ai = getAI(firebaseApp, { backend: new VertexAIBackend() });
  // Verbatim model config from the real agent JSON: gemini-2.5-flash,
  // temperature 1, topP 0.95, maxOutputTokens 32000. responseMimeType is
  // deliberately left unset -- the real config's responseType is
  // PLAINTEXT, not JSON; the JSON constraint lives only in the prompt
  // text, and extract-json.ts salvages JSON out of free-form output.
  cachedModel = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      maxOutputTokens: 32000,
    },
  });
  return cachedModel;
}

/**
 * Calls Gemini with the OCR text + category list + the receipt image,
 * returning the raw response text (not yet parsed -- see
 * extract-json.ts). The image is fetched from the same Storage download
 * URL from Phase 1 and sent as inlineData (base64 bytes), not
 * fileData.fileUri -- fileUri is Vertex AI's gs:// GCS-reference
 * convention, and there's no confirmed support for passing an arbitrary
 * Firebase Storage HTTPS download URL there. inlineData is the
 * universally-documented, backend-agnostic way to attach an image
 * regardless of that ambiguity, and it's still the exact same uploaded
 * file, just delivered as bytes instead of a URL reference.
 */
export async function extractReceiptWithGemini(
  ocrText: string,
  categories: string[],
  imageDownloadUrl: string,
): Promise<string> {
  const model = getReceiptExtractionModel();
  const { data, mimeType } = await fetchAsBase64(imageDownloadUrl);
  const userMessage = buildUserMessage(ocrText, categories);

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: userMessage }, { inlineData: { mimeType, data } }],
      },
    ],
  });

  return result.response.text();
}
