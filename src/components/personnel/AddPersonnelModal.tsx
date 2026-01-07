"use client";

import { useState } from "react";
import { useCreatePersonnel } from "@/hooks/useCreatePersonnel";

type PersonnelRole = "Collecteur" | "Tresorier" | "Lecteur";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddPersonnelModal({ open, onClose }: Props) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<PersonnelRole>("Collecteur");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useCreatePersonnel(onClose);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({
      first_name: nom,          // ✔️ backend compatible
      last_name: "",            // ✔️ explicite
      email,
      username: email,          // ✔️ standard SaaS
      role,
      password,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Ajouter un membre du personnel
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            required
            type="text"
            placeholder="Nom complet"
            className="w-full border p-2 rounded"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />

          <input
            required
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value as PersonnelRole)}
          >
            <option value="Collecteur">Collecteur</option>
            <option value="Tresorier">Trésorier</option>
            <option value="Lecteur">Lecteur</option>
          </select>

          <input
            required
            type="password"
            placeholder="Mot de passe temporaire"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Annuler
            </button>

            <button
              disabled={isPending}
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white"
            >
              {isPending ? "Création…" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
