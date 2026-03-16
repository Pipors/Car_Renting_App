import ReputationScore from "@/components/reputation/ReputationScore";
import ReputationTags from "@/components/reputation/ReputationTags";
import { useMyReputation } from "@/hooks/reputation/useMyReputation";

export default function MyReputationPage() {
  const query = useMyReputation();
  const data = query.data?.data;

  if (!data) return <div className="rounded border bg-white p-4">Loading reputation...</div>;

  return (
    <div className="space-y-4">
      <ReputationScore size="lg" score={data.reputation.avgScore} totalRatings={data.reputation.totalRatings} />
      <ReputationTags tags={data.reputation.tags} />
    </div>
  );
}
