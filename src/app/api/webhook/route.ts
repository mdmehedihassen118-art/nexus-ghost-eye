import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    let event;
    if (webhookSecret && !webhookSecret.includes('mock')) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`[Stripe Webhook] Subscription checkout completed for customer: ${session.customer}`);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`[Stripe Webhook] Subscription canceled: ${subscription.id}`);
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
