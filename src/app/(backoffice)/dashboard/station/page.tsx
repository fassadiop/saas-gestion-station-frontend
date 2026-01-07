// app/(backoffice)/dashboard/station/page.tsx

// app/(backoffice)/dashboard/station/page.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { UserRole } from "@/constants/UserRole";

import KpiCard from "@/components/dashboard/KpiCard";
import StationLastOperationsTable from "./components/dashboard/StationLastOperationsTable";
import RelaisTable from "./components/station/RelaisTable";
import AutonomieCards from "./components/dashboard/AutonomieCards";

import { useLastStationOperations } from "@/hooks/useLastStationOperations";

type StationDashboardResponse = {
  jour: {
    recettes: number;
    depenses: number;
    solde: number;
  };
  mois: {
    recettes: number;
    depenses: number;
    solde: number;
  };
  depotage: {
    volume_today: number;
    volume_month: number;
    depense_month: number;
    alertes_ecart: number;
  };
  autonomie?: any;
};

export default function StationDashboardPage() {
  const { user } = useAuth();
  const isGerant = user?.role === UserRole.GERANT;

  const { data: operations = [] } = useLastStationOperations();

  /**
   * =========================
   * DASHBOARD OPÉRATIONNEL
   * =========================
   */
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useQuery<StationDashboardResponse>({
    queryKey: ["station-dashboard"],
    queryFn: async () =>
      (await api.get("/station/dashboard/operationnel/")).data,
  });

  /**
   * =========================
   * RELAIS D’ÉQUIPE
   * =========================
   */
  const {
    data: relaisData,
    isLoading: isRelaisLoading,
    isError: isRelaisError,
  } = useQuery({
    queryKey: ["relais-station"],
    queryFn: async () =>
      (await api.get("/station/relais-equipes/")).data,
  });

  /**
   * =========================
   * ÉTATS
   * =========================
   */
  if (isLoading) {
    return <div>Chargement du dashboard…</div>;
  }

  if (isError || !dashboardData) {
    return (
      <div className="text-red-600">
        Impossible de charger le dashboard station.
      </div>
    );
  }

  const jour = dashboardData.jour;
  const mois = dashboardData.mois;

  /**
   * =========================
   * RENDER
   * =========================
   */
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold">Dashboard Station</h1>

      {/* KPI JOUR */}
      {isGerant && (
        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="Recettes jour" value={jour.recettes} />
          <KpiCard label="Dépenses jour" value={jour.depenses} />
          <KpiCard label="Solde jour" value={jour.solde} />
        </div>
      )}

      {/* KPI MOIS */}
      {isGerant && (
        <div className="grid grid-cols-3 gap-4">
          <KpiCard label="Recettes mois" value={mois.recettes} />
          <KpiCard label="Dépenses mois" value={mois.depenses} />
          <KpiCard label="Solde mois" value={mois.solde} />
        </div>
      )}

      {/* KPI DÉPOTAGE */}
      {isGerant && (
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            label="Volume dépoté (jour)"
            value={`${dashboardData.depotage.volume_today} L`}
          />
          <KpiCard
            label="Volume dépoté (mois)"
            value={`${dashboardData.depotage.volume_month} L`}
          />
          <KpiCard
            label="Dépense dépotage (mois)"
            value={`${dashboardData.depotage.depense_month.toLocaleString()} F`}
          />
          <KpiCard
            label="Alertes dépotage"
            value={dashboardData.depotage.alertes_ecart}
          />
        </div>
      )}

      {/* AUTONOMIE */}
      {dashboardData.autonomie && (
        <AutonomieCards autonomie={dashboardData.autonomie} />
      )}

      {/* DERNIÈRES OPÉRATIONS */}
      {isGerant && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            Dernières opérations
          </h2>
          <StationLastOperationsTable operations={operations} />
        </section>
      )}

      {/* RELAIS */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Relais d’équipe</h2>

        {isRelaisLoading && (
          <div className="text-gray-500">
            Chargement des relais…
          </div>
        )}

        {!isRelaisLoading &&
          relaisData?.results?.length > 0 && (
            <RelaisTable data={relaisData.results} />
          )}

        {!isRelaisLoading &&
          relaisData?.results?.length === 0 && (
            <div className="text-gray-500 italic">
              Aucun relais enregistré pour cette station.
            </div>
          )}

        {isRelaisError && (
          <div className="text-red-600">
            Impossible de charger les relais.
          </div>
        )}
      </section>

      {/* AUCUNE ACTIVITÉ */}
      {dashboardData.jour.recettes === 0 && (
        <div className="text-gray-500 italic">
          Aucune activité confirmée enregistrée pour aujourd’hui.
        </div>
      )}
    </div>
  );
}
