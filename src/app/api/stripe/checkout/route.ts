import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const userIdentifier = body.userIdentifier || 'anonymous_user';

    const origin = req.headers.get('origin') || req.nextUrl.origin || 'http://localhost:3000';
    const result = await createCheckoutSession(origin, userIdentifier);

    if (result.error || !result.url) {
      return NextResponse.json(
        { error: result.error || 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (err: any) {
    console.error('Error in /api/stripe/checkout:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
