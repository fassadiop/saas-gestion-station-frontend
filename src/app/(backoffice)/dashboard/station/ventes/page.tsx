"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import DataTable from "@/components/DataTable";
import VenteFormModal from "./components/VenteFormModal";
import VenteStatusBadge from "./components/VenteStatusBadge";
import VenteActions from "./components/VenteActions";

type Vente = {
  id: number;
  date: string;
  produit: string;
  volume: number;
  prix_unitaire: number;
  status: string;
};

export default function StationVentesPage() {
  useRequireAuth();
  const { data: user } = useCurrentUser();
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["station-ventes"],
    queryFn: async () => {
      const res = await api.get("/station/ventes-carburant/");
      return res.data.results;
    },
  });

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (v: Vente) =>
        new Date(v.date).toLocaleString(),
    },
    { key: "produit", label: "Produit" },
    { key: "volume", label: "Volume (L)" },
    { key: "prix_unitaire", label: "Prix U" },
    {
      key: "montant",
      label: "Montant",
      render: (v: Vente) =>
        (v.volume * v.prix_unitaire).toLocaleString(),
    },
    {
    key: "status",
    label: "Statut",
    render: (v: Vente) => (
        <VenteStatusBadge status={v.status} />
    ),
    },
    {
    key: "actions",
    label: "Actions",
    render: (v: Vente) => (
        <VenteActions
        vente={v}
        role={user?.role}
        />
    ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Ventes carburant
        </h1>

        {user?.role !== "AdminTenantFinance" && (
          <button
            className="btn btn-primary"
            onClick={() => setOpen(true)}
          >
            + Nouvelle vente
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        page={1}
        pageSize={20}
        total={data?.length ?? 0}
        onPageChange={() => {}}
      />

      {open && (
        <VenteFormModal
          open={open}
          onClose={() => setOpen(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["station-ventes"] });
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
