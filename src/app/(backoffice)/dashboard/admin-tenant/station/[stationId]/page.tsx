// src/app/(backoffice)/dashboard/admin-tenant/station/[stationId]/page.tsx
"use client";

import StationSelector from "../components/StationSelector";
import PeriodSelector from "../components/PeriodSelector";
import KpiCard from "../components/KpiCard";
import { useAdminTenantStationDashboard } from "@/hooks/useAdminTenantStationDashboard";
import { useSearchParams, useParams } from "next/navigation";
import { getPeriodDates } from "@/lib/dateUtils";
import TopServicesChart from "@/components/TopServicesChart";

export default function AdminTenantStationDashboardPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const params = useSearchParams();
  const period = params.get("period") ?? "month";

  const { startDate, endDate } = getPeriodDates(period);

  const { data, isLoading } =
    useAdminTenantStationDashboard(stationId, startDate, endDate);

  return (
    <div className="space-y-6">
      {/* Sélecteurs */}
      <div className="flex justify-between items-center">
        <StationSelector />
        <PeriodSelector />
      </div>

      {isLoading || !data ? (
        <p>Chargement…</p>
      ) : (
        <>
          {/* KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              label="Recettes"
              value={data.total_recettes}
            />
            <KpiCard
              label="Dépenses"
              value={data.total_depenses}
            />
            <KpiCard
              label="Solde"
              value={data.solde}
            />
          </div>

          {/* Graphique */}
          {data.top_services && data.top_services.length > 0 && (
            <TopServicesChart
              data={data.top_services}
            />
          )}
        </>
      )}
    </div>
  );
}
