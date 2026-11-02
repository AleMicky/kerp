"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getStoredUser, logout, useStoredUser } from "@/lib/pxp-client";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Database,
  Shield,
  Layers,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useStoredUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !getStoredUser()) {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        Cargando sesión PXP...
      </div>
    );
  }

  const navItems = [
    { label: "Resumen", href: "/dashboard", icon: LayoutDashboard },
    { label: "Funcionarios", href: "/dashboard/funcionarios", icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar navegación lateral"
          className="fixed inset-0 z-40 w-full h-full bg-black/60 backdrop-blur-sm lg:hidden border-0 p-0 cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">KERP / PXP</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Sistemas
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* System info badge */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>BD: {user.nombre_basedatos || "dbkerp"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Auth: {user.autentificacion || "local"}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-slate-200 text-base sm:text-lg">
              Panel Administrativo
            </h2>
          </div>

          {/* User & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200">{user.nombre_usuario}</p>
              <p className="text-xs text-slate-400">@{user.cuenta || "usuario"}</p>
            </div>
            <button
              onClick={() => logout()}
              title="Cerrar sesión"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium border border-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

