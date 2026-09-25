import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const PRO_PLAN_PRICE = 900; // $9.00 USD in cents
export const PRO_PLAN_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_pro_monthly';

export async function createCheckoutSession(origin: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    // In demo/test environment without real Stripe API key, simulate checkout URL
    return { url: `${origin}/?checkout=success` };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'PromptCraft AI Pro',
            description: 'Unlimited AI Prompt Generations for Marketing, Sales, Coding & HR',
          },
          unit_amount: PRO_PLAN_PRICE,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
  });

  return { url: session.url };
}
