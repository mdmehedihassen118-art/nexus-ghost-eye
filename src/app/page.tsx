'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PromptForm } from '@/components/PromptForm';
import { PromptCard } from '@/components/PromptCard';
import { PricingModal } from '@/components/PricingModal';
import { Category, GeneratedPrompt } from '@/lib/types';
import { FREE_DAILY_LIMIT } from '@/lib/rateLimiter';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingPrompts, setRemainingPrompts] = useState<number>(FREE_DAILY_LIMIT);
  const [isPro, setIsPro] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>('');
  const [lastBusinessName, setLastBusinessName] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve persistent local client ID for rate limit tracking
    let id = localStorage.getItem('promptcraft_client_id');
    if (!id) {
      id = 'client_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('promptcraft_client_id', id);
    }
    setClientId(id);

    // Check query params for Stripe checkout status or pro activation simulation
    const urlParams = new URLSearchParams(window.location.search);
    const stripeStatus = urlParams.get('stripe_status');
    const isProParam = urlParams.get('pro');

    if (stripeStatus === 'success' || isProParam === 'true') {
      setIsPro(true);
      localStorage.setItem('promptcraft_is_pro', 'true');
    } else if (localStorage.getItem('promptcraft_is_pro') === 'true') {
      setIsPro(true);
    }
  }, []);

  const handleGenerate = async (formData: { category: Category; businessName: string; businessDescription: string }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastBusinessName(formData.businessName);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData.category,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          isPro,
          clientId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setRemainingPrompts(0);
          setIsPricingOpen(true);
        }
        setErrorMessage(data.error || 'Failed to generate prompts.');
        setIsLoading(false);
        return;
      }

      setPrompts(data.prompts || []);
      if (typeof data.remainingPrompts === 'number') {
        setRemainingPrompts(data.remainingPrompts);
      }
    } catch (err: any) {
      console.error('Error generating prompts:', err);
      setErrorMessage(err.message || 'An error occurred while connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header isPro={isPro} onOpenPricing={() => setIsPricingOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Prompt Generator for Modern Business</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            High-Impact AI Prompts Tailored to Your Business
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Select your category, enter your business details, and instantly receive 5 optimized prompts ready for ChatGPT, Claude, and LLM workflows.
          </p>
        </section>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Form Component */}
        <PromptForm
          onSubmit={handleGenerate}
          isLoading={isLoading}
          remainingPrompts={remainingPrompts}
          isPro={isPro}
          onOpenPricing={() => setIsPricingOpen(true)}
        />

        {/* Generated Results Section */}
        {prompts.length > 0 && (
          <section className="space-y-6 animate-fade-in pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Generated Prompts for <span className="text-purple-400">{lastBusinessName}</span>
                </h2>
                <p className="text-xs text-slate-400">Click &quot;Copy&quot; on any card to copy the prompt directly to your clipboard.</p>
              </div>
              <span className="text-xs text-slate-400 font-medium bg-slate-900 border border-slate-800 px-3 py-1 rounded-full self-start sm:self-auto">
                5 Prompts Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prompts.map((p, idx) => (
                <PromptCard key={p.id || idx} prompt={p} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* Pro Plan Feature Card banner if free tier */}
        {!isPro && (
          <section className="mt-12 rounded-2xl bg-gradient-to-r from-purple-900/30 via-slate-900 to-indigo-900/30 border border-purple-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Need Unlimited AI Prompts for Your Team?</h3>
              <p className="text-slate-400 text-sm max-w-xl">
                Upgrade to PromptCraft Pro for $9/month to remove daily limitations, unlock unlimited prompt generations across Marketing, Sales, Coding, and HR.
              </p>
            </div>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="whitespace-nowrap px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center space-x-2 transition-all shadow-lg shadow-purple-600/30 shrink-0"
            >
              <span>Get Pro Access ($9/mo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PromptCraft AI. Production Ready SaaS.</p>
          <div className="flex items-center space-x-4">
            <span>Free Tier: 3 Prompts/day</span>
            <span>•</span>
            <span>Pro Tier: Unlimited ($9/mo)</span>
          </div>
        </div>
      </footer>

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        clientId={clientId}
      />
    </div>
  );
}
