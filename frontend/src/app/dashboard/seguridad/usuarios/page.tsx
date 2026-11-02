"use client";

import React, { useState } from "react";
import {
  Users,
  Shield,
  RefreshCw,
  Key,
  X,
  Calendar,
  Lock,
  Layers,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { SearchInput } from "@/components/common/SearchInput";
import { StateBadge } from "@/components/common/StateBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUsuarios, useUsuarioRoles } from "@/modules/seguridad/hooks/useUsuarios";
import { Usuario } from "@/modules/seguridad/types/usuario.types";

export default function UsuariosPage() {
  const [start, setStart] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const limit = 15;

  const { data, isLoading, error, refetch, isFetching } = useUsuarios({
    start,
    limit,
    filtro: searchQuery,
    sort: "desc_person",
    dir: "ASC",
  });

  const { data: userRoles = [], isLoading: loadingRoles } = useUsuarioRoles(
    selectedUser?.id_usuario
  );

  const usuarios = data?.datos || [];
  const total = data?.total || 0;

  const handleSearch = (query: string) => {
    setStart(0);
    setSearchQuery(query);
  };

  const columns: Column<Usuario>[] = [
    {
      header: "Usuario / Cuenta",
      accessorKey: "cuenta",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {item.cuenta ? item.cuenta.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="font-mono font-semibold text-sm text-foreground flex items-center gap-2">
              <span>{item.cuenta}</span>
              <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {item.autentificacion || "local"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              ID: {item.id_usuario}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Persona Asociada",
      accessorKey: "desc_person",
      render: (item) => (
        <div>
          <div className="font-medium text-foreground text-sm">
            {item.desc_person || "Sin persona asignada"}
          </div>
          {item.descripcion && (
            <div className="text-xs text-muted-foreground truncate max-w-[220px]">
              {item.descripcion}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Fecha Registro",
      accessorKey: "fecha_reg",
      align: "center",
      render: (item) => (
        <span className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          {item.fecha_reg || "N/D"}
        </span>
      ),
    },
    {
      header: "Estado",
      accessorKey: "estado_reg",
      align: "center",
      render: (item) => <StateBadge state={item.estado_reg} />,
    },
    {
      header: "Acciones",
      align: "right",
      render: (item) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSelectedUser(item)}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
          title="Ver detalles y roles"
        >
          <Eye className="w-3.5 h-3.5 mr-1 text-primary" />
          <span>Detalles</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <PageHeader
        title="Gestión de Usuarios"
        description="Módulo de Seguridad PXP — Administración de cuentas, credenciales y accesos al ERP"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        }
      />

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <SearchInput
          placeholder="Buscar por cuenta o nombre de persona..."
          onSearch={handleSearch}
          className="w-full sm:w-96"
        />

        <div className="flex items-center gap-2 text-xs text-muted-foreground self-end sm:self-auto">
          <Users className="w-4 h-4 text-primary" />
          <span>Total usuarios:</span>
          <span className="font-semibold text-foreground">{total}</span>
        </div>
      </div>

      {/* Tabla Principal de Usuarios */}
      <DataTable
        columns={columns}
        data={usuarios}
        loading={isLoading}
        error={error instanceof Error ? error.message : null}
        total={total}
        start={start}
        limit={limit}
        onPageChange={(newStart) => setStart(newStart)}
        onRowClick={(row) => setSelectedUser(row)}
        emptyMessage="No se encontraron usuarios registrados en PXP."
      />

      {/* Modal / Panel de Detalles de Usuario y Roles */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Cabecera del modal */}
            <div className="p-6 border-b border-border flex items-start justify-between bg-muted/30">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                  {selectedUser.cuenta ? selectedUser.cuenta.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {selectedUser.cuenta}
                    </h3>
                    <StateBadge state={selectedUser.estado_reg} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedUser.desc_person || "Persona no vinculada"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del modal con scroll */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Información general */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-primary" />
                  Información de la Cuenta
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">ID Usuario:</span>
                    <span className="font-semibold text-foreground">{selectedUser.id_usuario}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">Tipo de Autenticación:</span>
                    <span className="font-semibold text-foreground uppercase">{selectedUser.autentificacion || "local"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">Fecha Registro:</span>
                    <span className="font-semibold text-foreground">{selectedUser.fecha_reg || "N/D"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                    <span className="text-muted-foreground block text-[11px]">Fecha Caducidad:</span>
                    <span className="font-semibold text-foreground">{selectedUser.fecha_caducidad || "Sin fecha límite"}</span>
                  </div>
                </div>
              </div>

              {/* Roles asignados */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    Roles Asignados en PXP
                  </h4>
                  <Badge variant="outline" className="text-[10px]">
                    {userRoles.length} roles
                  </Badge>
                </div>

                {loadingRoles ? (
                  <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                    <span>Cargando roles del usuario...</span>
                  </div>
                ) : userRoles.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 border border-border/50 rounded-xl">
                    <Lock className="w-6 h-6 mx-auto mb-2 text-muted-foreground/50" />
                    <p>Este usuario no tiene roles activos asignados actualmente.</p>
                  </div>
                ) : (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Rol</th>
                          <th className="py-2.5 px-3">Subsistema</th>
                          <th className="py-2.5 px-3 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {userRoles.map((r) => (
                          <tr key={String(r.id_usuario_rol)} className="hover:bg-accent/40">
                            <td className="py-2.5 px-3 font-medium text-foreground flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{r.rol}</span>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Layers className="w-3 h-3 text-muted-foreground" />
                                {r.nombre || "General"}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <StateBadge state={r.estado_reg} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Footer del modal */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
                className="text-xs"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
