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

import { StationDashboardEvolutionPoint } from "@/types/dashboard";

type FinancialChartProps = {
  data: StationDashboardEvolutionPoint[];
};

export default function FinancialChart({ data }: FinancialChartProps) {
  // 🛡️ Sécurité absolue
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <ChartWrapper title="Évolution des recettes et dépenses">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={formatMoney} />
          <Legend />
          <Line
            type="monotone"
            dataKey="recettes"
            stroke="#4CAF50"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="depenses"
            stroke="#F44336"
            strokeWidth={2}
          />
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
