'use client';

import React, { useState } from 'react';
import { GeneratedPrompt } from '@/lib/types';
import { Copy, Check, Tag } from 'lucide-react';

interface PromptCardProps {
  prompt: GeneratedPrompt;
  index: number;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
              {index + 1}
            </span>
            <h3 className="font-semibold text-white text-base tracking-tight">{prompt.title}</h3>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Copy prompt to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800/80 mb-4 max-h-48 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {prompt.prompt}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          <Tag className="w-3.5 h-3.5 text-slate-500" />
          {prompt.tags.map((tag, idx) => (
            <span key={idx} className="bg-slate-800/70 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-slate-500 font-medium">{prompt.category}</span>
      </div>
    </div>
  );
};
