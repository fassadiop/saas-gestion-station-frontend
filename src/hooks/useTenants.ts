"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function useTenants() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTenants() {
    try {
      const res = await api.get("/tenants/");
      setTenants(res.data?.results ?? res.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTenants();
  }, []);

  return { tenants, loading, refresh: fetchTenants };
}

export async function createTenant(payload: any) {
  return api.post("/tenants/", payload);
}

export async function deleteTenant(id: string) {
  return api.delete(`/tenants/${id}/`);
}
