export default function ReviewCard({ review }: { review: { rating: number; comment: string; reviewer?: { firstName: string; lastName: string } } }) {
  return (
    <article className="rounded border bg-white p-3">
      <p className="font-medium">{review.rating} ★</p>
      <p className="text-sm text-slate-700">{review.comment}</p>
      {review.reviewer ? <p className="mt-1 text-xs text-slate-500">{review.reviewer.firstName} {review.reviewer.lastName}</p> : null}
    </article>
  );
}
