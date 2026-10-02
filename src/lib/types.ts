export type Category = 'Marketing' | 'Sales' | 'Coding' | 'HR';

export const CATEGORIES: Category[] = ['Marketing', 'Sales', 'Coding', 'HR'];

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  Marketing: 'Campaign strategies, SEO content, social media copy & brand messaging',
  Sales: 'Cold outreach emails, objection handling, pitch scripts & deal follow-ups',
  Coding: 'System design, code refactoring, bug fixing & API architecture',
  HR: 'Job descriptions, interview questions, onboarding plans & performance reviews',
};

export interface GeneratePromptsRequest {
  category: Category;
  businessName: string;
}

export interface GeneratePromptsResponse {
  success: boolean;
  prompts?: string[];
  remainingDailyPrompts?: number;
  isPro?: boolean;
  error?: string;
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: string;
  isPro: boolean;
}
