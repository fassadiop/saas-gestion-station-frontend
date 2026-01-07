"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useStationOperationalDashboard } from "../hooks/useStationOperationalDashboard";
import { useStationDashboardData } from "@/hooks/useStationDashboardData";
import { getPeriodDates } from "@/lib/dateUtils";

import StationDashboardCards from "../components/dashboard/StationKpiCards";
import StationOperationalAlerts from "../components/dashboard/StationOperationalAlerts";
import StationLastOperationsTable from "../components/dashboard/StationLastOperationsTable";
import DashboardPeriodFilter from "@/components/DashboardPeriodFilter";
import FinancialChart from "@/components/FinancialChart";
import AutonomieCards from "../components/dashboard/AutonomieCards";

type Period = "day" | "month" | "year";

export default function StationDashboardByIdPage() {
  const searchParams = useSearchParams();
  const stationId = searchParams.get("station_id");

  if (!stationId) {
    return <div>Station non spécifiée.</div>;
  }

  const [period, setPeriod] = useState<Period>("month");
  const { startDate, endDate } = getPeriodDates(period);

  // 🔹 OPÉRATIONNEL
  const {
    data: operationalData,
    isLoading: loadingOperational,
  } = useStationOperationalDashboard(stationId);

  // 🔹 ANALYTIQUE + AUTONOMIE (SOURCE UNIQUE)
  const {
    data: dashboard,
    isLoading: loadingDashboard,
  } = useStationDashboardData({
    stationId,
    startDate,
    endDate,
  });

  if (loadingOperational || loadingDashboard) {
    return <div>Chargement du dashboard station…</div>;
  }

  if (!operationalData || !dashboard) {
    return <div>Données indisponibles.</div>;
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          Situation financière (confirmée)
        </h2>

        <StationDashboardCards
          data={{
            jour: dashboard.jour,
            mois: dashboard.mois,
          }}
        />

        {dashboard.autonomie && (
          <AutonomieCards autonomie={dashboard.autonomie} />
        )}

        <StationOperationalAlerts alerts={operationalData.alerts} />

        <StationLastOperationsTable
          operations={operationalData.last_operations}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Analyse par période</h2>

        <DashboardPeriodFilter value={period} onChange={setPeriod} />
        <FinancialChart data={dashboard.evolution} />
      </section>
    </div>
  );
}
