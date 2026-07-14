import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDeleteDialog } from "@/components/helpdesk/ConfirmDeleteDialog";
import { IDEA_STATUS_LABEL, RegionBadge, VisibilityIndicator } from "@/components/helpdesk/badges";
import { useHelpdeskAuth } from "@/components/helpdesk/HelpdeskAuthContext";
import {
  FEATURE_IDEA_STATUSES,
  deleteIdea,
  isPubliclyVisible,
  updateIdeaStatus,
  type FeatureIdea,
  type FeatureIdeaStatus,
} from "@/integrations/supabase/helpdesk.server";
import { errorMessage, timeAgo } from "@/lib/utils";

/**
 * Row-detail side panel for a single feature idea -- title, description,
 * votes, submitter device id, region, timestamps, an editable status
 * (the 5 real enum values), Save, and a real, permanent delete (for
 * spam). Mirrors ReceiptDetailDialog's own delete-confirmation pattern.
 */
export function IdeaPanel({
  idea,
  onOpenChange,
  onChanged,
}: {
  idea: FeatureIdea | null;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
}) {
  const { authHeaders } = useHelpdeskAuth();

  const [status, setStatus] = useState<FeatureIdeaStatus>("pending_review");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (idea) setStatus(idea.status);
  }, [idea]);

  const dirty = idea !== null && status !== idea.status;
  const willNewlyPublish =
    idea !== null && idea.status === "pending_review" && status !== "pending_review";

  const handleSave = async () => {
    if (!idea) return;
    setSaving(true);
    try {
      await updateIdeaStatus({ data: { id: idea.id, status }, headers: authHeaders() });
      toast.success(
        willNewlyPublish
          ? `"${idea.title}" saved — now visible on the public roadmap.`
          : "Idea updated.",
      );
      onOpenChange(false);
      onChanged();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't save changes."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!idea) return;
    setDeleting(true);
    try {
      await deleteIdea({ data: { id: idea.id }, headers: authHeaders() });
      toast.success("Idea deleted.");
      setDeleteOpen(false);
      onOpenChange(false);
      onChanged();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't delete this idea."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Sheet
        open={idea !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteOpen(false);
          onOpenChange(open);
        }}
      >
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          {idea && (
            <>
              <SheetHeader>
                <SheetTitle className="text-black">{idea.title}</SheetTitle>
                <SheetDescription>
                  {idea.votes_count} vote{idea.votes_count === 1 ? "" : "s"} ·{" "}
                  {timeAgo(idea.created_at)}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-3 text-sm">
                <VisibilityIndicator status={status} />

                <p className="rounded-xl bg-black/[0.03] px-4 py-3 leading-relaxed text-black/70">
                  {idea.description}
                </p>

                <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Region</span>
                    <RegionBadge region={idea.region} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Submitter device</span>
                    <span
                      className="max-w-[220px] truncate font-medium text-black"
                      title={idea.device_id}
                    >
                      {idea.device_id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Created</span>
                    <span className="font-medium text-black">{timeAgo(idea.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Updated</span>
                    <span className="font-medium text-black">{timeAgo(idea.updated_at)}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Status</label>
                  <Select value={status} onValueChange={(v) => setStatus(v as FeatureIdeaStatus)}>
                    <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEATURE_IDEA_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {IDEA_STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {dirty && (
                    <p className="text-xs text-black/45">
                      {willNewlyPublish
                        ? "Saving will make this idea visible on the public roadmap."
                        : isPubliclyVisible(status)
                          ? "This idea stays visible on the public roadmap."
                          : "This idea stays hidden from the public roadmap."}
                    </p>
                  )}
                </div>
              </div>

              <SheetFooter className="mt-6 gap-2 sm:justify-between sm:gap-0">
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={!dirty || saving}
                  className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {idea && (
        <ConfirmDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete this idea?"
          description={`This permanently removes "${idea.title}" from the feature board. This can't be undone.`}
          confirmLabel="Delete idea"
          pendingLabel="Deleting…"
          pending={deleting}
          onConfirm={() => void handleDelete()}
        />
      )}
    </>
  );
}
