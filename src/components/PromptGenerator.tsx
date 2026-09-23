'use client';

import React, { useState } from 'react';
import { CATEGORIES } from '@/lib/templates';
import { CategoryId } from '@/types';
import { Megaphone, TrendingUp, Code2, Users, Sparkles, Building2, AlertCircle, ArrowRight } from 'lucide-react';

interface PromptGeneratorProps {
  onGenerate: (category: CategoryId, businessName: string) => void;
  isLoading: boolean;
  isPro: boolean;
  dailyUsageCount: number;
  maxFreeLimit: number;
  onOpenPricing: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Code2: <Code2 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
};

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({
  onGenerate,
  isLoading,
  isPro,
  dailyUsageCount,
  maxFreeLimit,
  onOpenPricing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('marketing');
  const [businessName, setBusinessName] = useState('');

  const isLimitReached = !isPro && dailyUsageCount >= maxFreeLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      onOpenPricing();
      return;
    }
    if (!businessName.trim()) return;
    onGenerate(selectedCategory, businessName.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Production-Ready Prompt Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Generate <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">5 Custom Prompts</span> for Your Business
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Select your industry category, type in your business name, and receive 5 battle-tested, high-impact AI prompts in seconds.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Selection Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              1. Choose Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all flex flex-col items-start gap-2 ${
                      isSelected
                        ? 'bg-slate-900 border-purple-500/80 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${cat.gradient} text-white shadow-md`}
                    >
                      {ICON_MAP[cat.iconName]}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{cat.name}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              2. Enter Business Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Cloud Corp, Nova Studio, Apex Tech..."
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm sm:text-base"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Tip: Works for startups, agencies, SaaS platforms, local businesses, and personal brands.
            </p>
          </div>

          {/* Limit Reached Warning if Free */}
          {isLimitReached && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-200">
                <p className="font-bold text-rose-300">Daily Free Limit Reached (3/3)</p>
                <p className="mt-0.5">
                  You have used all 3 free generations for today. Upgrade to Pro ($9/mo) for unlimited instant generations.
                </p>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type={isLimitReached ? 'button' : 'submit'}
            onClick={isLimitReached ? onOpenPricing : undefined}
            disabled={isLoading || (!isLimitReached && !businessName.trim())}
            className={`w-full py-4 px-6 rounded-xl font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2 ${
              isLimitReached
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-amber-500/20'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Architecting 5 Custom Prompts...</span>
              </>
            ) : isLimitReached ? (
              <>
                <span>Upgrade to Pro ($9/mo) to Generate</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
                <span>Generate 5 Custom Prompts</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
