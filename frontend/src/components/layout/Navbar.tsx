"use client";

import { Menu } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useUIStore } from "@/stores/useUIStore";
import { PxpUser } from "@/types/auth.types";

interface NavbarProps {
  user: PxpUser;
}

export function Navbar({ user }: Readonly<NavbarProps>) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Lado izquierdo: Botón hamburguesa móvil + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Abrir menú"
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs />
      </div>

      {/* Lado derecho: Estado de sesión, ThemeToggle & UserDropdown */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PXP Conectado</span>
        </div>

        <ThemeToggle />

        <UserDropdown user={user} />
      </div>
    </header>
  );
}

