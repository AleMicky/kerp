"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  dashboard: "Inicio",
  funcionarios: "Funcionarios",
  organigrama: "Organigrama",
  asistencia: "Asistencia",
  marcaciones: "Marcaciones",
  reportes: "Reportes",
  seguridad: "Seguridad",
  usuarios: "Usuarios",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1 && segments[0] === "dashboard") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Home className="w-3.5 h-3.5 text-muted-foreground" />
        <span>/</span>
        <span className="text-foreground font-medium">Panel Principal</span>
      </div>
    );
  }

  // Precalculamos las migas de pan de forma pura, sin mutar variables durante el render
  const items = segments
    .map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === segments.length - 1;
      return { segment, path, label, isLast, index };
    })
    .filter((item) => !(item.index === 0 && item.segment === "dashboard"));

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Inicio</span>
      </Link>

      {items.map((item) => (
        <div key={item.path} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
          {item.isLast ? (
            <span className="text-foreground font-semibold">{item.label}</span>
          ) : (
            <Link
              href={item.path}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
