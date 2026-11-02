"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  className?: string;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  total?: number;
  start?: number;
  limit?: number;
  onPageChange?: (newStart: number) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  error = null,
  total = 0,
  start = 0,
  limit = 15,
  onPageChange,
  onRowClick,
  emptyMessage = "No se encontraron registros",
}: DataTableProps<T>) {
  const currentPage = Math.floor(start / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasPagination = onPageChange && total > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {error && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 bg-slate-950/60 hover:bg-slate-950/60">
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={`text-slate-400 font-semibold text-xs tracking-wider uppercase py-3.5 ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-slate-800/40 hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-16 text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                    <span className="text-sm font-medium">Cargando datos desde PXP...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className="border-slate-800/40 hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-16 text-slate-500 text-sm"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={`border-slate-800/50 transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-slate-800/70" : "hover:bg-slate-800/40"
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <TableCell
                      key={colIdx}
                      className={`text-slate-300 py-3.5 text-sm ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left"
                      } ${col.className || ""}`}
                    >
                      {col.render ? col.render(row, rowIdx) : (row[col.accessorKey as string] ?? "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Mostrando{" "}
            <span className="font-semibold text-slate-200">
              {Math.min(start + 1, total)}
            </span>{" "}
            a{" "}
            <span className="font-semibold text-slate-200">
              {Math.min(start + data.length, total)}
            </span>{" "}
            de <span className="font-semibold text-slate-200">{total}</span> registros
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={start === 0 || loading}
              onClick={() => onPageChange(Math.max(0, start - limit))}
              className="h-8 px-3 text-xs border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Anterior
            </Button>

            <span className="px-2 text-slate-400">
              Página <span className="text-slate-200 font-medium">{currentPage}</span> de{" "}
              <span className="text-slate-200 font-medium">{totalPages}</span>
            </span>

            <Button
              size="sm"
              variant="outline"
              disabled={start + limit >= total || loading}
              onClick={() => onPageChange(start + limit)}
              className="h-8 px-3 text-xs border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
            >
              Siguiente <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

