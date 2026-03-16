type Props = { score: number; totalRatings: number; size?: "sm" | "lg" };

export default function ReputationScore({ score, totalRatings, size = "sm" }: Props) {
  const cls = size === "lg" ? "text-3xl" : "text-base";
  return (
    <div className="rounded border bg-white p-3">
      <div className={`${cls} font-bold text-brand-700`}>{score.toFixed(1)} ★</div>
      <p className="text-xs text-slate-600">{totalRatings} ratings</p>
    </div>
  );
}
