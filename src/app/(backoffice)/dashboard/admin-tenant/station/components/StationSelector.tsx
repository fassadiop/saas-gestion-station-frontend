// app/(backoffice)/dashboard/admin-tenant/station/components/StationSelector.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type Station = {
  id: number;
  nom: string;
};

type StationsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Station[];
};

export default function StationSelector() {
  const router = useRouter();
  const params = useSearchParams();
  const selectedStation = params.get("station");

  const { data, isLoading } = useQuery<StationsResponse>({
    queryKey: ["admin-tenant-stations"],
    queryFn: async () => {
      const res = await api.get("/station/stations/");
      return res.data;
    },
  });

  const stations = data?.results ?? [];

  // ✅ TOUS LES HOOKS AVANT LES RETURNS
  useEffect(() => {
    if (!isLoading && !selectedStation && stations.length > 0) {
      router.replace(
        `/dashboard/admin-tenant/station?station=${stations[0].id}`
      );
    }
  }, [isLoading, selectedStation, stations, router]);

  // 🔒 RENDERS CONDITIONNELS APRÈS
  if (isLoading) return null;
  if (stations.length === 0) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(
      `/dashboard/admin-tenant/station?station=${e.target.value}`
    );
  };

  return (
    <select
      value={selectedStation ?? ""}
      onChange={handleChange}
      className="border rounded px-3 py-1 text-sm"
    >
      {stations.map((station) => (
        <option key={station.id} value={station.id}>
          {station.nom}
        </option>
      ))}
    </select>
  );
}
