import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const apiKey = process.env.STRIPE_SECRET_KEY;

    if (apiKey) {
      const stripe = new Stripe(apiKey, {
        apiVersion: "2026-08-26.dahlia",
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "PromptCraft AI Pro",
                description: "Unlimited AI Prompt Generations + Advanced Custom Tuning ($9/month)",
              },
              unit_amount: 900, // $9.00 USD
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/?checkout=success`,
        cancel_url: `${origin}/?checkout=cancelled`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Demo/Sandbox fallback mode when Stripe Secret Key is not configured
    return NextResponse.json({
      url: `${origin}/?checkout=success&demo=true`,
      isDemo: true,
      message: "Pro plan unlocked in Demo Mode!",
    });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
