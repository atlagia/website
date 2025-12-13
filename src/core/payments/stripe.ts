import Stripe from 'stripe';

// Stripe Account Types
export enum StripeAccountType {
  EXPRESS = 'express',
  STANDARD = 'standard',
  CUSTOM = 'custom'
}

// Stripe Payment Methods
export enum StripePaymentMethod {
  CARD = 'card',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  ACH_DEBIT = 'ach_debit'
}

// Stripe Connect Account Configuration
export interface StripeConnectConfig {
  accountType: StripeAccountType;
  country: string;
  currency: string;
  businessType: 'individual' | 'company';
  capabilities?: string[];
}

// Merchant Account Creation Result
export interface MerchantAccountResult {
  accountId: string;
  accountLink: string;
  status: 'pending' | 'active' | 'rejected';
}

// Payment Intent Creation Options
export interface StripePaymentIntentOptions {
  amount: number;
  currency: string;
  sellerAccountId?: string;
  applicationFeeAmount?: number;
  transferGroup?: string;
  metadata?: Record<string, string>;
}

// Stripe Configuration Singleton
export class StripeConfig {
  private static instance: StripeConfig;
  public client: Stripe;

  private constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not configured');
    }

    this.client = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true
    });
  }

  public static getInstance(): StripeConfig {
    if (!StripeConfig.instance) {
      StripeConfig.instance = new StripeConfig();
    }
    return StripeConfig.instance;
  }

  // Validate Stripe configuration
  public validateConfig() {
    const requiredEnvVars = [
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(`Missing Stripe configuration: ${missingVars.join(', ')}`);
    }
  }

  // Create a Stripe Connect account
  public async createConnectAccount(
    merchantData: {
      email: string;
      businessName: string;
      country?: string;
    },
    config: StripeConnectConfig = {
      accountType: StripeAccountType.EXPRESS,
      country: 'US',
      currency: 'usd',
      businessType: 'individual'
    }
  ): Promise<MerchantAccountResult> {
    try {
      // Create Stripe account
      const account = await this.client.accounts.create({
        type: config.accountType,
        country: config.country,
        email: merchantData.email,
        business_type: config.businessType,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        },
        metadata: {
          business_name: merchantData.businessName
        }
      });

      // Generate account onboarding link
      const accountLink = await this.client.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.APP_URL}/stripe/onboarding/refresh`,
        return_url: `${process.env.APP_URL}/stripe/onboarding/success`,
        type: 'account_onboarding'
      });

      return {
        accountId: account.id,
        accountLink: accountLink.url,
        status: 'pending'
      };
    } catch (error) {
      console.error('Stripe Connect Account Creation Error:', error);
      throw new Error('Failed to create Stripe Connect account');
    }
  }

  // Create a payment intent
  public async createPaymentIntent(
    options: StripePaymentIntentOptions
  ) {
    try {
      const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(options.amount * 100), // Convert to cents
        currency: options.currency,
        transfer_group: options.transferGroup || `order_${Date.now()}`,
        metadata: options.metadata
      };

      // Add application fee for Connect accounts
      if (options.sellerAccountId && options.applicationFeeAmount) {
        paymentIntentOptions.application_fee_amount = 
          Math.round(options.applicationFeeAmount * 100);
        paymentIntentOptions.on_behalf_of = options.sellerAccountId;
        paymentIntentOptions.transfer_data = {
          destination: options.sellerAccountId
        };
      }

      const paymentIntent = await this.client.paymentIntents.create(
        paymentIntentOptions
      );

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe Payment Intent Creation Error:', error);
      throw new Error('Failed to create payment intent');
    }
  }
}

// Export singleton instance
export const stripeConfig = StripeConfig.getInstance();