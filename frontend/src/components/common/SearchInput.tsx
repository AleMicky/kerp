"use client";

import React, { useEffect, useState } from "react";
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
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-9 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

