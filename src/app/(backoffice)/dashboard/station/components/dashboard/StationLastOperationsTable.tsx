// src/app/(backoffice)/dashboard/station/components/dashboard/StationLastOperationsTable.tsx

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";

type Operation = {
  id: number;
  date: string;
  type: "RECETTE" | "DEPENSE";
  source_type: string;
  montant: number;
  finance_status?: "PROVISOIRE" | "CONFIRMEE";

  // 🔽 Champs plats (alignés backend)
  station_nom?: string;
  station_departement?: string;
  station_region?: string;
};

type Props = {
  operations: Operation[];
};

function getOperationLink(op: Operation): string | null {
  switch (op.source_type) {
    case "VENTE_CARBURANT":
      return `/dashboard/station/ventes-carburant/${op.id}`;
    case "RELAIS_EQUIPE":
      return `/dashboard/station/relais-equipes/${op.id}`;
    case "LOYER_LOCAL":
      return `/dashboard/station/contrats-location/${op.id}`;
    case "BOUTIQUE":
      return `/dashboard/station/boutique/ventes/${op.id}`;
    default:
      return null;
  }
}

export default function StationLastOperationsTable({ operations }: Props) {
  const { user } = useAuth();
  const isGerant = user?.role === "GERANT";
  const queryClient = useQueryClient();

  const confirmMutation = useMutation({
    mutationFn: async (transactionId: number) => {
      await api.post(`/finances/transactions/${transactionId}/confirmer/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station-dashboard"] });
    },
  });

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">Dernières opérations</h3>
      </div>

      {operations.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">
          Aucune opération enregistrée.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2">Heure</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Station</th>
                <th className="px-4 py-2">Origine</th>
                <th className="px-4 py-2 text-right">Montant</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {operations.map((op) => {
                const link = getOperationLink(op);

                return (
                  <tr key={op.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {new Date(op.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-4 py-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          op.type === "RECETTE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {op.type}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      {op.station_nom ? (
                        <div>
                          <div className="font-medium">{op.station_nom}</div>
                          <div className="text-xs text-gray-500">
                            {op.station_departement ?? "—"} •{" "}
                            {op.station_region ?? "—"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>

                    <td className="px-4 py-2 space-x-2">
                      <span>{op.source_type}</span>

                      {op.finance_status && (
                        <span
                          className={`ml-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                            op.finance_status === "PROVISOIRE"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {op.finance_status === "PROVISOIRE"
                            ? "Provisoire"
                            : "Confirmée"}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-right font-medium">
                      {Number(op.montant).toLocaleString()} F
                    </td>

                    <td className="px-4 py-2 text-right space-x-2">
                      {link ? (
                        <Link
                          href={link}
                          className="text-blue-600 hover:underline"
                        >
                          Voir
                        </Link>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}

                      {isGerant && op.finance_status === "PROVISOIRE" && (
                        <button
                          onClick={() => confirmMutation.mutate(op.id)}
                          disabled={confirmMutation.isPending}
                          className="ml-2 inline-flex items-center rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          Confirmer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
