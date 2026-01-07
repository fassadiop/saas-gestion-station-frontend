"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import { extractResults } from "@/lib/fetchHelpers";

export default function EditTransactionClient({ id }: { id: string }) {
  useRequireAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: me, isLoading: meLoading } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const tenantParam =
    me?.is_superuser ? selectedTenantId ?? null : (me?.tenant as any)?.id ?? null;

  const { data: tx, isLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => (await api.get(`/transactions/${id}/`)).data,
    enabled: !meLoading,
  });

  const [form, setForm] = useState({
    montant: "",
    categorie: "",
    mode_paiement: "",
    reference: "",
    type: "",
  });

  useEffect(() => {
    if (tx) {
      setForm({
        montant: String(tx.montant ?? ""),
        categorie: tx.categorie ?? "",
        mode_paiement: tx.mode_paiement ?? "",
        reference: tx.reference ?? "",
        type: tx.type ?? "",
      });
    }
  }, [tx]);

  const mut = useMutation({
    mutationFn: (payload) => api.put(`/transactions/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions", tenantParam ?? "all"] });
      router.push("/transactions");
    },
  });

  const submit = (e: any) => {
    e.preventDefault();
    const p: any = {
      ...form,
      montant: Number(form.montant),
    };
    if (me?.is_superuser && selectedTenantId) p.tenant = selectedTenantId;
    mut.mutate(p);
  };

  if (isLoading) return <div>Chargement…</div>;

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Modifier transaction #{id}</h1>

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
