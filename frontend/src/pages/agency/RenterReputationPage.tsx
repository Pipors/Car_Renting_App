import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ratingsService } from "@/services";

export function RenterReputationPage() {
  const { renterId } = useParams<{ renterId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["renter-reputation", renterId],
    queryFn: () => ratingsService.getRenterReputation(renterId!),
    enabled: !!renterId,
  });

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (isError || !data) return <p className="text-destructive">Failed to load reputation data.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-muted-foreground">Renter Reputation</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-6 w-6 ${
                    s <= Math.round(data.reputationScore)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div>
              <p className="text-2xl font-bold">{data.reputationScore.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">
                Based on {data.ratingCount} rating{data.ratingCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {data.ratings.length === 0 && (
          <p className="text-muted-foreground">No reviews yet.</p>
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
                <p className="text-sm text-muted-foreground">{rating.comment}</p>
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
