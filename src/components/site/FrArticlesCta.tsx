import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/** Dark CTA strip closing /fr/articles and each French article. */
export function FrArticlesCta() {
  return (
    <section data-surface="void" className="bg-ink py-6 sm:py-8">
      <div className="mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-8">
        <p className="eyebrow text-white/50">Commencer</p>
        <h2 className="mt-2 text-paper">Gérez vos reçus en quelques minutes</h2>
        <p className="mx-auto mt-2 max-w-md font-sans text-body text-paper-60">
          Conçu pour les travailleurs autonomes du Canada qui veulent être prêts pour l'ARC sans
          crouler sous la paperasse.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/fr"
            hash="pricing"
            className="inline-flex items-center gap-2 rounded-pill bg-ember px-6 py-3 font-sans text-sm font-semibold text-ink transition-all duration-200 hover:bg-ember-hover hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
          >
            Voir les tarifs
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            to="/fr"
            className="inline-flex items-center gap-2 rounded-pill border border-hairline-void px-6 py-3 font-sans text-sm font-semibold text-paper transition-all duration-200 hover:border-paper-40 hover:bg-paper-05"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}
