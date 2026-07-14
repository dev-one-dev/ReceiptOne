import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHelpdeskAuth } from "@/components/helpdesk/HelpdeskAuthContext";
import { IdeaPanel } from "@/components/helpdesk/IdeaPanel";
import { IDEA_STATUS_LABEL, IdeaStatusBadge, RegionBadge } from "@/components/helpdesk/badges";
import {
  FEATURE_IDEA_STATUSES,
  fetchAllIdeas,
  type FeatureIdea,
  type FeatureIdeaStatus,
} from "@/integrations/supabase/helpdesk.server";
import { errorMessage, timeAgo } from "@/lib/utils";

export const Route = createFileRoute("/helpdesk/ideas")({
  component: HelpdeskIdeasPage,
});

type SortMode = "newest" | "votes";
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "votes", label: "Most votes" },
];

const STATUS_ALL = "all";
const REGION_ALL = "all";

function HelpdeskIdeasPage() {
  const { authHeaders } = useHelpdeskAuth();

  const [ideas, setIdeas] = useState<FeatureIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_ALL);
  const [regionFilter, setRegionFilter] = useState<string>(REGION_ALL);
  const [selected, setSelected] = useState<FeatureIdea | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    return fetchAllIdeas({ headers: authHeaders() })
      .then((data) => setIdeas(data))
      .catch((e) => setError(errorMessage(e, "Couldn't load ideas.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = ideas.filter((idea) => {
    if (statusFilter !== STATUS_ALL && idea.status !== statusFilter) return false;
    if (regionFilter !== REGION_ALL && (idea.region ?? "").toLowerCase() !== regionFilter)
      return false;
    if (search.trim() && !idea.title.toLowerCase().includes(search.trim().toLowerCase()))
      return false;
    return true;
  });

  const rows = [...filtered].sort((a, b) =>
    sortMode === "votes"
      ? b.votes_count - a.votes_count
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Feature ideas</h1>
        <p className="mt-1 text-sm text-black/55">
          Moderate submissions and manage what's on the public roadmap.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35"
            aria-hidden
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="h-9 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm text-black outline-none placeholder:text-black/45 focus:border-black/25"
          />
        </div>
        <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
          <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none sm:w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={STATUS_ALL}>All statuses</SelectItem>
            {FEATURE_IDEA_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {IDEA_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none sm:w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={REGION_ALL}>All regions</SelectItem>
            <SelectItem value="ca">CA</SelectItem>
            <SelectItem value="us">US</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs text-black/45">
                <th className="px-5 py-3 text-right font-medium">Votes</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Region</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading ideas…
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                rows.map((idea) => (
                  <tr
                    key={idea.id}
                    onClick={() => setSelected(idea)}
                    className="cursor-pointer border-t border-black/[0.05] transition-colors hover:bg-black/[0.02]"
                  >
                    <td className="px-5 py-3 text-right tabular-nums text-black">
                      {idea.votes_count}
                    </td>
                    <td className="max-w-[360px] truncate px-5 py-3 font-medium text-black">
                      {idea.title}
                    </td>
                    <td className="px-5 py-3">
                      <IdeaStatusBadge status={idea.status as FeatureIdeaStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <RegionBadge region={idea.region} />
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-black/50">
                      {timeAgo(idea.created_at)}
                    </td>
                  </tr>
                ))}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    {ideas.length === 0 ? "No feature ideas yet." : "No ideas match these filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <IdeaPanel
        idea={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onChanged={() => void load()}
      />
    </div>
  );
}
