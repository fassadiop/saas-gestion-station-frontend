"use client";

import React from "react";

type KpiCardProps = {
  label: string;
  value: string | number;
  color?: string;
};

export default function KpiCard({
  label,
  value,
  color = "text-gray-900",
}: KpiCardProps) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${color}`}>
        {value}
      </div>
    </div>
  );
}
