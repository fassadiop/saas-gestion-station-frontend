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

/* --------------------------------------
   Types
---------------------------------------*/
type Transaction = {
  id: string | number;
  date?: string;
  montant?: number;
  type?: string;
  projet?: { id?: string | number; nom?: string } | null;
  categorie?: string;
  reference?: string;
};

/* --------------------------------------
   Fetch transactions (search + paging)
---------------------------------------*/
const fetchTransactions = async (
  tenantId?: string | null,
  search?: string,
  page?: number,
  pageSize?: number
) => {
  const params = new URLSearchParams();

  if (tenantId) params.append("tenant", String(tenantId));
  if (search) params.append("search", search);
  if (page) params.append("page", String(page));
  if (pageSize) params.append("page_size", String(pageSize));
  params.append("ordering", "-date");

  const res = await api.get(`/transactions/?${params.toString()}`);
  return res.data;
};

export default function TransactionsPage() {
  /* --------------------------------------
     AUTH & CONTEXT
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
     SEARCH & PAGINATION
  ---------------------------------------*/
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [search]);

  /* --------------------------------------
     QUERY
  ---------------------------------------*/
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transactions", tenantParam ?? "all", search, page],
    queryFn: () =>
      fetchTransactions(tenantParam, search, page, pageSize),
    enabled: !meLoading && !meError,
    staleTime: 1000 * 30,
  });

  /* --------------------------------------
     NORMALISATION API
  ---------------------------------------*/
  const transactions: Transaction[] = Array.isArray(data)
    ? data
    : data?.results ?? [];

  const total: number = Array.isArray(data)
    ? transactions.length
    : data?.count ?? 0;

  /* --------------------------------------
     DELETE MUTATION
  ---------------------------------------*/
  const deleteMut = useMutation({
    mutationFn: (id: string | number) =>
      api.delete(`/transactions/${id}/`),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["transactions", tenantParam ?? "all"],
      });
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
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-gray-600">Recettes et dépenses</p>
        </div>

        <Link
          href="/dashboard/tenant/transactions/nouveau"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + Nouvelle transaction
        </Link>
      </div>

      <DataTable<Transaction>
        title="Liste des transactions"
        data={transactions}
        loading={isLoading}
        error={!!isError}
        search={search}
        onSearchChange={setSearch}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        columns={[
          { key: "date", label: "Date" },
          { key: "montant", label: "Montant" },
          { key: "type", label: "Type" },
          {
            key: "projet",
            label: "Projet",
            render: (r) =>
              r.projet
                ? typeof r.projet === "object"
                  ? r.projet.nom ?? r.projet.id
                  : String(r.projet)
                : "—",
          },
          { key: "categorie", label: "Catégorie" },
          { key: "reference", label: "Référence" },
          {
            key: "actions",
            label: "",
            render: (r) => (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/transactions/${r.id}/edit`)
                  }
                  className="text-blue-600 text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Supprimer la transaction #${r.id} ?`
                      )
                    ) {
                      deleteMut.mutate(r.id);
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
