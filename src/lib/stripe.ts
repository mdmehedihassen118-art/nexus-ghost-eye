import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  : null;

export const PRO_PLAN_PRICE_USD = 9;
export const PRO_PLAN_NAME = 'PromptCraft AI Pro';

export async function createCheckoutSession(
  baseUrl: string,
  userIdentifier: string
): Promise<{ url: string | null; error?: string }> {
  if (!stripe) {
    // If Stripe key isn't configured, return mock upgrade success url for dev/demo mode
    return {
      url: `${baseUrl}/?upgraded=true`,
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: PRO_PLAN_NAME,
              description: 'Unlimited AI prompt generations for Marketing, Sales, Coding, & HR.',
            },
            unit_amount: PRO_PLAN_PRICE_USD * 100, // $9.00 in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      client_reference_id: userIdentifier,
    });

    return { url: session.url };
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return { url: null, error: err.message || 'Failed to create checkout session' };
  }
}
