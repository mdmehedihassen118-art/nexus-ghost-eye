'use client';

import React, { useState } from 'react';
import { CATEGORIES, CATEGORY_DESCRIPTIONS, Category, GeneratePromptsResponse } from '@/lib/types';
import { Sparkles, Check, Copy, Zap, ArrowRight, ShieldCheck, Code, Megaphone, TrendingUp, Users, RefreshCw } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Marketing');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<number | null>(3);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [upgrading, setUpgrading] = useState(false);

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Marketing':
        return <Megaphone className="w-5 h-5 text-indigo-400" />;
      case 'Sales':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Coding':
        return <Code className="w-5 h-5 text-cyan-400" />;
      case 'HR':
        return <Users className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('Please enter your business name.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          businessName: businessName.trim(),
        }),
      });

      const data: GeneratePromptsResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to generate prompts. Please try again.');
        if (data.remainingDailyPrompts !== undefined) {
          setRemainingPrompts(data.remainingDailyPrompts);
        }
        return;
      }

      if (data.prompts) {
        setPrompts(data.prompts);
      }
      if (data.remainingDailyPrompts !== undefined) {
        setRemainingPrompts(data.remainingDailyPrompts);
      }
      if (data.isPro !== undefined) {
        setIsPro(data.isPro);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to initiate upgrade. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process upgrade request.');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0d0e17]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                PromptCraft AI
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full">
              {isPro ? (
                <span className="flex items-center text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Pro Member (Unlimited)
                </span>
              ) : (
                <span className="text-slate-400">
                  Daily Free Prompts:{' '}
                  <strong className="text-indigo-400 font-semibold">
                    {remainingPrompts !== null ? remainingPrompts : 3} / 3
                  </strong>
                </span>
              )}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition shadow-md shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{upgrading ? 'Processing...' : 'Upgrade to Pro ($9/mo)'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Instant Custom AI Prompts for Your Business
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Select your category, type your business name, and receive 5 tailored, high-converting prompts designed to power your AI workflows.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-[#11131f] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/40 mb-10">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                1. Select Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const selected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                        selected
                          ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {getCategoryIcon(cat)}
                        <span className="font-semibold text-sm">{cat}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                        {CATEGORY_DESCRIPTIONS[cat]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Business Name Input */}
            <div>
              <label htmlFor="businessName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                2. Business Name
              </label>
              <input
                id="businessName"
                type="text"
                placeholder="e.g. Acme Tech Solutions, CloudFlow, DevStudio"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
                <span>{error}</span>
                {!isPro && error.includes('Daily free limit reached') && (
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    className="font-semibold text-indigo-400 underline ml-2 hover:text-indigo-300"
                  >
                    Upgrade Now
                  </button>
                )}
              </div>
            )}

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                  <span>Crafting 5 Custom Prompts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Generate 5 Custom Prompts</span>
                  <ArrowRight className="w-4 h-4 text-indigo-200 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prompts Output Section */}
        {prompts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Generated Custom Prompts for &quot;{businessName}&quot;</span>
              </h2>
              <span className="text-xs text-slate-400">{prompts.length} Prompts Ready</span>
            </div>

            <div className="grid gap-4">
              {prompts.map((promptText, idx) => (
                <div
                  key={idx}
                  className="group bg-[#11131f] border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all shadow-md hover:shadow-indigo-500/5 relative flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-mono">
                        {promptText}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(promptText, idx)}
                      className="flex-shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Copy prompt"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Pro Banner */}
        <div className="mt-16 bg-gradient-to-r from-indigo-900/30 via-slate-900 to-violet-900/30 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>PromptCraft Pro</span>
            </div>
            <h3 className="text-xl font-bold text-white">Unlock Unlimited Daily AI Prompts</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Free users get 3 prompts per day. Upgrade to Pro for $9/month to generate unlimited custom prompts for Marketing, Sales, Coding, and HR.
            </p>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold bg-white hover:bg-slate-100 text-slate-900 transition shadow-lg shadow-white/10 active:scale-[0.98] disabled:opacity-50"
          >
            {upgrading ? 'Loading Checkout...' : 'Upgrade Now - $9/month'}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d0e17] py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} PromptCraft AI. Production Ready SaaS.</span>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
