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
import {
  createReceipt,
  fetchReceipts,
  type Receipt,
  type TaxListEntry,
} from "@/integrations/firebase/receipts";
import { fetchUserProfile, type UserProfile } from "@/integrations/firebase/user-profile";
import { getReceiptCategories } from "@/integrations/receipt-parsing/categories";
import { extractReceiptWithGemini } from "@/integrations/receipt-parsing/gemini";
import { extractJsonFromText } from "@/integrations/receipt-parsing/extract-json";
import { parseReceiptFromJson } from "@/integrations/receipt-parsing/parse-receipt";
import { applyTaxListUpdate } from "@/integrations/receipt-parsing/apply-tax-settings";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

type ReviewTaxRow = { taxName: string; taxPercent: string; tax: string; isRefundable: boolean };

type ReviewForm = {
  merchantName: string;
  merchantCategory: string;
  date: string;
  price: string;
  tax: string;
  paymentMethod: "Cash" | "Card";
  typeOfTaxDeduction: "Business" | "Personal";
  comment: string;
};

function toDateInputValue(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

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

type FileStatus = "uploading" | "ocr" | "parsing" | "review" | "saving" | "error";

type FileCard = {
  id: string;
  file: File;
  status: FileStatus;
  errorMessage?: string;
  downloadUrl?: string;
  categories: string[];
  isPreTax: boolean;
  review?: ReviewForm;
  taxRows?: ReviewTaxRow[];
};

const STATUS_LABELS: Record<FileStatus, string> = {
  uploading: "Uploading…",
  ocr: "Running OCR…",
  parsing: "Parsing with AI…",
  review: "Ready for review",
  saving: "Saving…",
  error: "Failed",
};

/**
 * Runs one file through the full real pipeline: upload to Storage (the
 * permanent users/{uid}/receipts/... path, not OCR Test's old diagnostic
 * receipt-ocr-test/ path), OCR via the real getTextFromImage callable,
 * then the same Gemini parsing pipeline from src/integrations/
 * receipt-parsing/ that the old OCR Test tab used, unchanged. Skips
 * re-uploading on retry if a downloadUrl already exists (upload
 * succeeded, only OCR/parsing failed) -- each file's status updates
 * independently, so failures never block or hide sibling files.
 */
async function processFileCard(
  uid: string,
  card: FileCard,
  profile: UserProfile | null,
  updateCard: (id: string, patch: Partial<FileCard>) => void,
) {
  try {
    let downloadUrl = card.downloadUrl;
    if (!downloadUrl) {
      updateCard(card.id, { status: "uploading", errorMessage: undefined });
      const path = `users/${uid}/receipts/${Date.now()}-${card.file.name}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, card.file);
      downloadUrl = await getDownloadURL(fileRef);
      updateCard(card.id, { downloadUrl });
    }

    updateCard(card.id, { status: "ocr" });
    const getTextFromImage = httpsCallable<
      { downloadUrl: string },
      { text: string; parsedItems: unknown[] }
    >(functions, "getTextFromImage");
    const ocrResult = await getTextFromImage({ downloadUrl });
    const ocrText = ocrResult.data.text || "";

    updateCard(card.id, { status: "parsing" });
    const countryCode = profile?.countryCode || "us";
    const cats = getReceiptCategories(countryCode);
    const rawResponseText = await extractReceiptWithGemini(ocrText, cats, downloadUrl);
    const rawJson = extractJsonFromText(rawResponseText);
    const parsed = parseReceiptFromJson(
      rawJson,
      rawResponseText,
      profile?.stateCountry ?? "",
      profile?.stateState ?? "",
    );
    const { taxList, tax } = applyTaxListUpdate(parsed, profile?.taxList ?? []);

    updateCard(card.id, {
      status: "review",
      categories: cats,
      isPreTax: parsed.isPreTax,
      review: {
        merchantName: parsed.merchantName ?? "",
        merchantCategory: parsed.merchantCategory ?? cats[0] ?? "",
        date: parsed.date ? toDateInputValue(parsed.date) : "",
        price: parsed.price.toFixed(2),
        tax: tax.toFixed(2),
        paymentMethod: parsed.paymentMethod,
        typeOfTaxDeduction: parsed.typeOfTaxDeduction,
        comment: parsed.comment ?? "",
      },
      taxRows: taxList.map((t) => ({
        taxName: t.taxName,
        taxPercent: t.taxPercent.toFixed(2),
        tax: t.tax.toFixed(2),
        isRefundable: t.isRefundable,
      })),
    });
  } catch (e) {
    updateCard(card.id, {
      status: "error",
      errorMessage: errorMessage(e, "Something went wrong processing this file."),
    });
  }
}

/**
 * Real multi-file receipt pipeline (Phase 3) -- replaces the old
 * visual-only mock and absorbs the OCR Test tab's diagnostic flow.
 * Each dropped/picked file gets its own card and its own independent
 * processing run (not awaited in sequence, so file 2 never waits on
 * file 1); user profile + tax settings are fetched once per tab session
 * and shared across every file's pipeline run rather than refetched per
 * file. Saving calls createReceipt() with that card's current
 * (possibly edited) fields and removes the card on success -- the
 * receipt then shows up in All Receipts automatically since that tab
 * already reads live Firestore data.
 */
function BulkUploadTab() {
  const { user } = useAuth();
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [dragging, setDragging] = useState(false);
  const [cards, setCards] = useState<FileCard[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  // No per-account currency setting exists yet -- same precedent as
  // trips.ts/mileage.tsx (trips[0]?.currency ?? "USD"): use an existing
  // receipt's currency if the user has any, else fall back by country.
  const [defaultCurrency, setDefaultCurrency] = useState("USD");

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    Promise.all([fetchUserProfile(uid), fetchReceipts(uid)])
      .then(([p, receipts]) => {
        if (cancelled) return;
        setProfile(p);
        setDefaultCurrency(
          receipts[0]?.currency ?? (p?.countryCode?.toLowerCase() === "ca" ? "CAD" : "USD"),
        );
      })
      .catch(() => {
        // Non-fatal -- falls back to US categories, no province
        // disambiguation, no user tax settings, and USD for this
        // session if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const updateCard = (id: string, patch: Partial<FileCard>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!uid) {
      toast.error("You need to be signed in to upload receipts.");
      return;
    }
    const newCards: FileCard[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`,
      file,
      status: "uploading",
      categories: [],
      isPreTax: false,
    }));
    setCards((prev) => [...prev, ...newCards]);
    for (const card of newCards) {
      void processFileCard(uid, card, profile, updateCard);
    }
  };

  const retryCard = (card: FileCard) => {
    if (!uid) return;
    void processFileCard(uid, card, profile, updateCard);
  };

  const handleSave = async (card: FileCard) => {
    if (!uid || !card.review) return;
    updateCard(card.id, { status: "saving" });
    try {
      const taxLists: TaxListEntry[] = (card.taxRows ?? []).map((r) => ({
        taxName: r.taxName,
        tax: parseFloat(r.tax) || 0,
        taxPercent: parseFloat(r.taxPercent) || 0,
        isRefundable: r.isRefundable,
      }));
      await createReceipt({
        uid,
        comment: card.review.comment,
        companyCategory: card.review.merchantCategory,
        companyName: card.review.merchantName,
        currency: defaultCurrency,
        date: card.review.date ? new Date(`${card.review.date}T00:00:00`) : new Date(),
        isPreTax: card.isPreTax,
        paymentMethod: card.review.paymentMethod,
        price: parseFloat(card.review.price) || 0,
        receiptFile: card.downloadUrl ?? "",
        receiptImage: card.downloadUrl ?? "",
        tax: parseFloat(card.review.tax) || 0,
        taxLists,
        typeOfTaxDeduction: card.review.typeOfTaxDeduction,
      });
      toast.success(`Saved ${card.file.name}.`);
      removeCard(card.id);
    } catch (e) {
      updateCard(card.id, {
        status: "error",
        errorMessage: errorMessage(e, "Couldn't save this receipt."),
      });
    }
  };

  const updateReviewField = (card: FileCard, patch: Partial<ReviewForm>) => {
    if (!card.review) return;
    updateCard(card.id, { review: { ...card.review, ...patch } });
  };

  const updateTaxRow = (card: FileCard, index: number, patch: Partial<ReviewTaxRow>) => {
    const rows = card.taxRows ?? [];
    updateCard(card.id, {
      taxRows: rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    });
  };

  const removeTaxRow = (card: FileCard, index: number) => {
    const rows = card.taxRows ?? [];
    updateCard(card.id, { taxRows: rows.filter((_, i) => i !== index) });
  };

  const addTaxRow = (card: FileCard) => {
    const rows = card.taxRows ?? [];
    updateCard(card.id, {
      taxRows: [...rows, { taxName: "Tax", taxPercent: "0.00", tax: "0.00", isRefundable: false }],
    });
  };

  return (
    <div className="mt-5 space-y-4">
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
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {cards.map((card) => (
        <div
          key={card.id}
          className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-black">{card.file.name}</p>
              <p
                className={[
                  "mt-0.5 text-xs",
                  card.status === "error" ? "text-red-600" : "text-black/50",
                ].join(" ")}
              >
                {card.status === "error" ? card.errorMessage : STATUS_LABELS[card.status]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeCard(card.id)}
              aria-label={`Remove ${card.file.name}`}
              className="shrink-0 rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </div>

          {card.status === "error" && (
            <button
              type="button"
              onClick={() => retryCard(card)}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              Retry
            </button>
          )}

          {card.status === "review" && card.review && (
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Merchant name</label>
                  <input
                    value={card.review.merchantName}
                    onChange={(e) => updateReviewField(card, { merchantName: e.target.value })}
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Category</label>
                  <select
                    value={card.review.merchantCategory}
                    onChange={(e) => updateReviewField(card, { merchantCategory: e.target.value })}
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                  >
                    {card.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Date</label>
                  <input
                    type="date"
                    value={card.review.date}
                    onChange={(e) => updateReviewField(card, { date: e.target.value })}
                    className="h-9 w-full appearance-none rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Price</label>
                  <input
                    value={card.review.price}
                    onChange={(e) => updateReviewField(card, { price: e.target.value })}
                    inputMode="decimal"
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Tax (total)</label>
                  <input
                    value={card.review.tax}
                    onChange={(e) => updateReviewField(card, { tax: e.target.value })}
                    inputMode="decimal"
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">Payment method</label>
                  <select
                    value={card.review.paymentMethod}
                    onChange={(e) =>
                      updateReviewField(card, { paymentMethod: e.target.value as "Cash" | "Card" })
                    }
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-black/55">
                    Business or personal
                  </label>
                  <select
                    value={card.review.typeOfTaxDeduction}
                    onChange={(e) =>
                      updateReviewField(card, {
                        typeOfTaxDeduction: e.target.value as "Business" | "Personal",
                      })
                    }
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                  >
                    <option value="Business">Business</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-black/55">Comment</label>
                  <input
                    value={card.review.comment}
                    onChange={(e) => updateReviewField(card, { comment: e.target.value })}
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-black/55">Tax breakdown</p>
                <div className="mt-2 overflow-hidden rounded-xl border border-black/[0.07]">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="text-black/45">
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">Percent</th>
                        <th className="px-3 py-2 font-medium">Amount</th>
                        <th className="px-3 py-2 font-medium">Refundable</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {(card.taxRows ?? []).map((row, i) => (
                        <tr key={i} className="border-t border-black/[0.05]">
                          <td className="px-3 py-2">
                            <input
                              value={row.taxName}
                              onChange={(e) => updateTaxRow(card, i, { taxName: e.target.value })}
                              className="h-8 w-full rounded-lg border border-black/10 bg-white px-2 text-xs outline-none focus:border-black/25"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              value={row.taxPercent}
                              onChange={(e) =>
                                updateTaxRow(card, i, { taxPercent: e.target.value })
                              }
                              inputMode="decimal"
                              className="h-8 w-20 rounded-lg border border-black/10 bg-white px-2 text-xs outline-none focus:border-black/25"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              value={row.tax}
                              onChange={(e) => updateTaxRow(card, i, { tax: e.target.value })}
                              inputMode="decimal"
                              className="h-8 w-24 rounded-lg border border-black/10 bg-white px-2 text-xs outline-none focus:border-black/25"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={row.isRefundable}
                              onChange={(e) =>
                                updateTaxRow(card, i, { isRefundable: e.target.checked })
                              }
                              className="size-3.5 rounded border-black/20"
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => removeTaxRow(card, i)}
                              aria-label="Remove tax row"
                              className="text-black/40 transition-colors hover:text-black"
                            >
                              <X className="size-3.5" aria-hidden />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(card.taxRows ?? []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-3 py-4 text-center text-black/40">
                            No tax breakdown
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => addTaxRow(card)}
                  className="mt-2 text-xs font-medium text-black/55 transition-colors hover:text-black"
                >
                  + Add tax row
                </button>
              </div>

              <button
                type="button"
                onClick={() => void handleSave(card)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Save receipt
              </button>
            </div>
          )}
        </div>
      ))}
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
