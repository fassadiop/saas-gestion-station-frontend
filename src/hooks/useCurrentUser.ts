// src/hooks/useCurrentUser.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type CurrentUser = {
  username: any;
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  tenant?: { id: string; nom?: string } | null;
  station_id?: number | null;
  role?: string;
  is_superuser?: boolean;
};

export default function useCurrentUser() {
  return useQuery<CurrentUser | null, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/me/");
      // backend renvoie UtilisateurSerializer (ou 200 vide si non auth)
      return (res.data ?? null) as CurrentUser;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
