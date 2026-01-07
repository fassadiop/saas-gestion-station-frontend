"use client";

import React from "react";
import { useAuth } from "@/context/AuthProvider";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import useTenants from "@/hooks/useTenants";
import { isSuperAdmin } from "@/lib/userUtils";

export default function TenantSwitcher() {
  const { user } = useAuth();
  const { tenants, loading } = useTenants();
  const { selectedTenantId, changeTenant } = useSelectedTenant();

  if (!isSuperAdmin(user)) return null;
  if (loading) return <span>Chargement…</span>;

  return (
    <select
      className="border px-2 py-1 rounded text-sm"
      value={selectedTenantId ?? ""}
      onChange={(e) => {
        const id = e.target.value;
        const name = tenants.find((t) => t.id === id)?.nom ?? null;
        changeTenant(id, name);
      }}
    >
      <option value="">— Sélectionner un tenant —</option>

      {tenants.map((t) => (
        <option key={t.id} value={t.id}>
          {t.nom}
        </option>
      ))}
    </select>
  );
}
