// src/app/(backoffice)/dashboard/station/components/dashboard/StationRelais.tsx

type Props = {
  relais: {
    relais_effectues: number;
    total_encaisse: number;
  };
};

export default function StationRelais({ relais }: Props) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="font-semibold mb-3">
        Relais d’équipe (jour)
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Relais effectués</span>
          <span className="font-medium">
            {relais.relais_effectues}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Total encaissé</span>
          <span className="font-medium">
            {Number(relais.total_encaisse).toLocaleString()} F
          </span>
        </div>
      </div>
    </div>
  );
}
