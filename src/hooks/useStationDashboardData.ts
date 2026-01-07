// src/hooks/useStationDashboardData.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { StationDashboardResponse } from "@/types/dashboard";
import useCurrentUser from "@/hooks/useCurrentUser";
import { usePathname } from "next/navigation";
import { UserRole } from "@/constants/UserRole";

type Params = {
  stationId?: string;
  startDate: string;
  endDate: string;
};

export function useStationDashboardData({
  stationId,
  startDate,
  endDate,
}: Params) {
  const { data: me, isLoading } = useCurrentUser();
  const pathname = usePathname();

  const enabled =
    !isLoading &&
    !!me &&
    (me.role === UserRole.GERANT ||
      me.role === UserRole.ADMIN_TENANT_STATION) &&
    pathname.startsWith("/dashboard/station") &&
    Boolean(startDate && endDate);

  return useQuery<StationDashboardResponse>({
    queryKey: ["station-dashboard", stationId ?? "self", startDate, endDate],

    queryFn: async () => {
      const res = await api.get("/station/dashboard/operationnel/", {
        params: {
          station_id: stationId, // ignoré par le backend si inutile
          start_date: startDate,
          end_date: endDate,
        },
      });
      return res.data;
    },

    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
