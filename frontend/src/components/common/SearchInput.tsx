"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  debounceMs?: number;
  onSearch: (value: string) => void;
  className?: string;
}

export function SearchInput({
  value: initialValue = "",
  placeholder = "Buscar registros...",
  debounceMs = 400,
  onSearch,
  className = "w-full sm:w-80",
}: Readonly<SearchInputProps>) {
  const [query, setQuery] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setQuery(initialValue);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-9 bg-input/40 border-border text-foreground placeholder:text-muted-foreground rounded-xl focus-visible:ring-ring focus-visible:border-ring"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

