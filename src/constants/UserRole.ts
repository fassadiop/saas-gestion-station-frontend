// src/constants/UserRole.ts

export enum UserRole {
  // --- Gouvernance ---
  SUPERADMIN = "SUPER_ADMIN",

  // --- Admin tenant ---
  ADMIN_TENANT_FINANCE = "ADMIN_TENANT_FINANCE",
  ADMIN_TENANT_STATION = "ADMIN_TENANT_STATION",

  // --- Station ---
  GERANT = "GERANT",
  SUPERVISEUR = "SUPERVISEUR",
  POMPISTE = "POMPISTE",
  CAISSIER = "CAISSIER",
  PERSONNEL_ENTRETIEN = "PERSONNEL_ENTRETIEN",
  SECURITE = "SECURITE",

  // --- Finance ---
  TRESORIER = "TRESORIER",
  COLLECTEUR = "COLLECTEUR",

  // --- Lecture seule ---
  LECTEUR = "LECTEUR",
}

