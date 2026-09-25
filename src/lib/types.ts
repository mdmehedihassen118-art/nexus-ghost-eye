export type Category = 'Marketing' | 'Sales' | 'Coding' | 'HR';

export interface CategoryInfo {
  id: Category;
  label: string;
  description: string;
  icon: string;
  examples: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'Marketing',
    label: 'Marketing',
    description: 'Campaign ideas, ad copy, social media hooks, & SEO content',
    icon: 'Megaphone',
    examples: ['Acme SaaS', 'Bloom Coffee', 'TechFlow Analytics']
  },
  {
    id: 'Sales',
    label: 'Sales',
    description: 'Cold outreach emails, objection handling, & discovery scripts',
    icon: 'TrendingUp',
    examples: ['CloudSync Enterprise', 'Apex Logistics', 'Volt Energy']
  },
  {
    id: 'Coding',
    label: 'Coding',
    description: 'Architecture designs, refactoring prompts, unit test suites, & code review checklists',
    icon: 'Code',
    examples: ['DevPortal API', 'ShopEase Frontend', 'DataPulse Pipeline']
  },
  {
    id: 'HR',
    label: 'HR & Operations',
    description: 'Job descriptions, onboarding guides, performance reviews, & team policies',
    icon: 'Users',
    examples: ['Horizon Health', 'BrightByte Studio', 'Nexus Global']
  }
];

export interface GeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: Category;
  tags?: string[];
}

export interface PromptGenerationRequest {
  category: Category;
  businessName: string;
}

export interface PromptGenerationResponse {
  prompts: GeneratedPrompt[];
  remainingFreeGenerations: number;
  isPro: boolean;
  message?: string;
}
