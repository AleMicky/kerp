"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: Readonly<{ className?: string }>) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors ${className}`}
      aria-label="Cambiar tema claro / oscuro"
      title={isClient ? (isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro") : "Cambiar tema"}
    >
      {isClient ? (
        isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
      ) : (
        <span className="w-4 h-4 inline-block" />
      )}
    </button>
  );
}
