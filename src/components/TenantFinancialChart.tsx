"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type TenantStationResume = {
  station__nom: string;
  recettes: number;
  depenses: number;
};

type TenantFinancialChartProps = {
  data: TenantStationResume[];
};

export default function TenantFinancialChart({ data }: TenantFinancialChartProps) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const chartData = data.map((s) => ({
    station: s.station__nom,
    recettes: s.recettes,
    depenses: s.depenses,
  }));

  return (
    <ChartWrapper title="Recettes vs Dépenses par station">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <XAxis dataKey="station" />
          <YAxis />
          <Tooltip formatter={formatMoney} />
          <Legend />
          <Line type="monotone" dataKey="recettes" stroke="#4CAF50" />
          <Line type="monotone" dataKey="depenses" stroke="#F44336" />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ------------------------------------------------------------------ */

function ChartWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function formatMoney(value: number) {
  return `${value.toLocaleString()} FCFA`;
}
