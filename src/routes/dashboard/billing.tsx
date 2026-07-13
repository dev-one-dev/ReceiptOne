import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { updateProfile } from "firebase/auth";
import { ExternalLink, Gift, Mail, MapPin, Pencil, User, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardContext } from "@/components/dashboard/DashboardContext";
import { getInitials, useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";
import { fetchReferralCount } from "@/integrations/firebase/referrals";
import { fetchUserProfile, updateUserProfile } from "@/integrations/firebase/user-profile";
import {
  fetchBillingHistory,
  type BillingHistory,
} from "@/integrations/revenuecat/get-billing-history";
import { findActiveSubscription } from "@/integrations/entitlement";
import { formatCurrency, formatDate } from "@/lib/dashboard-format";
import { errorMessage } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

// No real auth/account data yet, so there's no way to know which store a
// user actually subscribed through -- and unlike an install CTA, guessing
// from the current browser/device would be actively wrong here (someone
// could've subscribed on their phone and be viewing this dashboard on a
// laptop). Same judgment call Pricing.tsx's usePlatform() already makes
// for install badges: when the real answer is ambiguous, show both,
// equal weight, rather than default to one. Once real account data
// exists, this should show only the one store the user actually
// subscribed through -- a recorded fact, not a device guess.
const STORES = [
  {
    name: "App Store",
    // Apple's standard, app-agnostic subscription management page --
    // subscriptions are managed per Apple ID, not via an app-specific URL.
    manageUrl: "https://apps.apple.com/account/subscriptions",
  },
  {
    name: "Google Play",
    // Real, confirmed package name from StoreBadge.tsx -- Google Play
    // does support deep-linking to a specific app's subscription.
    manageUrl: "https://play.google.com/store/account/subscriptions?package=com.appfyl.checkapp",
  },
] as const;

const COUNTRY_NAMES: Record<string, { flag: string; name: string }> = {
  ca: { flag: "🇨🇦", name: "Canada" },
  us: { flag: "🇺🇸", name: "United States" },
};

type Jurisdiction = { flag: string; text: string };

function formatJurisdiction(countryCode: string, state: string): Jurisdiction | null {
  const country = COUNTRY_NAMES[countryCode];
  if (!country) return null;
  return { flag: country.flag, text: state ? `${country.name} — ${state}` : country.name };
}

/** null if there's no trial date to show; otherwise a short status string, handling both "still in trial" and "already ended" since a real account's trial_exp_date can be in the past. */
function formatTrialStatus(trialExpDate: Date | null): string | null {
  if (!trialExpDate || trialExpDate.getTime() === 0) return null;
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((trialExpDate.getTime() - Date.now()) / msPerDay);
  if (daysLeft > 0) return `Trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
  if (daysLeft === 0) return "Trial ends today";
  return "Trial ended";
}

function BillingPage() {
  const { dateFormat } = useDashboardContext();
  const { user } = useAuth();
  const email = user?.email || "";
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const [countryCode, setCountryCode] = useState("");
  const [stateState, setStateState] = useState("");
  const [trialStatus, setTrialStatus] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState<number | null>(null);
  const [billing, setBilling] = useState<BillingHistory | null>(null);

  // Firebase Auth's updateProfile() mutates auth.currentUser in place
  // but doesn't re-fire onAuthStateChanged, so useAuth()'s own `user`
  // won't reflect a saved name change on its own -- this override is
  // the thing that actually updates the header immediately after save.
  const [displayNameOverride, setDisplayNameOverride] = useState<string | null>(null);
  const displayName = displayNameOverride || user?.displayName || "Account";

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCountryCode, setEditCountryCode] = useState("");
  const [editState, setEditState] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    Promise.all([fetchUserProfile(uid), fetchReferralCount(uid)])
      .then(([profile, count]) => {
        if (cancelled) return;
        if (profile) {
          setCountryCode(profile.countryCode);
          setStateState(profile.stateState);
          setJurisdiction(formatJurisdiction(profile.countryCode, profile.stateState));
          setTrialStatus(formatTrialStatus(profile.trialExpDate));
          setReferralCode(profile.promo);
        }
        setReferralCount(count);
      })
      .catch(() => {
        // Leave the fields blank if this fails -- Profile still renders
        // fine with just the Auth-derived name/email.
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const handleEditOpen = () => {
    setEditName(displayName === "Account" ? "" : displayName);
    setEditCountryCode(countryCode || "ca");
    setEditState(stateState);
    setSaveError(null);
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!uid) return;
    setSaving(true);
    setSaveError(null);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: editName.trim() });
      }
      await updateUserProfile(uid, {
        countryCode: editCountryCode,
        stateCountry: editCountryCode,
        stateState: editState.trim(),
      });
      setDisplayNameOverride(editName.trim() || null);
      setCountryCode(editCountryCode);
      setStateState(editState.trim());
      setJurisdiction(formatJurisdiction(editCountryCode, editState.trim()));
      toast.success("Profile updated.");
      setEditing(false);
    } catch (e) {
      setSaveError(errorMessage(e, "Couldn't save your changes."));
    } finally {
      setSaving(false);
    }
  };

  // Fetched separately from the profile/referral group above -- a
  // billing-history failure (or, very commonly right now, a real
  // "knownToRevenueCat: false" empty result) should never blank out
  // jurisdiction/referral data too. Quiet console.error only; the UI
  // just keeps showing the trial-based fallback below, since "no
  // RevenueCat data yet" is the expected common case, not an error
  // state worth alarming the user over.
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    fetchBillingHistory()
      .then((data) => {
        if (!cancelled) setBilling(data);
      })
      .catch((e) => {
        console.error("Couldn't load billing history:", e);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const activeSubscription = findActiveSubscription(billing);
  const purchases = billing?.purchases ?? [];

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Profile & Billing</h1>
        <p className="mt-1 text-sm text-black/55">Manage your account details and subscription.</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Profile */}
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-black">Profile</h2>
            {!editing && (
              <button
                type="button"
                onClick={handleEditOpen}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black"
              >
                <Pencil className="size-3.5" aria-hidden />
                Edit
              </button>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f97316]/15 text-sm font-semibold text-[#f97316]">
              {getInitials(user?.displayName ?? null, user?.email ?? null)}
            </span>
            <div>
              <p className="text-sm font-semibold text-black">{displayName}</p>
              <p className="text-xs text-black/50">{email}</p>
            </div>
          </div>

          {editing ? (
            <div className="mt-4 space-y-3 border-t border-black/[0.05] pt-4">
              <div className="space-y-1.5">
                <label htmlFor="edit-name" className="text-xs font-medium text-black/55">
                  Full name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/25"
                />
              </div>
              <div className="space-y-1.5">
                <p className="flex items-center gap-2 text-xs font-medium text-black/55">
                  <MapPin className="size-3.5" aria-hidden />
                  Tax jurisdiction
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-black/55">Country</label>
                  <Select value={editCountryCode} onValueChange={setEditCountryCode}>
                    <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                      <SelectItem value="us">🇺🇸 United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="edit-state" className="text-xs font-medium text-black/55">
                    State / Province
                  </label>
                  <input
                    id="edit-state"
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    placeholder="e.g. British Columbia"
                    className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none focus:border-black/25"
                  />
                </div>
              </div>
              {saveError && <p className="text-xs text-red-600">{saveError}</p>}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => void handleSaveProfile()}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <dl className="mt-4 space-y-2.5 border-t border-black/[0.05] pt-4">
              <div className="flex items-center justify-between text-sm">
                <dt className="flex items-center gap-2 text-black/55">
                  <User className="size-3.5" aria-hidden />
                  Full name
                </dt>
                <dd className="font-medium text-black">{displayName}</dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="flex items-center gap-2 text-black/55">
                  <Mail className="size-3.5" aria-hidden />
                  Email
                </dt>
                <dd className="font-medium text-black">{email}</dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="flex items-center gap-2 text-black/55">
                  <MapPin className="size-3.5" aria-hidden />
                  Tax jurisdiction
                </dt>
                <dd className="inline-flex items-center gap-1.5 font-medium text-black">
                  {jurisdiction ? (
                    <>
                      <span aria-hidden>{jurisdiction.flag}</span> {jurisdiction.text}
                    </>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="flex items-center gap-2 text-black/55">
                  <Gift className="size-3.5" aria-hidden />
                  Your referral code
                </dt>
                <dd className="font-medium text-black">{referralCode || "—"}</dd>
              </div>
              <div className="flex items-center justify-between text-sm">
                <dt className="flex items-center gap-2 text-black/55">
                  <Users className="size-3.5" aria-hidden />
                  Friends referred
                </dt>
                <dd className="font-medium text-black">{referralCount ?? "—"}</dd>
              </div>
            </dl>
          )}
        </div>

        {/* Subscription */}
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-black">Subscription</h2>
            {trialStatus && (
              <span className="rounded-full bg-[#f97316]/10 px-2.5 py-1 text-xs font-medium text-[#c2410c]">
                {trialStatus}
              </span>
            )}
          </div>
          {activeSubscription ? (
            <div className="mt-4 rounded-xl bg-black/[0.03] px-4 py-3">
              <p className="text-sm font-semibold text-black">
                {activeSubscription.productId || "Active plan"}
              </p>
              <p className="mt-0.5 text-xs text-black/50">
                {activeSubscription.currentPeriodEndsAt
                  ? // RevenueCat's auto_renewal_status enum isn't confirmed
                    // against a real live response yet -- WILL_RENEW is the
                    // documented "will renew" value; anything else (or
                    // missing) reads as "Ends" rather than assuming renewal.
                    `${activeSubscription.autoRenewalStatus === "WILL_RENEW" ? "Renews" : "Ends"} ${formatDate(new Date(activeSubscription.currentPeriodEndsAt), dateFormat)}`
                  : activeSubscription.status || "Active"}
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-black/[0.03] px-4 py-3 text-sm text-black/60">
              {trialStatus
                ? `No active store subscription found — ${trialStatus.toLowerCase()}.`
                : "No subscription or trial data found."}
            </div>
          )}
          <p className="mt-4 text-sm text-black/55">
            Managed through the mobile app's store — billing, plan changes, and cancellation all
            happen there, not on the web. Pick whichever store you originally subscribed through.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {STORES.map((store) => (
              <a
                key={store.name}
                href={store.manageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-black/85"
              >
                Manage on {store.name}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Billing history */}
      <div className="mt-6 rounded-2xl border border-black/[0.07] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-black">Billing history</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-t border-black/[0.07] text-xs text-black/45">
                <th className="px-5 py-2 font-medium">Date</th>
                <th className="px-5 py-2 font-medium">Amount</th>
                <th className="px-5 py-2 font-medium">Product / Store</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p, i) => (
                <tr key={p.id ?? i} className="border-t border-black/[0.05]">
                  <td className="px-5 py-3 text-black/60">
                    {p.purchasedAt ? formatDate(new Date(p.purchasedAt), dateFormat) : "—"}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-black">
                    {p.amount !== null && p.currency ? formatCurrency(p.amount, p.currency) : "—"}
                  </td>
                  <td className="px-5 py-3 text-black/60">
                    {[p.productId, p.store].filter(Boolean).join(" · ") || "—"}
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-sm text-black/45">
                    No purchases yet.
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
