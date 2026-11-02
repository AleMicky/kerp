"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/lib/pxp-client";
import { Lock, User, AlertCircle, Loader2, Database, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    try {
      const res = await login(data.username, data.password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setServerError(res.mensaje || "Error de autenticación");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo conectar con el servidor backend PXP";
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-400 mb-2 shadow-inner">
            <Database className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            KERP / PXP Client
          </CardTitle>
          <CardDescription className="text-sm text-slate-300">
            Frontend moderno en Next.js conectado al ERP PXP
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Error Alert */}
          {serverError && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Usuario PXP
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="username"
                  type="text"
                  placeholder="ej. admin"
                  {...register("username")}
                  className={`pl-10 h-11 bg-white/5 text-white placeholder:text-slate-500 rounded-xl transition-colors ${
                    errors.username
                      ? "border-red-500/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                      : "border-white/15 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-10 h-11 bg-white/5 text-white placeholder:text-slate-500 rounded-xl transition-colors ${
                    errors.password
                      ? "border-red-500/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                      : "border-white/15 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/20"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 gap-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando con PXP...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pt-2 border-t border-white/10 flex flex-col text-center text-xs text-slate-400">
          <p>Backend: PXP Framework (PHP 7.4 + PostgreSQL 11)</p>
          <p className="mt-0.5">Componentes: shadcn/ui + Tailwind CSS</p>
        </CardFooter>
      </Card>
    </div>
  );
}
