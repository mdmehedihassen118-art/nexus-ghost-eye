'use client';

import React, { useState } from 'react';
import { Crown, Check, X, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  isPro,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to initiate checkout.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An unexpected error occurred during checkout setup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Unlock Unlimited AI Prompting</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Choose Your PromptCraft AI Plan
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Supercharge your workflow with tailor-made enterprise prompts.
          </p>
        </div>

        {/* Plan Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Free Tier */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-base">Free Starter</h3>
                <span className="text-xs font-medium text-slate-400">Basic</span>
              </div>
              <div className="text-2xl font-black text-white mb-4">
                $0 <span className="text-xs font-normal text-slate-400">/ forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3 Prompt Generations per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 Prompts generated per run</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Marketing, Sales, Coding & HR</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="mt-6 w-full py-2.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold text-center cursor-not-allowed"
            >
              Current Default Plan
            </button>
          </div>

          {/* Pro Tier ($9/mo) */}
          <div className="relative p-5 rounded-xl bg-gradient-to-b from-purple-950/40 via-slate-900 to-indigo-950/40 border-2 border-purple-500/60 flex flex-col justify-between shadow-xl">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  Pro Membership
                </h3>
              </div>
              <div className="text-3xl font-black text-white mb-4">
                $9 <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2 font-medium text-purple-300">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
                  <span>Unlimited Prompt Generations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>GPT-4 / Claude Enhanced AI Engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click Copy & Favorite Storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority Customer Support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isLoading || isPro}
              className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Loading Stripe Checkout...</span>
              ) : isPro ? (
                <span>Pro Plan Active ✓</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Subscribe for $9/month</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure checkout processed by Stripe. Cancel anytime in 1-click.</span>
        </div>
      </div>
    </div>
  );
};
