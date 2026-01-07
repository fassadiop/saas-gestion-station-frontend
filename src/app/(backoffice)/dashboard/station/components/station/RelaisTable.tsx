// src/app/(backoffice)/dashboard/station/components/station/RelaisTable.tsx
import RelaisStatusBadge from "./RelaisStatusBadge";
import { useRouter } from "next/navigation";

type Relais = {
  id: number;
  debut_relais: string;
  fin_relais: string;
  equipe_sortante: string;
  equipe_entrante: string;
  total_encaisse: number;
  status: string;

  encaisse_liquide: string;
  encaisse_carte: string;
  encaisse_ticket_essence: string;
  encaisse_ticket_gasoil: string;
};

export default function RelaisTable({ data }: { data: Relais[] }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th className="p-3 text-left">Période</th>
            <th className="p-3 text-left">Équipes</th>
            <th className="p-3 text-left">Total encaissé</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((r) => {
            console.log("RELAIS ROW =", r);
            const totalProvisoire =
                Number(r.encaisse_liquide ?? 0) +
                Number(r.encaisse_carte ?? 0) +
                Number(r.encaisse_ticket_essence ?? 0) +
                Number(r.encaisse_ticket_gasoil ?? 0);

            return (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {new Date(r.debut_relais).toLocaleDateString()} <br />
                  <span className="text-xs text-gray-500">
                    → {new Date(r.fin_relais).toLocaleDateString()}
                  </span>
                </td>

                <td className="p-3">
                  <div>{r.equipe_sortante}</div>
                  <div className="text-xs text-gray-500">
                    → {r.equipe_entrante}
                  </div>
                </td>

                <td className="p-3 font-medium">
                  {(r.status === "BROUILLON"
                    ? totalProvisoire
                    : r.total_encaisse
                  ).toLocaleString()}{" "}
                  FCFA
                </td>

                <td className="p-3">
                  <RelaisStatusBadge status={r.status} />
                </td>

                <td className="p-3 text-left space-x-2">
                  {r.status === "BROUILLON" && (
                    <button
                        className="text-blue-600"
                        onClick={() =>
                        router.push(`/dashboard/station/relais/${r.id}/edit`)
                        }
                    >
                        Modifier
                    </button>
                  )}

                  {r.status === "BROUILLON" && (
                    <button className="text-green-600">Soumettre</button>
                  )}

                  <button
                    className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    onClick={() =>
                      router.push(`/dashboard/station/relais/${r.id}`)
                    }
                  >
                    Voir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
