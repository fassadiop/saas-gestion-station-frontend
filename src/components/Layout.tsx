// src/components/Layout.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-primary font-bold">Tech4Fisheries</div>
            <nav className="hidden md:flex gap-4">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/transactions">Transactions</Link>
            </nav>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">{user.email}</span>
                <button onClick={logout} className="text-sm text-red-600">Se déconnecter</button>
              </div>
            ) : (
              <Link href="/login">Se connecter</Link>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};
