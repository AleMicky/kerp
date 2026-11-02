"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, RefreshCw, Mail, Phone, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { SearchInput } from "@/components/common/SearchInput";
import { StateBadge } from "@/components/common/StateBadge";
import { FuncionarioService } from "@/modules/organigrama/services/funcionario.service";
import { Funcionario } from "@/modules/organigrama/types/funcionario.types";

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [start, setStart] = useState(0);
  const limit = 15;
  const [total, setTotal] = useState(0);

  const fetchFuncionarios = useCallback(async (currentStart: number, filtro: string) => {
    setLoading(true);
    try {
      const res = await FuncionarioService.listar({
        start: currentStart,
        limit,
        filtro,
      });

      if (res.tipo === "ERROR") {
        setError(res.mensaje || "Error al obtener funcionarios desde PXP");
      } else {
        setFuncionarios(res.datos || []);
        setTotal(Number(res.total) || 0);
        setError(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al conectar con PXP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFuncionarios(start, searchQuery);
  }, [fetchFuncionarios, start, searchQuery]);

  const handleSearch = (query: string) => {
    setStart(0);
    setSearchQuery(query);
  };

  const handleReload = () => {
    fetchFuncionarios(start, searchQuery);
  };

  const columns: Column<Funcionario>[] = [
    {
      header: "Funcionario",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
            {item.desc_person ? item.desc_person.charAt(0).toUpperCase() : "F"}
          </div>
          <div>
            <div className="font-medium text-foreground leading-tight">
              {item.desc_person || "Sin nombre registrado"}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              C.I.: {item.ci || "N/D"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Código / Cargo",
      render: (item) => (
        <div>
          <div className="font-mono text-xs text-primary font-medium">
            {item.codigo || `FUNC-${item.id_funcionario}`}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
            {item.nombre_cargo || "Funcionario de Planta"}
          </div>
        </div>
      ),
    },
    {
      header: "Contacto",
      render: (item) => (
        <div className="space-y-0.5">
          {item.email_empresa ? (
            <div className="text-xs text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate max-w-[200px]">{item.email_empresa}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground/60">Sin correo</span>
          )}
          {(item.telefono || item.celular || item.interno) && (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{item.celular || item.telefono || `Int: ${item.interno}`}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Fecha Ingreso",
      align: "center",
      render: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.fecha_ingreso || "N/A"}
        </span>
      ),
    },
    {
      header: "Estado",
      align: "center",
      render: (item) => <StateBadge state={item.estado_reg} />,
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Encabezado global */}
      <PageHeader
        title="Gestión de Funcionarios"
        description="Módulo de Organigrama y Recursos Humanos de KERP"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReload}
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refrescar
            </Button>
            <Button size="sm">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Nuevo Funcionario
            </Button>
          </div>
        }
      />

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Funcionarios</p>
              <p className="text-2xl font-bold text-foreground mt-1">{total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Búsqueda Global */}
      <div className="flex items-center justify-between gap-4">
        <SearchInput
          placeholder="Buscar por nombre, CI o código..."
          onSearch={handleSearch}
        />
      </div>

      {/* Tabla Global Reutilizable */}
      <DataTable
        columns={columns}
        data={funcionarios}
        loading={loading}
        error={error}
        total={total}
        start={start}
        limit={limit}
        onPageChange={(newStart) => setStart(newStart)}
        emptyMessage="No se encontraron funcionarios registrados en PXP."
      />
    </div>
  );
}
