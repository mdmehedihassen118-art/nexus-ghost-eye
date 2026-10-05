'use client';

import { useState, useEffect } from 'react';
import { Category, CATEGORIES, PromptItem } from '@/lib/types';
import { Sparkles, Copy, Check, Zap, Crown, Megaphone, TrendingUp, Code, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Marketing');
  const [businessName, setBusinessName] = useState('');
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<number>(3);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('pro') === 'true') {
        setIsPro(true);
        localStorage.setItem('promptcraft_is_pro', 'true');
      } else if (localStorage.getItem('promptcraft_is_pro') === 'true') {
        setIsPro(true);
      }
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('Please enter your business name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          businessName: businessName.trim(),
          isPro
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate prompts');
      }

      setPrompts(data.prompts);
      if (typeof data.remainingPrompts === 'number') {
        setRemainingPrompts(data.remainingPrompts);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Upgrade failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initiate Pro checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Marketing': return <Megaphone className="w-5 h-5" />;
      case 'Sales': return <TrendingUp className="w-5 h-5" />;
      case 'Coding': return <Code className="w-5 h-5" />;
      case 'HR': return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-gray-100">
      {/* Top Banner / Navbar */}
      <header className="border-b border-gray-800/80 bg-[#111622]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              PromptCraft <span className="text-indigo-400">AI</span>
            </span>
            {isPro && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Crown className="w-3 h-3" /> PRO
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isPro ? (
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline-block">
                  Free Plan: <strong className="text-indigo-400">{remainingPrompts}</strong> / 3 left today
                </span>
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Crown className="w-4 h-4" />
                  {checkoutLoading ? 'Redirecting...' : 'Upgrade to Pro ($9/mo)'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                <span>Unlimited Access Active</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Custom Prompt Generation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Transform Your Business with <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Tailored AI Prompts
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Select your industry category, input your business name, and generate 5 custom-engineered prompts in seconds.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-[#151C28] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-12">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                1. Select Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-center gap-2 p-3.5 rounded-xl text-sm font-medium border transition-all ${
                        active
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/10'
                          : 'bg-[#1E2738] border-gray-700/60 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-semibold text-gray-300 mb-2">
                2. Enter Business Name
              </label>
              <input
                id="businessName"
                type="text"
                placeholder="e.g. Acme Tech, Apex Marketing, CodeCraft..."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0B0F17] border border-gray-700/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!isPro && remainingPrompts <= 0)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Generating custom prompts...</span>
              ) : (
                <>
                  <span>Generate 5 Custom Prompts</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {!isPro && remainingPrompts <= 0 && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-between">
              <span>You have reached your free daily limit of 3 generations.</span>
              <button
                onClick={handleUpgrade}
                className="font-bold underline hover:text-amber-200 text-xs sm:text-sm"
              >
                Upgrade to Pro ($9/mo)
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {prompts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Generated Prompts for {businessName}</span>
              </h2>
              <span className="text-xs text-gray-400 bg-gray-800/60 px-3 py-1 rounded-full border border-gray-700">
                {selectedCategory}
              </span>
            </div>

            <div className="space-y-4">
              {prompts.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-[#151C28] border border-gray-800/80 hover:border-gray-700 rounded-xl p-5 shadow-lg transition-all group relative"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400 mb-1 block">
                        PROMPT #{index + 1}
                      </span>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className="p-2.5 rounded-lg bg-[#0B0F17] hover:bg-indigo-600/20 text-gray-400 hover:text-indigo-300 border border-gray-700/60 transition-all flex items-center gap-1.5 text-xs font-medium"
                      title="Copy prompt"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                  )}

                  <div className="bg-[#0B0F17] rounded-lg p-4 border border-gray-800/80 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap select-all">
                    {item.prompt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-[#0B0F17] py-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} PromptCraft AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
