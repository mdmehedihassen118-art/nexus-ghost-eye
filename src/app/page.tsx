'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  TrendingUp,
  Code,
  Users,
  Sparkles,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Crown,
  ArrowRight,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import { Category, CATEGORIES, GeneratedPrompt } from '@/lib/types';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Marketing');
  const [businessName, setBusinessName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quota & Pro status
  const [remainingGenerations, setRemainingGenerations] = useState<number>(3);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);

  // Check URL query params for checkout return or mock upgrade
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('checkout') === 'success' || urlParams.get('pro') === 'true') {
        setIsPro(true);
        setRemainingGenerations(999);
      }
    }

    // Fetch initial usage statistics
    fetch('/api/generate')
      .then((res) => res.json())
      .then((data) => {
        if (data.remainingFreeGenerations !== undefined) {
          setRemainingGenerations(data.remainingFreeGenerations);
        }
      })
      .catch((err) => console.error('Failed to fetch quota:', err));
  }, []);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!businessName.trim()) {
      setErrorMessage('Please enter your business or project name.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          businessName: businessName.trim(),
          isPro,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setRemainingGenerations(0);
          setShowProModal(true);
          setErrorMessage(data.error || 'Daily limit reached. Upgrade to Pro for unlimited access!');
        } else {
          setErrorMessage(data.error || 'Failed to generate prompts.');
        }
        setLoading(false);
        return;
      }

      setPrompts(data.prompts || []);
      if (!isPro && data.remainingFreeGenerations !== undefined) {
        setRemainingGenerations(data.remainingFreeGenerations);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpgradeCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Stripe redirect failed. Upgrading demo session to Pro.');
        setIsPro(true);
        setShowProModal(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback demo session unlock
      setIsPro(true);
      setShowProModal(false);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Megaphone':
        return <Megaphone className="w-5 h-5 text-blue-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-purple-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-pink-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-[#0a0a0c]">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              PromptCraft <span className="text-blue-500 font-extrabold">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Usage Counter Badge */}
            {!isPro ? (
              <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>
                  Free Tier:{' '}
                  <strong className={remainingGenerations === 0 ? 'text-red-400 font-bold' : 'text-blue-400 font-bold'}>
                    {remainingGenerations}/3
                  </strong>{' '}
                  left today
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full px-3.5 py-1 text-xs font-semibold text-purple-300">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>PRO Member</span>
              </div>
            )}

            {!isPro && (
              <button
                onClick={() => setShowProModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1.5"
              >
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Upgrade $9/mo</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-grow w-full">
        {/* Hero Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instantly generate production-grade prompts for your business</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Tailored AI Prompts for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Marketing, Sales, Coding & HR
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Select your category, type your business name, and PromptCraft AI will generate 5 highly optimized, ready-to-use custom prompts.
          </p>
        </div>

        {/* Input & Form Area */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-12 shadow-2xl relative">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Step 1: Category Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
                1. Select Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                          : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {getCategoryIcon(cat.icon)}
                        {isSelected && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                      </div>
                      <div>
                        <div className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {cat.label}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Business Name Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400">
                  2. Business or Project Name
                </label>
                <div className="text-xs text-slate-500">
                  Examples:{' '}
                  {CATEGORIES.find((c) => c.id === selectedCategory)?.examples.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBusinessName(ex)}
                      className="text-blue-400 hover:underline mx-1"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Acme SaaS, Bloom Coffee, TechFlow"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {!isPro && remainingGenerations === 0 && (
                  <button
                    type="button"
                    onClick={() => setShowProModal(true)}
                    className="ml-3 font-semibold underline hover:text-white text-xs flex-shrink-0"
                  >
                    Upgrade Now
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Crafting 5 Custom Prompts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Generate 5 Custom {selectedCategory} Prompts</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section: 5 Prompt Cards */}
        {prompts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>Generated Prompts for {businessName || 'Your Business'}</span>
              </h2>
              <span className="text-xs text-slate-400 bg-slate-900 border border-white/10 px-3 py-1 rounded-full">
                5 Prompts Ready
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {prompts.map((item, index) => (
                <div
                  key={item.id || index}
                  className="glass-card rounded-2xl p-6 relative border border-white/10 hover:border-blue-500/40 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                        #{index + 1}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                        copiedId === item.id
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500'
                      }`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Prompt Text Block */}
                  <div className="bg-[#0c0d12] border border-white/5 rounded-xl p-4 text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
                    {item.prompt}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing / Pro Callout */}
        <div className="mt-16 glass-panel rounded-2xl p-8 border border-purple-500/20 text-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>PromptCraft AI Pro</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Supercharge Your Workflow for $9/month
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Get unlimited prompt generations, priority OpenAI GPT-4 power, custom output templates, and category exports.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 text-left">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Unlimited Daily Generations</span>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Access All 4 Business Categories</span>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Cancel Anytime with Stripe</span>
            </div>
          </div>

          <button
            onClick={() => setShowProModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all inline-flex items-center space-x-2"
          >
            <span>Upgrade to Pro — $9/mo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Pro Modal */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121318] border border-white/10 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
              <Crown className="w-6 h-6 text-amber-300" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Upgrade to PromptCraft Pro</h3>
            <p className="text-xs text-slate-400 mb-6">
              Remove free limits and generate infinite tailored prompts for your business.
            </p>

            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-4 mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-semibold text-white">Pro Subscription</span>
                <span className="text-2xl font-extrabold text-blue-400">
                  $9<span className="text-xs font-normal text-slate-400">/month</span>
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 mt-3 pt-3 border-t border-white/5">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited prompt generations every day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Marketing, Sales, Coding & HR frameworks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Instant 1-click copy & custom tailoring</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgradeCheckout}
              disabled={checkoutLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
            >
              {checkoutLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Continue to Stripe Checkout ($9/mo)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#08080a] py-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PromptCraft AI. Production ready prompt engineering SaaS.</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Free Tier: 3 Prompts/Day</span>
            <span>•</span>
            <span>Pro Tier: $9/Month</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
