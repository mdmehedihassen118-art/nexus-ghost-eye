import { getFallbackPrompts, generatePrompts } from '../src/lib/openai';
import { CATEGORIES } from '../src/lib/types';

describe('openai prompt generation service', () => {
  test('returns 5 fallback prompts for every category', () => {
    CATEGORIES.forEach((category) => {
      const prompts = getFallbackPrompts(category, 'Acme Test Corp');
      expect(prompts).toHaveLength(5);
      prompts.forEach((p) => {
        expect(p.prompt).toContain('Acme Test Corp');
        expect(p.title).toBeTruthy();
        expect(p.description).toBeTruthy();
      });
    });
  });

  test('generatePrompts uses fallback when OPENAI_API_KEY is not set', async () => {
    const prompts = await generatePrompts('Marketing', 'TechStart');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].prompt).toContain('TechStart');
  });
});
