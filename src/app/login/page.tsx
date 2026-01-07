"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------------
     Redirection si déjà connecté
  ---------------------------------------*/
  useEffect(() => {
    if (ready && user) {
      router.replace("/dashboard");
    }
  }, [ready, user, router]);

  /* --------------------------------------
     Submit login
  ---------------------------------------*/
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login/", {
        username: email, // backend attend username
        password,
      });

      const { access, refresh } = res.data;

      if (!access) {
        throw new Error("Token d’accès manquant.");
      }

      // 🔑 délégation totale à AuthProvider
      await login({ access, refresh });

      router.replace("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.message ||
        "Erreur de connexion";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------
     Loading global (avant init auth)
  ---------------------------------------*/
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement…
      </div>
    );
  }

  /* --------------------------------------
     UI
  ---------------------------------------*/
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Connexion
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email ou nom d’utilisateur"
            className="w-full border p-2 rounded"
            autoComplete="username"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full border p-2 rounded"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
