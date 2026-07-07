import { createContext, useContext } from "react";

export type DashboardRegion = "ca" | "us";
export type Language = "en" | "fr";
export type DistanceUnit = "km" | "mi";
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export type TaxRateSetting = {
  name: string;
  percent: number;
};

export type DashboardContextValue = {
  year: string;
  region: DashboardRegion;
  language: Language;
  setLanguage: (language: Language) => void;
  distanceUnit: DistanceUnit;
  setDistanceUnit: (unit: DistanceUnit) => void;
  taxRate: TaxRateSetting;
  setTaxRate: (taxRate: TaxRateSetting) => void;
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
