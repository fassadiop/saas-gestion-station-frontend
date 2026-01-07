"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import useTenants from "@/hooks/useTenants";
import { useAuth } from "@/context/AuthProvider";

export default function TenantsListPage() {
  const { tenants, loading } = useTenants();
  const { user } = useAuth();

  // Empêche l'hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // Avant que le client soit prêt → rien afficher
  if (!isClient) return null;

  // Vérification du rôle
  if (!user?.is_superuser) {
    return <div className="text-center text-red-600">Accès refusé.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organisations</h1>

        <Link
          href="/tenants/nouveau"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          ➕ Nouveau Tenant
        </Link>
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="border rounded bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Nom</th>
                <th className="p-2 text-left">Structure</th>
                <th className="p-2 text-left">Créé le</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tenants.map((t: any) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.nom}</td>
                  <td className="p-2">{t.type_structure}</td>
                  <td className="p-2">{t.date_creation?.substring(0, 10)}</td>
                  <td className="p-2">
                    <Link
                      className="text-blue-600 underline"
                      href={`/tenants/${t.id}`}
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}

              {tenants.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Aucun tenant trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
