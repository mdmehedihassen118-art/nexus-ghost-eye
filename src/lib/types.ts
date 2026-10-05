export type Category = 'Marketing' | 'Sales' | 'Coding' | 'HR';

export const CATEGORIES: Category[] = ['Marketing', 'Sales', 'Coding', 'HR'];

export interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  description: string;
}

export interface GenerateResponse {
  prompts: PromptItem[];
  remainingPrompts: number;
  isPro: boolean;
}

export interface GenerateRequest {
  category: Category;
  businessName: string;
  userId?: string;
}
