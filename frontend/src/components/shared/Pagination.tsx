type Props = {
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ total, page, limit, onPageChange }: Props) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <p>
        Showing {total === 0 ? 0 : from}-{to} of {total}
      </p>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded border px-3 py-1 disabled:opacity-50">
          Previous
        </button>
        <span className="px-2 py-1">{page}/{totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="rounded border px-3 py-1 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
}
