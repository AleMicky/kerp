"use client";

import Link from "next/link";
import { useStoredUser } from "@/lib/pxp-client";
import {
  Users,
  Database,
  Server,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const user = useStoredUser();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sesión activa en PXP
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ¡Bienvenido, {user?.nombre_usuario || "Usuario"}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Esta interfaz en Next.js está conectada en tiempo real a los controladores de PXP y a la base de datos PostgreSQL.
            </p>
          </div>
          <Link
            href="/dashboard/funcionarios"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all flex-shrink-0"
          >
            <span>Ver Funcionarios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Base de Datos
            </p>
            <p className="text-xl font-bold text-white mt-1">
              {user?.nombre_basedatos || "dbkerp"}
            </p>
            <p className="text-xs text-slate-500 mt-1">PostgreSQL 11 (Docker)</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Autenticación
            </p>
            <p className="text-xl font-bold text-white mt-1 capitalize">
              {user?.autentificacion || "Local"}
            </p>
            <p className="text-xs text-slate-500 mt-1">PXP Security (segu)</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Arquitectura
            </p>
            <p className="text-xl font-bold text-white mt-1">Next.js + PXP</p>
            <p className="text-xs text-slate-500 mt-1">Headless ERP / BFF Proxy</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Módulos Conectados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/funcionarios"
            className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Organigrama / Funcionarios</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Consulta el personal registrado consumiendo <code className="text-indigo-300">ACTFuncionario</code>
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}

