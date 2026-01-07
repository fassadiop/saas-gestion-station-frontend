"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import { extractResults } from "@/lib/fetchHelpers";
import DataTable from "@/components/DataTable";

/* -----------------------------
   TYPES
------------------------------*/
type Membre = {
  id: string | number;
  nom?: string;
  nom_membre?: string;
  contact?: string;
  telephone?: string;
  email?: string;
  statut?: string;
  tenant?: { id: string; nom?: string } | string | null;
};

/* -----------------------------
   FETCH
------------------------------*/
const fetchMembres = async (tenantId?: string | null): Promise<Membre[]> => {
  const qs = tenantId
    ? `?tenant=${encodeURIComponent(String(tenantId))}&page_size=200`
    : "?page_size=200";

  const res = await api.get(`/membres/${qs}`);
  return extractResults<Membre>(res);
};

export default function MembresDataTablePage() {
  /* -----------------------------
     AUTH & TENANT
  ------------------------------*/
  useRequireAuth();
  const qc = useQueryClient();
  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam = me?.is_superuser
    ? selectedTenantId ?? null
    : (me?.tenant as any)?.id ?? null;

  /* -----------------------------
     STATE (client-side)
  ------------------------------*/
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* -----------------------------
     QUERY
  ------------------------------*/
  const {
    data: membres = [],
    isLoading,
    isError,
    error,
  } = useQuery<Membre[], Error>({
    queryKey: ["membres", tenantParam ?? "all"],
    queryFn: () => fetchMembres(tenantParam),
    enabled: !meLoading && !meError,
    staleTime: 1000 * 60,
  });

  /* -----------------------------
     DELETE
  ------------------------------*/
  const deleteMut = useMutation({
    mutationFn: (id: string | number) => api.delete(`/membres/${id}/`),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["membres", tenantParam ?? "all"] });
    },
  });

  const handleDelete = (m: Membre) => {
    if (!confirm(`Supprimer le membre "${m.nom_membre ?? m.nom ?? m.id}" ?`))
      return;
    deleteMut.mutate(m.id);
  };

  /* -----------------------------
     FILTER + PAGINATION (CLIENT)
  ------------------------------*/
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return membres;

    return membres.filter((m) =>
      [
        m.nom_membre,
        m.nom,
        m.email,
        m.telephone,
        m.contact,
        m.statut,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [membres, search]);

  const total = filtered.length;
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* -----------------------------
     STATES
  ------------------------------*/
  if (meLoading) return <div>Chargement utilisateur…</div>;
  if (meError) return <div>Erreur utilisateur</div>;
  if (isLoading) return <div>Chargement des membres…</div>;
  if (isError) return <div>Erreur : {String(error)}</div>;

  /* -----------------------------
     UI
  ------------------------------*/
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">Membres</h1>

        <Link
          href="/dashboard/tenant/membres/nouveau"
          className="px-3 py-2 bg-primary text-white rounded"
        >
          Nouveau membre
        </Link>
      </div>

      <DataTable
        title="Liste des membres"
        data={paginated}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        loading={isLoading}
        error={isError}
        columns={[
          { key: "id", label: "ID" },
          {
            key: "nom",
            label: "Nom",
            render: (m: Membre) => m.nom_membre ?? m.nom ?? "-",
          },
          { key: "contact", label: "Contact" },
          { key: "email", label: "Email" },
          { key: "telephone", label: "Téléphone" },
          { key: "statut", label: "Statut" },
          {
            key: "actions",
            label: "",
            render: (m: Membre) => (
              <div className="flex gap-2">
                <button
                  onClick={() => (window.location.href = `/membres/${m.id}/edit`)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(m)}
                  className="text-red-600 hover:underline text-sm"
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
