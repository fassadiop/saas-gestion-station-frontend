"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import { Role, ROLE_LABELS } from "@/constants/roles";

const STATION_ROLES: Role[] = [
  Role.GERANT,
  Role.SUPERVISEUR,
  Role.POMPISTE,
  Role.CAISSIER,
  Role.PERSONNEL_ENTRETIEN,
  Role.SECURITE,
];

type Errors = Partial<Record<
  "username" | "first_name" | "last_name" | "password",
  string
>>;

export default function PersonnelFormModal({
  open,
  onClose,
  editing,
  onSaved,
}: any) {
  const [form, setForm] = useState({
    username: editing?.username || "",
    first_name: editing?.first_name || "",
    last_name: editing?.last_name || "",
    email: editing?.email || "",
    role: editing?.role || STATION_ROLES[0],
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ ICI, les hooks étaient mal placés avant
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // 🔒 Validation métier simple et claire
  const validate = (): boolean => {
    const e: Errors = {};

    if (!form.last_name.trim()) e.last_name = "Le nom est requis";
    if (!form.first_name.trim()) e.first_name = "Le prénom est requis";
    if (!form.username.trim()) e.username = "Le nom d’utilisateur est requis";

    if (!editing && !form.password.trim()) {
      e.password = "Le mot de passe est requis à la création";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      setApiError(null);

      if (editing) {
        await api.patch(`/station/personnel/${editing.id}/`, form);
        setSuccess("Personnel mis à jour avec succès");
      } else {
        await api.post("/station/personnel/", form);
        setSuccess("Personnel ajouté avec succès");
      }

      setTimeout(() => {
        setSuccess(null);
        onSaved();
      }, 1000);

    } catch (err: any) {
      setApiError(
        err?.response?.data?.detail ||
        "Une erreur est survenue lors de l’enregistrement"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="modal modal-open">
      {/* Toasts */}
      {success && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        </div>
      )}

      {apiError && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-error">
            <span>{apiError}</span>
          </div>
        </div>
      )}

      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {editing
              ? "Modifier un membre du personnel"
              : "Ajouter un membre du personnel"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Tous les champs marqués * sont obligatoires
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Identité */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-gray-700">
              Identité
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label-text text-sm">Nom *</label>
                <input
                  className={`input input-bordered w-full ${
                    errors.last_name ? "input-error" : ""
                  }`}
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                />
                {errors.last_name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>

              <div>
                <label className="label-text text-sm">Prénom *</label>
                <input
                  className={`input input-bordered w-full ${
                    errors.first_name ? "input-error" : ""
                  }`}
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                />
                {errors.first_name && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Compte */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-gray-700">
              Compte utilisateur
            </legend>

            <div>
              <label className="label-text text-sm">
                Nom d’utilisateur *
              </label>
              <input
                className={`input input-bordered w-full ${
                  errors.username ? "input-error" : ""
                }`}
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
              {errors.username && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="label-text text-sm">
                Email (optionnel)
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {!editing && (
              <div>
                <label className="label-text text-sm">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  className={`input input-bordered w-full ${
                    errors.password ? "input-error" : ""
                  }`}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            )}
          </fieldset>

          {/* Rôle */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-gray-700">
              Rôle dans la station *
            </legend>

            <select
              className="select select-bordered w-full"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Role })
              }
            >
              {STATION_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </fieldset>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition btn btn-outline"
            onClick={onClose}
            disabled={submitting}
          >
            Annuler
          </button>

          <button
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-red-600 transition"
            onClick={submit}
            disabled={submitting || hasErrors}
          >
            {submitting
              ? "Enregistrement…"
              : editing
              ? "Mettre à jour"
              : "Créer le compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
