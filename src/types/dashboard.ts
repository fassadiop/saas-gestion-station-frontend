// src/types/dashboard.ts

/* =========================
 * TYPES COMMUNS
 * ========================= */

export type StationDashboardEvolutionPoint = {
  date: string
  recettes: number
  depenses: number
}

export type TenantStationResume = {
  station__nom: string
  recettes: number
  depenses: number
}

/* =========================
 * DASHBOARD TENANT (FINANCE)
 * ========================= */

export interface DashboardTenantData {
  /* --- SYNTHÈSE GLOBALE --- */
  global: {
    recettes: number
    depenses: number
    solde: number
    total_recettes?: number
    total_depenses?: number
    taux_cotisation?: number
  }

  /* --- ÉVOLUTION TEMPORELLE (UTILISÉE PAR FinancialChart) --- */
  evolution: StationDashboardEvolutionPoint[]

  /* --- RÉSUMÉ PAR STATION (UTILISÉ PAR TenantFinancialChart) --- */
  stations_resume: TenantStationResume[]

  /* --- PÉRIODE --- */
  period?: {
    start_date: string | null
    end_date: string | null
  }

  /* =========================
   * CHAMPS AVANCÉS (CONSERVÉS)
   * ========================= */

  charts?: {
    recettes_depenses: Array<{
      date: string
      recettes: number
      depenses: number
    }>

    depenses_par_categorie: Array<{
      categorie: string
      montant: number
    }>
  }

  projets?: Array<{
    id: number
    nom: string
    budget: number
    depenses: number
    taux_execution: number
    statut: string
  }>

  recent_transactions?: Array<{
    id: number
    date: string
    type: string
    categorie: string
    montant: number
    mode_paiement: string
  }>

  alerts?: Array<{
    type: string
    message: string
  }>

  staff?: {
    total: number
    collecteurs: number
    tresoriers: number
  }

  staff_stats?: {
    recettes_par_collecteur: Array<{
      id: number
      nom: string
      total: number
    }>
  }
}

/* =========================
 * DASHBOARD ADMIN (GOUVERNANCE)
 * ========================= */

export interface DashboardAdminData {
  tenants_latest: any

  stats: {
    tenants_total: number
    tenants_actifs: number
    utilisateurs_total: number
    admin_tenants: number
  }

  derniers_tenants: Array<{
    id: number
    nom: string
    created_at: string
  }>

  derniers_admins: Array<{
    id: number
    email: string
    first_name: string
    last_name: string
    tenant?: {
      id: number
      nom: string
    } | null
    station?: {
      id: number
      nom: string
    } | null
  }>
}

/* =========================
 * DASHBOARD STATION
 * ========================= */

export type StationDashboardResume = {
  recettes: number
  depenses: number
  solde: number
}

export type StationDashboardData = {
  jour: StationDashboardResume
  mois: StationDashboardResume
  evolution: StationDashboardEvolutionPoint[]
}

/* =========================
 * UNION
 * ========================= */

export type DashboardData =
  | DashboardTenantData
  | DashboardAdminData

export  type StationDashboardResponse = {
  autonomie: any
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
  evolution: {
    date: string;
    recettes: number;
    depenses: number;
  }[];
};

export type AutonomieItem = {
  stock_actuel: number;
  consommation_jour: number;
  jours_autonomie: number | null;
};

export type StationDashboard = {
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

  relais: {
    relais_effectues: number;
    total_encaisse: number;
  };

  alerts: {
    ventes_en_attente: number;
    relais_en_attente: number;
  };

  last_operations: any[];

  depotage?: {
    volume_today: number;
    volume_month: number;
    depense_month: number;
    alertes_ecart: number;
  };

  autonomie?: {
    ESSENCE: AutonomieItem;
    GASOIL: AutonomieItem;
  };
};