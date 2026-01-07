export default function VenteStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    BROUILLON: {
      label: "Brouillon",
      className: "badge badge-outline",
    },
    SOUMIS: {
      label: "Soumis",
      className: "badge badge-info",
    },
    VALIDE: {
      label: "Validé",
      className: "badge badge-warning",
    },
    TRANSFERE: {
      label: "Transféré",
      className: "badge badge-success",
    },
  };

  const conf = map[status] ?? {
    label: status,
    className: "badge",
  };

  return (
    <span className={conf.className}>
      {conf.label}
    </span>
  );
}
