"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PromptForm } from "@/components/PromptForm";
import { CategoryType } from "@/components/CategorySelector";
import { PromptCard } from "@/components/PromptCard";
import { PricingModal } from "@/components/PricingModal";
import { SavedPromptsDrawer } from "@/components/SavedPromptsDrawer";
import { PromptItem } from "@/app/api/generate/route";
import { Sparkles, Layers, ShieldCheck, Download, Zap } from "lucide-react";
import confetti from "canvas-confetti";

const MAX_FREE_DAILY = 3;

export default function Home() {
  const [category, setCategory] = useState<CategoryType>("Marketing");
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBusiness, setActiveBusiness] = useState<string>("");

  // Pro tier state
  const [isPro, setIsPro] = useState<boolean>(false);
  const [usageCount, setUsageCount] = useState<number>(0);

  // Saved prompts
  const [savedPrompts, setSavedPrompts] = useState<PromptItem[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Load local state on mount
  useEffect(() => {
    // 1. Check if user is Pro
    const storedPro = localStorage.getItem("promptcraft_pro_active");
    if (storedPro === "true") {
      setIsPro(true);
    }

    // Check URL search params for checkout=success
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("checkout") === "success") {
        setIsPro(true);
        localStorage.setItem("promptcraft_pro_active", "true");
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }
    }

    // 2. Check daily usage
    const today = new Date().toISOString().slice(0, 10);
    const storedUsage = localStorage.getItem(`promptcraft_usage_${today}`);
    if (storedUsage) {
      setUsageCount(parseInt(storedUsage, 10));
    }

    // 3. Load saved prompts
    const storedSaved = localStorage.getItem("promptcraft_saved_prompts");
    if (storedSaved) {
      try {
        setSavedPrompts(JSON.parse(storedSaved));
      } catch (e) {
        console.error("Failed to parse saved prompts", e);
      }
    }
  }, []);

  const handleUnlockPro = () => {
    setIsPro(true);
    localStorage.setItem("promptcraft_pro_active", "true");
  };

  const handleToggleSave = (item: PromptItem) => {
    setSavedPrompts((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      let updated: PromptItem[];
      if (exists) {
        updated = prev.filter((p) => p.id !== item.id);
      } else {
        updated = [item, ...prev];
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
      }
      localStorage.setItem("promptcraft_saved_prompts", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveSaved = (id: string) => {
    setSavedPrompts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("promptcraft_saved_prompts", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllSaved = () => {
    setSavedPrompts([]);
    localStorage.removeItem("promptcraft_saved_prompts");
  };

  const handleGeneratePrompts = async (data: {
    businessName: string;
    businessDetails: string;
    targetAudience: string;
  }) => {
    if (!isPro && usageCount >= MAX_FREE_DAILY) {
      setIsPricingModalOpen(true);
      return;
    }

    setIsLoading(true);
    setActiveBusiness(data.businessName);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          businessName: data.businessName,
          businessDetails: data.businessDetails,
          targetAudience: data.targetAudience,
        }),
      });

      const result = await res.json();
      if (result.success && result.prompts) {
        setPrompts(result.prompts);

        // Update daily usage
        if (!isPro) {
          const newCount = usageCount + 1;
          setUsageCount(newCount);
          const today = new Date().toISOString().slice(0, 10);
          localStorage.setItem(`promptcraft_usage_${today}`, newCount.toString());
        }

        // Scroll to prompts section
        setTimeout(() => {
          const el = document.getElementById("generated-prompts-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        alert("Failed to generate prompts. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting generator service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          isPro={isPro}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenSaved={() => setIsSavedDrawerOpen(true)}
          savedCount={savedPrompts.length}
          usageCount={usageCount}
          maxFree={MAX_FREE_DAILY}
        />

        {/* Hero Banner Header */}
        <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-indigo-500/5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Next-Gen AI Prompt Engine for Businesses</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Generate 5 Tailored AI Prompts for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Your Business
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8 font-normal">
            Select a category, enter your brand name, and instantly get high-converting, production-ready prompts for ChatGPT, Claude, & Gemini.
          </p>

          {/* Core Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>3 Free Prompts / Day</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Marketing, Sales, Coding & HR</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pro Plan $9/mo</span>
            </div>
          </div>
        </section>

        {/* Main Generator Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <PromptForm
            category={category}
            onSelectCategory={(cat) => setCategory(cat)}
            onSubmit={handleGeneratePrompts}
            isLoading={isLoading}
            isPro={isPro}
            usageCount={usageCount}
            maxFree={MAX_FREE_DAILY}
            onOpenPricing={() => setIsPricingModalOpen(true)}
          />
        </section>

        {/* Generated Prompts Display Section */}
        {prompts.length > 0 && (
          <section id="generated-prompts-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {category} Category
                  </span>
                  <span className="text-xs text-slate-400">for <strong>{activeBusiness}</strong></span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                  Your 5 Custom AI Prompts
                </h2>
              </div>

              <button
                onClick={() => {
                  const textAll = prompts.map((p, idx) => `PROMPT #${idx + 1}: ${p.title}\n${p.promptText}\n\n`).join('\n');
                  navigator.clipboard.writeText(textAll);
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                  alert("Copied all 5 prompts to clipboard!");
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Copy All 5 Prompts</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt, idx) => (
                <PromptCard
                  key={prompt.id || idx}
                  prompt={prompt}
                  index={idx}
                  isSaved={savedPrompts.some((s) => s.id === prompt.id)}
                  onToggleSave={handleToggleSave}
                  isPro={isPro}
                  onOpenPricing={() => setIsPricingModalOpen(true)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} PromptCraft AI. Production-ready AI SaaS.</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsPricingModalOpen(true)} className="hover:text-indigo-400 transition">
              Pro Plan ($9/mo)
            </button>
            <button onClick={() => setIsSavedDrawerOpen(true)} className="hover:text-purple-400 transition">
              Saved Library ({savedPrompts.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Pricing Modal & Saved Library Drawer */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        onUnlockPro={handleUnlockPro}
        isPro={isPro}
      />

      <SavedPromptsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPrompts={savedPrompts}
        onRemovePrompt={handleRemoveSaved}
        onClearAll={handleClearAllSaved}
      />
    </div>
  );
}
