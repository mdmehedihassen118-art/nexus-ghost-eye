export type CategoryId = 'marketing' | 'sales' | 'coding' | 'hr';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
  gradient: string;
}

export interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  category: CategoryId;
  businessName: string;
  tags: string[];
  explanation: string;
  isFavorite?: boolean;
}

export interface GenerationRequest {
  category: CategoryId;
  businessName: string;
  customNotes?: string;
}

export interface GenerationResponse {
  prompts: PromptItem[];
  remainingDailyGenerations: number;
  isPro: boolean;
}

export interface UserPlan {
  isPro: boolean;
  stripeCustomerId?: string;
  subscriptionId?: string;
  dailyUsageCount: number;
  lastUsedDate: string; // YYYY-MM-DD
}
