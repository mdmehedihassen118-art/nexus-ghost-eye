import { getFallbackPrompts } from '../lib/openai';
import { CATEGORIES, Category } from '../lib/types';

describe('OpenAI / Fallback Prompts', () => {
  test('returns 5 custom prompts for each category', () => {
    CATEGORIES.forEach((cat: Category) => {
      const prompts = getFallbackPrompts(cat, 'Acme Test Corp');
      expect(prompts).toHaveLength(5);
      prompts.forEach((item) => {
        expect(item.category).toBe(cat);
        expect(item.title).toBeTruthy();
        expect(item.promptText).toContain('Acme Test Corp');
        expect(item.description).toBeTruthy();
        expect(Array.isArray(item.tags)).toBe(true);
      });
    });
  });

  test('handles empty or whitespace business name gracefully', () => {
    const prompts = getFallbackPrompts('Marketing', '   ');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].promptText).toContain('Your Business');
  });
});
