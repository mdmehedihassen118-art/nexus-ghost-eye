'use client';

import React, { useState } from 'react';
import { Category, CATEGORIES } from '@/lib/types';
import { Megaphone, TrendingUp, Code2, Users, Sparkles, Building2, FileText, Loader2 } from 'lucide-react';

interface PromptFormProps {
  onSubmit: (data: { category: Category; businessName: string; businessDescription: string }) => void;
  isLoading: boolean;
  remainingPrompts: number;
  isPro: boolean;
  onOpenPricing: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Code2: <Code2 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />
};

export const PromptForm: React.FC<PromptFormProps> = ({
  onSubmit,
  isLoading,
  remainingPrompts,
  isPro,
  onOpenPricing
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Marketing');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    onSubmit({
      category: selectedCategory,
      businessName: businessName.trim(),
      businessDescription: businessDescription.trim()
    });
  };

  const isLimitReached = !isPro && remainingPrompts <= 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Generate Custom AI Prompts</h2>
          <p className="text-slate-400 text-sm mt-1">
            Select a category and enter your business details to generate 5 tailored, production-ready prompts.
          </p>
        </div>

        {/* Usage Pill */}
        <div className="self-start md:self-auto flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <span className="font-semibold text-slate-400">Daily Free Tier:</span>
          {isPro ? (
            <span className="text-emerald-400 font-bold">Unlimited</span>
          ) : (
            <span className={`font-bold ${remainingPrompts > 0 ? 'text-purple-400' : 'text-rose-400'}`}>
              {remainingPrompts} / 3 remaining
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-3">
            Select Category <span className="text-purple-400">*</span>
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-purple-600/10 border-purple-500 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg mb-2 ${isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800/80 text-slate-400'}`}>
                    {CATEGORY_ICONS[cat.iconName]}
                  </div>
                  <span className="font-semibold text-sm text-white mb-1">{cat.label}</span>
                  <span className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{cat.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Business Name Input */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-semibold text-slate-200 mb-2">
            Business Name <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Building2 className="w-5 h-5" />
            </div>
            <input
              id="businessName"
              type="text"
              required
              placeholder="e.g. Acme Tech, Nova Coffee, TechFlow SaaS"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Business Description / Context Input */}
        <div>
          <label htmlFor="businessDescription" className="block text-sm font-semibold text-slate-200 mb-2">
            Business Overview & Goals <span className="text-slate-500 text-xs font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 pointer-events-none text-slate-500">
              <FileText className="w-5 h-5" />
            </div>
            <textarea
              id="businessDescription"
              rows={3}
              placeholder="Briefly describe what your business does, target audience, or specific campaign goals..."
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit Button or Upgrade CTA */}
        {isLimitReached ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-300">Free Daily Limit Reached (3/3)</p>
              <p className="text-xs text-amber-200/80 mt-0.5">
                You have reached your 3 free prompt generations for today. Upgrade to Pro for unlimited access.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPricing}
              className="whitespace-nowrap px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md"
            >
              Upgrade to Pro ($9/mo)
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isLoading || !businessName.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Crafting 5 Custom Prompts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate 5 Custom {selectedCategory} Prompts</span>
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
};
