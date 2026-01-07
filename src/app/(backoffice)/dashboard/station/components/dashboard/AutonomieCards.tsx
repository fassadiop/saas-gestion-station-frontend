type Props = {
  autonomie: {
    ESSENCE: {
      stock_actuel: number;
      consommation_jour: number;
      jours_autonomie: number | null;
    };
    GASOIL: {
      stock_actuel: number;
      consommation_jour: number;
      jours_autonomie: number | null;
    };
  };
};

export default function AutonomieCards({ autonomie }: Props) {
  const render = (label: string, data: any) => {
    let color = "bg-green-100 text-green-700";

    if (data.jours_autonomie !== null) {
      if (data.jours_autonomie < 3) color = "bg-red-100 text-red-700";
      else if (data.jours_autonomie < 7)
        color = "bg-orange-100 text-orange-700";
    }

    return (
      <div className="rounded-lg bg-white p-4 shadow">
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-semibold ${color}`}>
          {data.jours_autonomie ?? "—"} j
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Stock: {data.stock_actuel} L · Conso:{" "}
          {data.consommation_jour} L/j
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {render("Autonomie Essence", autonomie.ESSENCE)}
      {render("Autonomie Gasoil", autonomie.GASOIL)}
    </div>
  );
}
