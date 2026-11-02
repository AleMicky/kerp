"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/pxp-client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
      Cargando...
    </div>
  );
}
