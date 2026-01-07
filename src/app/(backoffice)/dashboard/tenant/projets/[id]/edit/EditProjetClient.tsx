"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";

export default function EditProjetClient({ id }: { id: string }) {
  useRequireAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: me, isLoading: meLoading } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam =
    me?.is_superuser ? selectedTenantId ?? null : (me?.tenant as any)?.id ?? null;

  const { data: projet, isLoading } = useQuery({
    queryKey: ["projet", id],
    queryFn: async () => (await api.get(`/projets/${id}/`)).data,
    enabled: !meLoading,
  });

  const [form, setForm] = useState({
    nom: "",
    objectif: "",
    budget: "",
    statut: "",
  });

  useEffect(() => {
    if (projet) {
      setForm({
        nom: projet.nom ?? "",
        objectif: projet.objectif ?? "",
        budget: String(projet.budget ?? ""),
        statut: projet.statut ?? "",
      });
    }
  }, [projet]);

  const mut = useMutation({
    mutationFn: (payload) => api.put(`/projets/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projets", tenantParam ?? "all"] });
      router.push("/projets");
    },
  });

  const submit = (e: any) => {
    e.preventDefault();
    const payload: any = {
      ...form,
      budget: Number(form.budget),
    };
    if (me?.is_superuser && selectedTenantId) payload.tenant = selectedTenantId;
    mut.mutate(payload);
  };

  if (isLoading) return <div>Chargement…</div>;

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Modifier projet #{id}</h1>

      {Object.keys(form).map((key) => (
        <div key={key}>
          <label className="block">{key}</label>
          <input
            className="border rounded p-2 w-full"
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}

      <button className="bg-primary text-white px-4 py-2 rounded">Enregistrer</button>
    </form>
  );
}
