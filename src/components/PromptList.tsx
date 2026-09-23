'use client';

import React, { useState } from 'react';
import { PromptItem } from '@/types';
import { Copy, Check, Bookmark, Sparkles, Search, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PromptListProps {
  prompts: PromptItem[];
  favorites: PromptItem[];
  onToggleFavorite: (prompt: PromptItem) => void;
  businessName: string;
}

export const PromptList: React.FC<PromptListProps> = ({
  prompts,
  favorites,
  onToggleFavorite,
  businessName,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (prompts.length === 0) return null;

  // Collect unique tags
  const allTags = Array.from(new Set(prompts.flatMap((p) => p.tags)));

  const filteredPrompts = prompts.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-6">
      {/* Result Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              Generated Prompts for <span className="text-purple-400">{businessName}</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            5 tailored prompt engineering specifications designed for ChatGPT, Claude, & Gemini.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search in prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tags Pill Bar */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              selectedTag === null
                ? 'bg-purple-600 text-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All ({prompts.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Prompts Cards List */}
      <div className="space-y-5">
        {filteredPrompts.map((item, index) => {
          const isCopied = copiedId === item.id;
          const isFav = favorites.some((f) => f.id === item.id || f.prompt === item.prompt);

          return (
            <div
              key={item.id}
              className="glass-card rounded-xl p-5 sm:p-6 relative group border border-slate-800/80 hover:border-purple-500/40"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-950/80 border border-purple-800/50 text-xs font-bold text-purple-300">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                    {item.title}
                  </h3>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleFavorite(item)}
                    className={`p-2 rounded-lg border transition ${
                      isFav
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                    title={isFav ? 'Saved in favorites' : 'Save prompt'}
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleCopy(item.id, item.prompt)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500/30'
                    }`}
                  >
                    {isCopied ? (
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
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Prompt Body */}
              <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {item.prompt}
              </div>

              {/* Strategic Explanation */}
              <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5 italic">
                <span className="font-semibold text-purple-400 not-italic">Why this works:</span>{' '}
                {item.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
