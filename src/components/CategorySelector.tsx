"use client";

import React from "react";
import { Megaphone, TrendingUp, Code2, Users } from "lucide-react";

export type CategoryType = "Marketing" | "Sales" | "Coding" | "HR";

interface CategorySelectorProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const CATEGORIES: { id: CategoryType; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
  {
    id: "Marketing",
    label: "Marketing",
    icon: Megaphone,
    description: "Ads, copy, viral posts & SEO",
  },
  {
    id: "Sales",
    label: "Sales",
    icon: TrendingUp,
    description: "Outreach, scripts & pitch decks",
  },
  {
    id: "Coding",
    label: "Coding",
    icon: Code2,
    description: "Architecture, APIs & refactoring",
  },
  {
    id: "HR",
    label: "HR & People",
    icon: Users,
    description: "Hiring, onboarding & performance",
  },
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`group relative p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
              isSelected
                ? "bg-gradient-to-b from-indigo-900/40 to-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-indigo-600/30 text-indigo-300"
                    : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </div>
            <div>
              <h3
                className={`font-semibold text-sm sm:text-base ${
                  isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                }`}
              >
                {cat.label}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {cat.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
