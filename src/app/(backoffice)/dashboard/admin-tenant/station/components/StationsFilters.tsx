"use client";

interface Props {
  region: string;
  active: boolean | "";
  onChange: (v: { region: string; active: boolean | "" }) => void;
}

export default function StationsFilters({
  region,
  active,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        className="input input-bordered"
        placeholder="Filtrer par région"
        value={region}
        onChange={(e) =>
          onChange({ region: e.target.value, active })
        }
      />

      <select
        className="select select-bordered"
        value={active === "" ? "" : String(active)}
        onChange={(e) =>
          onChange({
            region,
            active:
              e.target.value === ""
                ? ""
                : e.target.value === "true",
          })
        }
      >
        <option value="">Tous</option>
        <option value="true">Actives</option>
        <option value="false">Inactives</option>
      </select>
    </div>
  );
}
