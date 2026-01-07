// src/hooks/useAdminTenantStations.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface StationLite {
  id: number;
  nom: string;
}

export function useAdminTenantStations() {
  return useQuery<StationLite[]>({
    queryKey: ["admin-tenant-stations"],
    queryFn: async () => {
      const res = await api.get("/station/stations");
      return res.data;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
