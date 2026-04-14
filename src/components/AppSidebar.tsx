import {
  Anchor, Users, Search, ClipboardCheck, BarChart3,
  Navigation, Ship, DollarSign, UserPlus,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useRole, type Role } from "@/contexts/RoleContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuByRole: Record<Role, { title: string; url: string; icon: React.ElementType }[]> = {
  Secretaria: [
    { title: "Nueva Inscripción", url: "/dashboard/socios", icon: UserPlus },
    { title: "Buscar Socios", url: "/dashboard/socios/buscar", icon: Search },
  ],
  Jefe: [
    { title: "Aprobaciones y Retiros", url: "/dashboard/aprobaciones", icon: ClipboardCheck },
    { title: "Métricas", url: "/dashboard", icon: BarChart3 },
  ],
  Naviero: [
    { title: "Gestión de Flota", url: "/dashboard/embarcaciones", icon: Ship },
    { title: "Control de Zarpes", url: "/dashboard/zarpes", icon: Navigation },
  ],
  Finanzas: [
    { title: "Panel Financiero", url: "/dashboard/facturacion", icon: DollarSign },
  ],
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { currentRole } = useRole();

  const items = menuByRole[currentRole];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-nautical">
            <Anchor className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">Club Náutico</span>
              <span className="text-xs text-sidebar-foreground/60">Poseidón del Perú</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/40 text-center">
            © 2024 Club Poseidón
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
