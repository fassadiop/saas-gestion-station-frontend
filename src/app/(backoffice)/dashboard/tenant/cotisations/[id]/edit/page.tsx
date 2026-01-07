// import EditCotisationClient from "./EditCotisationClient";

// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params; // IMPORTANT !
//   return <EditCotisationClient id={id} />;
// }


"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import { extractResults } from "@/lib/fetchHelpers";

export default function EditCotisationPage() {
  useRequireAuth();
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();

  const id = params?.id as string;

  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  // Tenant pour invalider cache
  const tenantParam =
    me?.is_superuser ? selectedTenantId ?? null : (me?.tenant as any)?.id ?? null;

  // -------------------------------------------------------
  // Charger la cotisation
  // -------------------------------------------------------
  const { data: cotisation, isLoading: cotLoading } = useQuery({
    queryKey: ["cotisation", id],
    queryFn: async () => (await api.get(`/cotisations/${id}/`)).data,
    enabled: Boolean(id) && !meLoading && !meError,
  });

  // -------------------------------------------------------
  // Charger la liste des membres
  // -------------------------------------------------------
  const { data: membres = [] } = useQuery({
    queryKey: ["membres", tenantParam ?? "all"],
    queryFn: async () => {
      const url = tenantParam
        ? `/membres/?tenant=${tenantParam}&page_size=200`
        : `/membres/?page_size=200`;
      const res = await api.get(url);
      return extractResults(res);
    },
    enabled: !meLoading && !meError,
  });

  // -------------------------------------------------------
  // Formulaire interne
  // -------------------------------------------------------
  const [form, setForm] = useState({
    membre: "",
    montant: "",
    date_paiement: "",
    periode: "",
    statut: "",
  });

  // Alimenter le formulaire dès que cotisation arrive
  useEffect(() => {
    if (cotisation) {
      setForm({
        membre: cotisation.membre ? String(cotisation.membre) : "",
        montant: String(cotisation.montant ?? ""),
        date_paiement: cotisation.date_paiement ?? "",
        periode: cotisation.periode ?? "",
        statut: cotisation.statut ?? "Payé",
      });
    }
  }, [cotisation]);

  // -------------------------------------------------------
  // Mutation : mise à jour
  // -------------------------------------------------------
  const mut = useMutation({
    mutationFn: (payload: any) => api.put(`/cotisations/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cotisations", tenantParam ?? "all"] });
      router.push("/cotisations");
    },
  });

  const submit = (e: any) => {
    e.preventDefault();
    const payload: any = { ...form };
    payload.montant = Number(payload.montant || 0);

    if (me?.is_superuser && selectedTenantId) {
      payload.tenant = selectedTenantId;
    }

    mut.mutate(payload);
  };

  if (cotLoading || meLoading) return <div>Chargement…</div>;

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Modifier cotisation #{id}</h1>

      {/* Membre */}
      <div>
        <label className="block text-sm">Membre</label>
        <select
          className="border rounded p-2 w-full"
          value={form.membre}
          onChange={(e) => setForm({ ...form, membre: e.target.value })}
        >
          <option value="">-- sélectionner --</option>
          {membres.map((m: any) => (
            <option key={m.id} value={String(m.id)}>
              {m.nom_membre ?? m.nom ?? `Membre #${m.id}`}
            </option>
          ))}
        </select>
      </div>

      {/* Montant */}
      <div>
        <label>Montant</label>
        <input
          type="number"
          className="border rounded p-2 w-full"
          value={form.montant}
          onChange={(e) => setForm({ ...form, montant: e.target.value })}
        />
      </div>

      {/* Date paiement */}
      <div>
        <label>Date de paiement</label>
        <input
          type="date"
          className="border rounded p-2 w-full"
          value={form.date_paiement}
          onChange={(e) => setForm({ ...form, date_paiement: e.target.value })}
        />
      </div>

      {/* Période */}
      <div>
        <label>Période (ex: 2025-01)</label>
        <input
          className="border rounded p-2 w-full"
          value={form.periode}
          onChange={(e) => setForm({ ...form, periode: e.target.value })}
        />
      </div>

      {/* Statut */}
      <div>
        <label>Statut</label>
        <select
          className="border rounded p-2 w-full"
          value={form.statut}
          onChange={(e) => setForm({ ...form, statut: e.target.value })}
        >
          <option value="Payé">Payé</option>
          <option value="Impayé">Impayé</option>
          <option value="En_attente">En attente</option>
        </select>
      </div>

      <button className="bg-primary text-white px-4 py-2 rounded">
        Enregistrer
      </button>
    </form>
  );
}
