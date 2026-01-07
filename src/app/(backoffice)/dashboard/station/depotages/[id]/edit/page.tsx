"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function DepotageEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["depotage", id],
    queryFn: async () =>
      (await api.get(`/station/depotages/${id}/`)).data,
  });

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async () =>
      api.patch(`/station/depotages/${id}/`, form),
    onSuccess: () =>
      router.push(`/dashboard/station/depotages/${id}`),
  });

  if (isLoading || !form) return <div>Chargement…</div>;

  if (form.statut !== "BROUILLON") {
    return <div>Ce dépotage ne peut plus être modifié.</div>;
  }

  const ecart =
    form.jauge_apres - form.jauge_avant - form.volume_livre;

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">
        Modifier dépotage
      </h1>

      <input
        type="number"
        className="input"
        value={form.volume_livre}
        onChange={(e) =>
          setForm({ ...form, volume_livre: Number(e.target.value) })
        }
      />

      <input
        type="number"
        className="input"
        value={form.montant_total}
        onChange={(e) =>
          setForm({ ...form, montant_total: Number(e.target.value) })
        }
      />

      <input
        type="number"
        className="input"
        value={form.jauge_avant}
        onChange={(e) =>
          setForm({ ...form, jauge_avant: Number(e.target.value) })
        }
      />

      <input
        type="number"
        className="input"
        value={form.jauge_apres}
        onChange={(e) =>
          setForm({ ...form, jauge_apres: Number(e.target.value) })
        }
      />

      <div className="text-sm">
        Écart jauge :{" "}
        <span
          className={
            Math.abs(ecart) > 50
              ? "text-red-600"
              : "text-green-600"
          }
        >
          {ecart} L
        </span>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => updateMutation.mutate()}
      >
        Enregistrer
      </button>
    </div>
  );
}
