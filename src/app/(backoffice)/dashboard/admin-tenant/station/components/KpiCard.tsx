"use client";

interface Props {
  label: string;
  value: string | number;
}

export default function KpiCard({ label, value }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-background">
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}
