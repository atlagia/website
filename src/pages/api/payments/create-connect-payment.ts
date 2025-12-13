import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { z } from 'zod';

// Input validation schema
const PaymentIntentSchema = z.object({
  amount: z.number().positive().max(10000), // Limit to $10,000
  currency: z.string().default('usd'),
  sellerAccountId: z.string(), // Stripe Connect account ID
  metadata: z.record(z.string(), z.string()).optional()
});

export const POST: APIRoute = async ({ request }) => {
  try {
    // Initialize Stripe with platform secret key
    const stripe = new Stripe(import.meta.env.STRIPE_PLATFORM_SECRET_KEY || '', {
      apiVersion: '2023-10-16'
    });

    // Parse and validate request body
    const body = await request.json();
    const { 
      amount, 
      currency, 
      sellerAccountId, 
      metadata 
    } = PaymentIntentSchema.parse(body);

    // Calculate application fee (0.5%)
    const applicationFeeAmount = Math.round(amount * 5); // 0.5% in cents

    // Create payment intent for connected account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: ['card'],
      
      // Specify the connected account for the transfer
      on_behalf_of: sellerAccountId,
      
      // Application fee for the platform
      application_fee_amount: applicationFeeAmount,
      
      // Transfer group for tracking
      transfer_group: `marketplace_transaction_${Date.now()}`,
      
      // Metadata for additional tracking
      metadata: {
        ...metadata,
        platform_fee_percent: '0.5',
        seller_account: sellerAccountId
      }
    });

    // Return payment intent details
    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Enable CORS
      }
    });

  } catch (error) {
    console.error('Payment Intent Creation Error:', error);

    // Handle different error types
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        error: 'Invalid input',
        details: error.errors
      }), { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to create payment intent',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

// Handle CORS preflight requests
export const OPTIONS: APIRoute = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};