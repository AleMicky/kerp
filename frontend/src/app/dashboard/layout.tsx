"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, useStoredUser } from "@/lib/pxp-client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const storedUser = useStoredUser();
  const { user, setUser } = useAuthStore();

  const currentUser = user || storedUser;

  useEffect(() => {
    const rawUser = getStoredUser();
    if (!rawUser) {
      router.push("/login");
    } else if (!user) {
      setUser(rawUser);
    }
  }, [router, user, setUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span>Verificando sesión PXP...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Barra de Navegación Lateral */}
      <Sidebar user={currentUser} />

      {/* Área Principal de Contenido */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Barra Superior */}
        <Navbar user={currentUser} />

        {/* Contenido de la Página */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
