// src/constants/roleLabels.ts
import { Role } from "@/types/user";

export const ROLE_LABELS: Record<Role, string> = {
  SuperAdmin: "Super Admin",
  AdminTenantFinance: "Admin Finance",
  AdminTenantStation: "Admin Station",
  Gerant: "Chef de station",
  Superviseur: "Chef de piste",
  Pompiste: "Agent de distribution",
  Caissier: "Vendeur boutique",
  Personnel_entretien: "Nettoyage",
  Securite: "Prévention des risques",
  Tresorier: "Trésorier",
  Collecteur: "Collecteur",
  Lecteur: "Lecture seule",
};
