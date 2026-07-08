/**
 * Ported verbatim from the mobile app's extractJsonFromText. The model
 * isn't constrained to JSON response mode (responseMimeType is
 * deliberately left unset -- see gemini.ts), so the raw response can
 * carry markdown fences or stray text around the JSON object. Throws a
 * clear, user-facing error if nothing parses, rather than silently
 * returning an empty/partial object.
 */
export function extractJsonFromText(raw: string): unknown {
  const cleaned = raw
    .trim()
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Fall through to try the whole cleaned string.
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Couldn't parse the AI response as JSON.");
  }
}
