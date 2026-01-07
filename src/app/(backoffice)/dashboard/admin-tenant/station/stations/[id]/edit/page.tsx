// app/(backoffice)/dashboard/admin-tenant/station/stations/[id]/edit/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStation } from "@/hooks/useStation";
import { useUpdateStation } from "@/hooks/useUpdateStation";

export default function EditStationPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useStation(id as string);
  const updateMutation = useUpdateStation(Number(id));

  const [form, setForm] = useState({
    nom: "",
    region: "",
    departement: "",
    adresse: "",
    telephone: "",
    responsable: "",
    active: true,
  });

  /* 🔹 Pré-remplissage */
  useEffect(() => {
    if (data) {
      setForm({
        nom: data.nom ?? "",
        region: data.region ?? "",
        departement: data.departement ?? "",
        adresse: data.adresse ?? "",
        telephone: data.telephone ?? "",
        responsable: data.responsable ?? "",
        active: data.active,
      });
    }
  }, [data]);

  const submit = async () => {
    await updateMutation.mutateAsync(form);
    router.push("/dashboard/admin-tenant/station/stations");
  };

  if (isLoading) return <p>Chargement…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">
        Modifier la station
      </h1>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <input
          className="input input-bordered w-full"
          value={form.nom}
          onChange={(e) =>
            setForm({ ...form, nom: e.target.value })
          }
          placeholder="Nom"
        />

        <input
          className="input input-bordered w-full"
          value={form.region}
          onChange={(e) =>
            setForm({
              ...form,
              region: e.target.value,
            })
          }
          placeholder="Région"
        />

        <input
          className="input input-bordered w-full"
          value={form.departement}
          onChange={(e) =>
            setForm({
              ...form,
              departement: e.target.value,
            })
          }
          placeholder="Département"
        />

        <textarea
          className="textarea textarea-bordered w-full"
          value={form.adresse}
          onChange={(e) =>
            setForm({
              ...form,
              adresse: e.target.value,
            })
          }
          placeholder="Adresse"
        />

        <input
          className="input input-bordered w-full"
          value={form.telephone}
          onChange={(e) =>
            setForm({
              ...form,
              telephone: e.target.value,
            })
          }
          placeholder="Téléphone"
        />

        <input
          className="input input-bordered w-full"
          value={form.responsable}
          onChange={(e) =>
            setForm({
              ...form,
              responsable: e.target.value,
            })
          }
          placeholder="Responsable"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({
                ...form,
                active: e.target.checked,
              })
            }
          />
          Station active
        </label>

        <div className="flex justify-end gap-3">
          <button
            className="btn btn-outline"
            onClick={() =>
              router.push(
                "/dashboard/admin-tenant/station/stations"
              )
            }
          >
            Annuler
          </button>

          <button
            className="btn btn-primary"
            disabled={updateMutation.isPending}
            onClick={submit}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
