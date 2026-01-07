// import EditTransactionClient from "./EditTransactionClient";
// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params; // IMPORTANT !
//   return <EditTransactionClient id={id} />;
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

export default function EditTransactionPage() {
  useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const qc = useQueryClient();

  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  // Tenant utilisé pour invalider les listes
  const tenantParam =
    me?.is_superuser ? selectedTenantId ?? null : (me?.tenant as any)?.id ?? null;

  // -------------------------------------------------
  // Charger la transaction
  // -------------------------------------------------
  const { data: tx, isLoading: txLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => (await api.get(`/transactions/${id}/`)).data,
    enabled: Boolean(id) && !meLoading && !meError,
  });

  // -------------------------------------------------
  // Charger les projets (optionnel)
  // -------------------------------------------------
  const { data: projets = [] } = useQuery({
    queryKey: ["projets", tenantParam ?? "all"],
    queryFn: async () => {
      const url = tenantParam
        ? `/projets/?tenant=${tenantParam}&page_size=200`
        : `/projets/?page_size=200`;

      const res = await api.get(url);
      return extractResults(res);
    },
    enabled: !meLoading && !meError,
  });

  // -------------------------------------------------
  // Formulaire
  // -------------------------------------------------

  const [form, setForm] = useState({
    projet: "",
    type: "",
    montant: "",
    date: "",
    categorie: "",
    mode_paiement: "",
    reference: "",
  });

  const [file, setFile] = useState<File | null>(null);

  // Remplir le formulaire lorsque la transaction arrive
  useEffect(() => {
    if (tx) {
      setForm({
        projet: tx.projet ? String(tx.projet) : "",
        type: tx.type ?? "",
        montant: String(tx.montant ?? ""),
        date: tx.date ?? new Date().toISOString().slice(0, 10),
        categorie: tx.categorie ?? "",
        mode_paiement: tx.mode_paiement ?? "",
        reference: tx.reference ?? "",
      });
    }
  }, [tx]);

  // -------------------------------------------------
  // Mutation
  // -------------------------------------------------
  const mut = useMutation({
    mutationFn: (formData: FormData) => api.put(`/transactions/${id}/`, formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions", tenantParam ?? "all"] });
      router.push("/transactions");
    },
  });

  const submit = (e: any) => {
    e.preventDefault();

    const fd = new FormData();

    if (form.projet) fd.append("projet", form.projet);
    fd.append("type", form.type);
    fd.append("montant", form.montant);
    fd.append("date", form.date);
    fd.append("categorie", form.categorie);

    if (form.mode_paiement) fd.append("mode_paiement", form.mode_paiement);
    if (form.reference) fd.append("reference", form.reference);

    if (file) fd.append("fichier_recu", file);

    if (me?.is_superuser && selectedTenantId) fd.append("tenant", selectedTenantId);

    mut.mutate(fd);
  };

  if (txLoading || meLoading) return <div>Chargement…</div>;

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  return (
    <form onSubmit={submit} className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">Modifier transaction #{id}</h1>

      {/* Projet */}
      <div>
        <label>Projet (optionnel)</label>
        <select
          className="border rounded p-2 w-full"
          value={form.projet}
          onChange={(e) => setForm({ ...form, projet: e.target.value })}
        >
          <option value="">-- Aucun --</option>
          {projets.map((p: any) => (
            <option key={p.id} value={String(p.id)}>
              {p.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div>
        <label>Type</label>
        <select
          className="border rounded p-2 w-full"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">-- Sélectionner --</option>
          <option value="Recette">Recette</option>
          <option value="Depense">Depense</option>
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

      {/* Date */}
      <div>
        <label>Date</label>
        <input
          type="date"
          className="border rounded p-2 w-full"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>

      {/* Catégorie */}
      <div>
        <label>Catégorie</label>
        <input
          className="border rounded p-2 w-full"
          value={form.categorie}
          onChange={(e) => setForm({ ...form, categorie: e.target.value })}
        />
      </div>

      {/* Mode de paiement */}
      <div>
        <label>Mode de paiement</label>
        <input
          className="border rounded p-2 w-full"
          value={form.mode_paiement}
          onChange={(e) => setForm({ ...form, mode_paiement: e.target.value })}
        />
      </div>

      {/* Référence */}
      <div>
        <label>Référence</label>
        <input
          className="border rounded p-2 w-full"
          value={form.reference}
          onChange={(e) => setForm({ ...form, reference: e.target.value })}
        />
      </div>

      {/* fichier_recu */}
      <div>
        <label>Fichier reçu (si nouveau)</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {tx?.fichier_recu && (
          <p className="text-xs text-gray-600 mt-1">
            Fichier actuel : {tx.fichier_recu.split("/").pop()}
          </p>
        )}
      </div>

      <button className="bg-primary text-white px-4 py-2 rounded">
        Enregistrer
      </button>
    </form>
  );
}
