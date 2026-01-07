"use client";

import useTenants from "@/hooks/useTenants";
import Link from "next/link";

export default function TenantsLatest() {
  const { tenants, loading } = useTenants();

  if (loading) return <div>Chargement…</div>;

  const latest = tenants.slice(0, 5);

  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      {latest.map((t) => (
        <div key={t.id} className="flex justify-between border-b pb-1">
          <span>{t.nom}</span>
          <Link href={`/tenants/${t.id}`} className="text-blue-600 underline">
            Ouvrir
          </Link>
        </div>
      ))}

      {latest.length === 0 && (
        <div className="text-gray-500 text-sm">Aucun tenant pour le moment.</div>
      )}
    </div>
  );
}
