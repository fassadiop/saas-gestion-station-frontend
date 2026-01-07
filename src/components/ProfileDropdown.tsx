// src/components/ProfileDropdown.tsx
"use client";

import React, { useState, useEffect } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function ProfileDropdown() {
  const { logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: user, isLoading } = useCurrentUser();

  // Avatar letter initiale : "U" côté serveur, puis mise à jour côté client si user présent.
  const initialLetter = "U";
  const avatarLetter = !isLoading && user ? (user.username?.[0] ?? user.email?.[0] ?? "U").toUpperCase() : initialLetter;

  return (
    <div className="relative">
      <button onClick={() => setOpen((s) => !s)} className="flex items-center gap-2 p-1 rounded hover:bg-gray-100">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
          {avatarLetter}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
          <div className="p-3 text-sm">
            <div className="font-semibold">{user?.first_name ?? user?.last_name ?? "Utilisateur"}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
          <div className="border-t">
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { setOpen(false); router.push("/profile"); }}>Profil</button>
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onClick={() => { logout(); router.replace("/login"); }}>Se déconnecter</button>
          </div>
        </div>
      )}
    </div>
  );
}
