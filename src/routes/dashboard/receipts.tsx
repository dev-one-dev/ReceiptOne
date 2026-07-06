import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Search, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/receipts")({
  component: ReceiptsPage,
});

type ReceiptRow = {
  merchant: string;
  category: string;
  date: string;
  amount: string;
  status: "Categorized" | "Needs review";
};

const CATEGORIES = ["All categories", "Office Supplies", "Travel", "Fuel", "Software", "Office Rent", "Meals"];
const STATUSES = ["All statuses", "Categorized", "Needs review"];

const RECEIPTS: ReceiptRow[] = [
  { merchant: "Staples", category: "Office Supplies", date: "Jul 2", amount: "$84.20", status: "Categorized" },
  { merchant: "Uber", category: "Travel", date: "Jun 29", amount: "$23.50", status: "Categorized" },
  { merchant: "Shell", category: "Fuel", date: "Jun 27", amount: "$61.10", status: "Needs review" },
  { merchant: "Adobe", category: "Software", date: "Jun 24", amount: "$54.99", status: "Categorized" },
  { merchant: "WeWork", category: "Office Rent", date: "Jun 20", amount: "$320.00", status: "Categorized" },
  { merchant: "Home Depot", category: "Supplies", date: "Jun 18", amount: "$142.75", status: "Needs review" },
  { merchant: "Chipotle", category: "Meals", date: "Jun 16", amount: "$18.40", status: "Categorized" },
  { merchant: "Best Buy", category: "Office Supplies", date: "Jun 12", amount: "$249.00", status: "Categorized" },
  { merchant: "Esso", category: "Fuel", date: "Jun 9", amount: "$58.30", status: "Needs review" },
  { merchant: "Notion", category: "Software", date: "Jun 5", amount: "$16.00", status: "Categorized" },
];

function StatusBadge({ status }: { status: ReceiptRow["status"] }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        status === "Categorized" ? "bg-black/[0.05] text-black/60" : "bg-[#f97316]/10 text-[#c2410c]",
      ].join(" ")}
    >
      {status === "Categorized" ? <CheckCircle2 className="size-3" aria-hidden /> : <AlertCircle className="size-3" aria-hidden />}
      {status}
    </span>
  );
}

function AllReceiptsTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState(STATUSES[0]);

  const rows = RECEIPTS.filter((r) => {
    if (category !== "All categories" && r.category !== category) return false;
    if (status !== "All statuses" && r.status !== status) return false;
    if (search.trim() && !r.merchant.toLowerCase().includes(search.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mt-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35" aria-hidden />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipts…"
            className="h-9 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm text-black outline-none placeholder:text-black/45 focus:border-black/25"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none sm:w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs text-black/45">
                <th className="px-5 py-3 font-medium">Merchant</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.merchant + row.date} className="border-t border-black/[0.05]">
                  <td className="px-5 py-3 font-medium text-black">{row.merchant}</td>
                  <td className="px-5 py-3 text-black/60">{row.category}</td>
                  <td className="px-5 py-3 text-black/60">{row.date}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-black">{row.amount}</td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    No receipts match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BulkUploadTab() {
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPending((prev) => [...prev, ...Array.from(files).map((f) => f.name)]);
  };

  const removeFile = (name: string) => {
    setPending((prev) => prev.filter((f) => f !== name));
  };

  const handleUpload = () => {
    if (pending.length === 0) return;
    toast.info("Bulk upload isn't wired up yet — this is a static mockup.");
    setPending([]);
  };

  return (
    <div className="mt-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={[
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors",
          dragging ? "border-[#f97316] bg-[#f97316]/5" : "border-black/15 bg-white hover:border-black/25",
        ].join(" ")}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
          <UploadCloud className="size-6" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-medium text-black">Drag and drop receipts here</p>
          <p className="mt-1 text-xs text-black/50">or click to browse — JPG, PNG, or PDF</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {pending.length > 0 && (
        <div className="mt-4 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium text-black/55">{pending.length} file{pending.length === 1 ? "" : "s"} ready to upload</p>
          <ul className="mt-2 space-y-1.5">
            {pending.map((name) => (
              <li key={name} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-2 text-sm text-black">
                <span className="truncate">{name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(name)}
                  className="ml-2 rounded-full p-1 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
                  aria-label={`Remove ${name}`}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleUpload}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Upload {pending.length} file{pending.length === 1 ? "" : "s"}
          </button>
        </div>
      )}
    </div>
  );
}

function ReceiptsPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Receipts</h1>
        <p className="mt-1 text-sm text-black/55">Browse, search, and manage every receipt in one place.</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mt-5 h-9 gap-1 rounded-xl bg-black/[0.04] p-1">
          <TabsTrigger
            value="all"
            className="rounded-lg px-3 text-sm font-medium text-black/55 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
          >
            All Receipts
          </TabsTrigger>
          <TabsTrigger
            value="bulk"
            className="rounded-lg px-3 text-sm font-medium text-black/55 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
          >
            Bulk Upload
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllReceiptsTab />
        </TabsContent>
        <TabsContent value="bulk">
          <BulkUploadTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
