import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface StationsParams {
  page: number;
  pageSize: number;
  ordering: string;
  region?: string;
  active?: boolean | "";
}

export function useAdminTenantStations(params: StationsParams) {
  return useQuery({
    queryKey: ["admin-tenant-stations", params],
    queryFn: async () => {
      const qs = new URLSearchParams();

      qs.set("page", String(params.page));
      qs.set("page_size", String(params.pageSize));
      qs.set("ordering", params.ordering);

      if (params.region) qs.set("region", params.region);
      if (params.active !== "" && params.active !== undefined)
        qs.set("active", String(params.active));

      const res = await api.get(
        `/station/stations/?${qs.toString()}`
      );

      return res.data; // { results, count, next, previous }
    },
    placeholderData: (prev) => prev,
  });
}
