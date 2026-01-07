"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useRequireAuth from "@/hooks/useRequireAuth";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

export default function EditAdminTenantPasswordClient({ id }: { id: string }) {
  useRequireAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: me } = useCurrentUser();

  // Charger l’utilisateur (sans loader)
  const { data: user } = useQuery({
    queryKey: ["admin-tenant", id],
    queryFn: async () => (await api.get(`/utilisateurs/${id}/`)).data,
  });

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // Mutation : changement de mot de passe
  const mut = useMutation({
    mutationFn: (payload: { password: string }) =>
      api.post(`/utilisateurs/${id}/change-password/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tenant", id] });
      qc.invalidateQueries({ queryKey: ["admin-tenants"] });
      alert("Mot de passe mis à jour avec succès !");
      router.push("/admin-tenants");
    },
    onError: () => {
      alert("Erreur lors du changement de mot de passe.");
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    mut.mutate({ password });
  };

  // UI sans loader — le rendu s’adapte dès que user arrive
  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">
        Modifier mot de passe {user ? `— ${user.username}` : ""}
      </h1>

      <div>
        <label className="block text-sm mb-1">Nouveau mot de passe</label>
        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Entrer le mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Confirmer mot de passe</label>
        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Confirmer"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Enregistrer
      </button>

      <button
        type="button"
        onClick={() => router.push("/admin-tenants")}
        className="px-4 py-2 border rounded ml-2"
      >
        Annuler
      </button>
    </form>
  );
}
