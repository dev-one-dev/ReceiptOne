import { createContext, useContext } from "react";

export type DashboardRegion = "ca" | "us";
export type Language = "en" | "fr";
export type DistanceUnit = "km" | "mi";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

/**
 * Single source of truth for "what currency does a brand-new record get
 * when there's nothing to copy from yet" -- region-derived, never a bare
 * hardcoded literal. Every "no existing record" currency fallback in the
 * dashboard (Home Office, Mileage, Vehicle Expenses, Reports, the
 * category donut) must go through this, not guess "USD" or "CAD"
 * directly and not copy "whatever the first unrelated record happens to
 * have." A CA-region user's first-ever record of any kind must be CAD.
 */
export function currencyForRegion(region: DashboardRegion): string {
  return region === "ca" ? "CAD" : "USD";
}

/** A single tax (e.g. GST or PST) -- real users can have more than one active at once (e.g. GST + PST in BC), so this is a list, not a single rate. */
export type TaxListEntry = {
  taxName: string;
  taxPercent: number;
  isRefundable: boolean;
};

export type DashboardContextValue = {
  year: string;
  region: DashboardRegion;
  /** currencyForRegion(region) -- surfaced directly so pages don't each re-derive it (or worse, guess). */
  currency: string;
  language: Language;
  setLanguage: (language: Language) => void;
  distanceUnit: DistanceUnit;
  setDistanceUnit: (unit: DistanceUnit) => void;
  taxList: TaxListEntry[];
  setTaxList: (taxList: TaxListEntry[]) => void;
  mileageRate: number;
  setMileageRate: (rate: number) => void;
  dateFormat: DateFormat;
  setDateFormat: (format: DateFormat) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  value,
  children,
}: {
  value: DashboardContextValue;
  children: React.ReactNode;
}) {
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboardContext must be used within DashboardProvider");
  return ctx;
}
