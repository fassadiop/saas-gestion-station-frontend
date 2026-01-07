// // SERVER COMPONENT
// import EditMembreClient from "./EditMembreClient";

// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params; // IMPORTANT !
//   return <EditMembreClient id={id} />;
// }


"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";

export default function EditMembrePage() {
  useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const qc = useQueryClient();

  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam =
    me?.is_superuser ? selectedTenantId ?? null : (me?.tenant as any)?.id ?? null;

  // ------------------------------
  // Query membre
  // ------------------------------
  const { data: membre, isLoading } = useQuery({
    queryKey: ["membre", id],
    queryFn: async () => (await api.get(`/membres/${id}/`)).data,
    enabled: Boolean(id) && !meLoading && !meError,
  });

  // ------------------------------
  // Form local, aligné au modèle Django
  // ------------------------------
  const [form, setForm] = useState({
    nom_membre: "",
    contact: "",
    statut: "",
  });

  useEffect(() => {
    if (membre) {
      setForm({
        nom_membre: membre.nom_membre ?? "",
        contact: membre.contact ?? "",
        statut: membre.statut ?? "Actif",
      });
    }
  }, [membre]);

  // ------------------------------
  // Mutation update
  // ------------------------------
  const mut = useMutation({
    mutationFn: (payload: any) => api.put(`/membres/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["membres", tenantParam ?? "all"] });
      router.push("/membres");
    },
  });

  const submit = (e: any) => {
    e.preventDefault();

    const payload: any = { ...form };

    if (me?.is_superuser && selectedTenantId) {
      payload.tenant = selectedTenantId;
    }

    mut.mutate(payload);
  };

  if (isLoading || meLoading) return <div>Chargement…</div>;

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Modifier membre #{id}</h1>

      <div>
        <label className="block">Nom du membre</label>
        <input
          className="border rounded p-2 w-full"
          value={form.nom_membre}
          onChange={(e) => setForm({ ...form, nom_membre: e.target.value })}
        />
      </div>

      <div>
        <label className="block">Contact</label>
        <input
          className="border rounded p-2 w-full"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
        />
      </div>

      <div>
        <label className="block">Statut</label>
        <select
          className="border rounded p-2 w-full"
          value={form.statut}
          onChange={(e) => setForm({ ...form, statut: e.target.value })}
        >
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
        </select>
      </div>

      <button className="bg-primary text-white px-4 py-2 rounded">
        Enregistrer
      </button>
    </form>
  );
}
