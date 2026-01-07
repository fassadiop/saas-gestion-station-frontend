// app/(backoffice)/dashboard/station/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import AppShell from "@/components/AppShell";
import { SelectedStationProvider } from "@/context/SelectedStationContext";
import { UserRole } from "@/constants/UserRole";

export default function StationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    /**
     * 🔒 Garde STATION STRICTE
     * (ajuste si tu as d'autres rôles autorisés)
     */
    const ALLOWED_ROLES = [
      "ADMIN_TENANT_STATION",
      "GERANT",
      "SUPERVISEUR",
      "POMPISTE",
      "CAISSIER",
    ];

    if (!ALLOWED_ROLES.includes(user.role)) {
      router.replace("/403");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

    console.log("ROLE ACTUEL =", user.role);

  const module =
  user.role === "ADMIN_TENANT_STATION"
    ? "admin-tenant-station"
    : "station";

  return (
    <AppShell module={module}>
      <SelectedStationProvider>
        {children}
      </SelectedStationProvider>
    </AppShell>
  );
}
