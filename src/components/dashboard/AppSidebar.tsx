import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import {
  Car,
  CreditCard,
  FileBarChart2,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Milestone,
  Receipt,
  Settings,
  type LucideIcon,
} from "lucide-react";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getInitials, useAuth } from "@/integrations/firebase/auth-context";
import { auth } from "@/integrations/firebase/client";

type NavItem = { label: string; href: string; icon: LucideIcon };

const MAIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Receipts", href: "/dashboard/receipts", icon: Receipt },
  { label: "Reports", href: "/dashboard/reports", icon: FileBarChart2 },
  { label: "Mileage", href: "/dashboard/mileage", icon: Car },
  { label: "File Manager", href: "/dashboard/file-manager", icon: FolderOpen },
  { label: "Roadmap & Changelog", href: "/dashboard/roadmap", icon: Milestone },
];

const ACCOUNT_NAV: NavItem[] = [
  { label: "Profile & Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function NavGroup({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
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
  );
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate({ to: "/login" });
    } catch {
      toast.error("Couldn't log out. Please try again.");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to={"/dashboard" as any} className="flex items-center gap-2.5 px-1">
          <img src={logoMark} alt="" aria-hidden className="size-7 shrink-0" />
          <img
            src={logoWordmark}
            alt="ReceiptOne"
            className="h-4 shrink-0 brightness-0 invert group-data-[collapsible=icon]:hidden"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup items={MAIN_NAV} pathname={location.pathname} />
        <SidebarSeparator />
        <NavGroup items={ACCOUNT_NAV} pathname={location.pathname} />
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        <div className="flex items-center gap-1">
          <Link
            to={"/dashboard/billing" as any}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.06] group-data-[collapsible=icon]:justify-center"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f97316]/20 text-xs font-semibold text-[#f97316]">
              {getInitials(user?.displayName ?? null, user?.email ?? null)}
            </span>
            <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-medium text-white">
                {user?.displayName || "Account"}
              </span>
              <span className="truncate text-xs text-white/50">{user?.email}</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
