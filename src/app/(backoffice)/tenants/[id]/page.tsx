"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import api from "@/lib/api";
import { deleteTenant } from "@/hooks/useTenants";

export default function TenantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const [tenant, setTenant] = useState<any>(null);

  if (!user?.role?.includes("SuperAdmin"))
    return <div className="text-red-600 text-center">Accès refusé.</div>;

  useEffect(() => {
    async function fetchTenant() {
      const res = await api.get(`/tenants/${params.id}/`);
      setTenant(res.data);
    }
    fetchTenant();
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Supprimer ce tenant ?")) return;
    await deleteTenant(params.id as string);
    router.push("/tenants");
  }

  if (!tenant) return <div>Chargement…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{tenant.nom}</h1>

      <div className="bg-white p-4 rounded shadow max-w-lg space-y-2">
        <p><strong>Structure :</strong> {tenant.type_structure}</p>
        <p><strong>Créé le :</strong> {tenant.date_creation?.substring(0, 10)}</p>
        <p><strong>AdminTenant :</strong> {tenant.admin_username ?? "—"}</p>
      </div>

      <button
        className="px-4 py-2 bg-red-600 text-white rounded"
        onClick={handleDelete}
      >
        Supprimer ce tenant
      </button>
    </div>
  );
}
