/** Exact wording, also asserted by tests/legal-fr.test.ts. */
export const FRENCH_PRECEDENCE_NOTE =
  "En cas de divergence entre la version française et la version anglaise, la version française prévaut pour les résidents du Québec.";

/** Shown at the top of /fr/privacy and /fr/terms only -- never on the English pages. */
export function FrenchPrecedenceNote() {
  return (
    <p
      role="note"
      className="mb-6 max-w-3xl rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-foreground"
    >
      {FRENCH_PRECEDENCE_NOTE}
    </p>
  );
}
