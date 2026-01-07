import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useToggleStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      active,
    }: {
      id: number;
      active: boolean;
    }) => {
      await api.patch(`/station/stations/${id}/`, {
        active,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenant-stations"],
      });
    },
  });
}
