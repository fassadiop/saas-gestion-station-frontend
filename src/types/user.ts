// src/types/user.ts
export type Role =
  | "SUPERADMIN"
  | "ADMIN_TENANT_FINANCE"
  | "ADMIN_TENANT_STATION"
  | "GERANT"
  | "SUPERVISEUR"
  | "POMPISTE"
  | "CAISSIER"
  | "PERSONNEL_ENTRETIEN"
  | "SECURITE"
  | "TRESORIER"
  | "COLLECTEUR";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  tenant_id: number | null;
  station_id: number | null;

  tenant: {
    id: string
    nom: string
    type_structure?: string
    devise?: string
  } | null

  station?: {
    id: number
    nom: string
  } | null

  is_superuser: boolean
  is_staff: boolean
  is_active: boolean
}
