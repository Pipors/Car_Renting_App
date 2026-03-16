import { useState } from "react";
import { useRateRenter } from "@/hooks/reputation/useRateRenter";

export default function RaterModal({ bookingId }: { bookingId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const rateRenter = useRateRenter();

  return (
    <div className="rounded border bg-white p-4">
      <h3 className="font-semibold">Rate renter</h3>
      <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-2 rounded border px-2 py-1" />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="mt-2 w-full rounded border px-2 py-1" placeholder="Comment" />
      <button
        className="mt-2 rounded bg-brand-600 px-3 py-1 text-sm text-white"
        onClick={() => rateRenter.mutate({ bookingId, rating, tags: ["on_time"], comment })}
      >
        Submit
      </button>
    </div>
  );
}
