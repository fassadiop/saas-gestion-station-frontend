"use client";

import useRequireAuth from "@/hooks/useRequireAuth";
import { useDashboardData } from "@/hooks/useDashboardData";

import TenantDashboardCards from "@/components/TenantDashboardCards";
import FinancialChart from "@/components/FinancialChart";
import TenantFinancialChart from "@/components/TenantFinancialChart";

import { DashboardTenantData } from "@/types/dashboard";

export default function TenantDashboardPage() {
  useRequireAuth();

  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return <div>Chargement du tableau de bord…</div>;
  }

  const dashboard = data as DashboardTenantData;

  return (
    <div className="space-y-8">
      {/* KPI */}
      <TenantDashboardCards data={dashboard} />

      {/* Évolution temporelle */}
      <FinancialChart data={dashboard.evolution ?? []} />

      {/* Comparaison par station */}
      <TenantFinancialChart data={dashboard.stations_resume ?? []} />
    </div>
  );
}
