import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    if (!stripe) {
      // Mock session checkout when Stripe secret key is not set
      return NextResponse.json({
        url: `${origin}?pro=true&session_id=mock_stripe_session_123`
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PromptCraft AI Pro Subscription',
              description: 'Unlimited AI Prompt Generations across all categories ($9/month)',
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
      success_url: `${origin}?pro=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create Checkout session' },
      { status: 500 }
    );
  }
}
