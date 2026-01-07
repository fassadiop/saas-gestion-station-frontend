import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useStation(id?: string | number) {
  return useQuery({
    queryKey: ["station", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(
        `/station/stations/${id}/`
      );
      return res.data;
    },
  });
}
