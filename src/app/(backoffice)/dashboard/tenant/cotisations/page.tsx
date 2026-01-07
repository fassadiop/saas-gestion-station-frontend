"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import DataTable from "@/components/DataTable";
import { useRouter } from "next/navigation";

/* -----------------------------
   Types
----------------------------- */
type Cotisation = {
  id: number;
  membre?: number;
  membre_display?: string;
  montant?: number;
  date_paiement?: string;
  periode?: string;
  statut?: string;
};

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/* -----------------------------
   Fetch cotisations
----------------------------- */
const fetchCotisations = async (
  tenantId: string | null,
  search: string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Cotisation>> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("page_size", String(pageSize));

  if (tenantId) params.append("tenant", tenantId);
  if (search) params.append("search", search);

  params.append("ordering", "-date_paiement");

  const res = await api.get(`/cotisations/?${params.toString()}`);
  return res.data;
};

export default function CotisationsPage() {
  /* -----------------------------
     AUTH & CONTEXT
  ----------------------------- */
  useRequireAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: me, isLoading: meLoading } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam = me?.is_superuser
    ? selectedTenantId ?? null
    : (me?.tenant as any)?.id ?? null;

  /* -----------------------------
     TABLE STATE
  ----------------------------- */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [search]);

  /* -----------------------------
     QUERY
  ----------------------------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cotisations", tenantParam, search, page],
    queryFn: () =>
      fetchCotisations(tenantParam, search, page, pageSize),
    enabled: !meLoading,
    placeholderData: (previousData) => previousData,
  });

  const cotisations = data?.results ?? [];
  const total = data?.count ?? 0;

  /* -----------------------------
     DELETE
  ----------------------------- */
  const deleteMut = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/cotisations/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cotisations"] });
    },
  });

  /* -----------------------------
     UI STATES
  ----------------------------- */
  if (meLoading) return <div>Chargement utilisateur…</div>;
  if (isLoading) return <div>Chargement…</div>;
  if (isError) return <div>Erreur de chargement</div>;

  /* -----------------------------
     RENDER
  ----------------------------- */
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cotisations</h1>

        <Link
          href="/dashboard/tenant/cotisations/nouveau"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Nouvelle cotisation
        </Link>
      </div>

      <DataTable<Cotisation>
        title="Liste des cotisations"
        data={cotisations}
        loading={isLoading}
        error={isError}
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        columns={[
          { key: "id", label: "ID" },
          { key: "membre_display", label: "Membre" },
          { key: "montant", label: "Montant" },
          { key: "date_paiement", label: "Date" },
          { key: "periode", label: "Période" },
          {
            key: "actions",
            label: "",
            render: (c: Cotisation) => (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/cotisations/${c.id}/edit`)
                  }
                  className="text-blue-600 text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Supprimer la cotisation #${c.id} ?`
                      )
                    ) {
                      deleteMut.mutate(c.id);
                    }
                  }}
                  className="text-red-600 text-sm"
                >
                  Supprimer
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
