// src/app/(backoffice)/dashboard/station/relais/nouveau/page.tsx

"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function NouveauRelaisEquipePage() {
  useRequireAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    debut_relais: "",
    fin_relais: "",

    equipe_sortante: "",
    equipe_entrante: "",

    index_essence_debut: 0,
    index_essence_fin: 0,
    index_gasoil_debut: 0,
    index_gasoil_fin: 0,

    jauge_essence_debut: 0,
    jauge_essence_fin: 0,
    jauge_gasoil_debut: 0,
    jauge_gasoil_fin: 0,

    cash_essence: 0,
    ticket_essence: 0,
    ticket_gasoil: 0,
    carte_essence: 0,
  });

  /* =======================
     CALCULS AUTOMATIQUES
     ======================= */
  const volumeEssence =
    form.index_essence_debut - form.index_essence_fin;
  const volumeGasoil =
    form.index_gasoil_fin - form.index_gasoil_debut;

  const variationCuveEssence =
    form.jauge_essence_fin - form.jauge_essence_debut;
  const variationCuveGasoil =
    form.jauge_gasoil_fin - form.jauge_gasoil_debut;

  const totalEncaisse =
    (form.cash_essence || 0) +
    (form.ticket_essence || 0) +
    (form.carte_essence || 0) +
    (form.ticket_gasoil || 0);

  const submit = async () => {
    if (!form.debut_relais || !form.fin_relais) {
      alert("Veuillez renseigner les dates du relais");
      return;
    }

    if (form.index_essence_fin < form.index_essence_debut) {
      alert("Index essence invalide");
      return;
    }

    if (form.index_gasoil_fin < form.index_gasoil_debut) {
      alert("Index gasoil invalide");
      return;
    }

    await api.post("/station/relais-equipes/", {
      debut_relais: form.debut_relais,
      fin_relais: form.fin_relais,

      equipe_sortante: form.equipe_sortante,
      equipe_entrante: form.equipe_entrante,

      index_essence_debut: form.index_essence_debut,
      index_essence_fin: form.index_essence_fin,
      index_gasoil_debut: form.index_gasoil_debut,
      index_gasoil_fin: form.index_gasoil_fin,

      jauge_essence_debut: form.jauge_essence_debut,
      jauge_essence_fin: form.jauge_essence_fin,
      jauge_gasoil_debut: form.jauge_gasoil_debut,
      jauge_gasoil_fin: form.jauge_gasoil_fin,

      encaisse_liquide: form.cash_essence,
      encaisse_ticket_essence: form.ticket_essence,
      encaisse_ticket_gasoil: form.ticket_gasoil,
      encaisse_carte: form.carte_essence,

      total_encaisse: totalEncaisse,
    });

    alert("Relais enregistré (brouillon)");
    router.push("/dashboard/station/relais");
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Nouveau relais d’équipe
        </h1>

        <button
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition"
          onClick={() =>
            router.push("/dashboard/station/relais")
          }
        >
          Retour à la liste
        </button>
      </div>

      <div className="max-w-5xl space-y-8">
      <h1 className="text-xl font-semibold">
        Relais d’équipe – Station
      </h1>

      {/* =======================
          INFOS RELAIS
         ======================= */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="datetime-local"
            className="input input-bordered"
            onChange={(e) =>
              setForm({ ...form, debut_relais: e.target.value })
            }
          />

          <input
            type="datetime-local"
            className="input input-bordered"
            onChange={(e) =>
              setForm({ ...form, fin_relais: e.target.value })
            }
          />
        </div>
      </section>
      <section>  
        <h2 className="font-medium mb-2">Equipes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Équipe sortante"
            className="input input-bordered"
            onChange={(e) =>
              setForm({ ...form, equipe_sortante: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Équipe entrante"
            className="input input-bordered"
            onChange={(e) =>
              setForm({ ...form, equipe_entrante: e.target.value })
            }
          />
        </div>
      </section>

      {/* =======================
          INDEX COMPTEURS
         ======================= */}
      <section>
        <h2 className="font-medium mb-2">Index compteurs</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="number"
            placeholder="Index début Essence"
            onChange={(e) =>
              setForm({
                ...form,
                index_essence_debut: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Index fin Essence"
            onChange={(e) =>
              setForm({
                ...form,
                index_essence_fin: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Index début Gasoil"
            onChange={(e) =>
              setForm({
                ...form,
                index_gasoil_debut: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Index fin Gasoil"
            onChange={(e) =>
              setForm({
                ...form,
                index_gasoil_fin: Number(e.target.value),
              })
            }
          />
        </div>
      </section>

      {/* =======================
          CUVE
         ======================= */}
      <section>
        <h2 className="font-medium mb-2">Jauge cuves</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="number"
            placeholder="Cuve début Essence"
            onChange={(e) =>
              setForm({
                ...form,
                jauge_essence_debut: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Cuve fin Essence"
            onChange={(e) =>
              setForm({
                ...form,
                jauge_essence_fin: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Cuve début Gasoil"
            onChange={(e) =>
              setForm({
                ...form,
                jauge_gasoil_debut: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Cuve fin Gasoil"
            onChange={(e) =>
              setForm({
                ...form,
                jauge_gasoil_fin: Number(e.target.value),
              })
            }
          />
        </div>
      </section>

      {/* =======================
          ENCAISSEMENTS
         ======================= */}
      <section>
        <h2 className="font-medium mb-2">Encaissements Essence</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="number"
            placeholder="Cash"
            onChange={(e) =>
              setForm({
                ...form,
                cash_essence: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Carte"
            onChange={(e) =>
              setForm({
                ...form,
                carte_essence: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Tickets essence"
            onChange={(e) =>
              setForm({
                ...form,
                ticket_essence: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            placeholder="Tickets gasoil"
            onChange={(e) =>
              setForm({
                ...form,
                ticket_gasoil: Number(e.target.value),
              })
            }
          />

        </div>
      </section>

      {/* =======================
          ACTIONS
         ======================= */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition btn btn-outline">
          Annuler
        </button>

        <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition" onClick={submit}>
          Enregistrer (brouillon)
        </button>
      </div>
    </div>
    </div>
  );
}
