// src/hooks/useMembres.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type UseMembresParams = {
  search: string;
  page: number;
  pageSize: number;
};

export function useMembres({ search, page, pageSize }: UseMembresParams) {
  return useQuery({
    queryKey: ["membres", search, page, pageSize],
    queryFn: async () => {
      const res = await api.get("/membres/", {
        params: {
          search,
          page,
          page_size: pageSize,
        },
      });

      if (Array.isArray(res.data)) {
        return {
          membres: res.data,
          total: res.data.length,
        };
      }

      return {
        membres: res.data.results ?? [],
        total: res.data.count ?? 0,
      };
    },
    staleTime: 60 * 1000,
  });
}
