"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { createTenant } from "@/hooks/useTenants";

export default function NewTenantPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Accès SuperAdmin seulement
  if (!user?.is_superuser)
    return <div className="text-red-600 text-center">Accès refusé.</div>;

  const [form, setForm] = useState({
    nom: "",
    type_structure: "GIE",
  });

  const [loading, setLoading] = useState(false);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Création du tenant uniquement
      const t = await createTenant({
        nom: form.nom,
        type_structure: form.type_structure,
      });

      const tenantId = t.data.id;

      // 2️⃣ Redirection vers le formulaire d'AdminTenant
      router.push(`/tenants/${tenantId}/admin/nouveau`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du tenant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Créer une nouvelle organisation</h1>

      <form className="space-y-4 bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
        
        <div>
          <label>Nom du Tenant</label>
          <input
            required
            className="input"
            value={form.nom}
            onChange={(e) => updateField("nom", e.target.value)}
          />
        </div>

        <div>
          <label>Type de structure</label>
          <select
            className="input"
            value={form.type_structure}
            onChange={(e) => updateField("type_structure", e.target.value)}
          >
            <option value="GIE">GIE</option>
            <option value="GPF">GPF</option>
            <option value="COOPERATIVE">Coopérative</option>
          </select>
        </div>

        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">
          {loading ? "Création…" : "Créer"}
        </button>
      </form>
    </div>
  );
}
