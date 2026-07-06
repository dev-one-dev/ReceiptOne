import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f5f4f0]">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-black/[0.07] bg-[#f5f4f0] px-4">
          <SidebarTrigger className="text-black/60 hover:bg-black/5 hover:text-black" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-black/[0.1]" />
          <span className="text-sm font-medium text-black/55">ReceiptOne</span>
        </header>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
