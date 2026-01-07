// src/hooks/useRequireAuth.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";

export default function useRequireAuth() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Quand le contexte est prêt et qu'il n'y a pas d'utilisateur,
    // redirige vers /login (replace pour éviter le back)
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  // Retourne l'état utile pour l'UI (loader / user)
  return { user, ready };
}
