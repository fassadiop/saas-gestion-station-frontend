// src/app/(backoffice)/dashboard/station/components/dashboard/StationVolumes.tsx

type Props = {
  volumes: Record<string, number>;
};

export default function StationVolumes({ volumes }: Props) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="font-semibold mb-3">
        Volumes carburant (jour)
      </h3>

      {Object.keys(volumes).length === 0 && (
        <p className="text-sm text-gray-400">
          Aucun volume enregistré.
        </p>
      )}

      <ul className="space-y-2">
        {Object.entries(volumes).map(
          ([produit, volume]) => (
            <li
              key={produit}
              className="flex justify-between"
            >
              <span>{produit}</span>
              <span className="font-medium">
                {volume} L
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
