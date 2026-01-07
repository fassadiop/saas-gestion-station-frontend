// src/lib/roleMapper.ts

import { Role } from "@/constants/roles";
import { UserRole } from "@/types/user";

export const ROLE_TO_USER_ROLE: Record<Role, UserRole> = {
  [Role.SUPER_ADMIN]: "SuperAdmin",
  [Role.ADMIN_TENANT_FINANCE]: "AdminTenantFinance",
  [Role.ADMIN_TENANT_STATION]: "AdminTenantStation",

  [Role.GERANT]: "Gerant",
  [Role.SUPERVISEUR]: "Superviseur",
  [Role.POMPISTE]: "Pompiste",
  [Role.CAISSIER]: "Caissier",
  [Role.SECURITE]: "Securite",
  [Role.PERSONNEL_ENTRETIEN]: "Personnel_entretien",

  [Role.TRESORIER]: "Tresorier",
  [Role.COLLECTEUR]: "Collecteur",
};