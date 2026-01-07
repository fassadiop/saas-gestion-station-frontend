"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import DataTable from "@/components/DataTable";

/* --------------------------------------
   Types
---------------------------------------*/
type UserItem = {
  id: number | string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  tenant?: { id: string; nom: string } | string | null;
  is_superuser?: boolean;
  is_active?: boolean;
};

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/* --------------------------------------
   Fetch users (NE PAS MODIFIER)
---------------------------------------*/
const fetchUsers = async (
  tenantId: string | null,
  search: string,
  page: number,
  pageSize: number
) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("page_size", String(pageSize));

  if (tenantId) params.append("tenant", tenantId);
  if (search) params.append("search", search);

  const res = await api.get(`/utilisateurs/?${params.toString()}`);
  return res.data;
};

export default function UtilisateursPage() {
  /* --------------------------------------
     AUTH
  ---------------------------------------*/
  useRequireAuth();
  const qc = useQueryClient();

  const { data: me, isLoading: meLoading, isError: meError } =
    useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const isSuper = me?.is_superuser === true;

  const tenantParam = isSuper
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
  const {
    data,
    isLoading,
    isError,
  } = useQuery<any>({
    queryKey: ["utilisateurs", tenantParam ?? "all", search, page, pageSize],
    queryFn: () =>
      fetchUsers(tenantParam, search, page, pageSize),
    enabled: !meLoading && !meError,
    staleTime: 1000 * 60 * 2,
  });

  /* --------------------------------------
     🔥 NORMALISATION CRITIQUE
  ---------------------------------------*/
  const users: UserItem[] = Array.isArray(data)
    ? data
    : data?.results ?? [];

  const total: number = Array.isArray(data)
    ? users.length
    : data?.count ?? 0;

  /* --------------------------------------
     DELETE
  ---------------------------------------*/
  const deleteMut = useMutation({
    mutationFn: (id: string | number) =>
      api.delete(`/utilisateurs/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["utilisateurs", tenantParam ?? "all"],
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
          <h1 className="text-2xl font-bold">Utilisateurs</h1>
          <p className="text-sm text-gray-500">
            Gestion des comptes du tenant
          </p>
        </div>

        {(isSuper || me?.role === "AdminTenant") && (
          <Link
            href="/utilisateurs/nouveau"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            + Nouvel utilisateur
          </Link>
        )}
      </div>

      <DataTable<UserItem>
        title="Liste des utilisateurs"
        data={users}
        loading={isLoading}
        error={isError}
        search={search}
        onSearchChange={(v) => {
          setPage(1);     // 🔥 reset pagination
          setSearch(v);
        }}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        columns={[
          { key: "id", label: "ID" },
          { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          {
            key: "tenant",
            label: "Tenant",
            render: (u) =>
              typeof u.tenant === "object"
                ? u.tenant?.nom
                : u.tenant ?? "-",
          },
          { key: "role", label: "Rôle" },
          {
            key: "is_active",
            label: "Actif",
            render: (u) => (u.is_active ? "Oui" : "Non"),
          },
          {
            key: "actions",
            label: "",
            render: (u) => (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    (window.location.href =
                      `/admin-tenants/${u.id}/edit-password`)
                  }
                  className="text-blue-600 text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (!confirm(`Supprimer ${u.username} ?`)) return;
                    deleteMut.mutate(u.id);
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
