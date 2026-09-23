"use client";

import React, { useState } from "react";
import { X, Check, Crown, Zap, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockPro: () => void;
  isPro: boolean;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onUnlockPro,
  isPro,
}) => {
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.url) {
        if (data.isDemo) {
          // Instantly activate Pro in local state
          onUnlockPro();
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          onClose();
        } else {
          // Redirect to Stripe Hosted Checkout Page
          window.location.href = data.url;
        }
      } else {
        alert("Failed to create Stripe session. Unlocking Pro demo mode...");
        onUnlockPro();
        onClose();
      }
    } catch (err) {
      console.error(err);
      onUnlockPro();
      onClose();
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e1526] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Supercharge Your AI Workflows</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Upgrade to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">PromptCraft Pro</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Get unlimited prompt generations, custom tone tuning, and priority AI exports for your business.
          </p>
        </div>

        {/* Pricing Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
          {/* Free Tier */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-300">Free Tier</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">Current</span>
              </div>
              <div className="text-2xl font-bold text-white mb-4">
                $0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>3 prompt generations / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>All 4 core categories</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>One-click copy to clipboard</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pro Tier ($9/month) */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-b from-indigo-900/40 via-purple-900/20 to-slate-900/90 border-2 border-indigo-500 shadow-xl flex flex-col justify-between">
            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-sm font-bold text-white">Pro Plan</span>
              </div>
              <div className="text-3xl font-extrabold text-white mb-4">
                $9 <span className="text-xs text-indigo-300 font-normal">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>UNLIMITED</strong> prompt generations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Advanced audience & tone tuning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Priority TXT/JSON/CSV exports</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Direct AI execution simulator</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              {isPro ? (
                <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold text-xs">
                  Pro Plan Currently Active!
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={loadingCheckout}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition transform active:scale-95 flex items-center justify-center space-x-2"
                >
                  {loadingCheckout ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting Stripe...</span>
                    </>
                  ) : (
                    <>
                      <span>Upgrade to Pro Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security / Guarantee Footer */}
        <div className="text-center border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-slate-500 relative z-10">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Encrypted Stripe Checkout</span>
          </div>
          <div>Cancel anytime in 1-click</div>
        </div>
      </div>
    </div>
  );
};
