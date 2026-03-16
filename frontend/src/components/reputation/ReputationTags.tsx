type Tags = Record<string, number>;

const tagColor = (k: string) => {
  if (["major_damage", "no_show"].includes(k)) return "bg-red-100 text-red-700";
  if (["minor_damage", "late_return"].includes(k)) return "bg-amber-100 text-amber-700";
  return "bg-green-100 text-green-700";
};

export default function ReputationTags({ tags }: { tags: Tags }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(tags).map(([k, v]) => (
        <span key={k} className={`rounded-full px-2 py-1 text-xs ${tagColor(k)}`}>
          {k.replace(/_/g, " ")} ({v})
        </span>
      ))}
    </div>
  );
}
