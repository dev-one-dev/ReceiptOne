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
import { RegionBadge, SUPPORT_STATUS_LABEL } from "@/components/helpdesk/badges";
import { useHelpdeskAuth } from "@/components/helpdesk/HelpdeskAuthContext";
import {
  SUPPORT_REQUEST_STATUSES,
  deleteSupportRequest,
  fetchSupportReplies,
  sendSupportReply,
  updateSupportRequestStatus,
  type SupportReply,
  type SupportRequest,
  type SupportRequestStatus,
} from "@/integrations/supabase/helpdesk.server";
import { errorMessage, timeAgo } from "@/lib/utils";

export function SupportPanel({
  request,
  onOpenChange,
  onChanged,
}: {
  request: SupportRequest | null;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
}) {
  const { authHeaders } = useHelpdeskAuth();

  // Local, possibly-ahead-of-the-prop copy -- sendSupportReply can bump
  // status to in_progress without closing the panel, so this (not the
  // `request` prop, which only updates when the caller refetches its
  // list and reopens the panel) is the source of truth for what's shown.
  const [effectiveRequest, setEffectiveRequest] = useState<SupportRequest | null>(request);
  const [status, setStatus] = useState<SupportRequestStatus>("new");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [replies, setReplies] = useState<SupportReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    setEffectiveRequest(request);
    if (request) setStatus(request.status);
  }, [request]);

  useEffect(() => {
    if (!request) {
      setReplies([]);
      return;
    }
    let cancelled = false;
    setRepliesLoading(true);
    fetchSupportReplies({ data: { supportRequestId: request.id }, headers: authHeaders() })
      .then((rows) => {
        if (!cancelled) setReplies(rows);
      })
      .catch((e) => {
        if (!cancelled) toast.error(errorMessage(e, "Couldn't load replies."));
      })
      .finally(() => {
        if (!cancelled) setRepliesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [request, authHeaders]);

  const dirty = effectiveRequest !== null && status !== effectiveRequest.status;

  const handleSave = async () => {
    if (!effectiveRequest) return;
    setSaving(true);
    try {
      await updateSupportRequestStatus({
        data: { id: effectiveRequest.id, status },
        headers: authHeaders(),
      });
      toast.success("Support request updated.");
      onOpenChange(false);
      onChanged();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't save changes."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!effectiveRequest) return;
    setDeleting(true);
    try {
      await deleteSupportRequest({ data: { id: effectiveRequest.id }, headers: authHeaders() });
      toast.success("Support request deleted.");
      setDeleteOpen(false);
      onOpenChange(false);
      onChanged();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't delete this support request."));
    } finally {
      setDeleting(false);
    }
  };

  const handleSendReply = async () => {
    if (!effectiveRequest || !replyText.trim()) return;
    setSendingReply(true);
    try {
      const result = await sendSupportReply({
        data: { supportRequestId: effectiveRequest.id, body: replyText },
        headers: authHeaders(),
      });
      setReplies((prev) => [...prev, result.reply]);
      setEffectiveRequest(result.request);
      setStatus(result.request.status);
      setReplyText("");
      toast.success("Reply sent.");
      onChanged();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't send the reply."));
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <>
      <Sheet
        open={request !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteOpen(false);
          onOpenChange(open);
        }}
      >
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          {effectiveRequest && (
            <>
              <SheetHeader>
                <SheetTitle className="text-black">{effectiveRequest.subject}</SheetTitle>
                <SheetDescription>
                  {effectiveRequest.name} · {effectiveRequest.email}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-3 text-sm">
                {/* Conversation thread -- the original message, then every reply, oldest first */}
                <div className="space-y-3 rounded-xl bg-black/[0.03] px-4 py-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-black/40">
                      <span className="font-medium text-black/60">{effectiveRequest.name}</span>
                      <span>{timeAgo(effectiveRequest.created_at)}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap leading-relaxed text-black/70">
                      {effectiveRequest.message}
                    </p>
                  </div>

                  {repliesLoading && <p className="text-xs text-black/40">Loading replies…</p>}

                  {replies.map((reply) => (
                    <div key={reply.id} className="border-t border-black/[0.07] pt-3">
                      <div className="flex items-center justify-between text-xs text-black/40">
                        <span className="font-medium text-black/60">You</span>
                        <span>{timeAgo(reply.sent_at)}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap leading-relaxed text-black/70">
                        {reply.body}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Reply</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Write a reply — sent from support@receipt-one.com"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/25"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSendReply()}
                    disabled={!replyText.trim() || sendingReply}
                    className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendingReply ? "Sending…" : "Send reply"}
                  </button>
                </div>

                <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Region</span>
                    <RegionBadge region={effectiveRequest.region} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Created</span>
                    <span className="font-medium text-black">
                      {timeAgo(effectiveRequest.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Updated</span>
                    <span className="font-medium text-black">
                      {timeAgo(effectiveRequest.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Status</label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as SupportRequestStatus)}
                  >
                    <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_REQUEST_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {SUPPORT_STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

      {effectiveRequest && (
        <ConfirmDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete this support request?"
          description={`This permanently removes "${effectiveRequest.subject}" from your inbox. This can't be undone.`}
          confirmLabel="Delete request"
          pendingLabel="Deleting…"
          pending={deleting}
          onConfirm={() => void handleDelete()}
        />
      )}
    </>
  );
}
