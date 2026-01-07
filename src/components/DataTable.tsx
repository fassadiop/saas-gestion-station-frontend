// src/components/DataTable.tsx

"use client";

import React from "react";

type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  title?: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: boolean;
  search?: string;
  onSearchChange?: (v: string) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function DataTable<T>({
  title,
  columns,
  data,
  loading,
  error,
  search,
  onSearchChange,
  page,
  pageSize,
  total,
  onPageChange,
}: Props<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || onSearchChange) && (
        <div className="flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}

          {onSearchChange && (
            <input
              type="text"
              value={search ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher…"
              className="border rounded px-3 py-2 text-sm w-64"
            />
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-3 text-left text-sm font-medium text-gray-600"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-gray-500"
                >
                  Chargement…
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-red-600"
                >
                  Erreur de chargement
                </td>
              </tr>
            )}

            {!loading && !error && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-gray-500"
                >
                  Aucun résultat
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              data.map((row, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="p-3 text-sm">
                      {col.render
                        ? col.render(row)
                        : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Page {page} sur {totalPages} — {total} éléments
        </div>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Précédent
          </button>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
