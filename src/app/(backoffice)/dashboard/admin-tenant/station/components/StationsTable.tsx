import Link from "next/link";
import { useToggleStation } from "../hooks/useToggleStation";

/* ===============================
   COLONNE TRIABLE
================================ */
function SortableTh({
  label,
  field,
  ordering,
  setOrdering,
}: {
  label: string;
  field: string;
  ordering: string;
  setOrdering: (v: string) => void;
}) {
  const isAsc = ordering === field;
  const isDesc = ordering === `-${field}`;

  return (
    <th
      className="p-3 text-left cursor-pointer select-none"
      onClick={() =>
        setOrdering(isAsc ? `-${field}` : field)
      }
    >
      {label}
      {isAsc && " ↑"}
      {isDesc && " ↓"}
    </th>
  );
}

/* ===============================
   TABLE STATIONS
================================ */
export default function StationsTable({
  data,
  ordering,
  setOrdering,
}: {
  data: any[];
  ordering: string;
  setOrdering: (v: string) => void;
}) {
  const toggleMutation = useToggleStation();

  return (
    <div className="bg-white border rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <SortableTh
              label="Nom"
              field="nom"
              ordering={ordering}
              setOrdering={setOrdering}
            />
            <SortableTh
              label="Région"
              field="region"
              ordering={ordering}
              setOrdering={setOrdering}
            />
            <th className="p-3 text-left">
              Département
            </th>
            <SortableTh
              label="Statut"
              field="active"
              ordering={ordering}
              setOrdering={setOrdering}
            />
            <th className="p-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-3">{s.nom}</td>
              <td className="p-3">
                {s.region ?? "—"}
              </td>
              <td className="p-3">
                {s.departement ?? "—"}
              </td>

              <td className="p-3">
                <span
                  className={
                    s.active
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {s.active
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td className="p-3 text-right space-x-2">
                {/* Voir */}
                <Link
                  href={`/dashboard/admin-tenant/station?station=${s.id}`}
                  className="btn btn-xs btn-outline"
                >
                  Voir dashboard
                </Link>

                {/* Activer / Désactiver */}
                <button
                  className={`btn btn-xs ${
                    s.active
                      ? "btn-error"
                      : "btn-success"
                  }`}
                  disabled={toggleMutation.isPending}
                  onClick={() =>
                    toggleMutation.mutate({
                      id: s.id,
                      active: !s.active,
                    })
                  }
                >
                  {s.active
                    ? "Désactiver"
                    : "Activer"}
                </button>

                {/* Éditer */}
                <Link
                  href={`/dashboard/admin-tenant/station/stations/${s.id}/edit`}
                  className="btn btn-xs btn-ghost"
                >
                  Éditer
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
