"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_ID = "selected_tenant_id";
const STORAGE_NAME = "selected_tenant_name";

export default function useSelectedTenant() {
  const [selectedTenantId, setId] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_ID); } catch { return null; }
  });

  const [selectedTenantName, setName] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_NAME); } catch { return null; }
  });

  const changeTenant = useCallback((id: string | null, name?: string | null) => {
    setId(id);
    setName(name ?? null);

    try {
      id ? localStorage.setItem(STORAGE_ID, id) : localStorage.removeItem(STORAGE_ID);
      name ? localStorage.setItem(STORAGE_NAME, name) : localStorage.removeItem(STORAGE_NAME);
      window.dispatchEvent(new Event("selected-tenant-changed"));
    } catch {}
  }, []);

  useEffect(() => {
    const handler = () => {
      try {
        setId(localStorage.getItem(STORAGE_ID));
        setName(localStorage.getItem(STORAGE_NAME));
      } catch {}
    };

    window.addEventListener("selected-tenant-changed", handler);
    return () => window.removeEventListener("selected-tenant-changed", handler);
  }, []);

  return { selectedTenantId, selectedTenantName, changeTenant };
}
