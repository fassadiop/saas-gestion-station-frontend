// src/app/(backoffice)/dashboard/admin-tenant/station/nouveau/page.tsx

"use client";

import StationCreateForm from "../components/StationCreateForm";

export default function NewStationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">
          Création d’une station
        </h1>
        <p className="text-sm text-gray-500">
          La création d’une station nécessite obligatoirement un gérant.
        </p>
      </div>

      <StationCreateForm />
    </div>
  );
}