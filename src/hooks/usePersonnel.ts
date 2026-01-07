// src/hooks/usePersonnel.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type UsePersonnelParams = {
  search: string;
  page: number;
  pageSize: number;
};

export function usePersonnel({ search, page, pageSize }: UsePersonnelParams) {
  return useQuery({
    queryKey: ["personnel", search, page, pageSize],
    queryFn: async () => {
      const res = await api.get("/staff/", {
        params: {
          search,
          page,
          page_size: pageSize,
        },
      });

      // ✅ Gère les deux formats DRF
      if (Array.isArray(res.data)) {
        return {
          personnel: res.data,
          total: res.data.length,
        };
      }

      return {
        personnel: res.data.results ?? [],
        total: res.data.count ?? 0,
      };
    },
    staleTime: 60 * 1000,
  });
}


