"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

export default function NewAdminTenantPage() {
  const router = useRouter();
  const params = useParams(); // ⭐ OFFICIEL & STABLE
  const tenantId = params?.id as string; // ⭐ plus de Promise

  const { user, ready } = useAuth();

  if (!ready) return null;

  if (!user) {
    return <div className="text-center text-red-600">Accès non autorisé</div>;
  }

  if (!user.is_superuser)
    return <div className="text-red-600 text-center">Accès refusé.</div>;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "ADMIN_TENANT_STATION" as
      | "ADMIN_TENANT_STATION"
      | "ADMIN_TENANT_FINANCE",
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      await api.post("/utilisateurs/", {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        tenant: tenantId,
        first_name: "",
        last_name: "",
      });

      alert("Administrateur créé !");
      router.push("/tenants");
    } catch (err: any) {
      console.error("❌ API ERROR:", err.response?.data || err);
      alert("Erreur lors de la création de l'administrateur.");
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Créer l’administrateur du tenant</h1>
      <p className="text-gray-600">Tenant ID : {tenantId}</p>

      <form className="space-y-4 bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
        <div>
          <label>Nom d'utilisateur</label>
          <input
            required
            className="input"
            value={form.username}
            onChange={(e) => updateField("username", e.target.value)}
          />
        </div>

        <div>
          <label>Type d’administrateur</label>
          <select
            className="input"
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
          >
            <option value="ADMIN_TENANT_STATION">
              Admin Tenant – Station
            </option>
            <option value="ADMIN_TENANT_FINANCE">
              Admin Tenant – Finance
            </option>
          </select>
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        <div>
          <label>Mot de passe</label>
          <input
            required
            type="password"
            className="input"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          type="submit"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Création…" : "Créer l’administrateur"}
        </button>
      </form>
    </div>
  );
}
