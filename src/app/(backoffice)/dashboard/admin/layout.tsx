// app/(backoffice)/dashboard/admin/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();

  if (!ready) return null;

  if (!user) {
    router.replace("/login");
  return null;
}

  return <>{children}</>;
}
