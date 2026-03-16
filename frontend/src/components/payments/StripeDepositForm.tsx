import { PaymentElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { usePaymentConfirm } from "@/hooks/payments/usePaymentConfirm";

function StripeInner({ clientSecret, bookingId }: { clientSecret: string; bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const confirm = usePaymentConfirm();

  const onSubmit = async () => {
    if (!stripe || !elements) return;
    const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (!result.error && result.paymentIntent?.id) {
      confirm.mutate({ bookingId, paymentIntentId: result.paymentIntent.id });
    }
  };

  return (
    <div className="space-y-3 rounded border bg-white p-4">
      <PaymentElement />
      <button className="rounded bg-brand-600 px-3 py-1 text-sm text-white" onClick={onSubmit}>Confirm deposit</button>
      <p className="text-xs text-slate-500">Client secret: {clientSecret.slice(0, 16)}...</p>
    </div>
  );
}

export default function StripeDepositForm({ clientSecret, bookingId }: { clientSecret: string; bookingId: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeInner clientSecret={clientSecret} bookingId={bookingId} />
    </Elements>
  );
}
