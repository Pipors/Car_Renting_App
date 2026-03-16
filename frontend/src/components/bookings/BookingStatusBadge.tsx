import type { BookingStatus } from "@/types/api.types";
import { cn } from "@/utils/cn";

const map: Record<BookingStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700",
  APPROVED: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-green-100 text-green-700",
  COMPLETED: "bg-teal-100 text-teal-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-500"
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <span className={cn("rounded-full px-2 py-1 text-xs font-medium", map[status])}>{status}</span>;
}
