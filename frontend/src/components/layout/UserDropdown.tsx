"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Shield, Database, ChevronDown, UserCheck } from "lucide-react";
import { PxpUser } from "@/types/auth.types";
import { useAuthStore } from "@/stores/useAuthStore";

interface UserDropdownProps {
  user: PxpUser;
}

export function UserDropdown({ user }: Readonly<UserDropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((state) => state.logout);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.nombre_usuario
    ? user.nombre_usuario
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-accent transition-colors border border-transparent hover:border-border"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center shadow-sm">
          {initials}
        </div>
        <div className="text-left hidden md:block">
          <p className="text-xs font-semibold text-foreground leading-tight">
            {user.nombre_usuario}
          </p>
          <p className="text-[11px] text-muted-foreground">@{user.cuenta || "pxp_user"}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-popover border border-border shadow-2xl p-2 z-50 text-popover-foreground text-xs">
          {/* Header con info */}
          <div className="px-3 py-2.5 border-b border-border space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground truncate">{user.nombre_usuario}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">
                PXP
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">ID: {user.id_usuario}</p>
          </div>

          {/* Info del sistema */}
          <div className="py-2 px-3 border-b border-border space-y-1.5 text-muted-foreground">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-primary" /> Base de Datos
              </span>
              <span className="text-foreground font-mono">{user.nombre_basedatos || "dbkerp"}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" /> Autenticación
              </span>
              <span className="text-foreground capitalize">{user.autentificacion || "local"}</span>
            </div>
            {user.id_funcionario && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-primary" /> Funcionario
                </span>
                <span className="text-foreground font-mono">#{user.id_funcionario}</span>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="pt-1">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-left font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

