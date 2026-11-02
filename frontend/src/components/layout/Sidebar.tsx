"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Layers,
  X,
  Database,
  Shield,
} from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { PxpUser } from "@/types/auth.types";

interface NavGroup {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: "General",
    items: [
      { label: "Resumen", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Recursos Humanos",
    items: [
      { label: "Funcionarios", href: "/dashboard/funcionarios", icon: Users },
      { label: "Asistencia", href: "/dashboard/asistencia", icon: CalendarClock, badge: "Pronto" },
    ],
  },
];

interface SidebarProps {
  user: PxpUser;
}

export function Sidebar({ user }: Readonly<SidebarProps>) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Backdrop para dispositivos móviles */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar barra lateral"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden border-0 cursor-default"
        />
      )}

      {/* Contenedor del Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Encabezado / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-sidebar-foreground block">KERP</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide block -mt-1">
                PXP FRAMEWORK
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-sidebar-foreground p-1 rounded-lg hover:bg-sidebar-accent"
            aria-label="Cerrar navegación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de navegación */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? "text-sidebar-primary-foreground" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer del Sidebar con info de PXP */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30 text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span className="truncate">BD: {user.nombre_basedatos || "dbkerp"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Auth: {user.autentificacion || "local"}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

