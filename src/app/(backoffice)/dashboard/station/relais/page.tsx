// src/app/(backoffice)/dashboard/station/relais/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import DataTable from "@/components/DataTable";
import useRequireAuth from "@/hooks/useRequireAuth";

type Relais = {
  id: string;
  debut_relais: string;
  fin_relais: string;
  statut: string;
};

function StatutBadge({ statut }: { statut: string }) {
  const map: Record<string, string> = {
    BROUILLON: "bg-gray-100 text-gray-700",
    VALIDE: "bg-green-100 text-green-700",
    TRANSFERE: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        map[statut] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {statut}
    </span>
  );
}

export default function RelaisEquipePage() {
  useRequireAuth();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["relais-equipes", page],
    queryFn: async () =>
      (
        await api.get("/station/relais-equipes/", {
          params: { page, page_size: pageSize },
        })
      ).data,
  });

  const columns = [
    {
      key: "debut_relais",
      label: "Début",
      render: (r: Relais) =>
        new Date(r.debut_relais).toLocaleString(),
    },
    {
      key: "fin_relais",
      label: "Fin",
      render: (r: Relais) =>
        new Date(r.fin_relais).toLocaleString(),
    },
    {
      key: "statut",
      label: "Statut",
      render: (r: Relais) => (
        <StatutBadge statut={r.statut} />
      ),
    },
    {
      key: "actions",
      label: "",
      render: (r: Relais) => (
        <div className="flex gap-2">
          <Link
            href={`/dashboard/station/relais/${r.id}`}
            className="text-blue-600 text-sm"
          >
            Voir
          </Link>
          {r.statut === "BROUILLON" && (
            <Link
              href={`/dashboard/station/relais/${r.id}/edit`}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition"
            >
              Modifier
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Relais d’équipe
        </h1>

        <Link
          href="/dashboard/station/relais/nouveau"
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition"
        >
          Nouveau relais
        </Link>
      </div>

      <DataTable<Relais>
        columns={columns}
        data={data?.results ?? []}
        loading={isLoading}
        error={isError}
        page={page}
        pageSize={pageSize}
        total={data?.count ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}
