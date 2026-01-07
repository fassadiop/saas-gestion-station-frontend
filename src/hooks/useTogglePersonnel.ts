import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useTogglePersonnel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: number;
      is_active: boolean;
    }) => {
      const res = await api.patch(`/staff/${id}/`, {
        is_active,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
    },
  });
}
