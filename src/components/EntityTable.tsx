"use client";
import React from "react";

type Column<T> = { key: keyof T; label: string; render?: (row: T) => React.ReactNode };
type Props<T> = {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onAdd?: () => void;
};

export function EntityTable<T>({ data, columns, onEdit, onDelete, onAdd }: Props<T>) {
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold">Liste</div>
        {/* <div>
          {onAdd && <button onClick={onAdd} className="bg-primary text-white px-3 py-1 rounded">Ajouter</button>}
        </div> */}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            {columns.map((c) => <th key={String(c.key)} className="p-3 bg-gray-50">{c.label}</th>)}
            <th className="p-3 bg-gray-50">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">Aucun enregistrement</td></tr>
          ) : data.map((row: any, i: number) => (
            <tr key={i} className="border-t">
              {columns.map((c) => <td key={String(c.key)} className="p-3">{c.render ? c.render(row) : row[c.key]}</td>)}
              <td className="p-3">
                {onEdit && <button onClick={() => onEdit(row)} className="text-sm mr-2 underline">Modifier</button>}
                {onDelete && <button onClick={() => onDelete(row)} className="text-sm text-red-600 underline">Supprimer</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
