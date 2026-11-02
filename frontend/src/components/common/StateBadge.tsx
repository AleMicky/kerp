import React from "react";
import { Badge } from "@/components/ui/badge";

interface StateBadgeProps {
  state?: string | null;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StateBadge({
  state,
  activeLabel = "Activo",
  inactiveLabel = "Inactivo",
}: StateBadgeProps) {
  const normalized = (state || "").toLowerCase().trim();
  const isActive = normalized === "activo" || normalized === "active" || normalized === "1";

  if (isActive) {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5" />
        {activeLabel}
      </Badge>
    );
  }

  return (
    <Badge className="bg-slate-800 text-slate-400 border-slate-700 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block mr-1.5" />
      {inactiveLabel}
    </Badge>
  );
}

