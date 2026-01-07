// src/app/(backoffice)/admin/page.tsx

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/context/AuthProvider"
import { DashboardAdminData } from "@/types/dashboard"

import TenantsLatest from "@/components/TenantsLatest"

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return;

    if (!user || !user.is_superuser) {
      router.replace("/403");
    }
  }, [user, loading, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-admin"],
    queryFn: async () => {
      const res = await api.get("/dashboard/admin/");
      return res.data;
    },
  });

  if (loading || isLoading || !data) {
    return <div>Chargement…</div>
  }

  const adminData = data as DashboardAdminData;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        Dashboard Super Admin
      </h1>

      {/* KPI GOUVERNANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">
            Organisations (Tenants)
          </div>
          <div className="text-2xl font-bold">
            {adminData.stats.tenants_total}
          </div>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">
            Administrateurs de tenants
          </div>
          <div className="text-2xl font-bold">
            {adminData.stats.tenants_total}
          </div>
        </div>
      </div>

      {/* ACTIONS GOUVERNANCE */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/tenants")}
          className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
        >
          Gérer les organisations
        </button>

        <button
          onClick={() => router.push("/utilisateurs")}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Gérer les AdminTenant
        </button>
      </div>

      {/* DERNIERS TENANTS */}
      <section>
        <h2 className="text-lg font-semibold mb-2">
          Dernières organisations créées
        </h2>
        <TenantsLatest />
      </section>
    </div>
  )
}
