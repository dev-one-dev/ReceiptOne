import { createContext, useContext } from "react";

export type DashboardRegion = "ca" | "us";

export type DashboardContextValue = {
  year: string;
  region: DashboardRegion;
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
