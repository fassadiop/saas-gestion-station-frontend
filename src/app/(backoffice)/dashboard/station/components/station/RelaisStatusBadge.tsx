type Props = { status: string };

export default function RelaisStatusBadge({ status }: Props) {
  const map: Record<string, string> = {
    BROUILLON: "bg-gray-200 text-gray-800",
    SOUMIS: "bg-yellow-100 text-yellow-800",
    VALIDE: "bg-green-100 text-green-800",
    REJETE: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        map[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}
