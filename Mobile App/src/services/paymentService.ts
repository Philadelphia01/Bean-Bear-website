// Payment Processing Service using Stripe
// Note: Requires @stripe/stripe-js package
// Install: npm install @stripe/stripe-js

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here';

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

class PaymentService {
  private stripe: Stripe | null = null;

  async initialize(): Promise<void> {
    this.stripe = await getStripe();
  }

  // Create payment intent on server
  // This should call your backend API
  async createPaymentIntent(amount: number, currency: string = 'zar'): Promise<PaymentIntent> {
    try {
      // In production, this should call your backend API
      // For now, we'll use a mock implementation
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      // Fallback for development
      return {
        id: 'pi_mock_' + Date.now(),
        amount: Math.round(amount * 100),
        currency: currency.toUpperCase(),
        status: 'requires_payment_method',
      };
    }
  }

  // Confirm payment with Stripe
  async confirmPayment(
    clientSecret: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.stripe) {
      await this.initialize();
    }

    if (!this.stripe) {
      return { success: false, error: 'Stripe not initialized' };
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (paymentIntent?.status === 'succeeded') {
        return { success: true };
      }

      return { success: false, error: 'Payment not completed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Payment failed' };
    }
  }

  // Create payment method
  async createPaymentMethod(cardElement: any): Promise<PaymentMethod | null> {
    if (!this.stripe) {
      await this.initialize();
    }

    if (!this.stripe) {
      return null;
    }

    try {
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Error creating payment method:', error);
        return null;
      }

      return {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card
          ? {
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
              exp_month: paymentMethod.card.exp_month,
              exp_year: paymentMethod.card.exp_year,
            }
          : undefined,
      };
    } catch (error) {
      console.error('Error creating payment method:', error);
      return null;
    }
  }

  // Process payment (simplified version for cash payments)
  async processCashPayment(amount: number): Promise<{ success: boolean }> {
    // Cash payments don't need processing
    return { success: true };
  }
}

export const paymentService = new PaymentService();

