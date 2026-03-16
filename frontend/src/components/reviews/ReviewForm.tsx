import { useState } from "react";

export default function ReviewForm({ onSubmit }: { onSubmit: (data: { rating: number; comment: string }) => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <div className="rounded border bg-white p-4">
      <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded border px-2 py-1" />
      <textarea className="mt-2 w-full rounded border px-2 py-1" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="mt-2 rounded bg-brand-600 px-3 py-1 text-sm text-white" onClick={() => onSubmit({ rating, comment })}>Submit Review</button>
    </div>
  );
}
