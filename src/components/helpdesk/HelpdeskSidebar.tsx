import { Link, useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { LayoutDashboard, Lightbulb, LifeBuoy, LogOut, type LucideIcon } from "lucide-react";
import logoMark from "@/assets/figma/logo-mark.svg";
import logoWordmark from "@/assets/figma/logo-wordmark.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useHelpdeskAuth } from "@/components/helpdesk/HelpdeskAuthContext";
import { errorMessage } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { label: "Overview", href: "/helpdesk", icon: LayoutDashboard },
  { label: "Ideas", href: "/helpdesk/ideas", icon: Lightbulb },
  { label: "Support", href: "/helpdesk/support", icon: LifeBuoy },
];

export function HelpdeskSidebar() {
  const location = useLocation();
  const { session, signOut } = useHelpdeskAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      toast.error(errorMessage(e, "Couldn't sign out. Please try again."));
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/helpdesk" className="flex items-center gap-2.5 px-1">
          <img src={logoMark} alt="" aria-hidden className="size-7 shrink-0" />
          <span className="flex flex-col group-data-[collapsible=icon]:hidden">
            <img src={logoWordmark} alt="ReceiptOne" className="h-4 shrink-0 brightness-0 invert" />
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-white/40">
              Helpdesk
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ label, href, icon: Icon }) => {
                const isActive = location.pathname === href;
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                      className={
                        isActive
                          ? "bg-[#f97316]/15 font-medium text-white data-[active=true]:bg-[#f97316]/15 data-[active=true]:text-white [&>svg]:text-[#f97316]"
                          : undefined
                      }
                    >
                      <Link to={href as any}>
                        <Icon aria-hidden />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        <div className="flex items-center gap-1">
          <span className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 group-data-[collapsible=icon]:justify-center">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f97316]/20 text-xs font-semibold text-[#f97316]">
              {session?.user.email?.[0]?.toUpperCase() ?? "A"}
            </span>
            <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-medium text-white">Admin</span>
              <span className="truncate text-xs text-white/50">{session?.user.email}</span>
            </span>
          </span>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            aria-label="Sign out"
            title="Sign out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
