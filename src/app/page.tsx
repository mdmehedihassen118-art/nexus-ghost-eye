'use client';

import React, { useState, useEffect } from 'react';
import { Category, CATEGORIES, PromptItem } from '@/lib/types';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  Megaphone,
  TrendingUp,
  Code,
  Users,
  ShieldCheck,
  Crown,
  ArrowRight,
  AlertCircle,
  X
} from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Marketing');
  const [businessName, setBusinessName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(3);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [activePromptModal, setActivePromptModal] = useState<PromptItem | null>(null);
  const [upgradedBanner, setUpgradedBanner] = useState<boolean>(false);

  useEffect(() => {
    // Check url params for Stripe checkout status
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('upgraded') === 'true') {
        setIsPro(true);
        setUpgradedBanner(true);
        setRemaining(999);
      }
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          businessName,
          isPro,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMsg(data.error || 'Daily free limit reached.');
          setShowProModal(true);
        } else {
          setErrorMsg(data.error || 'Failed to generate prompts.');
        }
        setLoading(false);
        return;
      }

      setPrompts(data.prompts || []);
      if (!isPro && typeof data.remainingPrompts === 'number') {
        setRemaining(data.remainingPrompts);
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpgradePro = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier: 'user_session' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Could not initiate checkout session.');
      }
    } catch (err) {
      alert('Error initiating checkout.');
    }
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Marketing':
        return <Megaphone className="w-5 h-5 text-pink-400" />;
      case 'Sales':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Coding':
        return <Code className="w-5 h-5 text-cyan-400" />;
      case 'HR':
        return <Users className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#0B0F17]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                PromptCraft <span className="text-purple-400">AI</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tailored AI Prompts for Business Growth
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isPro ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Crown className="w-3.5 h-3.5" /> Pro Plan (Unlimited)
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  Free Tier: <strong className="text-purple-400 font-semibold">{remaining}</strong>/3 left today
                </span>
                <button
                  onClick={() => setShowProModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition shadow-md shadow-purple-500/10"
                >
                  <Crown className="w-3.5 h-3.5" /> Upgrade Pro ($9/mo)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Upgraded Banner */}
      {upgradedBanner && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Welcome to PromptCraft AI Pro! Unlimited prompt generations activated.
          <button onClick={() => setUpgradedBanner(false)} className="ml-4 opacity-80 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10">
        {/* Hero Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Instant AI Prompt Engine for Teams
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Generate 5 High-Impact AI Prompts for Your Business
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Select your category, enter your company name, and instantly get custom, battle-tested prompt templates engineered for OpenAI, Claude, and Gemini.
          </p>
        </section>

        {/* Input Form Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Category Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
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
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left font-medium text-sm transition-all ${
                        selected
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-500'
                          : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Business Name Input */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-semibold text-slate-300 mb-2">
                2. Enter Your Business Name
              </label>
              <input
                id="businessName"
                type="text"
                placeholder="e.g. Acme Cloud Corp, Spark Studio, Zenith Tech"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                No credit card required for free tier • 3 prompts/day
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating 5 Custom Prompts...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate 5 Custom Prompts
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        {prompts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Generated Prompts for</span>
                <span className="text-purple-400">{businessName || 'Your Business'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-normal">
                  {selectedCategory}
                </span>
              </h3>
              <span className="text-xs text-slate-400">5 Prompts Ready</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {prompts.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
                          Prompt #{index + 1}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-0.5">{item.title}</h4>
                      </div>

                      <button
                        onClick={() => handleCopy(item.id || String(index), item.promptText)}
                        className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition shrink-0 flex items-center gap-1.5 text-xs font-medium"
                        title="Copy prompt text"
                      >
                        {copiedId === (item.id || String(index)) ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400">{item.description}</p>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                      {item.promptText}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setActivePromptModal(item)}
                      className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                    >
                      Full View & Instructions <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing / Pro Tier Banner */}
        <section className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> Upgrade to Pro
            </span>
            <h3 className="text-2xl font-bold text-white">Unlock Unlimited Prompt Generations</h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Free users get 3 custom prompt runs per day. Upgrade to Pro for $9/month to generate unlimited Marketing, Sales, Coding, and HR prompts for all your projects.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <div className="text-3xl font-extrabold text-white">
              $9<span className="text-sm font-normal text-slate-400">/month</span>
            </div>
            <button
              onClick={handleUpgradePro}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 transition flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              Upgrade to Pro ($9/mo)
            </button>
          </div>
        </section>
      </main>

      {/* Pro Modal */}
      {showProModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Daily Limit Reached</h3>
              <p className="text-xs text-slate-400">
                You have used your 3 free prompt generations for today.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span>Free Tier Limit</span>
                <span className="text-slate-400">3 prompts/day</span>
              </div>
              <div className="flex items-center justify-between text-white font-semibold">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Crown className="w-4 h-4 text-amber-400" /> Pro Tier
                </span>
                <span className="text-emerald-400">Unlimited ($9/mo)</span>
              </div>
            </div>

            <button
              onClick={handleUpgradePro}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" /> Upgrade to Pro Now
            </button>
          </div>
        </div>
      )}

      {/* Full Prompt Preview Modal */}
      {activePromptModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActivePromptModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                {activePromptModal.category} Prompt
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{activePromptModal.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{activePromptModal.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Prompt Text</span>
                <button
                  onClick={() => handleCopy(activePromptModal.id, activePromptModal.promptText)}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                {activePromptModal.promptText}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActivePromptModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PromptCraft AI. Production ready prompt engineering tool.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
