import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useUpdateStation(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      await api.patch(
        `/station/stations/${id}/`,
        payload
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-tenant-stations"],
      });
      qc.invalidateQueries({
        queryKey: ["station", id],
      });
    },
  });
}
