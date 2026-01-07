"use client";

import React from "react";
import { StationDashboardData } from "@/types/dashboard";
import KpiCard from "./KpiCard";

type Props = {
  data: StationDashboardData;
};

export default function StationDashboardCards({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard
        label="Recettes (jour)"
        value={`${data.jour.recettes.toLocaleString()} FCFA`}
        color="text-green-600"
      />
      <KpiCard
        label="Dépenses (jour)"
        value={`${data.jour.depenses.toLocaleString()} FCFA`}
        color="text-red-600"
      />
      <KpiCard
        label="Solde (jour)"
        value={`${data.jour.solde.toLocaleString()} FCFA`}
      />

      <KpiCard
        label="Recettes (mois)"
        value={`${data.mois.recettes.toLocaleString()} FCFA`}
        color="text-green-600"
      />
      <KpiCard
        label="Dépenses (mois)"
        value={`${data.mois.depenses.toLocaleString()} FCFA`}
        color="text-red-600"
      />
      <KpiCard
        label="Solde (mois)"
        value={`${data.mois.solde.toLocaleString()} FCFA`}
      />
    </div>
  );
}
