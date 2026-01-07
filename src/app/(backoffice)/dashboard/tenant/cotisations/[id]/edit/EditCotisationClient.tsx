"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";

export default function EditCotisationClient({ id }: { id: string }) {
  useRequireAuth();
  const router = useRouter();
  const qc = useQueryClient();
  
  const { data: me, isLoading: meLoading } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam =
    me?.is_superuser ? selectedTenantId ?? null : (me?.tenant as any)?.id ?? null;

  const { data: cot, isLoading } = useQuery({
    queryKey: ["cotisation", id],
    queryFn: async () => (await api.get(`/cotisations/${id}/`)).data,
    enabled: !meLoading,
  });

  const [form, setForm] = useState({
    montant: "",
    type: "",
    statut: "",
  });

  useEffect(() => {
    if (cot) {
      setForm({
        montant: String(cot.montant ?? ""),
        type: cot.type ?? "",
        statut: cot.statut ?? "",
      });
    }
  }, [cot]);

  const mut = useMutation({
    mutationFn: (payload) => api.put(`/cotisations/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cotisations", tenantParam ?? "all"] });
      router.push("/cotisations");
    },
  });

  const submit = (e: any) => {
    e.preventDefault();
    const p: any = { ...form, montant: Number(form.montant) };
    if (me?.is_superuser && selectedTenantId) p.tenant = selectedTenantId;
    mut.mutate(p);
  };

  if (isLoading) return <div>Chargement…</div>;

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Modifier cotisation #{id}</h1>

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
