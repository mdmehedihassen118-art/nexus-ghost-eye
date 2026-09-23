"use client";

import React, { useState } from "react";
import { Sparkles, Building2, Target, HelpCircle } from "lucide-react";
import { CategorySelector, CategoryType } from "./CategorySelector";

interface PromptFormProps {
  category: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onSubmit: (data: { businessName: string; businessDetails: string; targetAudience: string }) => void;
  isLoading: boolean;
  isPro: boolean;
  usageCount: number;
  maxFree: number;
  onOpenPricing: () => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  category,
  onSelectCategory,
  onSubmit,
  isLoading,
  isPro,
  usageCount,
  maxFree,
  onOpenPricing,
}) => {
  const [businessName, setBusinessName] = useState("");
  const [businessDetails, setBusinessDetails] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const isLimitReached = !isPro && usageCount >= maxFree;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    if (isLimitReached) {
      onOpenPricing();
      return;
    }
    onSubmit({
      businessName: businessName.trim(),
      businessDetails: businessDetails.trim(),
      targetAudience: targetAudience.trim(),
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Step 1: Select Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            Step 1: Choose Prompt Category
          </label>
          <CategorySelector
            selectedCategory={category}
            onSelectCategory={onSelectCategory}
          />
        </div>

        {/* Step 2: Business Info */}
        <div className="space-y-4 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Step 2: Enter Business & Target Details
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Business / Brand Name <span className="text-pink-500">*</span></span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex AI, Acme Studio, CloudScale"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                />
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Target Audience <span className="text-slate-500 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Target className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. B2B SaaS Founders, E-commerce Buyers"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                />
              </div>
            </div>
          </div>

          {/* Product / Business Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Product or Service Description <span className="text-slate-500 text-xs">(Optional)</span></span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. We provide automated AI lead scoring software for fast-growing sales teams."
              value={businessDetails}
              onChange={(e) => setBusinessDetails(e.target.value)}
              className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm resize-none"
            />
          </div>
        </div>

        {/* Submit CTA & Limit Alert */}
        <div className="pt-2">
          {isLimitReached ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3 text-amber-200 text-sm">
                <HelpCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
                <span>You&apos;ve reached your <strong>3 free generations/day limit</strong>. Upgrade to Pro for unlimited prompts!</span>
              </div>
              <button
                type="button"
                onClick={onOpenPricing}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition flex-shrink-0"
              >
                Unlock Pro ($9)
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !businessName.trim()}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center space-x-2 transition transform active:scale-[0.99] shadow-xl ${
                isLoading || !businessName.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-500/20"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Crafting 5 Custom Prompts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Generate 5 Custom AI Prompts</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
