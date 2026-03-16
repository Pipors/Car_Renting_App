type Props = {
  filters: URLSearchParams;
  onChange: (next: URLSearchParams) => void;
};

export default function CarFilters({ filters, onChange }: Props) {
  const setValue = (key: string, value: string) => {
    const next = new URLSearchParams(filters);
    if (!value) next.delete(key);
    else next.set(key, value);
    onChange(next);
  };

  return (
    <div className="space-y-3 rounded-xl border bg-white p-4">
      <input
        placeholder="City"
        className="w-full rounded border px-3 py-2 text-sm"
        defaultValue={filters.get("city") ?? ""}
        onChange={(e) => setValue("city", e.target.value)}
      />
      <select className="w-full rounded border px-3 py-2 text-sm" defaultValue={filters.get("type") ?? ""} onChange={(e) => setValue("type", e.target.value)}>
        <option value="">All types</option>
        <option value="sedan">Sedan</option>
        <option value="suv">SUV</option>
        <option value="hatchback">Hatchback</option>
        <option value="van">Van</option>
      </select>
      <button
        className="w-full rounded border px-3 py-2 text-sm"
        onClick={() => onChange(new URLSearchParams())}
        type="button"
      >
        Clear filters
      </button>
    </div>
  );
}
