// src/app/(backoffice)/dashboard/admin-tenant/station/region/[region]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

type Station = {
  id: number;
  nom: string;
  departement?: string | null;
  active: boolean;
};

export default function StationsByRegionPage() {
  const { region } = useParams<{ region: string }>();
  const router = useRouter();

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await api.get("/station/stations/", {
          params: { region },
        });
        setStations(res.data.results ?? res.data);
      } catch {
        setError("Impossible de charger les stations.");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [region]);

  if (loading) return <p>Chargement…</p>;

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Stations – Région {region}
        </h1>
        <p className="text-gray-500">
          Sélectionnez une station pour voir son
          dashboard
        </p>
      </div>

      {stations.length === 0 ? (
        <p className="text-gray-500">
          Aucune station dans cette région.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((station) => (
            <div
              key={station.id}
              className="border rounded-lg p-4 bg-white cursor-pointer hover:shadow"
              onClick={() => {
                router.push(`/dashboard/station/${station.id}?station_id=${station.id}`);
              }}
            >
              <div className="font-medium">
                {station.nom}
              </div>
              <div className="text-sm text-gray-500">
                {station.departement ??
                  "Département non renseigné"}
              </div>
              <div className="mt-2 text-sm">
                {station.active ? (
                  <span className="text-green-600">
                    Active
                  </span>
                ) : (
                  <span className="text-red-600">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
