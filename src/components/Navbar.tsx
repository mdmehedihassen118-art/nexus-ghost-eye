'use client';

import React from 'react';
import { Sparkles, Crown, Bookmark } from 'lucide-react';

interface NavbarProps {
  isPro: boolean;
  dailyUsageCount: number;
  maxFreeLimit: number;
  onOpenPricing: () => void;
  onOpenHistory: () => void;
  favoriteCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPro,
  dailyUsageCount,
  maxFreeLimit,
  onOpenPricing,
  onOpenHistory,
  favoriteCount,
}) => {
  const remainingGenerations = isPro ? Infinity : Math.max(0, maxFreeLimit - dailyUsageCount);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
                PromptCraft AI
              </span>
              {isPro ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                  PRO
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  FREE TIER
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Usage Badge */}
          {!isPro ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                Free Prompts Left Today:{' '}
                <strong className={remainingGenerations === 0 ? 'text-rose-400 font-bold' : 'text-purple-400 font-bold'}>
                  {remainingGenerations}/{maxFreeLimit}
                </strong>
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/50 border border-purple-800/40 text-xs font-medium text-purple-300">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Unlimited Pro Generations Active</span>
            </div>
          )}

          {/* Favorites Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex items-center gap-1.5 text-xs font-medium"
            title="View Saved Prompts"
          >
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Saved</span>
            {favoriteCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white font-bold text-[10px]">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Pro Upgrade Trigger */}
          {!isPro ? (
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 border border-purple-400/30 transition transform active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Upgrade to Pro ($9)</span>
            </button>
          ) : (
            <button
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-300 transition"
            >
              Manage Plan
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
