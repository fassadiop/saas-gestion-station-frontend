export interface StationInfo {
  id: number;
  nom: string;
  adresse: string;
  active: boolean;
}

export interface StationPeriode {
  start: string;
  end: string;
  type: "day" | "month" | "year";
}

export interface StationSynthese {
  recettes: number;
  depenses: number;
  solde: number;
  transactions: number;
}

export interface AdminTenantStationDashboardData {
  station: StationInfo;
  periode: StationPeriode;
  synthese: StationSynthese;
}
