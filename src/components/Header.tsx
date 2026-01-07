// src/components/Headers.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  // ✅ Attend que le composant soit monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔒 Empêche tout rendu SSR/client mismatch
  if (!mounted) return null;

  if (!user) return null;

  const tenantName = user.tenant?.nom ?? "Organisation";
  const roleLabel = user.role ?? "Utilisateur";

  return (
    <header className="w-full bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Organisation */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Organisation</span>
        <span className="text-lg font-semibold text-gray-900">
          {tenantName}
        </span>
      </div>

      {/* Utilisateur */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-800">
            {user.email}
          </div>
          <div className="text-xs text-gray-500">
            {roleLabel}
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
