'use client';

import React from 'react';
import { Sparkles, Zap, Shield } from 'lucide-react';

export const FeatureSection: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto mt-20 pt-10 border-t border-slate-800/80">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
          Designed for Modern Business Operations
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          PromptCraft AI bridges the gap between raw AI potential and practical enterprise results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/50 w-fit text-purple-400 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-lg mb-2">5 Prompts per Run</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every generation produces 5 distinct, high-context prompt variations designed with clear role definition, task parameters, and structured outputs.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/50 w-fit text-indigo-400 mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-lg mb-2">4 Enterprise Verticals</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Choose specialized frameworks tailored for Marketing, Sales, Software Engineering, or HR & Talent Operations.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800/50 w-fit text-cyan-400 mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-lg mb-2">Instant 1-Click Workflow</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Copy prompts directly into ChatGPT, Claude, or Gemini with 1-click, or bookmark them to your personal saved library for later reuse.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 max-w-3xl mx-auto">
        <h3 className="font-bold text-xl text-white mb-6 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="border-b border-slate-800/80 pb-3">
            <h4 className="font-bold text-purple-300 mb-1">How does the Free Tier daily limit work?</h4>
            <p className="text-slate-400">
              Free users receive 3 full prompt generations per calendar day. Each generation delivers 5 custom prompts for your chosen business category.
            </p>
          </div>
          <div className="border-b border-slate-800/80 pb-3">
            <h4 className="font-bold text-purple-300 mb-1">What do I get with Pro ($9/month)?</h4>
            <p className="text-slate-400">
              Pro members get unlimited daily generations, priority access to GPT-4 tuned AI logic, instant saved favorites drawer, and dedicated support.
            </p>
          </div>
          <div className="border-b border-slate-800/80 pb-3">
            <h4 className="font-bold text-purple-300 mb-1">Can I use generated prompts commercially?</h4>
            <p className="text-slate-400">
              Yes, 100%! All prompts generated on PromptCraft AI are completely royalty-free for commercial and business usage.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-purple-300 mb-1">Can I cancel my Pro subscription?</h4>
            <p className="text-slate-400">
              Yes, you can cancel or manage your subscription anytime via Stripe with a single click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
