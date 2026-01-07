"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import TenantSwitcher from "@/components/TenantSwitcher";
import { extractResults } from "@/lib/fetchHelpers";

type Membre = { id: string | number; nom_membre?: string; nom?: string };

export default function CotisationCreatePage() {
  useRequireAuth();

  const router = useRouter();
  const qc = useQueryClient();

  /* ---------------------------------------
     TOUS LES HOOKS D’ABORD
  --------------------------------------- */
  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const [membreId, setMembreId] = useState("");
  const [montant, setMontant] = useState("");
  const [datePaiement, setDatePaiement] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [periode, setPeriode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ---------------------------------------
     DERIVED DATA (sans hooks)
  --------------------------------------- */
  const isSuper = me?.is_superuser === true;
  const tenantParam = isSuper
    ? selectedTenantId ?? null
    : me?.tenant?.id ?? null;

  /* ---------------------------------------
     FETCH MEMBRES
  --------------------------------------- */
  const {
    data: membres = [],
    isLoading: membresLoading,
    error: membresError,
  } = useQuery<Membre[]>({
    queryKey: ["membres", tenantParam ?? "all"],
    queryFn: async () => {
      const qs = tenantParam
        ? `?tenant=${tenantParam}&page_size=200`
        : "?page_size=200";
      const res = await api.get(`/membres/${qs}`);
      return extractResults<Membre>(res);
    },
    enabled: tenantParam !== undefined,
  });

  /* ---------------------------------------
     MUTATION
  --------------------------------------- */
  const createMut = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/cotisations/", payload);
      return res.data;
    },
    onMutate: () => {
      setSubmitting(true);
      setErrorMsg(null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cotisations"] });
      qc.invalidateQueries({ queryKey: ["membres"] });
      router.push("/dashboard/tenant/cotisations");
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

    if (!membreId) return setErrorMsg("Le membre est requis.");
    if (!montant || isNaN(Number(montant)))
      return setErrorMsg("Montant invalide.");

    const payload: any = {
      membre: membreId,
      montant: Number(montant),
      date_paiement: datePaiement,
      periode: periode || undefined,
    };

    if (isSuper && selectedTenantId) {
      payload.tenant = selectedTenantId;
    }

    createMut.mutate(payload);
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Nouvelle cotisation</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSuper && (
          <div>
            <TenantSwitcher />
            <p className="text-xs text-gray-500 mt-1">
              Sélectionnez un tenant pour appliquer la cotisation.
            </p>
          </div>
        )}

        <div>
          <label className="block font-medium">Membre</label>
          <select
            className="border p-2 rounded w-full"
            value={membreId}
            disabled={membresLoading}
            onChange={(e) => setMembreId(e.target.value)}
          >
            <option value="">-- choisir --</option>
            {membres.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.nom_membre ?? m.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Montant (XOF)</label>
          <input
            className="border p-2 rounded w-full"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Date de paiement</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={datePaiement}
            onChange={(e) => setDatePaiement(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Période (optionnel)</label>
          <input
            className="border p-2 rounded w-full"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          />
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
