"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type StationLite = {
  id: number;
  nom: string;
  adresse?: string;
  active: boolean;
};

export function useStations() {
  return useQuery<StationLite[]>({
    queryKey: ["admin-tenant-stations"],
    queryFn: async () => {
      const res = await api.get("/station/stations/");
      return res.data;
    },
    staleTime: 60_000,
  });
}
