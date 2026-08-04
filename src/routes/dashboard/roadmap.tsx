import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GitCommitHorizontal, Milestone, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { SuggestFeatureWidget } from "@/components/site/SuggestFeatureWidget";
import { supabase } from "@/integrations/supabase/client";
import { errorMessage } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/roadmap")({
  component: RoadmapPage,
});

// Matches the full DB enum, including pending_review -- RLS filters rows,
// not the column's type, so Postgrest's return type genuinely includes it
// even though a pending_review row should never actually reach this query.
type FeatureIdeaStatus =
  | "pending_review"
  | "under_review"
  | "planned"
  | "coming_soon"
  | "published";

type FeatureIdea = {
  id: string;
  title: string;
  description: string;
  status: FeatureIdeaStatus;
  votes_count: number;
  updated_at: string;
};

const STATUS_LABEL: Record<FeatureIdeaStatus, string> = {
  pending_review: "Pending review",
  under_review: "Under review",
  planned: "Planned",
  coming_soon: "Coming soon",
  published: "Published",
};

const STATUS_STYLE: Record<FeatureIdeaStatus, string> = {
  pending_review: "bg-black/[0.05] text-black/40",
  under_review: "bg-black/[0.05] text-black/60",
  planned: "bg-[#f97316]/10 text-[#c2410c]",
  coming_soon: "bg-[#f97316]/15 text-[#c2410c]",
  published: "bg-black text-white",
};

/** Same read this dashboard's own feature-suggestion widget uses --
 * feature_ideas' SELECT policy now excludes pending_review, so this works
 * with the anon/publishable client, no service-role access needed. */
async function fetchIdeas(): Promise<FeatureIdea[]> {
  const { data, error } = await supabase
    .from("feature_ideas")
    .select("id, title, description, status, votes_count, updated_at")
    .order("votes_count", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-black/[0.07] bg-white p-5">
      <div className="h-4 w-2/3 rounded bg-black/[0.06]" />
      <div className="mt-3 h-3 w-full rounded bg-black/[0.05]" />
      <div className="mt-1.5 h-3 w-4/5 rounded bg-black/[0.05]" />
    </div>
  );
}

function RoadmapPage() {
  const { region } = useDashboardContext();
  const [ideas, setIdeas] = useState<FeatureIdea[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchIdeas();
        if (!cancelled) setIdeas(data);
      } catch (e) {
        if (!cancelled) {
          setLoadError(true);
          toast.error(errorMessage(e, "Failed to load roadmap"));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // RLS already excludes pending_review from this query entirely; this
  // filter is a belt-and-suspenders backstop, not the real enforcement.
  const roadmap = (ideas ?? []).filter(
    (i) => i.status !== "published" && i.status !== "pending_review",
  );
  const changelog = (ideas ?? [])
    .filter((i) => i.status === "published")
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Roadmap & Changelog</h1>
        <p className="mt-1 text-sm text-black/55">
          What's planned next and what's already shipped — pulled from the community feature board.
        </p>
      </div>

      {/* Roadmap */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <Milestone className="size-4 text-black/40" aria-hidden />
          <h2 className="text-sm font-semibold text-black">Roadmap</h2>
        </div>

        {ideas === null ? (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : loadError ? (
          <div className="mt-3 rounded-2xl border border-black/[0.07] bg-white p-6 text-center text-sm text-black/45">
            Couldn't load the roadmap right now.
          </div>
        ) : roadmap.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-black/15 bg-white p-6 text-center text-sm text-black/45">
            Nothing in review or planned right now.
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roadmap.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-black">{item.title}</h3>
                  <span
                    className={[
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      STATUS_STYLE[item.status],
                    ].join(" ")}
                  >
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-black/55">{item.description}</p>
                <p className="mt-2 text-xs text-black/40">
                  {item.votes_count} vote{item.votes_count === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Changelog */}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Rocket className="size-4 text-black/40" aria-hidden />
          <h2 className="text-sm font-semibold text-black">Changelog</h2>
        </div>

        {ideas === null ? (
          <div className="mt-3 space-y-3">
            <CardSkeleton />
          </div>
        ) : loadError ? null : changelog.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-black/15 bg-white p-6 text-center text-sm text-black/45">
            Nothing shipped yet.
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <ul>
              {changelog.map((item, i) => (
                <li
                  key={item.id}
                  className={[
                    "flex gap-4 px-5 py-4",
                    i !== 0 ? "border-t border-black/[0.05]" : "",
                  ].join(" ")}
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-black/40">
                    <GitCommitHorizontal className="size-3.5" aria-hidden />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-black">{item.title}</span>
                      <span className="text-xs text-black/40">{formatDate(item.updated_at)}</span>
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-black/55">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <SuggestFeatureWidget region={region} />
    </div>
  );
}
