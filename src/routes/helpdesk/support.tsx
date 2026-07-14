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
import { SupportPanel } from "@/components/helpdesk/SupportPanel";
import {
  RegionBadge,
  SUPPORT_STATUS_LABEL,
  SupportStatusBadge,
} from "@/components/helpdesk/badges";
import {
  SUPPORT_REQUEST_STATUSES,
  fetchAllSupportRequests,
  type SupportRequest,
} from "@/integrations/supabase/helpdesk.server";
import { errorMessage, timeAgo } from "@/lib/utils";

export const Route = createFileRoute("/helpdesk/support")({
  component: HelpdeskSupportPage,
});

const STATUS_ALL = "all";
const REGION_ALL = "all";

function HelpdeskSupportPage() {
  const { authHeaders } = useHelpdeskAuth();

  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_ALL);
  const [regionFilter, setRegionFilter] = useState<string>(REGION_ALL);
  const [selected, setSelected] = useState<SupportRequest | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    return fetchAllSupportRequests({ headers: authHeaders() })
      .then((data) => setRequests(data))
      .catch((e) => setError(errorMessage(e, "Couldn't load support requests.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = requests.filter((r) => {
    if (statusFilter !== STATUS_ALL && r.status !== statusFilter) return false;
    if (regionFilter !== REGION_ALL && (r.region ?? "").toLowerCase() !== regionFilter)
      return false;
    const q = search.trim().toLowerCase();
    if (
      q &&
      !r.subject.toLowerCase().includes(q) &&
      !r.email.toLowerCase().includes(q) &&
      !r.message.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Support requests</h1>
        <p className="mt-1 text-sm text-black/55">Every contact-form submission, newest first.</p>
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
            placeholder="Search subject, email, or message…"
            className="h-9 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm text-black outline-none placeholder:text-black/45 focus:border-black/25"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none sm:w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={STATUS_ALL}>All statuses</SelectItem>
            {SUPPORT_REQUEST_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {SUPPORT_STATUS_LABEL[s]}
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
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Region</th>
                <th className="px-5 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading support requests…
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
                rows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="cursor-pointer border-t border-black/[0.05] transition-colors hover:bg-black/[0.02]"
                  >
                    <td className="max-w-[300px] truncate px-5 py-3 font-medium text-black">
                      {r.subject}
                    </td>
                    <td className="px-5 py-3 text-black/60">{r.email}</td>
                    <td className="px-5 py-3">
                      <SupportStatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3">
                      <RegionBadge region={r.region} />
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-black/50">
                      {timeAgo(r.created_at)}
                    </td>
                  </tr>
                ))}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    {requests.length === 0
                      ? "No support requests yet."
                      : "No requests match these filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SupportPanel
        request={selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onChanged={() => void load()}
      />
    </div>
  );
}
