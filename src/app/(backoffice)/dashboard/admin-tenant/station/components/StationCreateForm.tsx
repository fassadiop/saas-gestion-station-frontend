"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

/* -------------------------------------------------
   Référentiel officiel Région → Départements
--------------------------------------------------*/
const REGIONS_DEPARTEMENTS: Record<string, string[]> = {
  Dakar: ["Dakar", "Guédiawaye", "Keur Massar", "Pikine", "Rufisque"],
  Thiès: ["Thiès", "Mbour", "Tivaouane"],
  Diourbel: ["Diourbel", "Bambey", "Mbacké"],
  Fatick: ["Fatick", "Foundiougne", "Gossas"],
  Kaolack: ["Kaolack", "Nioro du Rip"],
  Kaffrine: ["Kaffrine", "Birkelane", "Koungheul", "Malem Hodar"],
  Tambacounda: ["Tambacounda", "Bakel", "Goudiry", "Vélingara"],
  Kédougou: ["Kédougou", "Salémata", "Saraya"],
  Sédhiou: ["Sédhiou", "Bignona", "Goudomp"],
  Kolda: ["Kolda", "Médina Yoro Foulah", "Vélingara"],
  Ziguinchor: ["Ziguinchor", "Bignona", "Oussouye"],
  Louga: ["Louga", "Linguère", "Kébémer"],
  Matam: ["Matam", "Kanel", "Ranérou-Ferlo"],
  "Saint-Louis": ["Saint-Louis", "Dagana", "Podor"],
};

type StationFormState = {
  nom: string;
  region: string;
  departement: string;
  adresse: string;
  telephone: string;
  responsable: string;
  gerant: {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

export default function StationCreateForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<StationFormState>({
    nom: "",
    region: "",
    departement: "",
    adresse: "",
    telephone: "",
    responsable: "",
    gerant: {
      username: "",
      password: "",
      email: "",
      first_name: "",
      last_name: "",
    },
  });

  /* -------------------------------------------------
     Validation minimale frontend (cohérente backend)
  --------------------------------------------------*/
  const validateForm = (): string | null => {
    if (!form.nom.trim()) return "Nom de station requis";
    if (!form.region) return "Région requise";
    if (!form.departement) return "Département requis";
    if (!form.telephone.trim()) return "Téléphone requis";

    if (!form.gerant.username.trim())
      return "Nom d’utilisateur du gérant requis";

    if (!form.gerant.password.trim())
      return "Mot de passe du gérant requis";

    return null;
  };

  /* -------------------------------------------------
     Soumission
  --------------------------------------------------*/
  const submit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/station/stations/", form);
      router.push("/dashboard/admin-tenant/station");
    } catch (err: any) {
      const data = err?.response?.data;

      if (typeof data === "string") {
        setError(data);
      } else if (data?.gerant) {
        setError("Erreur sur les informations du gérant");
      } else if (data?.region || data?.departement) {
        setError("Erreur sur la localisation (région / département)");
      } else {
        setError("Erreur lors de la création de la station");
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------
     RENDER
  --------------------------------------------------*/
  return (
    <div className="bg-white rounded-lg border p-6 space-y-8">
      {/* ================= STATION ================= */}
      <fieldset className="space-y-4">
        <legend className="font-medium text-gray-700">
          Informations de la station
        </legend>

        <input
          className="input input-bordered w-full"
          placeholder="Nom de la station"
          value={form.nom}
          onChange={(e) =>
            setForm({ ...form, nom: e.target.value })
          }
        />

        {/* Région / Département */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="select select-bordered w-full"
            value={form.region}
            onChange={(e) =>
              setForm({
                ...form,
                region: e.target.value,
                departement: "",
              })
            }
          >
            <option value="">— Sélectionner une région —</option>
            {Object.keys(REGIONS_DEPARTEMENTS).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered w-full"
            value={form.departement}
            disabled={!form.region}
            onChange={(e) =>
              setForm({
                ...form,
                departement: e.target.value,
              })
            }
          >
            <option value="">— Sélectionner un département —</option>
            {form.region &&
              REGIONS_DEPARTEMENTS[form.region].map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
          </select>
        </div>

        <input
          className="input input-bordered w-full"
          placeholder="Adresse"
          value={form.adresse}
          onChange={(e) =>
            setForm({ ...form, adresse: e.target.value })
          }
        />

        <input
          className="input input-bordered w-full"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={(e) =>
            setForm({ ...form, telephone: e.target.value })
          }
        />

        <input
          className="input input-bordered w-full"
          placeholder="Responsable (nom affiché)"
          value={form.responsable}
          onChange={(e) =>
            setForm({ ...form, responsable: e.target.value })
          }
        />
      </fieldset>

      {/* ================= GERANT ================= */}
      <fieldset className="space-y-4">
        <legend className="font-medium text-gray-700">
          Compte du gérant
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="input input-bordered"
            placeholder="Prénom"
            value={form.gerant.first_name}
            onChange={(e) =>
              setForm({
                ...form,
                gerant: {
                  ...form.gerant,
                  first_name: e.target.value,
                },
              })
            }
          />

          <input
            className="input input-bordered"
            placeholder="Nom"
            value={form.gerant.last_name}
            onChange={(e) =>
              setForm({
                ...form,
                gerant: {
                  ...form.gerant,
                  last_name: e.target.value,
                },
              })
            }
          />
        </div>

        <input
          className="input input-bordered w-full"
          placeholder="Nom d’utilisateur"
          value={form.gerant.username}
          onChange={(e) =>
            setForm({
              ...form,
              gerant: {
                ...form.gerant,
                username: e.target.value,
              },
            })
          }
        />

        <input
          className="input input-bordered w-full"
          placeholder="Email"
          value={form.gerant.email}
          onChange={(e) =>
            setForm({
              ...form,
              gerant: {
                ...form.gerant,
                email: e.target.value,
              },
            })
          }
        />

        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="Mot de passe"
          value={form.gerant.password}
          onChange={(e) =>
            setForm({
              ...form,
              gerant: {
                ...form.gerant,
                password: e.target.value,
              },
            })
          }
        />
      </fieldset>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition btn btn-outline"
          onClick={() =>
            router.push("/dashboard/admin-tenant/station")
          }
        >
          Annuler
        </button>

        <button
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition btn btn-primary"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Création…" : "Créer la station"}
        </button>
      </div>
    </div>
  );
}
