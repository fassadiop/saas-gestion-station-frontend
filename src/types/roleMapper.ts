// src/lib/roleMapper.ts

import { Role } from "@/constants/roles";
import { UserRole } from "@/constants/UserRole";

export const ROLE_TO_USER_ROLE: Record<Role, UserRole> = {
  [Role.SUPER_ADMIN]: UserRole.SUPERADMIN,
  [Role.ADMIN_TENANT_FINANCE]: UserRole.ADMIN_TENANT_FINANCE,
  [Role.ADMIN_TENANT_STATION]: UserRole.ADMIN_TENANT_STATION,

  [Role.GERANT]: UserRole.GERANT,
  [Role.SUPERVISEUR]: UserRole.SUPERVISEUR,
  [Role.POMPISTE]: UserRole.POMPISTE,
  [Role.CAISSIER]: UserRole.CAISSIER,
  [Role.SECURITE]: UserRole.SECURITE,
  [Role.PERSONNEL_ENTRETIEN]: UserRole.PERSONNEL_ENTRETIEN,

  [Role.TRESORIER]: UserRole.TRESORIER,
  [Role.COLLECTEUR]: UserRole.COLLECTEUR,
  [Role.LECTEUR]: UserRole.LECTEUR,
};