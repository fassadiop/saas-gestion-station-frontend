"use client";

import { useRouter, useSearchParams } from "next/navigation";

const PERIODS = [
  { value: "day", label: "Jour" },
  { value: "month", label: "Mois" },
  { value: "year", label: "Année" },
] as const;

export default function PeriodSelector() {
  const router = useRouter();
  const params = useSearchParams();

  const station = params.get("station");
  const period = params.get("period") ?? "month";

  if (!station) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(
      `/dashboard/admin-tenant/station?station=${station}&period=${e.target.value}`
    );
  };

  return (
    <select
      value={period}
      onChange={handleChange}
      className="border rounded px-3 py-1 text-sm"
    >
      {PERIODS.map((p) => (
        <option key={p.value} value={p.value}>
          {p.label}
        </option>
      ))}
    </select>
  );
}
