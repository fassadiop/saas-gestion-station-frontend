"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

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

  status: "BROUILLON" | "SOUMIS" | "TRANSFERE";
};

/* =========================
   HELPERS
========================= */

const toNumberOrNull = (v: any): number | null =>
  v === null || v === undefined ? null : Number(v);

const toNumber = (v: any): number =>
  v === null || v === undefined ? 0 : Number(v);

const mapApiToForm = (r: any): RelaisForm => ({
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

  status: r.status,
});

/* =========================
   PAGE
========================= */

export default function EditRelaisPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<RelaisForm | null>(null);

  /* ===== QUERY ===== */
  const { data, isLoading } = useQuery({
      queryKey: ["relais-edit", id],
      queryFn: () =>
        api.get(`/station/relais-equipes/${id}/`).then(res => res.data),
    });

  /* ===== EFFECT ===== */
  useEffect(() => {
    if (data) setForm(mapApiToForm(data));
  }, [data]);

  /* ===== MUTATIONS (TOUJOURS AVANT LES GUARDS) ===== */
const updateMutation = useMutation({
    mutationFn: () =>
      api.patch(`/station/relais-equipes/${id}/`, form),
    onSuccess: () => {
      alert("Modifications enregistrées");
      router.refresh();
    },
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      api.post(`/station/relais-equipes/${id}/soumettre/`),
    onSuccess: () => {
      alert("Relais soumis");
      router.refresh();
    },
  });

  const validateMutation = useMutation({
    mutationFn: () =>
      api.post(`/station/relais-equipes/${id}/valider/`),
    onSuccess: () => {
      alert("Relais validé et transféré");
      router.refresh();
    },
  });


  /* ===== RULES ===== */
  const isEditable = form?.status === "BROUILLON";

  const canSubmit =
    form?.status === "BROUILLON" &&
    user !== null &&
    ["POMPISTE", "SUPERVISEUR"].includes(user.role);

  const canValidate =
    form?.status === "SOUMIS" &&
    user !== null &&
    user.role === "SUPERVISEUR";

  /* ===== GUARDS (APRÈS TOUS LES HOOKS) ===== */
  if (isLoading || !form) {
    return <div>Chargement…</div>;
  }

  if (form.status !== "BROUILLON" && !canValidate) {
    return (
      <div className="text-red-600">
        Ce relais ne peut plus être modifié.
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-xl font-semibold">
        Modifier le relais
      </h1>

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
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          value={form.index_gasoil_debut ?? ""}
          onChange={e =>
            setForm({
              ...form,
              index_gasoil_debut:
                e.target.value === "" ? null : Number(e.target.value),
            })
          }
          placeholder="Index gasoil début"
        />
        <input
          type="number"
          value={form.index_gasoil_fin ?? ""}
          onChange={e =>
            setForm({
              ...form,
              index_gasoil_fin:
                e.target.value === "" ? null : Number(e.target.value),
            })
          }
          placeholder="Index gasoil fin"
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
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          value={form.jauge_gasoil_debut ?? ""}
          onChange={e =>
            setForm({
              ...form,
              jauge_gasoil_debut:
                e.target.value === "" ? null : Number(e.target.value),
            })
          }
          placeholder="Jauge début gasoil"
        />
        <input
          type="number"
          value={form.jauge_gasoil_fin ?? ""}
          onChange={e =>
            setForm({
              ...form,
              jauge_gasoil_fin:
                e.target.value === "" ? null : Number(e.target.value),
            })
          }
          placeholder="Jauge fin gasoil"
        />
      </div>

      {/* ENCAISSEMENTS */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          value={form.encaisse_liquide}
          onChange={e =>
            setForm({ ...form, encaisse_liquide: Number(e.target.value) })
          }
          placeholder="Encaisse liquide"
        />
        <input
          type="number"
          value={form.encaisse_carte}
          onChange={e =>
            setForm({ ...form, encaisse_carte: Number(e.target.value) })
          }
          placeholder="Encaisse carte"
        />
        <input
          type="number"
          value={form.encaisse_ticket_essence}
          onChange={e =>
            setForm({ ...form, encaisse_ticket_essence: Number(e.target.value) })
          }
          placeholder="Encaisse ticket essence"
        />
        <input
          type="number"
          value={form.encaisse_ticket_gasoil}
          onChange={e =>
            setForm({ ...form, encaisse_ticket_gasoil: Number(e.target.value) })
          }
          placeholder="Encaisse ticket gasoil"
        />
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end gap-3">
        <button className="btn btn-outline" onClick={() => router.back()}>
          Annuler
        </button>

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
            className="btn btn-warning"
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
      </div>
    </div>
  );
}
