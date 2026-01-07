export default function Pagination({
  page,
  pageSize,
  count,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  count: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="flex justify-end gap-2">
      <button
        className="btn btn-sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Précédent
      </button>

      <span className="text-sm self-center">
        Page {page} / {totalPages}
      </span>

      <button
        className="btn btn-sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  );
}
