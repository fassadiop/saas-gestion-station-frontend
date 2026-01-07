// src/app/(backoffice)/dashboard/station/components/dashboard/StationAlerts.tsx

type Props = {
  alerts: {
    ventes_en_attente: number;
    relais_en_attente: number;
  };
};

export default function StationAlerts({ alerts }: Props) {
  if (
    alerts.ventes_en_attente === 0 &&
    alerts.relais_en_attente === 0
  )
    return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
      <h3 className="font-semibold text-yellow-800 mb-2">
        Alertes opérationnelles
      </h3>
      <ul className="text-sm space-y-1">
        {alerts.ventes_en_attente > 0 && (
          <li>
            • {alerts.ventes_en_attente} ventes en attente
            de validation
          </li>
        )}
        {alerts.relais_en_attente > 0 && (
          <li>
            • {alerts.relais_en_attente} relais d’équipe
            non validés
          </li>
        )}
      </ul>
    </div>
  );
}
