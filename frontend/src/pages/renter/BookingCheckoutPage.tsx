import { useLocation, useParams } from "react-router-dom";
import StripeDepositForm from "@/components/payments/StripeDepositForm";

export default function BookingCheckoutPage() {
  const { id } = useParams();
  const location = useLocation() as { state?: { clientSecret?: string } };
  const clientSecret = location.state?.clientSecret;

  if (!id || !clientSecret) {
    return <div className="rounded border bg-white p-4">Missing checkout data. Re-open booking and try again.</div>;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Booking Checkout</h1>
      <StripeDepositForm bookingId={id} clientSecret={clientSecret} />
    </div>
  );
}
