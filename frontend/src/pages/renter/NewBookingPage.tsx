import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateBooking } from "@/hooks/bookings/useCreateBooking";

export default function NewBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createBooking = useCreateBooking();

  const carIdFromQuery = searchParams.get("carId") ?? "";
  const [carId, setCarId] = useState(carIdFromQuery);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carId || !pickupDate || !returnDate) {
      toast.error("Car, pickup date, and return date are required");
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        carId,
        pickupDate,
        returnDate,
        notes: notes || undefined
      });
      toast.success("Booking request sent");
      navigate(`/renter/bookings/${booking.id}`);
    } catch {
      toast.error("Failed to create booking");
    }
  };

  return (
    <div className="max-w-xl rounded-xl border bg-white p-4">
      <h1 className="text-xl font-bold">Request a Booking</h1>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Car ID"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2"
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2"
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button className="rounded bg-brand-600 px-4 py-2 text-white" type="submit" disabled={createBooking.isPending}>
          {createBooking.isPending ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}