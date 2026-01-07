import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useStationOperationalDashboard(stationId?: string) {
  return useQuery({
    queryKey: ["station-operational-dashboard", stationId],
    queryFn: async () => {
      const res = await api.get(
        `/station/dashboard/operationnel/?station_id=${stationId}`
      );
      return res.data;
    },
    enabled: typeof stationId === "string" && stationId.length > 0,
  });
}
