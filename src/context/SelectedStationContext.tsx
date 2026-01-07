// src/context/SelectedStationContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

export interface Station {
  id: string;
  nom: string;
}

interface SelectedStationContextType {
  stations: Station[];
  selectedStationId: string | null;
  setSelectedStationId: (id: string | null) => void;
  loading: boolean;
}

const SelectedStationContext =
  createContext<SelectedStationContextType | undefined>(
    undefined
  );

export function SelectedStationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStationId, setSelectedStationId] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔒 GARDE ABSOLUE
    if (!user || user.role !== "ADMIN_TENANT_STATION") {
      setStations([]);
      setSelectedStationId(null);
      return;
    }

    let cancelled = false;

    const fetchStations = async () => {
      try {
        setLoading(true);
        const res = await api.get("/station/stations/");
        if (!cancelled) {
          setStations(res.data.results ?? res.data);
          // 🔹 auto-sélection première station
          if (
            res.data.results?.length &&
            !selectedStationId
          ) {
            setSelectedStationId(
              res.data.results[0].id
            );
          }
        }
      } catch (err) {
        console.error(
          "Erreur chargement stations",
          err
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStations();

    return () => {
      cancelled = true;
    };
  }, [user, selectedStationId]);

  return (
    <SelectedStationContext.Provider
      value={{
        stations,
        selectedStationId,
        setSelectedStationId,
        loading,
      }}
    >
      {children}
    </SelectedStationContext.Provider>
  );
}

export function useSelectedStation() {
  const ctx = useContext(SelectedStationContext);
  if (!ctx) {
    throw new Error(
      "useSelectedStation must be used within SelectedStationProvider"
    );
  }
  return ctx;
}
