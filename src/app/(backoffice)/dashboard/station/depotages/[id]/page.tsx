"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";


export default function DepotageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["depotage", id],
    queryFn: async () =>
      (await api.get(`/station/depotages/${id}/`)).data,
  });

  const submitMutation = useMutation({
    mutationFn: async () =>
      api.post(`/station/depotages/${id}/soumettre/`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["depotage", id] }),
  });

  const confirmMutation = useMutation({
    mutationFn: async () =>
      api.post(`/station/depotages/${id}/confirmer/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depotage", id] });
      router.push("/dashboard/station/depotages");
    },
  });

  const transferMut = useMutation({
    mutationFn: async () =>
      (await api.post(`/station/depotages/${id}/transferer/`)).data,
    onSuccess: () => {
      // Rafraîchir le détail + la liste
      queryClient.invalidateQueries({ queryKey: ["depotage", id] });
      queryClient.invalidateQueries({ queryKey: ["depotages"] });
    },
  });

  if (isLoading) return <div>Chargement…</div>;
  if (!data) return <div>Dépotage introuvable.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">
        Dépotage – {data.produit}
      </h1>

      <div className="bg-white rounded shadow p-4 space-y-2">
        <p><strong>Date :</strong> {new Date(data.date_depotage).toLocaleString()}</p>
        <p><strong>Produit :</strong> {data.produit}</p>
        <p><strong>Volume livré :</strong> {data.volume_livre} L</p>
        <p><strong>Montant :</strong> {data.montant_total.toLocaleString()} F</p>
        <p><strong>Fournisseur :</strong> {data.fournisseur || "—"}</p>
        <p><strong>Bon :</strong> {data.reference_bon || "—"}</p>
        <p><strong>Jauge avant :</strong> {data.jauge_avant}</p>
        <p><strong>Jauge après :</strong> {data.jauge_apres}</p>

        {data.ecart_jauge !== null && (
          <p>
            <strong>Écart jauge :</strong>{" "}
            <span
              className={
                Math.abs(data.ecart_jauge) > 50
                  ? "text-red-600"
                  : "text-green-600"
              }
            >
              {data.ecart_jauge} L
            </span>
          </p>
        )}

        <p>
          <strong>Statut :</strong>{" "}
          <span className="font-medium">{data.statut}</span>
        </p>
      </div>

      <div className="flex gap-3">
      {data.statut === "BROUILLON" &&
        (user?.role === "GERANT" || user?.role === "SUPERVISEUR") && (
          <>
            <button
              className="btn btn-outline"
              onClick={() =>
                router.push(`/dashboard/station/depotages/${id}/edit`)
              }
            >
              Modifier
            </button>

            <button
              className="btn btn-primary"
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
            >
              Soumettre
            </button>
          </>
        )}
      <div className="flex gap-3"></div>
        {data.statut === "SOUMIS" &&
          (user?.role === "GERANT" || user?.role === "SUPERVISEUR") && (
            <button
              className="btn btn-success"
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
            >
              Confirmer
            </button>
          )}

        {data.statut === "CONFIRME" &&
          (user?.role === "GERANT" || user?.role === "SUPERVISEUR") && (
            <button
              onClick={() => transferMut.mutate()}
              disabled={transferMut.isPending}
              className="btn btn-warning"
            >
              {transferMut.isPending
                ? "Transfert en cours…"
                : "Transférer"}
            </button>
          )}
      </div>
    </div>
  );
}
