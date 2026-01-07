"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import DataTable from "@/components/DataTable";

/* --------------------------------------
   Types
---------------------------------------*/
type Projet = {
  id: string | number;
  nom?: string;
  objectif?: string;
  budget?: number;
  statut?: string;
};

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/* --------------------------------------
   Fetch projets
---------------------------------------*/
const fetchProjets = async (
  tenantId: string | null,
  search: string,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Projet>> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("page_size", String(pageSize));

  if (tenantId) params.append("tenant", tenantId);
  if (search) params.append("search", search);

  const res = await api.get(`/projets/?${params.toString()}`);
  return res.data;
};

export default function ProjetsPage() {
  /* --------------------------------------
     AUTH
  ---------------------------------------*/
  useRequireAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: me, isLoading: meLoading, isError: meError } =
    useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam = me?.is_superuser
    ? selectedTenantId ?? null
    : (me?.tenant as any)?.id ?? null;

  /* --------------------------------------
     TABLE STATE
  ---------------------------------------*/
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* --------------------------------------
     QUERY
  ---------------------------------------*/
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projets", tenantParam, search, page],
    queryFn: () => fetchProjets(tenantParam, search, page, pageSize),
    enabled: !meLoading && !meError,
    placeholderData: (previousData) => previousData,
  });

  const projets = data?.results ?? [];
  const total = data?.count ?? 0;

  /* --------------------------------------
     DELETE
  ---------------------------------------*/
  const deleteMut = useMutation({
    mutationFn: (id: string | number) =>
      api.delete(`/projets/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projets"] });
    },
  });

  /* --------------------------------------
     UI STATES
  ---------------------------------------*/
  if (meLoading) return <div>Chargement utilisateur…</div>;
  if (meError) return <div>Erreur utilisateur</div>;

  /* --------------------------------------
     RENDER
  ---------------------------------------*/
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projets</h1>

        <Link
          href="/dashboard/tenant/projets/nouveau"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + Nouveau projet
        </Link>
      </div>

      <DataTable
        title="Liste des projets"
        data={projets}
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
          { key: "nom", label: "Nom" },
          { key: "objectif", label: "Objectif" },
          { key: "budget", label: "Budget" },
          { key: "statut", label: "Statut" },
          {
            key: "actions",
            label: "",
            render: (p: Projet) => (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/projets/${p.id}/edit`)
                  }
                  className="text-blue-600 text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Supprimer le projet « ${p.nom ?? p.id} » ?`
                      )
                    ) {
                      deleteMut.mutate(p.id);
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
