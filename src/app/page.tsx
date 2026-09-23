'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PromptGenerator } from '@/components/PromptGenerator';
import { PromptList } from '@/components/PromptList';
import { PricingModal } from '@/components/PricingModal';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { FeatureSection } from '@/components/FeatureSection';
import { CategoryId, PromptItem } from '@/types';
const FREE_DAILY_LIMIT = 3;
import confetti from 'canvas-confetti';

export default function Home() {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [dailyUsageCount, setDailyUsageCount] = useState<number>(0);
  const [generatedPrompts, setGeneratedPrompts] = useState<PromptItem[]>([]);
  const [businessName, setBusinessName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<PromptItem[]>([]);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load state from localStorage on mount & handle Stripe URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPro = localStorage.getItem('promptcraft_is_pro');
      if (savedPro === 'true') {
        setIsPro(true);
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const savedUsageDate = localStorage.getItem('promptcraft_usage_date');
      if (savedUsageDate === todayStr) {
        const savedCount = localStorage.getItem('promptcraft_usage_count');
        if (savedCount) setDailyUsageCount(parseInt(savedCount, 10));
      } else {
        localStorage.setItem('promptcraft_usage_date', todayStr);
        localStorage.setItem('promptcraft_usage_count', '0');
      }

      const savedFavs = localStorage.getItem('promptcraft_favorites');
      if (savedFavs) {
        try {
          setFavorites(JSON.parse(savedFavs));
        } catch (e) {
          console.error('Failed parsing favorites:', e);
        }
      }

      // Handle checkout success redirect
      const query = new URLSearchParams(window.location.search);
      if (query.get('success') === 'true' || query.get('mock_pro') === 'true') {
        setIsPro(true);
        localStorage.setItem('promptcraft_is_pro', 'true');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  }, []);

  // Save favorites to localStorage
  const handleToggleFavorite = (prompt: PromptItem) => {
    let updated: PromptItem[];
    const exists = favorites.some((f) => f.id === prompt.id || f.prompt === prompt.prompt);
    if (exists) {
      updated = favorites.filter((f) => f.id !== prompt.id && f.prompt !== prompt.prompt);
    } else {
      updated = [{ ...prompt, isFavorite: true }, ...favorites];
    }
    setFavorites(updated);
    localStorage.setItem('promptcraft_favorites', JSON.stringify(updated));
  };

  const handleRemoveFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('promptcraft_favorites', JSON.stringify(updated));
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
    localStorage.setItem('promptcraft_favorites', JSON.stringify([]));
  };

  // Trigger Prompt Generation API
  const handleGenerate = async (category: CategoryId, bizName: string) => {
    setIsLoading(true);
    setBusinessName(bizName);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          businessName: bizName,
          isPro,
          currentUsageCount: dailyUsageCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setIsPricingOpen(true);
        } else {
          alert(data.error || 'Generation failed. Please try again.');
        }
        return;
      }

      setGeneratedPrompts(data.prompts || []);
      const newUsage = data.usageCount ?? dailyUsageCount + 1;
      setDailyUsageCount(newUsage);
      localStorage.setItem('promptcraft_usage_count', newUsage.toString());

      // Scroll smoothly to results
      setTimeout(() => {
        window.scrollTo({
          top: 480,
          behavior: 'smooth',
        });
      }, 100);
    } catch (err) {
      console.error('Generation error:', err);
      alert('An unexpected error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#090d16] text-slate-100 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Navigation */}
      <Navbar
        isPro={isPro}
        dailyUsageCount={dailyUsageCount}
        maxFreeLimit={FREE_DAILY_LIMIT}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        favoriteCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PromptGenerator
          onGenerate={handleGenerate}
          isLoading={isLoading}
          isPro={isPro}
          dailyUsageCount={dailyUsageCount}
          maxFreeLimit={FREE_DAILY_LIMIT}
          onOpenPricing={() => setIsPricingOpen(true)}
        />

        <PromptList
          prompts={generatedPrompts}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          businessName={businessName}
        />

        <FeatureSection />
      </main>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        isPro={isPro}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PromptCraft AI. Production Ready SaaS Architecture.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsPricingOpen(true)} className="hover:text-white transition">
              Pricing
            </button>
            <span>•</span>
            <button onClick={() => setIsHistoryOpen(true)} className="hover:text-white transition">
              Saved Prompts
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
