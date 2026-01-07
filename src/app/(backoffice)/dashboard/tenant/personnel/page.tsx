"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { usePersonnel } from "@/hooks/usePersonnel";
import { useTogglePersonnel } from "@/hooks/useTogglePersonnel";
import AddPersonnelModal from "@/components/personnel/AddPersonnelModal";
import DataTable from "@/components/DataTable";
import { UserRole } from "@/constants/UserRole";

type PersonnelUser = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: "Collecteur" | "Tresorier";
  is_active: boolean;
};

function PersonnelActions({ user }: { user: PersonnelUser }) {

  const toggleMut = useTogglePersonnel();

    return (
      <button
          onClick={() =>
            toggleMut.mutate({
              id: user.id,
              is_active: !user.is_active,
            })
          }
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            user.is_active
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {user.is_active ? "Désactiver" : "Activer"}
      </button>
    );
}

export default function PersonnelPage() {
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

   const {
        data,
        isLoading,
        error,
        } = usePersonnel({
        search,
        page,
        pageSize: 10,
    });

    const personnel = data?.personnel ?? [];
    const total = data?.total ?? 0;

    console.log("PERSONNEL (hook)", { personnel, total });


    // ✅ DEBUG PRO
    console.log("PERSONNEL (hook)", { personnel, total });

  if (!ready) return <div className="p-6">Chargement…</div>;

  if (user?.role !== UserRole.ADMIN_TENANT_FINANCE) {
    return (
      <div className="p-6 text-red-600">
        Accès réservé à l’administrateur de l’organisation
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personnel</h1>
          <p className="text-gray-600">
            Collecteurs et Trésoriers de l’organisation
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
        >
          + Ajouter
        </button>
      </div>

      <AddPersonnelModal open={open} onClose={() => setOpen(false)} />

      <DataTable
        title="Liste du personnel"
        search={search}
        onSearchChange={setSearch}
        page={page}
        pageSize={10}
        total={total}
        onPageChange={setPage}
        loading={isLoading}
        error={!!error}
        data={personnel}
        columns={[
          {
            key: "nom",
            label: "Nom",
            render: (u: PersonnelUser) =>
              u.first_name || u.last_name
                ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()
                : "—",
          },
          { key: "email", label: "Email" },
          {
            key: "role",
            label: "Rôle",
            render: (u: PersonnelUser) => (
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  u.role === "Collecteur"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {u.role}
              </span>
            ),
          },
          {
            key: "is_active",
            label: "Statut",
            render: (u: PersonnelUser) =>
              u.is_active ? (
                <span className="text-green-600 font-medium">Actif</span>
              ) : (
                <span className="text-red-600 font-medium">Inactif</span>
              ),
          },
          {
            key: "actions",
            label: "",
            render: (u: PersonnelUser) => <PersonnelActions user={u} />,
          },
        ]}
      />
    </div>
  );
}
