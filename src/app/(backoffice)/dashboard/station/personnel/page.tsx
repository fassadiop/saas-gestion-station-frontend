// src/app/(backoffice)/dashboard/station/personnel/page.tsx
"use client";

import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "@/lib/api";
import { Personnel } from "@/types";

import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import { extractResults } from "@/lib/fetchHelpers";

import DataTable from "@/components/DataTable";
import PersonnelFormModal from "@/components/station/personnel/PersonnelFormModal";

import { Role } from "@/constants/roles";
import { ROLE_LABELS } from "@/constants/roles";

export default function PersonnelStationPage() {
  useRequireAuth();

  const { data: user } = useCurrentUser();
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Personnel | null>(null);

  // Pagination locale (serveur plus tard si besoin)
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ============================
     QUERY — LISTE PERSONNEL
     ============================ */
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["station-personnel", page],
    queryFn: async () => {
      const res = await api.get("/station/personnel/");
      return extractResults<Personnel>(res.data);
    },
  });

  /* ============================
     MUTATION — ACTIVER / DÉSACTIVER
     ============================ */
  const toggleActive = useMutation({
    mutationFn: async (p: Personnel) =>
      api.patch(`/station/personnel/${p.id}/`, {
        is_active: !p.is_active,
      }),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["station-personnel"],
      }),
  });

  /* ============================
     COLONNES TABLE
     ============================ */
  const columns = [
    {
      key: "nom",
      label: "Nom",
      render: (p: Personnel) =>
        `${p.last_name ?? ""} ${p.first_name ?? ""}`,
    },
    {
      key: "role",
      label: "Rôle",
      render: (p: Personnel) =>
        ROLE_LABELS[p.role as Role] ?? p.role,
    },
    {
      key: "username",
      label: "Nom d’utilisateur",
    },
    {
      key: "statut",
      label: "Statut",
      render: (p: Personnel) => {
        if (p.role === Role.GERANT && p.is_active) {
          return (
            <span className="badge badge-success">
              Chef actif
            </span>
          );
        }

        if (p.is_active) {
          return (
            <span className="badge badge-outline badge-success">
              Actif
            </span>
          );
        }

        return (
          <span className="badge badge-outline badge-error">
            Inactif
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (p: Personnel) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 text-sm"
            onClick={() => {
              setEditing(p);
              setOpen(true);
            }}
          >
            Modifier
          </button>

          {(user?.role === Role.GERANT ||
            user?.role === Role.ADMIN_TENANT_STATION) && (
            <button
              className="text-sm text-red-600"
              onClick={() =>
                toggleActive.mutate(p)
              }
            >
              {p.is_active
                ? "Désactiver"
                : "Activer"}
            </button>
          )}
        </div>
      ),
    },
  ];

  /* ============================
     RENDER
     ============================ */
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Personnel de la station
        </h1>

        {(user?.role === Role.GERANT ||
          user?.role === Role.ADMIN_TENANT_STATION) && (
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition"
          >
            + Ajouter
          </button>
        )}
      </div>

      {/* TABLE */}
      <DataTable<Personnel>
        title="Liste du personnel"
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        error={isError}
        page={page}
        pageSize={pageSize}
        total={data?.length ?? 0}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && (
        <PersonnelFormModal
          open={open}
          onClose={() => setOpen(false)}
          editing={editing}
          onSaved={() => {
            qc.invalidateQueries({
              queryKey: ["station-personnel"],
            });
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
