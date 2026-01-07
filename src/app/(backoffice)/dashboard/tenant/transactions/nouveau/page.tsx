"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { extractResults } from "@/lib/fetchHelpers";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import TenantSwitcher from "@/components/TenantSwitcher";

type Projet = { id: string | number; nom?: string };

export default function TransactionCreatePage() {
  useRequireAuth();

  const router = useRouter();
  const qc = useQueryClient();

  /* ---------------------------------------
     TOUS LES HOOKS D’ABORD (OBLIGATOIRE)
  --------------------------------------- */
  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const [projetId, setProjetId] = useState("");
  const [typeTx, setTypeTx] = useState<"Recette" | "Depense" | "">("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [categorie, setCategorie] = useState("");
  const [modePaiement, setModePaiement] = useState("");
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ---------------------------------------
     DERIVED DATA (PAS DE HOOKS)
  --------------------------------------- */
  const isSuper = me?.is_superuser === true;
  const tenantParam = isSuper
    ? selectedTenantId ?? null
    : me?.tenant?.id ?? null;

  /* ---------------------------------------
     FETCH PROJETS
  --------------------------------------- */
  const { data: projets = [], isLoading: projetsLoading } = useQuery<Projet[]>({
    queryKey: ["projets", tenantParam ?? "all"],
    queryFn: async () => {
      const qs = tenantParam
        ? `?tenant=${tenantParam}&page_size=200`
        : "?page_size=200";
      const res = await api.get(`/projets/${qs}`);
      return extractResults<Projet>(res);
    },
    enabled: tenantParam !== undefined,
  });

  /* ---------------------------------------
     MUTATION
  --------------------------------------- */
  const createMut = useMutation({
    mutationFn: async (form: FormData) => {
      const res = await api.post("/transactions/", form);
      return res.data;
    },
    onMutate: () => {
      setSubmitting(true);
      setErrorMsg(null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      router.push("/dashboard/tenant/transactions");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        err?.message ||
        "Erreur lors de l’enregistrement";
      setErrorMsg(String(msg));
    },
    onSettled: () => setSubmitting(false),
  });

  /* ---------------------------------------
     RENDERS CONDITIONNELS (APRÈS HOOKS)
  --------------------------------------- */
  if (meLoading) return <div>Chargement utilisateur…</div>;
  if (meError || !me) return <div>Erreur chargement utilisateur</div>;

  /* ---------------------------------------
     SUBMIT
  --------------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!typeTx) return setErrorMsg("Type requis.");
    if (!montant || isNaN(Number(montant)))
      return setErrorMsg("Montant invalide.");
    if (!categorie) return setErrorMsg("Catégorie requise.");

    const fd = new FormData();
    if (projetId) fd.append("projet", projetId);
    fd.append("type", typeTx);
    fd.append("montant", montant);
    fd.append("date", date);
    fd.append("categorie", categorie);
    if (modePaiement) fd.append("mode_paiement", modePaiement);
    if (reference) fd.append("reference", reference);
    if (file) fd.append("fichier_recu", file);

    if (isSuper && selectedTenantId) {
      fd.append("tenant", selectedTenantId);
    }

    createMut.mutate(fd);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Nouvelle transaction</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSuper && <TenantSwitcher />}

        <div>
          <label className="block font-medium">Projet (optionnel)</label>
          <select
            className="border rounded p-2 w-full"
            value={projetId}
            disabled={projetsLoading}
            onChange={(e) => setProjetId(e.target.value)}
          >
            <option value="">-- Aucun --</option>
            {projets.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.nom ?? p.id}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Type</label>
            <select
              className="border rounded p-2 w-full"
              value={typeTx}
              onChange={(e) => setTypeTx(e.target.value as any)}
            >
              <option value="">-- choisir --</option>
              <option value="Recette">Recette</option>
              <option value="Depense">Dépense</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Montant</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Date</label>
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Catégorie</label>
          <input
            className="border rounded p-2 w-full"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Mode de paiement</label>
            <input
              className="border rounded p-2 w-full"
              value={modePaiement}
              onChange={(e) => setModePaiement(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium">Référence</label>
            <input
              className="border rounded p-2 w-full"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Fichier reçu</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && <div className="text-xs text-gray-600">{file.name}</div>}
        </div>

        {errorMsg && <div className="text-red-600">{errorMsg}</div>}

        <button
          className="bg-primary text-white px-4 py-2 rounded"
          disabled={submitting}
        >
          {submitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
