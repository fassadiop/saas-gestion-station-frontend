// src/hooks/useAdminTenantStationDashboard.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useSelectedStation } from "@/context/SelectedStationContext";

export type AdminTenantStationDashboardData = {
  total_recettes: number;
  total_depenses: number;
  solde: number;
  top_services?: {
    label: string;
    value: number;
  }[];
};

export function useAdminTenantStationDashboard(
  stationId: string,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: [
      "admin-tenant-station-dashboard",
      stationId,
      startDate,
      endDate,
    ],
    enabled: Boolean(stationId),
    queryFn: async () => {
      const res = await api.get(
        `/station/dashboard/admin-tenant/${stationId}/`,
        {
          params: { startDate, endDate },
        }
      );
      return res.data;
    },
  });
}
