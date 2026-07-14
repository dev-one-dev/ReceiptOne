import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { HelpdeskSidebar } from "@/components/helpdesk/HelpdeskSidebar";
import { HelpdeskLoginForm } from "@/components/helpdesk/HelpdeskLoginForm";
import { HelpdeskAuthProvider, useHelpdeskAuth } from "@/components/helpdesk/HelpdeskAuthContext";

export const Route = createFileRoute("/helpdesk")({
  component: HelpdeskRoute,
});

function HelpdeskRoute() {
  return (
    <HelpdeskAuthProvider>
      <HelpdeskGate />
    </HelpdeskAuthProvider>
  );
}

/**
 * This gate is UX only -- it decides what to render, nothing more. The
 * real access-control boundary is requireHelpdeskAdmin running
 * server-side inside every helpdesk.server.ts function, regardless of
 * what this component shows.
 */
function HelpdeskGate() {
  const { session, adminStatus, adminError, signOut, refetchOverview } = useHelpdeskAuth();

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
        <p className="text-sm text-black/50">Loading…</p>
      </div>
    );
  }

  if (session === null) {
    return <HelpdeskLoginForm />;
  }

  if (adminStatus === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
        <p className="text-sm text-black/50">Checking access…</p>
      </div>
    );
  }

  if (adminStatus === "forbidden" || adminStatus === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-black/[0.07] bg-white p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h1 className="text-lg font-semibold tracking-tight text-black">
            {adminStatus === "forbidden" ? "Not an approved admin" : "Something went wrong"}
          </h1>
          <p className="mt-2 text-sm text-black/55">
            {adminStatus === "forbidden"
              ? "You're signed in, but this Supabase account isn't on the helpdesk admin allowlist."
              : (adminError ?? "Couldn't verify helpdesk access.")}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            {adminStatus === "error" && (
              <button
                type="button"
                onClick={() => void refetchOverview()}
                className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
              >
                Retry
              </button>
            )}
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <HelpdeskSidebar />
      <SidebarInset className="bg-[#f5f4f0]">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-black/[0.07] bg-[#f5f4f0] px-4">
          <SidebarTrigger className="text-black/60 hover:bg-black/5 hover:text-black" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-black/[0.1]" />
          <span className="text-sm font-medium text-black/55">Helpdesk</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-3 py-1.5 text-xs font-medium text-black/60">
            Internal tool
          </span>
        </header>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
