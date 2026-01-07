// src/lib/userUtils.ts
import { User } from "@/types/user";

/* ----------------------------------
   MODULE ACTIF (SIDEBAR)
-----------------------------------*/
export type Module =
  | "admin"
  | "finance"
  | "station"
  | "admin-tenant-station";

/**
 * Mapping clair backend → frontend
 * Le backend est la source de vérité
 */
export function getAppModule(user: User): Module {
  console.log("🔥 getAppModule CALLED WITH ROLE =", user?.role);

  if (user.is_superuser) {
    return "admin";
  }

  const role = user.role?.toUpperCase();

  switch (role) {
    case "ADMIN_TENANT_FINANCE":
      return "finance";

    case "ADMIN_TENANT_STATION":
      console.log("🔥 MATCH ADMIN_TENANT_STATION");
      return "admin-tenant-station";

    case "GERANT":
    case "SUPERVISEUR":
    case "POMPISTE":
    case "CAISSIER":
    case "SECURITE":
    case "LECTEUR":
      return "station";

    default:
      return "station";
  }
}

/* ----------------------------------
   DASHBOARD ROOT
-----------------------------------*/
export function getDashboardHref(user: User): string {
  if (user.is_superuser) {
    return "/dashboard/admin";
  }

  const role = user.role?.toUpperCase();

  if (role === "ADMIN_TENANT_FINANCE") {
    return "/dashboard/tenant";
  }

  if (role === "ADMIN_TENANT_STATION") {
    return "/dashboard/admin-tenant/station";
  }

  return "/dashboard";
}

export function isSuperAdmin(user?: User | null): boolean {
  return Boolean(user?.is_superuser);
}
