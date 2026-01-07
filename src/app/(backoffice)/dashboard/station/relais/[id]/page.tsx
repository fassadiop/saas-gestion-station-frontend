"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import api from "@/lib/api";
import RelaisStatusBadge from "../../components/station/RelaisStatusBadge";
import { useAuth } from "@/context/AuthProvider";
import { Role } from "@/types/user";

/* =========================
   TYPES
========================= */

type RelaisForm = {
  debut_relais: string;
  fin_relais: string;

  equipe_sortante: string;
  equipe_entrante: string;

  index_essence_debut: number | null;
  index_essence_fin: number | null;
  index_gasoil_debut: number | null;
  index_gasoil_fin: number | null;

  jauge_essence_debut: number | null;
  jauge_essence_fin: number | null;
  jauge_gasoil_debut: number | null;
  jauge_gasoil_fin: number | null;

  encaisse_liquide: number;
  encaisse_carte: number;
  encaisse_ticket_essence: number;
  encaisse_ticket_gasoil: number;
};

/* =========================
   HELPERS
========================= */

const toNumberOrNull = (value: any): number | null =>
  value === null || value === undefined ? null : Number(value);

const toNumber = (value: any): number =>
  value === null || value === undefined ? 0 : Number(value);

/* =========================
   MAPPING API → FORM
========================= */

function mapRelaisToForm(r: any): RelaisForm {
  return {
    debut_relais: r.debut_relais ? r.debut_relais.slice(0, 16) : "",
    fin_relais: r.fin_relais ? r.fin_relais.slice(0, 16) : "",

    equipe_sortante: r.equipe_sortante ?? "",
    equipe_entrante: r.equipe_entrante ?? "",

    index_essence_debut: toNumberOrNull(r.index_essence_debut),
    index_essence_fin: toNumberOrNull(r.index_essence_fin),

    index_gasoil_debut: toNumberOrNull(r.index_gasoil_debut),
    index_gasoil_fin: toNumberOrNull(r.index_gasoil_fin),

    jauge_essence_debut: toNumberOrNull(r.jauge_essence_debut),
    jauge_essence_fin: toNumberOrNull(r.jauge_essence_fin),

    jauge_gasoil_debut: toNumberOrNull(r.jauge_gasoil_debut),
    jauge_gasoil_fin: toNumberOrNull(r.jauge_gasoil_fin),

    encaisse_liquide: toNumber(r.encaisse_liquide),
    encaisse_carte: toNumber(r.encaisse_carte),
    encaisse_ticket_essence: toNumber(r.encaisse_ticket_essence),
    encaisse_ticket_gasoil: toNumber(r.encaisse_ticket_gasoil),
  };
}

/* =========================
   PAGE
========================= */

export default function RelaisDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<RelaisForm | null>(null);

  /* =========================
     QUERY
  ========================= */

  const { data: relais, isLoading } = useQuery({
    queryKey: ["relais-detail", id],
    queryFn: async () => {
      const res = await api.get(`/station/relais-equipes/${id}/`);
      return res.data;
    },
  });

  /* =========================
     MUTATIONS
  ========================= */

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!form) throw new Error("Formulaire non initialisé");
      return api.put(`/station/relais-equipes/${id}/`, form);
    },
    onSuccess: () => {
      alert("Relais mis à jour");
      router.refresh();
    },
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      api.post(`/station/relais-equipes/${id}/soumettre/`),
    onSuccess: () => router.refresh(),
  });

  const validateMutation = useMutation({
    mutationFn: () =>
      api.post(`/station/relais-equipes/${id}/valider/`),
    onSuccess: () => router.refresh(),
  });

  /* =========================
     EFFECT
  ========================= */

  useEffect(() => {
    if (relais) {
      setForm(mapRelaisToForm(relais));
    }
  }, [relais]);

  /* =========================
     GUARDS
  ========================= */

  if (isLoading) return <div>Chargement du relais…</div>;
  if (!relais || !form) return <div>Relais introuvable</div>;

  /* =========================
     DROITS
  ========================= */

  const isEditable = relais.status === "BROUILLON";

  const STAFF_CAN_SUBMIT: Role[] = ["POMPISTE", "SUPERVISEUR"];

  const canSubmit =
    relais.status === "BROUILLON" &&
    user !== null &&
    STAFF_CAN_SUBMIT.includes(user.role);

  const canValidate =
    relais.status === "SOUMIS" &&
    user?.role === "SUPERVISEUR";

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="max-w-4xl space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Relais #{relais.id}
        </h1>
        <RelaisStatusBadge status={relais.status} />
      </div>

      {/* ================= FORM ================= */}
      {isEditable && (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">

          <h2 className="font-semibold text-lg">
            Modification du relais
          </h2>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={form.debut_relais}
              onChange={e =>
                setForm({ ...form, debut_relais: e.target.value })
              }
            />
            <input
              type="datetime-local"
              value={form.fin_relais}
              onChange={e =>
                setForm({ ...form, fin_relais: e.target.value })
              }
            />
          </div>

          {/* ÉQUIPES */}
          <div className="grid grid-cols-2 gap-4">
            <input
              value={form.equipe_sortante}
              onChange={e =>
                setForm({ ...form, equipe_sortante: e.target.value })
              }
              placeholder="Équipe sortante"
            />
            <input
              value={form.equipe_entrante}
              onChange={e =>
                setForm({ ...form, equipe_entrante: e.target.value })
              }
              placeholder="Équipe entrante"
            />
          </div>

          {/* INDEX */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={form.index_essence_debut ?? ""}
              onChange={e =>
                setForm({
                  ...form,
                  index_essence_debut:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder="Index essence début"
            />
            <input
              type="number"
              value={form.index_essence_fin ?? ""}
              onChange={e =>
                setForm({
                  ...form,
                  index_essence_fin:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder="Index essence fin"
            />
          </div>

          {/* JAUAGES */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={form.jauge_essence_debut ?? ""}
              onChange={e =>
                setForm({
                  ...form,
                  jauge_essence_debut:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder="Jauge début essence"
            />
            <input
              type="number"
              value={form.jauge_essence_fin ?? ""}
              onChange={e =>
                setForm({
                  ...form,
                  jauge_essence_fin:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder="Jauge fin essence"
            />
          </div>

          {/* ENCAISSEMENTS */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={form.encaisse_liquide}
              onChange={e =>
                setForm({
                  ...form,
                  encaisse_liquide: Number(e.target.value),
                })
              }
              placeholder="Encaisse liquide"
            />
            <input
              type="number"
              value={form.encaisse_carte}
              onChange={e =>
                setForm({
                  ...form,
                  encaisse_carte: Number(e.target.value),
                })
              }
              placeholder="Encaisse carte"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={form.encaisse_ticket_essence}
              onChange={e =>
                setForm({
                  ...form,
                  encaisse_ticket_essence: Number(e.target.value),
                })
              }
              placeholder="Ticket essence"
            />
            <input
              type="number"
              value={form.encaisse_ticket_gasoil}
              onChange={e =>
                setForm({
                  ...form,
                  encaisse_ticket_gasoil: Number(e.target.value),
                })
              }
              placeholder="Ticket gasoil"
            />
          </div>
        </div>
      )}

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3">
        {isEditable && (
          <button
            className="btn btn-primary"
            onClick={() => updateMutation.mutate()}
          >
            Enregistrer
          </button>
        )}

        {canSubmit && (
          <button
            className="btn btn-primary"
            onClick={() => submitMutation.mutate()}
          >
            Soumettre
          </button>
        )}

        {canValidate && (
          <button
            className="btn btn-success"
            onClick={() => validateMutation.mutate()}
          >
            Valider
          </button>
        )}

        <button
          className="btn btn-outline"
          onClick={() => router.back()}
        >
          Retour
        </button>
      </div>
    </div>
  );
}
