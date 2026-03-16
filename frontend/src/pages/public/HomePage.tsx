import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (pickupDate) params.set("pickupDate", pickupDate);
    if (returnDate) params.set("returnDate", returnDate);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-brand-700">Find Your Next Rental Car</h1>
        <p className="mt-2 text-slate-600">Search, book, and drive with trust.</p>
        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input className="rounded border px-3 py-2" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <input className="rounded border px-3 py-2" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
          <input className="rounded border px-3 py-2" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          <button className="rounded bg-brand-600 px-4 py-2 font-medium text-white" type="submit">Search cars</button>
        </form>
      </div>
    </section>
  );
}
