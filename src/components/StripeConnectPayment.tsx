import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { 
  FaCreditCard, 
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcDinersClub,
  FaCcJcb
} from 'react-icons/fa';

// Interface for component props
interface StripeConnectPaymentProps {
  amount: number;
  sellerAccountId: string;
  stripePublishableKey?: string;
  onPaymentSuccess?: (paymentDetails: {
    paymentIntentId: string;
    amount: number;
  }) => void;
  onPaymentError?: (error: string) => void;
}

// Default no-op functions to prevent undefined errors
const defaultOnPaymentSuccess = (details: { paymentIntentId: string; amount: number }) => {
  console.log('Payment Successful:', details);
};
const defaultOnPaymentError = (error: string) => {
  console.error('Payment Error:', error);
};

// Minimalist black and white payment method icons
const PaymentMethodIcons = () => (
  <div className="flex items-center justify-center space-x-2 my-4 text-gray-700">
    <FaCcVisa className="w-10 h-6 opacity-80 grayscale" />
    <FaCcMastercard className="w-10 h-6 opacity-80 grayscale" />
    <FaCcAmex className="w-10 h-6 opacity-80 grayscale" />
    <FaCcDiscover className="w-10 h-6 opacity-80 grayscale" />
    <FaCcDinersClub className="w-10 h-6 opacity-80 grayscale" />
    <FaCcJcb className="w-10 h-6 opacity-80 grayscale" />
  </div>
);

// Internal payment form component
const StripeConnectPaymentForm: React.FC<StripeConnectPaymentProps> = ({
  amount,
  sellerAccountId,
  stripePublishableKey,
  onPaymentSuccess = defaultOnPaymentSuccess,
  onPaymentError = defaultOnPaymentError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Reset previous states
    setErrorMessage(null);
    setPaymentStatus('processing');
    
    if (!stripe || !elements) {
      const errorMsg = 'Stripe not loaded';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      
      // Ensure onPaymentError is a function before calling
      if (typeof onPaymentError === 'function') {
        onPaymentError(errorMsg);
      } else {
        console.error(errorMsg);
      }
      
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent on the Django backend
      const response = await fetch('https://admins.atlagia.com/api/billing/create-connect-payment/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          sellerAccountId,
          currency: 'usd',
          metadata: {
            source: 'marketplace_checkout',
            seller: sellerAccountId
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || 'Payment intent creation failed';
        throw new Error(errorMsg);
      }

      const { clientSecret, paymentIntentId, publishableKey } = await response.json();

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'Customer Name' // Replace with actual customer details
          }
        }
      });

      if (result.error) {
        const errorMsg = result.error.message || 'Payment failed';
        setErrorMessage(errorMsg);
        setPaymentStatus('error');
        
        // Ensure onPaymentError is a function before calling
        if (typeof onPaymentError === 'function') {
          onPaymentError(errorMsg);
        } else {
          console.error(errorMsg);
        }
      } else {
        // Payment successful
        setPaymentStatus('success');
        
        // Ensure onPaymentSuccess is a function before calling
        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            paymentIntentId,
            amount
          });
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      setPaymentStatus('error');
      
      // Ensure onPaymentError is a function before calling
      if (typeof onPaymentError === 'function') {
        onPaymentError(errorMsg);
      } else {
        console.error(errorMsg);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-connect-payment-form">
      <div className="payment-details mb-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
        <PaymentMethodIcons />
      </div>
      
      {/* Success Message */}
      {paymentStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Payment Successful!</strong>
          <span className="block sm:inline"> Your payment of ${amount.toFixed(2)} has been processed.</span>
        </div>
      )}
      
      {/* Error Message */}
      {paymentStatus === 'error' && errorMessage && (
        <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">
          {errorMessage}
        </div>
      )}
      
      <div className="card-element-wrapper border border-gray-300 rounded-md p-3 mb-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                fontFamily: '"Inter", sans-serif',
                '::placeholder': {
                  color: '#aab7c4',
                },
                padding: '10px',
                lineHeight: '1.5',
              },
              invalid: {
                color: '#9e2146',
                iconColor: '#9e2146'
              }
            },
            classes: {
              base: 'stripe-card-input',
              complete: 'stripe-card-complete',
              empty: 'stripe-card-empty',
              focus: 'stripe-card-focus',
              invalid: 'stripe-card-invalid'
            }
          }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isProcessing || !stripe || paymentStatus === 'success'}
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-semibold flex items-center justify-center"
      >
        {paymentStatus === 'success' ? 'Payment Completed' : 
         isProcessing ? 'Processing...' : 
         `Pay $${amount.toFixed(2)}`}
        {paymentStatus !== 'success' && <FaCreditCard className="ml-2" />}
      </button>
    </form>
  );
};

// Wrapper component to provide Stripe Elements
export const StripeConnectPayment: React.FC<StripeConnectPaymentProps> = (props) => {
  // Prefer backend-provided key, fallback to prop or empty string
  const stripePromise = loadStripe(
    props.stripePublishableKey || 
    'pk_test_51RtcKLPFl82N8NOJTtkhP4JngK4CqAFFX7eOa3p0TP4NuUZgJkr6k2njsp4A49tXaJpzRwwsd8i9niAYa2O4WNFJ00TA7l9Sz8'
  );

  return (
    <Elements stripe={stripePromise}>
      <StripeConnectPaymentForm {...props} />
    </Elements>
  );
};

export default StripeConnectPayment;