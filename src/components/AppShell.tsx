// src/components/AppShell.tsx
"use client";

import React from "react";
import Header from "@/components/Header";

import SidebarFinance from "@/components/sidebar/SidebarFinance";
import SidebarStation from "@/components/sidebar/SidebarStation";
import SidebarAdmin from "@/components/sidebar/SidebarAdmin";
import SidebarAdminTenantStation from "@/components/sidebar/SidebarAdminTenantStation";
import { AppModule } from "@/types/app";
/**
 * Chaque module correspond à UN contexte métier clair
 * et à UNE sidebar dédiée.
 */

interface AppShellProps {
  module?: string;
  children: React.ReactNode;
}

export default function AppShell({
  children,
  module,
}: AppShellProps) {
  console.log("AppShell module =", module);
  console.log("🔍 AppShell RAW user =", JSON.stringify(module));

  return (
    <div className="h-screen flex bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      {module === "admin" && <SidebarAdmin />}

      {module === "finance" && <SidebarFinance />}

      {module === "station" && <SidebarStation />}

      {module === "admin-tenant-station" && (
        <SidebarAdminTenantStation />
      )}

      {/* ================= CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

