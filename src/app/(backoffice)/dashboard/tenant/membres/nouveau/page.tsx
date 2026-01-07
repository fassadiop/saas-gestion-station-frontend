"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import useSelectedTenant from "@/hooks/useSelectedTenant";
import TenantSwitcher from "@/components/TenantSwitcher";

export default function MembreCreatePage() {
  useRequireAuth();

  const router = useRouter();
  const qc = useQueryClient();

  /* ---------------------------------------
     TOUS LES HOOKS D’ABORD
  --------------------------------------- */
  const { data: me, isLoading: meLoading, isError: meError } = useCurrentUser();
  const { selectedTenantId } = useSelectedTenant();

  const [nom, setNom] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [statut, setStatut] = useState("Actif");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ---------------------------------------
     MUTATION
  --------------------------------------- */
  const createMut = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/membres/", payload);
      return res.data;
    },
    onMutate: () => {
      setSubmitting(true);
      setErrorMsg(null);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["membres", "tenant", me?.tenant?.id ?? "all"],
      });
      router.push("/dashboard/tenant/membres");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        err?.message ||
        "Erreur lors de la création du membre";
      setErrorMsg(String(msg));
    },
    onSettled: () => setSubmitting(false),
  });

  /* ---------------------------------------
     MAINTENANT SEULEMENT : RENDERS CONDITIONNELS
  --------------------------------------- */
  if (meLoading) return <div>Chargement utilisateur…</div>;
  if (meError || !me)
    return <div>Erreur lors de la récupération du profil utilisateur</div>;

  const isSuper = me.is_superuser === true;
  const tenantParam = isSuper
    ? selectedTenantId ?? null
    : me.tenant?.id ?? null;

  /* ---------------------------------------
     SUBMIT
  --------------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!nom.trim()) {
      setErrorMsg("Le nom du membre est requis.");
      return;
    }

    const payload: any = {
      nom_membre: nom.trim(),
      contact: contact || undefined,
      email: email || undefined,
      telephone: telephone || undefined,
      statut,
    };

    if (isSuper && tenantParam) {
      payload.tenant = tenantParam;
    }

    createMut.mutate(payload);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Nouveau membre</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isSuper && (
          <div>
            <TenantSwitcher />
            <p className="text-xs text-gray-500 mt-1">
              Sélectionnez une organisation avant de créer le membre.
            </p>
          </div>
        )}

        <div>
          <label className="font-medium block">Nom du membre</label>
          <input
            className="border w-full rounded p-2"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium block">Contact</label>
          <input
            className="border w-full rounded p-2"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium block">Email</label>
          <input
            className="border w-full rounded p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium block">Téléphone</label>
          <input
            className="border w-full rounded p-2"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium block">Statut</label>
          <select
            className="border w-full rounded p-2"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
          >
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
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
