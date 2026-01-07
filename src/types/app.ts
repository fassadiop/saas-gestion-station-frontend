export type AppModule =
  | "admin"                 // SuperAdmin global
  | "finance"               // Module finances (tenant)
  | "station"               // Exploitation station (GERANT / STAFF)
  | "admin-tenant-station"; // AdminTenantStation