import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { message: 'Webhook endpoint reached, but STRIPE_WEBHOOK_SECRET is not configured.' },
      { status: 200 }
    );
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const event = constructWebhookEvent(rawBody, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        console.log(`Stripe subscription checkout successful for client ${session.client_reference_id}`);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        console.log(`Stripe subscription cancelled for customer ${subscription.customer}`);
        break;
      }
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error verifying Stripe webhook:', err);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
}
