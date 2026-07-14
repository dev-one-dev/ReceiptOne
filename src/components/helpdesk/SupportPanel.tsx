import { useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
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
  updateSupportRequestStatus,
  type SupportRequest,
  type SupportRequestStatus,
} from "@/integrations/supabase/helpdesk.server";
import { errorMessage, timeAgo } from "@/lib/utils";

/** mailto: link with the subject pre-filled -- the only way to actually answer a ticket today, since there's no in-app reply system. */
function replyMailto(request: SupportRequest): string {
  const subject = `Re: ${request.subject}`;
  return `mailto:${encodeURIComponent(request.email)}?subject=${encodeURIComponent(subject)}`;
}

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

  const [status, setStatus] = useState<SupportRequestStatus>("new");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (request) setStatus(request.status);
  }, [request]);

  const dirty = request !== null && status !== request.status;

  const handleSave = async () => {
    if (!request) return;
    setSaving(true);
    try {
      await updateSupportRequestStatus({
        data: { id: request.id, status },
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
    if (!request) return;
    setDeleting(true);
    try {
      await deleteSupportRequest({ data: { id: request.id }, headers: authHeaders() });
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
          {request && (
            <>
              <SheetHeader>
                <SheetTitle className="text-black">{request.subject}</SheetTitle>
                <SheetDescription>
                  {request.name} · {request.email}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-3 text-sm">
                <a
                  href={replyMailto(request)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Mail className="size-3.5" aria-hidden />
                  Reply by email
                </a>

                <p className="whitespace-pre-wrap rounded-xl bg-black/[0.03] px-4 py-3 leading-relaxed text-black/70">
                  {request.message}
                </p>

                <div className="space-y-2 rounded-xl bg-black/[0.03] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Region</span>
                    <RegionBadge region={request.region} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Created</span>
                    <span className="font-medium text-black">{timeAgo(request.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/55">Updated</span>
                    <span className="font-medium text-black">{timeAgo(request.updated_at)}</span>
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

      {request && (
        <ConfirmDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete this support request?"
          description={`This permanently removes "${request.subject}" from your inbox. This can't be undone.`}
          confirmLabel="Delete request"
          pendingLabel="Deleting…"
          pending={deleting}
          onConfirm={() => void handleDelete()}
        />
      )}
    </>
  );
}
