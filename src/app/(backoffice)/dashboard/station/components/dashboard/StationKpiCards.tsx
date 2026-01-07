// src/app/(backoffice)/dashboard/station/components/dashboard/StationKpiCards.tsx

type KpiData = {
  jour: {
    recettes: number;
    depenses: number;
    solde: number;
  };
  mois: {
    recettes: number;
    depenses: number;
    solde: number;
  };
};

type Props = {
  data: KpiData;
};

export default function StationKpiCards({ data }: Props) {
  const { jour, mois } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Kpi
        title="Recettes du jour"
        value={jour.recettes}
      />
      <Kpi
        title="Solde du jour"
        value={jour.solde}
      />
      <Kpi
        title="Résultat du mois"
        value={mois.solde}
      />
    </div>
  );
}

function Kpi({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">
        {Number(value).toLocaleString()} F
      </p>
    </div>
  );
}
