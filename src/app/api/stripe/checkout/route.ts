import { NextRequest, NextResponse } from 'next/server';
import { createProCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || req.headers.get('referer') || 'http://localhost:3000';
    const body = await req.json().catch(() => ({}));
    const { clientId, email } = body;

    const successUrl = `${origin}/?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/?stripe_status=cancelled`;

    const { url, sessionId } = await createProCheckoutSession({
      successUrl,
      cancelUrl,
      clientReferenceId: clientId,
      customerEmail: email
    });

    return NextResponse.json({ url, sessionId });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize Stripe checkout session.' },
      { status: 500 }
    );
  }
}
