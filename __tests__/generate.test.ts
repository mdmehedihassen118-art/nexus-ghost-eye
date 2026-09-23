import { generatePromptsForBusiness } from '../src/lib/ai';

describe('Prompt Generation Engine Logic', () => {
  it('should generate 5 prompts for Marketing category', async () => {
    const prompts = await generatePromptsForBusiness('marketing', 'Acme Corp');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].businessName).toBe('Acme Corp');
    expect(prompts[0].prompt).toContain('Acme Corp');
  });

  it('should generate 5 prompts for Coding category', async () => {
    const prompts = await generatePromptsForBusiness('coding', 'Tech Innovations');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('coding');
    expect(prompts[0].prompt).toContain('Tech Innovations');
  });

  it('should handle empty business name gracefully with default', async () => {
    const prompts = await generatePromptsForBusiness('sales', '   ');
    expect(prompts).toHaveLength(5);
    expect(prompts[0].businessName).toBe('My Business');
  });
});
