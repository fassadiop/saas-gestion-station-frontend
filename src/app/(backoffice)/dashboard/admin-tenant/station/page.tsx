// src/app/(backoffice)/dashboard/admin-tenant/station/page.tsx

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type DashboardData = {
  totals: {
    total: number;
    active: number;
    inactive: number;
  };
  by_region: {
    region: string | null;
    count: number;
    total: number;
  }[];
};

export default function AdminTenantStationGlobalDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get(
          "/station/dashboard/admin-tenant/"
        );
        setData(res.data);
      } catch (err) {
        setError(
          "Impossible de charger le dashboard global."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Chargement du dashboard…</p>;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* ================= EN-TÊTE ================= */}
      <div>
        <h1 className="text-2xl font-semibold">
          Supervision des stations
        </h1>
        <p className="text-gray-500">
          Vue globale du parc de stations du tenant
        </p>
      </div>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          label="Stations totales"
          value={data.totals.total}
        />
        <KpiCard
          label="Stations actives"
          value={data.totals.active}
        />
        <KpiCard
          label="Stations inactives"
          value={data.totals.inactive}
        />
      </div>

      {/* ================= PAR RÉGION ================= */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Répartition par région
          </h2>
        </div>

        {data.by_region.length === 0 ? (
          <p className="text-gray-500">
            Aucune station enregistrée.
          </p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left">Nom de la Région</th>
                <th className="text-center">
                  Nombre de stations
                </th>
              </tr>
            </thead>
            <tbody>
              {data.by_region.map((item) => (
                <tr key={item.region ?? "inconnu"}>
                  <td>
                    {item.region ? (
                        <Link
                        href={`/dashboard/admin-tenant/station/region/${item.region}`}
                        className="text-primary hover:underline"
                        >
                        {item.region}
                        </Link>
                    ) : (
                        "Non renseignée"
                    )}
                   </td>
                  <td className="text-center font-medium">
                        <span className="font-semibold">
                        {item.total}
                        </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= ACTION ================= */}
      <div className="flex justify-end">
        <Link
          href="/dashboard/admin-tenant/station"
          className="btn btn-primary"
        >
          Voir les stations
        </Link>
      </div>
    </div>
  );
}

/* ================= COMPOSANT KPI ================= */

function KpiCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="text-sm text-gray-500">
        {label}
      </div>
      <div className="text-3xl font-bold mt-2">
        {value}
      </div>
    </div>
  );
}
