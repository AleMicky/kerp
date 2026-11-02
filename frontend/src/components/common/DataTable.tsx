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
  id?: string;
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
  getRowId?: (row: T) => string | number;
}

function getColumnKey<T>(col: Column<T>, index: number): string {
  if (col.id) return col.id;
  if (col.accessorKey) return String(col.accessorKey);
  if (col.header) return col.header;
  return `column-${index}`;
}

function getRowKey<T>(row: T, index: number, getRowId?: (row: T) => string | number): string | number {
  if (getRowId) {
    return getRowId(row);
  }
  if (row && typeof row === "object") {
    const record = row as Record<string, unknown>;
    for (const key of ["id", "id_funcionario", "uuid", "key"]) {
      const val = record[key];
      if (typeof val === "string" || typeof val === "number") {
        return val;
      }
    }
  }
  return `row-${index}`;
}

function getAlignmentClass(align?: "left" | "center" | "right"): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export function DataTable<T>({
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
  getRowId,
}: Readonly<DataTableProps<T>>) {
  const currentPage = Math.floor(start / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasPagination = onPageChange && total > 0;

  const renderCellContent = (col: Column<T>, row: T, rowIdx: number) => {
    if (col.render) {
      return col.render(row, rowIdx);
    }
    if (col.accessorKey) {
      return (row[col.accessorKey] as React.ReactNode) ?? "-";
    }
    return "-";
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableCell
            colSpan={columns.length}
            className="text-center py-16 text-muted-foreground"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-medium">Cargando datos desde PXP...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (data.length === 0) {
      return (
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableCell
            colSpan={columns.length}
            className="text-center py-16 text-muted-foreground text-sm"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }

    return data.map((row, rowIdx) => (
      <TableRow
        key={getRowKey(row, rowIdx, getRowId)}
        onClick={() => onRowClick?.(row)}
        className={`border-border/50 transition-colors ${
          onRowClick ? "cursor-pointer hover:bg-accent/60" : "hover:bg-accent/30"
        }`}
      >
        {columns.map((col, colIdx) => (
          <TableCell
            key={getColumnKey(col, colIdx)}
            className={`text-foreground py-3.5 text-sm ${getAlignmentClass(col.align)} ${col.className || ""}`}
          >
            {renderCellContent(col, row, rowIdx)}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {error && (
        <div className="p-4 bg-destructive/10 border-b border-destructive/20 text-destructive flex items-center gap-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/40 hover:bg-muted/40">
              {columns.map((col, idx) => (
                <TableHead
                  key={getColumnKey(col, idx)}
                  className={`text-muted-foreground font-semibold text-xs tracking-wider uppercase py-3.5 ${getAlignmentClass(
                    col.align
                  )} ${col.className || ""}`}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTableBody()}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Mostrando{" "}
            <span className="font-semibold text-foreground">
              {Math.min(start + 1, total)}
            </span>{" "}
            a{" "}
            <span className="font-semibold text-foreground">
              {Math.min(start + data.length, total)}
            </span>{" "}
            de <span className="font-semibold text-foreground">{total}</span> registros
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={start === 0 || loading}
              onClick={() => onPageChange(Math.max(0, start - limit))}
              className="h-8 px-3 text-xs disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Anterior
            </Button>

            <span className="px-2 text-muted-foreground">
              Página <span className="text-foreground font-medium">{currentPage}</span> de{" "}
              <span className="text-foreground font-medium">{totalPages}</span>
            </span>

            <Button
              size="sm"
              variant="outline"
              disabled={start + limit >= total || loading}
              onClick={() => onPageChange(start + limit)}
              className="h-8 px-3 text-xs disabled:opacity-40"
            >
              Siguiente <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

