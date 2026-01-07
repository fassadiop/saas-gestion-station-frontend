// src/app/(backoffice)/dashboard/station/components/dashboard/StationOperationalAlerts.tsx

type Alerts = {
  ventes_en_attente: number;
  relais_en_attente: number;
};

type Props = {
  alerts: Alerts;
};

export default function StationOperationalAlerts({ alerts }: Props) {
  const hasAlerts =
    alerts.ventes_en_attente > 0 ||
    alerts.relais_en_attente > 0;

  if (!hasAlerts) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm text-green-700">
          ✔️ Aucune alerte opérationnelle. La station est sous contrôle.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
      <h3 className="mb-2 font-semibold text-yellow-800">
        ⚠️ Alertes opérationnelles
      </h3>

      <ul className="space-y-1 text-sm text-yellow-900">
        {alerts.ventes_en_attente > 0 && (
          <li>
            • {alerts.ventes_en_attente} vente(s) en attente de
            validation
          </li>
        )}

        {alerts.relais_en_attente > 0 && (
          <li>
            • {alerts.relais_en_attente} relais d’équipe non validé(s)
          </li>
        )}
      </ul>
    </div>
  );
}
