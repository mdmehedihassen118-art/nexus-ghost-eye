import { getFallbackPrompts } from '../lib/openai';
import { CATEGORIES } from '../lib/types';

describe('PromptCraft AI Logic & Quota Tests', () => {
  test('CATEGORIES constant contains expected 4 categories', () => {
    expect(CATEGORIES).toHaveLength(4);
    const categoryIds = CATEGORIES.map((c) => c.id);
    expect(categoryIds).toContain('Marketing');
    expect(categoryIds).toContain('Sales');
    expect(categoryIds).toContain('Coding');
    expect(categoryIds).toContain('HR');
  });

  test('getFallbackPrompts returns exactly 5 custom prompts for Marketing', () => {
    const prompts = getFallbackPrompts('Marketing', 'Acme Corp');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('Marketing');
    expect(prompts[0].prompt).toContain('Acme Corp');
  });

  test('getFallbackPrompts returns exactly 5 custom prompts for Sales', () => {
    const prompts = getFallbackPrompts('Sales', 'Apex Sales');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('Sales');
    expect(prompts[0].prompt).toContain('Apex Sales');
  });

  test('getFallbackPrompts returns exactly 5 custom prompts for Coding', () => {
    const prompts = getFallbackPrompts('Coding', 'DevPortal');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('Coding');
    expect(prompts[0].prompt).toContain('DevPortal');
  });

  test('getFallbackPrompts returns exactly 5 custom prompts for HR', () => {
    const prompts = getFallbackPrompts('HR', 'Horizon Health');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('HR');
    expect(prompts[0].prompt).toContain('Horizon Health');
  });
});
