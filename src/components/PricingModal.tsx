'use client';

import React, { useState } from 'react';
import { X, Crown, Check, Zap, Shield, Sparkles, Loader2 } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, clientId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to initiate Stripe Checkout session.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Crown className="w-6 h-6 fill-amber-400/20" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Upgrade to Pro</h3>
            <p className="text-slate-400 text-xs">Unlock unlimited prompt generation power</p>
          </div>
        </div>

        <div className="my-6 p-5 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-4xl font-extrabold text-white">$9</span>
            <span className="text-slate-400 text-sm font-medium">/ month</span>
          </div>

          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Unlimited AI prompt generations</strong> (No daily caps)</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full access to Marketing, Sales, Coding, & HR</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Advanced GPT-4o custom tailoring & detailed context</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Priority response speed & zero queue waiting</span>
            </li>
            <li className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cancel or pause subscription anytime</span>
            </li>
          </ul>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting to Checkout...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Subscribe Now - $9/month</span>
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-slate-500">
          <Shield className="w-3.5 h-3.5" />
          <span>Secured by Stripe SSL 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
};
