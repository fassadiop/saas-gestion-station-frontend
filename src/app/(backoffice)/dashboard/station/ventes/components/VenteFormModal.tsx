"use client";

import { useState } from "react";
import api from "@/lib/api";

const PRODUITS = ["Super", "Gasoil", "Petrole"];

export default function VenteFormModal({ open, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    produit: PRODUITS[0],
    volume: "",
    prix_unitaire: "",
  });

  const submit = async () => {
    await api.post("/station/ventes-carburant/", {
      produit: form.produit,
      volume: Number(form.volume),
      prix_unitaire: Number(form.prix_unitaire),
    });
    onSaved();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-semibold text-lg mb-4">
          Nouvelle vente carburant
        </h3>

        <div className="space-y-4">
          <select
            className="select select-bordered w-full"
            value={form.produit}
            onChange={(e) =>
              setForm({ ...form, produit: e.target.value })
            }
          >
            {PRODUITS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Volume (L)"
            className="input input-bordered w-full"
            value={form.volume}
            onChange={(e) =>
              setForm({ ...form, volume: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Prix unitaire"
            className="input input-bordered w-full"
            value={form.prix_unitaire}
            onChange={(e) =>
              setForm({ ...form, prix_unitaire: e.target.value })
            }
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-outline" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={submit}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
