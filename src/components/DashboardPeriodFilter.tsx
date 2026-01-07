"use client";

type Period = "day" | "month" | "year";

export default function DashboardPeriodFilter({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="flex gap-2">
      <PeriodButton label="Jour" value="day" active={value === "day"} onClick={onChange} />
      <PeriodButton label="Mois" value="month" active={value === "month"} onClick={onChange} />
      <PeriodButton label="Année" value="year" active={value === "year"} onClick={onChange} />
    </div>
  );
}

function PeriodButton({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: "day" | "month" | "year";
  active: boolean;
  onClick: (v: any) => void;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1 rounded text-sm border transition
        ${active ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}
      `}
    >
      {label}
    </button>
  );
}
