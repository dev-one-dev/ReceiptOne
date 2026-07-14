import { Eye, EyeOff } from "lucide-react";
import type {
  FeatureIdeaStatus,
  SupportRequestStatus,
} from "@/integrations/supabase/helpdesk.server";
import { isPubliclyVisible } from "@/integrations/supabase/helpdesk.server";

/** Same hand-rolled pill convention the public roadmap page (dashboard/roadmap.tsx) already uses for this exact enum. */
export const IDEA_STATUS_LABEL: Record<FeatureIdeaStatus, string> = {
  pending_review: "Pending review",
  under_review: "Under review",
  planned: "Planned",
  coming_soon: "Coming soon",
  published: "Published",
};

const IDEA_STATUS_STYLE: Record<FeatureIdeaStatus, string> = {
  pending_review: "bg-black/[0.05] text-black/40",
  under_review: "bg-black/[0.05] text-black/60",
  planned: "bg-[#f97316]/10 text-[#c2410c]",
  coming_soon: "bg-[#f97316]/15 text-[#c2410c]",
  published: "bg-black text-white",
};

export function IdeaStatusBadge({ status }: { status: FeatureIdeaStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${IDEA_STATUS_STYLE[status]}`}
    >
      {IDEA_STATUS_LABEL[status]}
    </span>
  );
}

export const SUPPORT_STATUS_LABEL: Record<SupportRequestStatus, string> = {
  new: "New",
  in_progress: "In progress",
  resolved: "Resolved",
};

const SUPPORT_STATUS_STYLE: Record<SupportRequestStatus, string> = {
  new: "bg-[#f97316]/15 text-[#c2410c]",
  in_progress: "bg-black/[0.05] text-black/60",
  resolved: "bg-black text-white",
};

export function SupportStatusBadge({ status }: { status: SupportRequestStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${SUPPORT_STATUS_STYLE[status]}`}
    >
      {SUPPORT_STATUS_LABEL[status]}
    </span>
  );
}

const REGION_LABEL: Record<string, { flag: string; label: string }> = {
  ca: { flag: "🇨🇦", label: "CA" },
  us: { flag: "🇺🇸", label: "US" },
};

export function RegionBadge({ region }: { region: string | null }) {
  const info = region ? REGION_LABEL[region.toLowerCase()] : undefined;
  if (!info) return <span className="text-xs text-black/30">—</span>;
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/[0.05] px-2 py-0.5 text-xs font-medium text-black/60">
      <span aria-hidden>{info.flag}</span>
      {info.label}
    </span>
  );
}

/**
 * Every feature_ideas status except pending_review is live on the public
 * roadmap -- this makes that consequence visible everywhere a status can
 * be changed, per the moderation-safety requirement.
 */
export function VisibilityIndicator({ status }: { status: FeatureIdeaStatus }) {
  const visible = isPubliclyVisible(status);
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        visible ? "bg-[#f97316]/10 text-[#c2410c]" : "bg-black/[0.05] text-black/40"
      }`}
    >
      {visible ? <Eye className="size-3" aria-hidden /> : <EyeOff className="size-3" aria-hidden />}
      {visible ? "Visible publicly" : "Hidden (pending review)"}
    </span>
  );
}
