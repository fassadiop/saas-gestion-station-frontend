// src/app/(backoffice)/dashboard/station/depotages/page.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import DataTable from "@/components/DataTable";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Depotage = {
  id: number;
  date_depotage: string;
  produit: string;
  quantite_livree: number;
  statut: string;
};

function StatutBadge({ statut }: { statut: string }) {
  const styles: Record<string, string> = {
    BROUILLON: "bg-gray-100 text-gray-700",
    SOUMIS: "bg-yellow-100 text-yellow-700",
    CONFIRME: "bg-green-100 text-green-700",
    TRANSFERE: "bg-blue-100 text-blue-700",
    ANNULE: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        styles[statut] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {statut}
    </span>
  );
}

export default function DepotagesPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["depotages", page, pageSize],
    queryFn: async () =>
      (
        await api.get("/station/depotages/", {
          params: { page, page_size: pageSize },
        })
      ).data,
  });

  const transferFromList = useMutation({
    mutationFn: async (id: number) =>
      (await api.post(`/station/depotages/${id}/transferer/`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depotages"] });
    },
  });

  const canManageDepotage =
  user?.role === "GERANT" || user?.role === "SUPERVISEUR";
  
  const rows = Array.isArray(data) ? data : data?.results ?? [];
  const columns = [
    {
      key: "date_depotage",
      label: "Date",
      render: (row: Depotage) =>
        new Date(row.date_depotage).toLocaleDateString(),
    },
    {
      key: "produit",
      label: "Produit",
    },
    {
      key: "quantite_livree", // ✅ BON CHAMP
      label: "Volume",
      render: (row: Depotage) => `${row.quantite_livree} L`,
    },
    {
      key: "statut",
      label: "Statut",
      render: (row: Depotage) => (
        <StatutBadge statut={row.statut} />
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: Depotage) => (
        <div className="flex gap-3 items-center">
          <Link
            href={`/dashboard/station/depotages/${row.id}`}
            className="text-blue-600 text-sm"
          >
            Voir
          </Link>

          {canManageDepotage && row.statut === "CONFIRME" && (
            <button
              onClick={() => transferFromList.mutate(row.id)}
              disabled={transferFromList.isPending}
              className="text-orange-600 text-sm hover:underline"
            >
              {transferFromList.isPending
                ? "Transfert…"
                : "Transférer"}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dépotages</h1>

        {(user?.role === "GERANT" ||
          user?.role === "SUPERVISEUR") && (
          <Link
            href="/dashboard/station/depotages/nouveau"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition"
          >
            Nouveau dépotage
          </Link>
        )}
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        error={isError}
        page={page}
        pageSize={pageSize}
        total={rows.length}
        onPageChange={setPage}
      />
    </div>
  );
}
