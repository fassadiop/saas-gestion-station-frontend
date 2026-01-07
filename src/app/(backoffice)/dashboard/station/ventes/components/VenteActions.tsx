"use client";

import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Vente = {
  id: number;
  status: string;
};

type Props = {
  vente: Vente;
  role?: string;
};

export default function VenteActions({ vente, role }: Props) {
  const qc = useQueryClient();

  const submitMut = useMutation({
    mutationFn: () =>
      api.post(`/station/ventes-carburant/${vente.id}/soumettre/`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["station-ventes"] }),
  });

  const validateMut = useMutation({
    mutationFn: () =>
      api.post(`/station/ventes-carburant/${vente.id}/valider/`),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["station-ventes"] }),
  });

  // 🟡 BROUILLON → SOUMIS
  if (
    vente.status === "BROUILLON" &&
    (role === "Pompiste" || role === "Superviseur")
  ) {
    return (
      <button
        className="btn btn-xs btn-outline btn-info"
        onClick={() => submitMut.mutate()}
      >
        Soumettre
      </button>
    );
  }

  // 🟠 SOUMIS → TRANSFERE
  if (vente.status === "SOUMIS" && role === "Superviseur") {
    return (
      <button
        className="btn btn-xs btn-outline btn-success"
        onClick={() => validateMut.mutate()}
      >
        Valider
      </button>
    );
  }

  return <span className="text-xs text-gray-400">—</span>;
}
