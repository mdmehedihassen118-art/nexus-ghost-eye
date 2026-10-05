import { checkRateLimit, incrementRateLimit, resetMemoryStore, MAX_FREE_DAILY_PROMPTS } from '../src/lib/rateLimiter';

describe('rateLimiter utility', () => {
  beforeEach(() => {
    resetMemoryStore();
  });

  test('allows up to 3 daily prompts for free tier', () => {
    const clientId = 'test-client-1';

    let status = checkRateLimit(clientId, false);
    expect(status.allowed).toBe(true);
    expect(status.remaining).toBe(3);

    incrementRateLimit(clientId, false);
    incrementRateLimit(clientId, false);
    incrementRateLimit(clientId, false);

    status = checkRateLimit(clientId, false);
    expect(status.allowed).toBe(false);
    expect(status.remaining).toBe(0);
  });

  test('unlimited prompts for pro tier users', () => {
    const clientId = 'pro-client-1';

    const status = checkRateLimit(clientId, true);
    expect(status.allowed).toBe(true);
    expect(status.remaining).toBe(999);

    const incStatus = incrementRateLimit(clientId, true);
    expect(incStatus.remaining).toBe(999);
  });
});
