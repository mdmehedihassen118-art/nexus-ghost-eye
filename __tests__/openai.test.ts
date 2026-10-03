import { generatePromptsForBusiness } from '../src/lib/openai';

describe('openai lib prompt generation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('generates 5 fallback prompts for Marketing when API key is not present or is mock', async () => {
    delete process.env.OPENAI_API_KEY;

    const prompts = await generatePromptsForBusiness('Marketing', 'Acme Corp', 'Digital agency');

    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('Marketing');
    expect(prompts[0].prompt).toContain('Acme Corp');
    expect(prompts[0].prompt).toContain('Digital agency');
    expect(prompts[0].title).toBeDefined();
    expect(prompts[0].tags.length).toBeGreaterThan(0);
  });

  it('generates 5 fallback prompts for Coding category', async () => {
    process.env.OPENAI_API_KEY = 'mock-key';

    const prompts = await generatePromptsForBusiness('Coding', 'DevFlow');

    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('Coding');
    expect(prompts[0].prompt).toContain('DevFlow');
  });

  it('generates 5 fallback prompts for Sales category', async () => {
    process.env.OPENAI_API_KEY = 'sk-test-placeholder';

    const prompts = await generatePromptsForBusiness('Sales', 'SalesPro');

    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('Sales');
  });

  it('generates 5 fallback prompts for HR category', async () => {
    process.env.OPENAI_API_KEY = 'mock-key';

    const prompts = await generatePromptsForBusiness('HR', 'PeopleFirst');

    expect(prompts).toHaveLength(5);
    expect(prompts[0].category).toBe('HR');
  });
});
