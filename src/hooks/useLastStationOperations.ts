// src/hooks/useLastStationOperations.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useLastStationOperations = () => {
  return useQuery({
    queryKey: ["station-last-operations"],
    queryFn: async () => {
      const res = await api.get("/station/operations/dernieres/");
      return res.data;
    },
  });
};
