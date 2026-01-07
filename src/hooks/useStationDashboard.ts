// src/hooks/useStationDashboard.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useStationDashboard = () => {
  return useQuery({
    queryKey: ["station-dashboard"],
    queryFn: async () => {
      const res = await api.get("/dashboard/station/");
      return res.data;
    }
  });
};
