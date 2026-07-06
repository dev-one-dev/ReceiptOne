import { Link, useLocation } from "@tanstack/react-router";
import {
  Car,
  CreditCard,
  FileBarChart2,
  FolderOpen,
  LayoutDashboard,
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to={"/dashboard" as any} className="flex items-center gap-2.5 px-1">
          <img src={logoMark} alt="" aria-hidden className="size-7 shrink-0 brightness-0 invert" />
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
        <Link
          to={"/dashboard/billing" as any}
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.06] group-data-[collapsible=icon]:justify-center"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f97316]/20 text-xs font-semibold text-[#f97316]">
            JD
          </span>
          <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium text-white">Jane Doe</span>
            <span className="truncate text-xs text-white/50">jane@example.com</span>
          </span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
