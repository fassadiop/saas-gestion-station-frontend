// src/app/(backoffice)/dashboard/station/depotages/nouveau/page.tsx

"use client";

import { useState, useMemo } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NouveauDepotagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    produit: "ESSENCE",
    fournisseur: "",
    date_depotage: "",
    quantite_commandee: "",
    quantite_livree: "",
    quantite_acceptee: "",
    jauge_avant: "",
    jauge_apres: "",
    prix_unitaire: "",
    bon_livraison_numero: "",
  });

  /** =========================
   * CALCULS MÉTIER (READ-ONLY)
   * ========================= */
  const variation_cuve = useMemo(() => {
    const avant = Number(form.jauge_avant);
    const apres = Number(form.jauge_apres);
    return apres - avant || 0;
  }, [form.jauge_avant, form.jauge_apres]);

  const montant_total = useMemo(() => {
    const qte = Number(form.quantite_acceptee);
    const prix = Number(form.prix_unitaire);
    return qte * prix || 0;
  }, [form.quantite_acceptee, form.prix_unitaire]);

  /** =========================
   * SUBMIT
   * ========================= */
  // const submit = async () => {
  //   try {
  //     setLoading(true);

  //     const payload = {
  //       produit: form.produit,
  //       fournisseur: form.fournisseur,
  //       date_depotage: form.date_depotage,

  //       quantite_commandee: form.quantite_commandee
  //         ? Number(form.quantite_commandee)
  //         : null,

  //       quantite_livree: Number(form.quantite_livree),
  //       quantite_acceptee: Number(form.quantite_acceptee),

  //       jauge_avant: Number(form.jauge_avant),
  //       jauge_apres: Number(form.jauge_apres),

  //       variation_cuve: Number(variation_cuve),

  //       prix_unitaire: Number(form.prix_unitaire),
  //       montant_total: Number(montant_total),

  //       bon_livraison_numero:
  //         form.bon_livraison_numero || null,
  //     };

  //     const res = await api.post(
  //       "/station/depotages/",
  //       payload
  //     );

  //     router.push(
  //       `/dashboard/station/depotages/${res.data.id}`
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const submit = async () => {
  try {
    setLoading(true);

    const payload = {
        produit: form.produit,
        fournisseur: form.fournisseur,
        date_depotage: form.date_depotage,

        quantite_commandee: form.quantite_commandee
          ? Number(form.quantite_commandee)
          : null,

        quantite_livree: Number(form.quantite_livree),
        quantite_acceptee: Number(form.quantite_acceptee),

        jauge_avant: Number(form.jauge_avant),
        jauge_apres: Number(form.jauge_apres),

        variation_cuve: Number(variation_cuve),

        prix_unitaire: Number(form.prix_unitaire),
        montant_total: Number(montant_total),

        bon_livraison_numero:
          form.bon_livraison_numero || null,
      };


    const res = await api.post(
      "/station/depotages/",
      payload
    );

    router.push(
      `/dashboard/station/depotages/${res.data.id}`
    );
  } catch (err: any) {
    console.error("ERREUR BACKEND :", err.response?.data);
    alert(
      "Erreur backend:\n" +
        JSON.stringify(err.response?.data, null, 2)
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-xl font-semibold">
        Nouveau dépotage carburant
      </h1>

      {/* =========================
          CONTEXTE
         ========================= */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="font-medium">
          Informations générales
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Produit</label>
            <select
              className="select w-full"
              value={form.produit}
              onChange={(e) =>
                setForm({
                  ...form,
                  produit: e.target.value,
                })
              }
            >
              <option value="ESSENCE">Essence</option>
              <option value="GASOIL">Gasoil</option>
            </select>
          </div>

          <div>
            <label className="label">Fournisseur</label>
            <input
              className="input w-full"
              value={form.fournisseur}
              onChange={(e) =>
                setForm({
                  ...form,
                  fournisseur: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="label">
              Date de dépotage
            </label>
            <input
              type="datetime-local"
              className="input w-full"
              value={form.date_depotage}
              onChange={(e) =>
                setForm({
                  ...form,
                  date_depotage: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* =========================
          LIVRAISON
         ========================= */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="font-medium">
          Livraison
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            className="input"
            placeholder="Quantité commandée (optionnel)"
            value={form.quantite_commandee}
            onChange={(e) =>
              setForm({
                ...form,
                quantite_commandee: e.target.value,
              })
            }
          />
          <input
            className="input"
            placeholder="Quantité livrée"
            value={form.quantite_livree}
            onChange={(e) =>
              setForm({
                ...form,
                quantite_livree: e.target.value,
              })
            }
          />
          <input
            className="input"
            placeholder="Quantité acceptée"
            value={form.quantite_acceptee}
            onChange={(e) =>
              setForm({
                ...form,
                quantite_acceptee: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* =========================
          CUVE
         ========================= */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="font-medium">
          Relevés cuve
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            className="input"
            placeholder="Jauge avant"
            value={form.jauge_avant}
            onChange={(e) =>
              setForm({
                ...form,
                jauge_avant: e.target.value,
              })
            }
          />
          <input
            className="input"
            placeholder="Jauge après"
            value={form.jauge_apres}
            onChange={(e) =>
              setForm({
                ...form,
                jauge_apres: e.target.value,
              })
            }
          />
          <input
            className="input bg-gray-100"
            readOnly
            value={`Variation : ${variation_cuve} L`}
          />
        </div>
      </div>

      {/* =========================
          FINANCES
         ========================= */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="font-medium">
          Finances
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            className="input"
            placeholder="Prix unitaire"
            value={form.prix_unitaire}
            onChange={(e) =>
              setForm({
                ...form,
                prix_unitaire: e.target.value,
              })
            }
          />
          <input
            className="input bg-gray-100"
            readOnly
            value={`Montant total : ${montant_total}`}
          />
        </div>
      </div>

      {/* =========================
          JUSTIFICATIFS
         ========================= */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="font-medium">
          Justificatifs
        </h2>

        <input
          className="input"
          placeholder="Numéro du bon de livraison"
          value={form.bon_livraison_numero}
          onChange={(e) =>
            setForm({
              ...form,
              bon_livraison_numero: e.target.value,
            })
          }
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() =>
            router.push("/dashboard/station/depotages")
          }
        >
          Annuler
        </button>

        <button
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition"
          disabled={loading}
          onClick={submit}
        >
          {loading
            ? "Enregistrement…"
            : "Enregistrer (brouillon)"}
        </button>
      </div>
    </div>
  );
}
