import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authService, ratingsService } from "@/services";

export function MyReputationPage() {
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
  });

  const renterId = me?.renter?.id;

  const { data, isLoading } = useQuery({
    queryKey: ["my-reputation", renterId],
    queryFn: () => ratingsService.getRenterReputation(renterId!),
    enabled: !!renterId,
  });

  if (isLoading || !data) {
    return <p className="text-muted-foreground">Loading reputation...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Reputation</h1>
        <p className="text-muted-foreground mt-1">
          Your cross-agency renter score
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-8 w-8 ${
                    s <= Math.round(data.reputationScore)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div>
              <p className="text-4xl font-bold">{data.reputationScore.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">
                {data.ratingCount} rating{data.ratingCount !== 1 ? "s" : ""} from agencies
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Reviews from agencies</h2>
        {data.ratings.length === 0 && (
          <p className="text-muted-foreground">
            No reviews yet. Complete a rental to receive your first review.
          </p>
        )}
        {data.ratings.map((rating) => (
          <Card key={rating.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {rating.agency?.companyName ?? "Agency"}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= rating.score
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <Badge variant="outline" className="ml-2">
                    {rating.score}/5
                  </Badge>
                </div>
              </div>
            </CardHeader>
            {rating.comment && (
              <CardContent className="pb-4">
                <p className="text-sm">{rating.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
