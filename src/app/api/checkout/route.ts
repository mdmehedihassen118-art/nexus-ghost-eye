import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_monthly_9';

    // If real Stripe key is provided, create real session
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock')) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Direct success redirect for preview / demo mode when Stripe live keys aren't configured
    return NextResponse.json({
      url: `${origin}/?success=true&mock_pro=true`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
