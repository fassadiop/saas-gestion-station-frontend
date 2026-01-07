"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import TenantSwitcher from "@/components/TenantSwitcher";

export default function ProjetCreatePage() {
  useRequireAuth();

  const router = useRouter();
  const qc = useQueryClient();

  /* ---------------------------------------
     TOUS LES HOOKS D’ABORD
  --------------------------------------- */
  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const [nom, setNom] = useState("");
  const [objectif, setObjectif] = useState("");
  const [budget, setBudget] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [statut, setStatut] = useState("En_cours");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ---------------------------------------
     DERIVED DATA
  --------------------------------------- */
  const isSuper = me?.is_superuser === true;
  const tenantParam = isSuper
    ? selectedTenantId ?? null
    : me?.tenant?.id ?? null;

  /* ---------------------------------------
     MUTATION
  --------------------------------------- */
  const createMut = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/projets/", payload);
      return res.data;
    },
    onMutate: () => {
      setSubmitting(true);
      setErrorMsg(null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projets", tenantParam ?? "all"] });
      router.push("/dashboard/tenant/projets");
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
     RENDERS CONDITIONNELS
  --------------------------------------- */
  if (meLoading) return <div>Chargement utilisateur…</div>;
  if (meError || !me)
    return <div>Erreur lors de la récupération du profil utilisateur</div>;

  /* ---------------------------------------
     SUBMIT
  --------------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!nom.trim()) return setErrorMsg("Le nom du projet est requis.");

    const payload: any = {
      nom,
      objectif: objectif || undefined,
      budget: budget ? Number(budget) : undefined,
      statut,
      date_debut: dateDebut || undefined,
      date_fin: dateFin || undefined,
    };

    if (isSuper && selectedTenantId) {
      payload.tenant = selectedTenantId;
    }

    createMut.mutate(payload);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Nouveau projet</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSuper && (
          <div>
            <TenantSwitcher />
            <p className="text-xs text-gray-500 mt-1">
              Un projet doit être rattaché à un tenant.
            </p>
          </div>
        )}

        <div>
          <label className="font-medium block">Nom du projet</label>
          <input
            className="border w-full rounded p-2"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium block">Objectif</label>
          <textarea
            className="border w-full rounded p-2"
            rows={3}
            value={objectif}
            onChange={(e) => setObjectif(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium block">Budget</label>
          <input
            type="number"
            className="border w-full rounded p-2"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium block">Date début</label>
            <input
              type="date"
              className="border w-full rounded p-2"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
          </div>

          <div>
            <label className="font-medium block">Date fin</label>
            <input
              type="date"
              className="border w-full rounded p-2"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="font-medium block">Statut</label>
          <select
            className="border w-full rounded p-2"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
          >
            <option value="En_cours">En cours</option>
            <option value="Termine">Terminé</option>
            <option value="Annule">Annulé</option>
          </select>
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
