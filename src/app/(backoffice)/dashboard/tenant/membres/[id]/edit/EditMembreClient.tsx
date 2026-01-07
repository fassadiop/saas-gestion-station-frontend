"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";

export default function EditMembreClient({ id }: { id: string }) {
  useRequireAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam =
    me?.is_superuser ? selectedTenantId ?? null : (me?.tenant as any)?.id ?? null;

  const { data: membre, isLoading } = useQuery({
    queryKey: ["membre", id],
    queryFn: async () => (await api.get(`/membres/${id}/`)).data,
    enabled: !meLoading && !meError,
  });

  const [form, setForm] = useState({
    nom_membre: "",
    contact: "",
    email: "",
    telephone: "",
    statut: "",
  });

  useEffect(() => {
    if (membre) {
      setForm({
        nom_membre: membre?.nom_membre ?? "",
        contact: membre?.contact ?? "",
        email: membre?.email ?? "",
        telephone: membre?.telephone ?? "",
        statut: membre?.statut ?? "",
      });
    }
  }, [membre]);

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
    if (me?.is_superuser && selectedTenantId) payload.tenant = selectedTenantId;
    mut.mutate(payload);
  };

  if (isLoading || meLoading) return <div>Chargement…</div>;

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Modifier membre #{id}</h1>

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
