"use client";

import React, { useState } from "react";
import { Copy, Check, Bookmark, BookmarkCheck, Lightbulb, Play, ArrowUpRight } from "lucide-react";
import { PromptItem } from "@/app/api/generate/route";
import confetti from "canvas-confetti";

interface PromptCardProps {
  prompt: PromptItem;
  index: number;
  isSaved: boolean;
  onToggleSave: (prompt: PromptItem) => void;
  isPro: boolean;
  onOpenPricing: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  index,
  isSaved,
  onToggleSave,
  isPro,
  onOpenPricing,
}) => {
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateAI = () => {
    if (!isPro) {
      onOpenPricing();
      return;
    }
    setIsSimulating(true);
    setTestResult(null);
    setTimeout(() => {
      setIsSimulating(false);
      setTestResult(
        `🤖 [AI Simulation Output for Pro Plan]\n\nHello! I have executed this prompt for your campaign:\n- Value Hooks: Crafted 5 high-converting headlines.\n- Target Focus: Optimized for conversion with 34% estimated CTR lift.\n- Action Step: Ready to deploy into your campaign workflow!`
      );
    }, 1200);
  };

  return (
    <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              #{index + 1}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {prompt.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Save Toggle */}
            <button
              onClick={() => onToggleSave(prompt)}
              className={`p-1.5 rounded-lg border text-xs font-medium transition flex items-center space-x-1 ${
                isSaved
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-slate-800/80 text-slate-400 hover:text-white border-slate-700"
              }`}
              title={isSaved ? "Saved in Library" : "Save to Library"}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title & Purpose */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5">
          {prompt.title}
        </h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2">
          🎯 <strong className="text-slate-300">Purpose:</strong> {prompt.purpose}
        </p>

        {/* Prompt Body Box */}
        <div className="relative mb-4">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-60 overflow-y-auto">
            {prompt.promptText}
          </pre>
          <button
            onClick={handleCopy}
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-md ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
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

        {/* Pro AI Execution Test Result */}
        {testResult && (
          <div className="mb-4 p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-200 font-mono whitespace-pre-wrap animate-fadeIn">
            {testResult}
          </div>
        )}

        {/* Pro Tip Box */}
        {prompt.tips && (
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400 flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-300">Pro Tip:</strong> {prompt.tips}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <button
          onClick={handleSimulateAI}
          disabled={isSimulating}
          className="flex items-center space-x-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition"
        >
          {isSimulating ? (
            <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span>{isPro ? "Test Prompt Execution" : "Test Run AI Prompt (Pro)"}</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-slate-400 hover:text-white transition font-medium"
        >
          <span>Use Prompt</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
