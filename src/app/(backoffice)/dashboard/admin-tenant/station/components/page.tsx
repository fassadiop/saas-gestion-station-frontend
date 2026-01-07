"use client";

import { useSearchParams } from "next/navigation";
import StationSelector from "./StationSelector";

export default function AdminTenantStationDashboardPage() {
  const searchParams = useSearchParams();
  const stationId = searchParams.get("station");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Dashboard Station
        </h1>

        <StationSelector />
      </div>

      {/* État vide tant que station non sélectionnée */}
      {!stationId && (
        <div className="text-sm text-muted-foreground">
          Veuillez sélectionner une station pour afficher le tableau de bord.
        </div>
      )}

      {/* KPI viendront ici (PHASE 3.2) */}
    </div>
  );
}
