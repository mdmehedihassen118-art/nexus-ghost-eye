'use client';

import React, { useState } from 'react';
import { PromptItem } from '@/types';
import { X, Bookmark, Copy, Check, Trash2 } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: PromptItem[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between p-6 shadow-2xl">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-purple-400 fill-purple-400/20" />
              <h2 className="text-lg font-bold text-white">Saved Prompts ({favorites.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="mt-4 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {favorites.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-400" />
                <p className="text-sm font-medium">No saved prompts yet</p>
                <p className="text-xs mt-1">Click the bookmark icon on any prompt to save it here.</p>
              </div>
            ) : (
              favorites.map((item) => {
                const isCopied = copiedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 relative group hover:border-purple-500/40 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40 uppercase tracking-wider">
                        {item.category} • {item.businessName}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(item.id, item.prompt)}
                          className={`p-1.5 rounded text-xs transition ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                          title="Copy prompt"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => onRemoveFavorite(item.id)}
                          className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          title="Remove prompt"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    <p className="text-xs font-mono text-slate-300 line-clamp-3 bg-slate-900/60 p-2 rounded border border-slate-800/50">
                      {item.prompt}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-500">{favorites.length} prompts saved</span>
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
