// app/(backoffice)/dashboard/admin-tenant/station/stations/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminTenantStations } from "../hooks/useAdminTenantStations";
import StationsFilters from "../components/StationsFilters";
import StationsTable from "../components/StationsTable";
import Pagination from "../components/Pagination";

export default function AdminTenantStationsPage() {
  // 🔹 Filtres UI
  const [uiFilters, setUiFilters] = useState<{
    region: string;
    active: boolean | "";
  }>({
    region: "",
    active: "",
  });

  // 🔹 Pagination & tri
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [ordering, setOrdering] = useState("nom");

  // 🔹 Paramètres serveur COMPLETS
  const filters = {
    page,
    pageSize,
    ordering,
    region: uiFilters.region,
    active: uiFilters.active,
  };

  const { data, isLoading } =
    useAdminTenantStations(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Liste des stations
          </h1>
          <p className="text-sm text-gray-500">
            Gestion des stations du tenant
          </p>
        </div>

        <Link
          href="/dashboard/admin-tenant/station/nouveau"
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition"
        >
          Créer une station
        </Link>
      </div>

      {/* Filtres */}
      <StationsFilters
        region={uiFilters.region}
        active={uiFilters.active}
        onChange={(v) => {
          setPage(1); // reset pagination
          setUiFilters(v);
        }}
      />

      {/* Table */}
      {isLoading ? (
        <p>Chargement…</p>
      ) : data?.results?.length ? (
        <>
          <StationsTable
            data={data.results}
            ordering={ordering}
            setOrdering={setOrdering}
          />

          {/* Pagination */}
          <Pagination
            page={page}
            pageSize={pageSize}
            count={data.count}
            onPageChange={setPage}
          />
        </>
      ) : (
        <p className="text-gray-500">
          Aucune station trouvée.
        </p>
      )}
    </div>
  );
}
