export type Category = 'Marketing' | 'Sales' | 'Coding' | 'HR';

export const CATEGORIES: Category[] = ['Marketing', 'Sales', 'Coding', 'HR'];

export interface PromptItem {
  id: string;
  category: Category;
  title: string;
  promptText: string;
  description: string;
  tags: string[];
}

export interface GeneratePromptsRequest {
  category: Category;
  businessName: string;
}

export interface GeneratePromptsResponse {
  prompts: PromptItem[];
  remainingPrompts: number;
  isPro: boolean;
  limitReached: boolean;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetTime: number;
}
