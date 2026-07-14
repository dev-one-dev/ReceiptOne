import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Check,
  Lightbulb,
  ListChecks,
  LifeBuoy,
  ThumbsUp,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useHelpdeskAuth } from "@/components/helpdesk/HelpdeskAuthContext";
import { ConfirmDeleteDialog } from "@/components/helpdesk/ConfirmDeleteDialog";
import { RegionBadge, SupportStatusBadge } from "@/components/helpdesk/badges";
import {
  deleteIdea,
  updateIdeaStatus,
  type FeatureIdea,
} from "@/integrations/supabase/helpdesk.server";
import { errorMessage, timeAgo } from "@/lib/utils";

export const Route = createFileRoute("/helpdesk/")({
  component: HelpdeskOverviewPage,
});

type StatCard = { label: string; value: string; icon: LucideIcon };

function HelpdeskOverviewPage() {
  const { overview, overviewLoading, authHeaders, refetchOverview } = useHelpdeskAuth();

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FeatureIdea | null>(null);
  const [deleting, setDeleting] = useState(false);

  const s = overview?.stats;
  const statVal = (n: number | undefined) =>
    overviewLoading || s === undefined ? "…" : String(n ?? 0);
  const stats: StatCard[] = [
    { label: "Pending review", value: statVal(s?.pendingReviewCount), icon: ListChecks },
    { label: "Total ideas", value: statVal(s?.totalIdeasCount), icon: Lightbulb },
    { label: "Open support requests", value: statVal(s?.openSupportCount), icon: LifeBuoy },
    { label: "Total votes", value: statVal(s?.totalVotesCount), icon: ThumbsUp },
  ];

  const pendingIdeas = overview?.pendingIdeas ?? [];
  const latestSupport = overview?.latestSupportRequests ?? [];

  const handleApprove = async (idea: FeatureIdea) => {
    setApprovingId(idea.id);
    try {
      await updateIdeaStatus({
        data: { id: idea.id, status: "under_review" },
        headers: authHeaders(),
      });
      toast.success(`"${idea.title}" approved — now visible on the public roadmap.`);
      await refetchOverview();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't approve this idea."));
    } finally {
      setApprovingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteIdea({ data: { id: deleteTarget.id }, headers: authHeaders() });
      toast.success("Idea deleted.");
      setDeleteTarget(null);
      await refetchOverview();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't delete this idea."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Helpdesk overview</h1>
        <p className="mt-1 text-sm text-black/55">
          Moderate the public feature board and answer support requests.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-black/55">{label}</span>
              <span className="flex size-8 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
                <Icon className="size-4" aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-black">{value}</p>
          </div>
        ))}
      </div>

      {/* Pending review queue -- the #1 daily task, front and center */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-black">Pending review</h2>
            {!overviewLoading && pendingIdeas.length > 0 && (
              <span className="rounded-full bg-[#f97316]/15 px-2 py-0.5 text-xs font-semibold text-[#c2410c]">
                {pendingIdeas.length}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-black/45">
            New ideas aren't visible on the roadmap until approved.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-t border-black/[0.07] text-xs text-black/45">
                <th className="px-5 py-2 font-medium">Title</th>
                <th className="px-5 py-2 font-medium">Description</th>
                <th className="px-5 py-2 text-right font-medium">Votes</th>
                <th className="px-5 py-2 font-medium">Region</th>
                <th className="px-5 py-2 font-medium">Created</th>
                <th className="px-5 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {overviewLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading…
                  </td>
                </tr>
              )}
              {!overviewLoading && pendingIdeas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-black/45">
                    Nothing waiting for review.
                  </td>
                </tr>
              )}
              {!overviewLoading &&
                pendingIdeas.map((idea) => (
                  <tr key={idea.id} className="border-t border-black/[0.05]">
                    <td className="max-w-[220px] truncate px-5 py-3 font-medium text-black">
                      {idea.title}
                    </td>
                    <td className="max-w-[320px] truncate px-5 py-3 text-black/60">
                      {idea.description}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-black">
                      {idea.votes_count}
                    </td>
                    <td className="px-5 py-3">
                      <RegionBadge region={idea.region} />
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-black/50">
                      {timeAgo(idea.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          title="Approve — publishes this idea to the public roadmap"
                          onClick={() => void handleApprove(idea)}
                          disabled={approvingId === idea.id}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Check className="size-3.5" aria-hidden />
                          {approvingId === idea.id ? "Approving…" : "Approve"}
                        </button>
                        <button
                          type="button"
                          aria-label="Delete idea"
                          title="Delete (spam)"
                          onClick={() => setDeleteTarget(idea)}
                          className="inline-flex items-center justify-center rounded-full border border-red-200 p-1.5 text-red-700 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest support requests */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold text-black">Latest support requests</h2>
          <Link
            to="/helpdesk/support"
            className="inline-flex items-center gap-1 text-xs font-medium text-black/55 transition-colors hover:text-black"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-t border-black/[0.07] text-xs text-black/45">
                <th className="px-5 py-2 font-medium">Subject</th>
                <th className="px-5 py-2 font-medium">Email</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {overviewLoading && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading…
                  </td>
                </tr>
              )}
              {!overviewLoading && latestSupport.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-black/45">
                    No support requests yet.
                  </td>
                </tr>
              )}
              {!overviewLoading &&
                latestSupport.map((req) => (
                  <tr key={req.id} className="border-t border-black/[0.05]">
                    <td className="max-w-[280px] truncate px-5 py-3 font-medium text-black">
                      {req.subject}
                    </td>
                    <td className="px-5 py-3 text-black/60">{req.email}</td>
                    <td className="px-5 py-3">
                      <SupportStatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-black/50">
                      {timeAgo(req.created_at)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this idea?"
        description={`This permanently removes "${deleteTarget?.title ?? ""}" from the feature board. This can't be undone.`}
        confirmLabel="Delete idea"
        pendingLabel="Deleting…"
        pending={deleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
