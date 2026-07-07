import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, Mail, Pencil, User } from "lucide-react";
import { toast } from "sonner";
import { getInitials, useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";
import { fetchUserProfile } from "@/integrations/firebase/user-profile";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

type Invoice = {
  date: string;
  amount: string;
  status: "Paid";
};

const INVOICES: Invoice[] = [
  { date: "Jun 1, 2026", amount: "$19.00", status: "Paid" },
  { date: "May 1, 2026", amount: "$19.00", status: "Paid" },
  { date: "Apr 1, 2026", amount: "$19.00", status: "Paid" },
];

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

function notWiredUp() {
  toast.info("This isn't wired up yet — static mockup only.");
}

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
  const { user } = useAuth();
  const displayName = user?.displayName || "Account";
  const email = user?.email || "";
  const uid = user?.uid ?? auth.currentUser?.uid ?? null;

  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const [trialStatus, setTrialStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    fetchUserProfile(uid)
      .then((profile) => {
        if (cancelled || !profile) return;
        setJurisdiction(formatJurisdiction(profile.countryCode, profile.stateState));
        setTrialStatus(formatTrialStatus(profile.trialExpDate));
      })
      .catch(() => {
        // Leave the fields blank if this fails -- Profile still renders
        // fine with just the Auth-derived name/email.
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

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
            <button
              type="button"
              onClick={notWiredUp}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black"
            >
              <Pencil className="size-3.5" aria-hidden />
              Edit
            </button>
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
              <dt className="text-black/55">Tax jurisdiction</dt>
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
          </dl>
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
          <div className="mt-4 flex items-center justify-between rounded-xl bg-black/[0.03] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-black">Pro — Monthly</p>
              <p className="text-xs text-black/50">Renews Aug 1, 2026</p>
            </div>
            <p className="text-lg font-semibold text-black">
              $19<span className="text-xs font-normal text-black/45">/mo</span>
            </p>
          </div>
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

      {/* Invoices */}
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
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 text-right font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.date} className="border-t border-black/[0.05]">
                  <td className="px-5 py-3 text-black/60">{inv.date}</td>
                  <td className="px-5 py-3 tabular-nums text-black">{inv.amount}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-xs font-medium text-black/60">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={notWiredUp}
                      className="inline-flex items-center gap-1 rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
                      aria-label={`Download invoice for ${inv.date}`}
                    >
                      <Download className="size-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
