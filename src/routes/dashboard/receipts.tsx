import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReceiptDetailDialog } from "@/components/dashboard/ReceiptDetailDialog";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { useAuth } from "@/integrations/firebase/auth-context";
import { auth, functions, storage } from "@/integrations/firebase/client";
import { fetchReceipts, type Receipt } from "@/integrations/firebase/receipts";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/receipts")({
  component: ReceiptsPage,
});

const ALL_CATEGORIES = "All categories";

// TODO(write-access): view-only for now -- no create/edit/delete against
// the real `receipts` collection yet. Revisit once Stage 4's read-only
// scope is done; see README's "Known Limitations" section.
function AllReceiptsTab() {
  const { dateFormat } = useDashboardContext();
  const { user } = useAuth();
  // Falls back to auth.currentUser for the same reason the dashboard guard
  // does: context can briefly lag a fresh sign-in, and we'd rather fetch
  // than silently skip loading this user's receipts.
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [selected, setSelected] = useState<Receipt | null>(null);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchReceipts(uid)
      .then((data) => {
        if (!cancelled) setReceipts(data);
      })
      .catch((e) => {
        if (!cancelled) setError(errorMessage(e, "Couldn't load receipts."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(receipts.map((r) => r.companyCategory).filter(Boolean)));
    return [ALL_CATEGORIES, ...unique.sort()];
  }, [receipts]);

  const rows = receipts.filter((r) => {
    if (category !== ALL_CATEGORIES && r.companyCategory !== category) return false;
    if (search.trim() && !r.companyName.toLowerCase().includes(search.trim().toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="mt-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/35"
            aria-hidden
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipts…"
            className="h-9 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm text-black outline-none placeholder:text-black/45 focus:border-black/25"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none sm:w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs text-black/45">
                <th className="px-5 py-3 font-medium">Merchant</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Tax deduction</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    Loading receipts…
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
                rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelected(row)}
                    className="cursor-pointer border-t border-black/[0.05] transition-colors hover:bg-black/[0.02]"
                  >
                    <td className="px-5 py-3 font-medium text-black">{row.companyName || "—"}</td>
                    <td className="px-5 py-3 text-black/60">{row.companyCategory || "—"}</td>
                    <td className="px-5 py-3 text-black/60">{formatDate(row.date, dateFormat)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-black">
                      {formatCurrency(row.price, row.currency)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {row.typeOfTaxDeduction ? (
                        <span className="inline-flex items-center rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-medium text-black/60">
                          {row.typeOfTaxDeduction}
                        </span>
                      ) : (
                        <span className="text-black/30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-black/45">
                    {receipts.length === 0
                      ? "No receipts yet — receipts scanned from the ReceiptOne mobile app will show up here."
                      : "No receipts match these filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptDetailDialog
        receipt={selected}
        dateFormat={dateFormat}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}

// TODO(write-access): visual only -- no real upload/OCR pipeline behind
// this yet. Revisit once Stage 4's read-only scope is done; see README's
// "Known Limitations" section.
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
          dragging
            ? "border-[#f97316] bg-[#f97316]/5"
            : "border-black/15 bg-white hover:border-black/25",
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
          <p className="text-xs font-medium text-black/55">
            {pending.length} file{pending.length === 1 ? "" : "s"} ready to upload
          </p>
          <ul className="mt-2 space-y-1.5">
            {pending.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-2 text-sm text-black"
              >
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

/**
 * Phase 1 OCR diagnostic -- proves the real end-to-end pipeline works
 * from the web: upload to Storage, get its download URL, call the real
 * getTextFromImage callable with that URL (never raw file bytes -- the
 * function's contract is { downloadUrl }, per the deployed Cloud
 * Function source). Deliberately separate from Bulk Upload above, which
 * is still a polished-looking mock for a different, multi-file flow --
 * this stays visibly a diagnostic so it's not mistaken for a finished
 * feature. Does not touch the receipts collection, does not parse the
 * OCR text into structured fields, and does not call any AI parsing --
 * that's later phases.
 */
function OcrTestTab() {
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;
  const inputRef = useRef<HTMLInputElement>(null);

  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [resultText, setResultText] = useState("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!uid) {
      toast.error("You need to be signed in to test this.");
      return;
    }
    setProcessing(true);
    setResultText("");
    setFileName(file.name);
    try {
      // Storage rules only allow writes under /users/{uid}/... by the
      // matching uid -- this path satisfies that exactly.
      const path = `users/${uid}/receipt-ocr-test/${Date.now()}-${file.name}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);

      const getTextFromImage = httpsCallable<
        { downloadUrl: string },
        { text: string; parsedItems: unknown[] }
      >(functions, "getTextFromImage");
      const result = await getTextFromImage({ downloadUrl });
      setResultText(result.data.text || "(empty response)");
      toast.success("OCR completed.");
    } catch (e) {
      toast.error(errorMessage(e, "Upload or OCR failed."));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-semibold text-black">OCR test (diagnostic)</p>
        <p className="mt-1 text-xs text-black/50">
          Uploads a single file to Storage, then calls the real OCR function to confirm the pipeline
          works end-to-end. Nothing here is saved to your receipts -- this only shows the raw text
          the OCR step returns.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={processing}
            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UploadCloud className="size-4" aria-hidden />
            {processing ? "Processing…" : "Choose file"}
          </button>
          {fileName && <span className="truncate text-xs text-black/50">{fileName}</span>}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              void handleFile(file);
            }}
          />
        </div>
      </div>

      {(processing || resultText) && (
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-medium text-black/55">Raw OCR text</p>
          {processing ? (
            <p className="mt-2 text-sm text-black/45">Uploading and running OCR…</p>
          ) : (
            <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-black/[0.03] p-3 text-xs text-black/80">
              {resultText}
            </pre>
          )}
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
        <p className="mt-1 text-sm text-black/55">
          Browse, search, and manage every receipt in one place.
        </p>
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
          <TabsTrigger
            value="ocr-test"
            className="rounded-lg px-3 text-sm font-medium text-black/55 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
          >
            OCR Test
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllReceiptsTab />
        </TabsContent>
        <TabsContent value="bulk">
          <BulkUploadTab />
        </TabsContent>
        <TabsContent value="ocr-test">
          <OcrTestTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
