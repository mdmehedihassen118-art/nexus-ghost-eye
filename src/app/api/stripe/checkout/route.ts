import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    if (!stripeSecretKey || stripeSecretKey === 'mock-key') {
      // In development or when Stripe is unconfigured, simulate successful Pro subscription activation
      const res = NextResponse.json({
        url: `${origin}/?session_id=mock_session_success&status=success`,
      });
      res.cookies.set('pro_access', 'true', {
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        sameSite: 'lax',
      });
      return res;
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia' as any,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PromptCraft AI Pro Plan',
              description: 'Unlimited AI prompt generation, all categories, premium support.',
            },
            unit_amount: 900, // $9.00 USD
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${origin}/?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
