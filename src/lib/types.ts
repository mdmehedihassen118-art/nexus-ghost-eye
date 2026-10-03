export type Category = 'Marketing' | 'Sales' | 'Coding' | 'HR';

export const CATEGORIES: { id: Category; label: string; description: string; iconName: string }[] = [
  {
    id: 'Marketing',
    label: 'Marketing',
    description: 'Campaign ideas, ad copy, SEO content, social strategy',
    iconName: 'Megaphone'
  },
  {
    id: 'Sales',
    label: 'Sales',
    description: 'Cold outreach, email templates, objection handling, pitch scripts',
    iconName: 'TrendingUp'
  },
  {
    id: 'Coding',
    label: 'Coding',
    description: 'Code refactoring, bug fixing, API design, unit test generation',
    iconName: 'Code2'
  },
  {
    id: 'HR',
    label: 'HR & People',
    description: 'Job descriptions, onboarding, performance reviews, policy drafts',
    iconName: 'Users'
  }
];

export interface GeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: Category;
  tags: string[];
}

export interface PromptGenerationRequest {
  category: Category;
  businessName: string;
  businessDescription?: string;
  isPro?: boolean;
}

export interface PromptGenerationResponse {
  prompts: GeneratedPrompt[];
  remainingPrompts: number;
  isPro: boolean;
  error?: string;
}

export interface UsageInfo {
  count: number;
  limit: number;
  remaining: number;
  isPro: boolean;
  resetAt: string;
}
