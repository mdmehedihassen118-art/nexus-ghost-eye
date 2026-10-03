'use client';

import React from 'react';
import { Sparkles, Crown, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  isPro: boolean;
  onOpenPricing: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isPro, onOpenPricing }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              PromptCraft <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isPro ? (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              <span>Pro Plan Active</span>
            </div>
          ) : (
            <button
              onClick={onOpenPricing}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-purple-600/20 hover:shadow-purple-600/30 active:scale-95"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Pro ($9/mo)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
