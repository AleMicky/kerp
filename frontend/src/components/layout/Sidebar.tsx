"use client";

import React, { useState, useMemo } from "react";
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
  Briefcase,
  Settings,
  FileText,
  GitBranch,
  Folder,
  ChevronDown,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { PxpUser } from "@/types/auth.types";
import { useMenu } from "@/modules/seguridad/hooks/useMenu";
import { PxpMenuItem } from "@/modules/seguridad/types/menu.types";
import { getRouteForMenuItem } from "@/modules/seguridad/services/menu.service";

interface SidebarProps {
  user: PxpUser;
}

function MenuIcon({
  item,
  className,
}: Readonly<{
  item: PxpMenuItem;
  className?: string;
}>) {
  const text = `${item.component || ""} ${item.text}`.toLowerCase();
  if (text.includes("resumen") || text.includes("dashboard")) {
    return <LayoutDashboard className={className} />;
  }
  if (text.includes("funcionario") || text.includes("persona") || text.includes("usuario")) {
    return <Users className={className} />;
  }
  if (text.includes("asistencia") || text.includes("marcac") || text.includes("horario")) {
    return <CalendarClock className={className} />;
  }
  if (text.includes("seguridad") || text.includes("rol") || text.includes("permiso")) {
    return <Shield className={className} />;
  }
  if (text.includes("organigrama") || text.includes("cargo")) {
    return <Briefcase className={className} />;
  }
  if (text.includes("parametro") || text.includes("config")) {
    return <Settings className={className} />;
  }
  if (text.includes("reporte") || text.includes("informe")) {
    return <FileText className={className} />;
  }
  if (text.includes("workflow") || text.includes("flujo")) {
    return <GitBranch className={className} />;
  }
  if (item.type === "carpeta" || (item.childrens && item.childrens.length > 0)) {
    return <Folder className={className} />;
  }
  return <FileText className={className} />;
}

interface MenuItemViewProps {
  item: PxpMenuItem;
  pathname: string;
  onNavigate: () => void;
  depth?: number;
}

function MenuItemView({
  item,
  pathname,
  onNavigate,
  depth = 0,
}: Readonly<MenuItemViewProps>) {
  const hasChildren = Boolean(item.childrens && item.childrens.length > 0);
  const isFolder = item.type === "carpeta" || hasChildren;
  const href = getRouteForMenuItem(item);
  const isActive = !isFolder && (pathname === href || (href !== "/dashboard" && pathname.startsWith(href)));

  // Expandir carpeta por defecto si alguno de sus hijos está activo
  const hasActiveChild = useMemo(() => {
    if (!hasChildren || !item.childrens) return false;
    return item.childrens.some((child) => {
      const childHref = getRouteForMenuItem(child);
      return pathname === childHref || (childHref !== "/dashboard" && pathname.startsWith(childHref));
    });
  }, [hasChildren, item.childrens, pathname]);

  const [isOpen, setIsOpen] = useState(hasActiveChild || depth === 0);

  if (isFolder) {
    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors ${
            depth > 0 ? "pl-5" : ""
          }`}
        >
          <div className="flex items-center gap-2.5">
            <MenuIcon item={item} className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="truncate">{item.text}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {isOpen && item.childrens && (
          <div className="pl-2 space-y-1 border-l border-sidebar-border/60 ml-3 my-1">
            {item.childrens.map((child) => (
              <MenuItemView
                key={String(child.id_gui || child.text)}
                item={child}
                pathname={pathname}
                onNavigate={onNavigate}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
        depth > 0 ? "text-xs py-1.5" : ""
      } ${
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <MenuIcon
          item={item}
          className={`w-4 h-4 shrink-0 ${
            isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"
          }`}
        />
        <span className="truncate">{item.text}</span>
      </div>
      {item.badge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shrink-0">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ user }: Readonly<SidebarProps>) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { data: menu = [], isLoading } = useMenu();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = () => {
    setSidebarOpen(false);
  };

  // Filtrado de ítems por búsqueda
  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return menu;
    const query = searchQuery.toLowerCase();

    function filterItem(item: PxpMenuItem): PxpMenuItem | null {
      const matchSelf =
        item.text.toLowerCase().includes(query) ||
        (item.component && item.component.toLowerCase().includes(query));

      if (item.childrens && item.childrens.length > 0) {
        const filteredChildren = item.childrens
          .map(filterItem)
          .filter((c): c is PxpMenuItem => c !== null);

        if (filteredChildren.length > 0) {
          return { ...item, childrens: filteredChildren };
        }
      }

      return matchSelf ? item : null;
    }

    return menu.map(filterItem).filter((item): item is PxpMenuItem => item !== null);
  }, [menu, searchQuery]);

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
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border shrink-0">
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

        {/* Buscador rápido de menú */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en menú..."
              className="w-full bg-sidebar-accent/40 border border-sidebar-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-primary"
            />
          </div>
        </div>

        {/* Lista de navegación dinámica */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-xs">Cargando menú PXP...</span>
            </div>
          ) : filteredMenu.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No se encontraron opciones
            </div>
          ) : (
            filteredMenu.map((item) => (
              <MenuItemView
                key={String(item.id_gui || item.text)}
                item={item}
                pathname={pathname}
                onNavigate={handleNavigate}
              />
            ))
          )}
        </nav>

        {/* Footer del Sidebar con info de PXP */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30 text-xs text-muted-foreground space-y-2 shrink-0">
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
