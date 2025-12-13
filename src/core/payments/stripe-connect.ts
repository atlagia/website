import Stripe from 'stripe';
import { z } from 'zod';

// Payment intent validation schema
const PaymentIntentSchema = z.object({
  amount: z.number().positive().max(100000), // $1000 max
  currency: z.string().default('usd'),
  sellerAccountId: z.string(), // Stripe Connect account ID
  applicationFeePercent: z.number().min(0).max(20).default(0.5),
  metadata: z.record(z.string(), z.string()).optional()
});

export class StripeConnectService {
  private stripe: Stripe;

  constructor(platformStripeSecretKey: string) {
    if (!platformStripeSecretKey) {
      throw new Error('Stripe Platform Secret Key is required');
    }
    
    this.stripe = new Stripe(platformStripeSecretKey, { 
      apiVersion: '2023-10-16' 
    });
  }

  // Create a payment intent for a connected account
  async createPaymentIntent(data: z.infer<typeof PaymentIntentSchema>) {
    try {
      // Validate input
      const validatedData = PaymentIntentSchema.parse(data);

      // Calculate application fee
      const applicationFee = Math.round(
        validatedData.amount * (validatedData.applicationFeePercent / 100)
      );

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(validatedData.amount * 100), // Convert to cents
        currency: validatedData.currency,
        transfer_group: `marketplace_transaction_${Date.now()}`,
        payment_method_types: ['card'],
        
        // Specify the connected account for the transfer
        on_behalf_of: validatedData.sellerAccountId,
        
        // Application fee for the platform
        application_fee_amount: applicationFee,
        
        // Metadata for tracking
        metadata: {
          ...validatedData.metadata,
          platform_fee_percent: validatedData.applicationFeePercent.toString(),
          seller_account: validatedData.sellerAccountId
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        transferGroup: paymentIntent.transfer_group
      };
    } catch (error) {
      console.error('Stripe Connect Payment Intent Error:', error);
      throw new Error('Failed to create Connect payment intent');
    }
  }

  // Confirm and process payment
  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Payment Confirmation Error:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  // Create transfer to seller's account
  async transferToSeller(
    paymentIntentId: string, 
    sellerAccountId: string
  ) {
    try {
      // Retrieve the original payment intent
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      // Create a transfer to the seller's account
      const transfer = await this.stripe.transfers.create({
        amount: paymentIntent.amount - (paymentIntent.application_fee_amount || 0),
        currency: paymentIntent.currency || 'usd',
        destination: sellerAccountId,
        transfer_group: paymentIntent.transfer_group
      });

      return transfer;
    } catch (error) {
      console.error('Transfer to Seller Error:', error);
      throw new Error('Failed to transfer funds to seller');
    }
  }
}