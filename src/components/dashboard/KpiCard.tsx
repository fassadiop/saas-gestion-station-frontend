type Props = {
  label: string;
  value: number | string;
};

export default function KpiCard({ label, value }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="text-2xl font-semibold">
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </p>
    </div>
  );
}
