"use client";

import React from "react";
import { DashboardTenantData } from "@/types/dashboard";
import KpiCard from "@/components/KpiCard";

type Props = {
  data: DashboardTenantData;
};

export default function TenantDashboardCards({ data }: Props) {
  // 🛡️ Sécurité maximale + source unique de vérité
  const recettes = data.global?.recettes ?? 0;
  const depenses = data.global?.depenses ?? 0;
  const solde =
    data.global?.solde ?? recettes - depenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard
        label="Recettes"
        value={`${recettes.toLocaleString()} FCFA`}
        color="text-green-600"
      />
      <KpiCard
        label="Dépenses"
        value={`${depenses.toLocaleString()} FCFA`}
        color="text-red-600"
      />
      <KpiCard
        label="Résultat"
        value={`${solde.toLocaleString()} FCFA`}
      />
    </div>
  );
}
