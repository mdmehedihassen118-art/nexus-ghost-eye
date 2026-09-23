import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret_key',
  {
    apiVersion: '2026-08-26.dahlia',
    typescript: true,
  }
);
