"use client";

import React from "react";
import { Sparkles, Crown, Bookmark, Zap } from "lucide-react";

interface NavbarProps {
  isPro: boolean;
  onOpenPricing: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  usageCount: number;
  maxFree: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPro,
  onOpenPricing,
  onOpenSaved,
  savedCount,
  usageCount,
  maxFree,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#090d16]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px]">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              PromptCraft
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AI
            </span>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Daily Usage Counter */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isPro ? (
                <span className="text-emerald-400 font-medium">Unlimited Pro Plan</span>
              ) : (
                <span>
                  Free: <strong className="text-white">{Math.max(0, maxFree - usageCount)}</strong> of {maxFree} left today
                </span>
              )}
            </span>
          </div>

          {/* Saved Library Button */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-300 bg-slate-800/50 hover:bg-slate-800 hover:text-white border border-slate-700/60 transition"
            title="Saved Prompts Library"
          >
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Saved Library</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-purple-500 text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* Pro Subscription Button / Badge */}
          {isPro ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40">
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>PRO Active</span>
            </div>
          ) : (
            <button
              onClick={onOpenPricing}
              className="flex items-center space-x-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-500/25 transition transform active:scale-95"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Upgrade ($9/mo)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
