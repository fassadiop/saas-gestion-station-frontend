// import EditProjetClient from "./EditProjetClient";

// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params; // IMPORTANT !
//   return <EditProjetClient id={id} />;
// }


"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";

export default function EditProjetPage() {
  useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const qc = useQueryClient();

  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam =
    me?.is_superuser ? selectedTenantId ?? null : (me?.tenant as any)?.id ?? null;

  // ----------------------------------------
  // Fetch projet
  // ----------------------------------------
  const { data: projet, isLoading } = useQuery({
    queryKey: ["projet", id],
    queryFn: async () => (await api.get(`/projets/${id}/`)).data,
    enabled: Boolean(id) && !meLoading && !meError,
  });

  // ----------------------------------------
  // Form local
  // ----------------------------------------
  const [form, setForm] = useState({
    nom: "",
    budget: "",
    statut: "",
  });

  useEffect(() => {
    if (projet) {
      setForm({
        nom: projet.nom ?? "",
        budget: String(projet.budget ?? "0"),
        statut: projet.statut ?? "En_cours",
      });
    }
  }, [projet]);

  // ----------------------------------------
  // Update mutation
  // ----------------------------------------
  const mut = useMutation({
    mutationFn: (payload: any) => api.put(`/projets/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projets", tenantParam ?? "all"] });
      router.push("/projets");
    },
  });

  const submit = (e: any) => {
    e.preventDefault();

    const payload: any = {
      ...form,
      budget: parseFloat(form.budget || "0"),
    };

    if (me?.is_superuser && selectedTenantId) {
      payload.tenant = selectedTenantId;
    }

    mut.mutate(payload);
  };

  if (isLoading || meLoading) return <div>Chargement…</div>;

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Modifier projet #{id}</h1>

      <div>
        <label>Nom</label>
        <input
          className="border p-2 rounded w-full"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />
      </div>

      <div>
        <label>Budget</label>
        <input
          className="border p-2 rounded w-full"
          type="number"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
      </div>

      <div>
        <label>Statut</label>
        <select
          className="border p-2 rounded w-full"
          value={form.statut}
          onChange={(e) => setForm({ ...form, statut: e.target.value })}
        >
          <option value="En_cours">En cours</option>
          <option value="Termine">Terminé</option>
          <option value="Suspendu">Suspendu</option>
        </select>
      </div>

      <button className="bg-primary text-white px-4 py-2 rounded">
        Enregistrer
      </button>
    </form>
  );
}
