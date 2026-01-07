// app/(backoffice)/dashboard/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import AppShell from "@/components/AppShell";
import { getDashboardHref } from "@/lib/userUtils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (window.location.pathname === "/dashboard") {
      router.replace(getDashboardHref(user));
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  // ⛔ PAS d’AppShell ici
  return <>{children}</>;
}
