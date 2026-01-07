// app/(backoffice)/dashboard/admin-tenant/layout.tsx

"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import AppShell from "@/components/AppShell";
import { Role } from "@/constants/roles";


export default function AdminTenantLayout({
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

    // 🔒 Garde ADMIN_TENANT_STATION
    if (
      user.role !== Role.ADMIN_TENANT_STATION &&
      user.role !== Role.GERANT
    ) {
      router.replace("/403");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <AppShell module="admin-tenant-station">
      {children}
    </AppShell>
  );
}