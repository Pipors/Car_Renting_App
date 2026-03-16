export default function StarRating({ value }: { value: number }) {
  return <span>{"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}</span>;
}
