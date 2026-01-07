import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type Payload = {
  first_name: string;          // ✅ AJOUT
  email: string;
  username: string;
  role: "Collecteur" | "Tresorier";
  password: string;
};

export function useCreatePersonnel(onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/staff/", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["personnel"] });
      onSuccess?.();
    },
  });
}