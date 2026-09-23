"use client";

import React, { useState } from "react";
import { X, Bookmark, Trash2, Download, Copy, Check, Search } from "lucide-react";
import { PromptItem } from "@/app/api/generate/route";

interface SavedPromptsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPrompts: PromptItem[];
  onRemovePrompt: (id: string) => void;
  onClearAll: () => void;
}

export const SavedPromptsDrawer: React.FC<SavedPromptsDrawerProps> = ({
  isOpen,
  onClose,
  savedPrompts,
  onRemovePrompt,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = savedPrompts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportAsTXT = () => {
    const textContent = savedPrompts
      .map(
        (p, idx) =>
          `=== [${idx + 1}] ${p.title} (${p.category}) ===\nPurpose: ${p.purpose}\n\n${p.promptText}\n\nTip: ${p.tips}\n\n`
      )
      .join("\n----------------------------------------\n\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PromptCraft_Saved_Prompts_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#0d1322] border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Saved Prompts Library</h2>
              <p className="text-xs text-slate-400">{savedPrompts.length} prompts bookmarked</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls: Search & Export */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/30">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search saved prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {savedPrompts.length > 0 && (
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={exportAsTXT}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 transition font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export as TXT</span>
              </button>

              <button
                onClick={onClearAll}
                className="flex items-center space-x-1 text-slate-500 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedPrompts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Bookmark className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <h3 className="text-slate-300 font-semibold text-sm">No saved prompts yet</h3>
              <p className="text-slate-500 text-xs mt-1">
                Click the &ldquo;Save&rdquo; bookmark button on any prompt card to store it in your library for later.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">
              No matching prompts found for &ldquo;{searchTerm}&rdquo;
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition space-y-2"
              >
                <div className="flex items-start justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {item.category}
                  </span>
                  <button
                    onClick={() => onRemovePrompt(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-white text-xs sm:text-sm">{item.title}</h4>

                <div className="relative">
                  <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 max-h-24 overflow-y-auto line-clamp-3">
                    {item.promptText}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={() => handleCopy(item.id, item.promptText)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center space-x-1 transition ${
                      copiedId === item.id
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
