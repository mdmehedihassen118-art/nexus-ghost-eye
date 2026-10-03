import Stripe from 'stripe';

export const PRO_PLAN_PRICE_USD = 9;

// Lazily initialize Stripe client to prevent build-time missing secret key errors
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
    stripeClient = new Stripe(apiKey, {
      apiVersion: '2024-09-30.acacia' as any
    });
  }
  return stripeClient;
}

export async function createProCheckoutSession(options: {
  successUrl: string;
  cancelUrl: string;
  clientReferenceId?: string;
  customerEmail?: string;
}): Promise<{ url: string | null; sessionId: string }> {
  const stripe = getStripeClient();

  // If running without a real Stripe key in development/demo mode, return simulated checkout URL
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_placeholder')) {
    return {
      url: `${options.successUrl}?session_id=mock_session_${Date.now()}&status=success`,
      sessionId: `mock_session_${Date.now()}`
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'PromptCraft AI Pro Subscription',
            description: 'Unlimited AI prompt generations for Marketing, Sales, Coding, and HR.'
          },
          unit_amount: PRO_PLAN_PRICE_USD * 100, // $9.00 USD
          recurring: {
            interval: 'month'
          }
        },
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    client_reference_id: options.clientReferenceId,
    customer_email: options.customerEmail
  });

  return {
    url: session.url,
    sessionId: session.id
  };
}

export function constructWebhookEvent(body: string | Buffer, signature: string, webhookSecret: string): Stripe.Event {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}
