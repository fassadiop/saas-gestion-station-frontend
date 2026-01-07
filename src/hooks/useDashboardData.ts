// src/hooks/useDashboardData.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import useCurrentUser from "@/hooks/useCurrentUser";
import {
  DashboardAdminData,
  DashboardTenantData,
} from "@/types/dashboard";
import { UserRole } from "@/constants/UserRole";

export type DashboardData =
  | DashboardAdminData
  | DashboardTenantData;

export interface DashboardParams {
  startDate?: string;
  endDate?: string;
  projetId?: number;
}

export function useDashboardData(
  params: DashboardParams = {}
) {
  const { startDate, endDate, projetId } = params;

  const {
    data: me,
    isLoading: userLoading,
  } = useCurrentUser();

  return useQuery<DashboardData>({
    queryKey: ["dashboard", me?.id, { startDate, endDate, projetId }],
    enabled: !!me && !userLoading,

    queryFn: async () => {
      if (!me) {
        throw new Error("Utilisateur non chargé");
      }

      const baseParams = {
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      };

      // 🔹 SUPER ADMIN — dashboard global
      if (me.is_superuser) {
        const res = await api.get<DashboardAdminData>(
          "/dashboard/admin/",
          { params: baseParams }
        );
        return res.data;
      }

      // 🔹 ADMIN TENANT FINANCE — dashboard financier
      if (me.role === UserRole.ADMIN_TENANT_FINANCE) {
        const res = await api.get<DashboardTenantData>(
          "/dashboard/",
          {
            params: {
              ...baseParams,
              ...(projetId && { projet_id: projetId }),
            },
          }
        );
        return res.data;
      }

      // 🔹 ADMIN TENANT STATION — dashboard station (agrégé)
      if (me.role === UserRole.ADMIN_TENANT_STATION) {
        const res = await api.get<DashboardTenantData>(
          "/dashboard/",
          { params: baseParams }
        );
        return res.data;
      }

      // 🔹 AUTRES RÔLES — pas encore autorisés ici
      throw new Error("Accès au dashboard non autorisé");
    },

    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
}
