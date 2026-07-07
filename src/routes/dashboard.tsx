import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DashboardProvider,
  type DashboardRegion,
  type DateFormat,
  type DistanceUnit,
  type Language,
  type TaxRateSetting,
} from "@/components/dashboard/DashboardContext";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

// Mock account context -- reflects the user's real region/tax-year once
// auth and data are wired up. Region changes only happen deliberately in
// Profile & Billing, never from this header, so it's a static label here.
// "region" is the single source of truth threaded to every dashboard page
// via DashboardProvider below.
const ACCOUNT_REGION: { flag: string; label: string; region: DashboardRegion } = {
  flag: "🇨🇦",
  label: "Canada",
  region: "ca",
};
const TAX_YEARS = ["2026", "2025", "2024"];

function DashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // `auth.currentUser` updates synchronously the instant a sign-in call
  // resolves, but the `user` above comes from onAuthStateChanged, which
  // notifies listeners asynchronously -- right after login's redirect,
  // this component can mount before that notification lands. Checking
  // currentUser directly closes that gap instead of trusting context
  // alone to be caught up by the time we render.
  const isSignedIn = Boolean(user) || Boolean(auth.currentUser);

  const [year, setYear] = useState(TAX_YEARS[0]);
  const [language, setLanguage] = useState<Language>("en");
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("km");
  const [taxRate, setTaxRate] = useState<TaxRateSetting>({ name: "GST", percent: 5 });
  const [mileageRate, setMileageRate] = useState(0.73);
  const [dateFormat, setDateFormat] = useState<DateFormat>("MM/DD/YYYY");

  useEffect(() => {
    if (!loading && !isSignedIn) {
      navigate({ to: "/login" });
    }
  }, [loading, isSignedIn, navigate]);

  if (loading || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
        <p className="text-sm text-black/50">Loading…</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f5f4f0]">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-black/[0.07] bg-[#f5f4f0] px-4">
          <SidebarTrigger className="text-black/60 hover:bg-black/5 hover:text-black" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-black/[0.1]" />
          <span className="text-sm font-medium text-black/55">ReceiptOne</span>

          <div className="ml-auto flex items-center gap-2">
            {/* Static, non-interactive -- changing region is a deliberate
                Profile & Billing action, not a casual header toggle. */}
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-3 py-1.5 text-xs font-medium text-black/60"
              aria-label={`Tax jurisdiction: ${ACCOUNT_REGION.label}`}
            >
              <span aria-hidden>{ACCOUNT_REGION.flag}</span>
              {ACCOUNT_REGION.label}
            </span>

            <Select value={year} onValueChange={setYear}>
              <SelectTrigger
                aria-label="Tax year"
                className="h-8 w-[88px] rounded-full border-black/10 bg-white px-3 text-xs font-medium text-black shadow-none focus:ring-1 focus:ring-[#f97316]/40"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {TAX_YEARS.map((y) => (
                  <SelectItem key={y} value={y} className="text-xs">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <DashboardProvider
            value={{
              year,
              region: ACCOUNT_REGION.region,
              language,
              setLanguage,
              distanceUnit,
              setDistanceUnit,
              taxRate,
              setTaxRate,
              mileageRate,
              setMileageRate,
              dateFormat,
              setDateFormat,
            }}
          >
            <Outlet />
          </DashboardProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
