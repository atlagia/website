import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';

// Stripe configuration for Connect
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '', {
  stripeAccount: process.env.STRIPE_ACCOUNT_ID
});

// Stripe Connect Payment Component
interface StripeConnectPaymentProps {
  total: number;
  currency: string;
  sellerAccountId: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

// Internal payment form for Stripe Connect
const StripeConnectPaymentForm: React.FC<StripeConnectPaymentProps> = ({
  total, 
  currency, 
  sellerAccountId,
  onPaymentSuccess, 
  onPaymentError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on the server with Connect account
      const response = await fetch('/api/create-connect-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: total,
          currency: currency,
          sellerAccountId: sellerAccountId
        })
      });

      const { clientSecret, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      // Confirm card payment with Connect account
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Customer Name' // TODO: Get from form
          }
        },
        // Specify the connected account for the payment
        transfer_group: `order_${Date.now()}`,
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        onPaymentError(result.error.message || 'Payment failed');
      } else {
        onPaymentSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="stripe-connect-payment-container">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card-element-container border rounded-md p-3">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!stripe || processing}
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-semibold"
        >
          {processing ? 'Processing...' : `Pay €${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

// Wrapper component to provide Stripe Connect context
const StripeConnectPayment: React.FC<StripeConnectPaymentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeConnectPaymentForm {...props} />
    </Elements>
  );
};

export default StripeConnectPayment;