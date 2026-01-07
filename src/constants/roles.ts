// src/constants/roles.ts

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",

  ADMIN_TENANT_FINANCE = "ADMIN_TENANT_FINANCE",
  ADMIN_TENANT_STATION = "ADMIN_TENANT_STATION",

  GERANT = "GERANT",
  SUPERVISEUR = "SUPERVISEUR",
  POMPISTE = "POMPISTE",
  CAISSIER = "CAISSIER",
  PERSONNEL_ENTRETIEN = "PERSONNEL_ENTRETIEN",
  SECURITE = "SECURITE",

  TRESORIER = "TRESORIER",
  COLLECTEUR = "COLLECTEUR",

  LECTEUR = "LECTEUR",
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "Super administrateur",

  [Role.ADMIN_TENANT_FINANCE]: "Administrateur Finance",
  [Role.ADMIN_TENANT_STATION]: "Administrateur Station",

  [Role.GERANT]: "Chef de station",
  [Role.SUPERVISEUR]: "Chef de piste",
  [Role.POMPISTE]: "Agent de distribution",
  [Role.CAISSIER]: "Vendeur boutique",
  [Role.PERSONNEL_ENTRETIEN]: "Personnel d’entretien",
  [Role.SECURITE]: "Sécurité",

  [Role.TRESORIER]: "Trésorier",
  [Role.COLLECTEUR]: "Collecteur",

  [Role.LECTEUR]: "Lecteur",
};
