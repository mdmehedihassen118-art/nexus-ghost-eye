import { checkRateLimit, incrementUsage, resetUsageStore, FREE_DAILY_LIMIT } from '../lib/rateLimiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    resetUsageStore();
  });

  test('allows up to FREE_DAILY_LIMIT requests for standard user', () => {
    const clientId = 'user-1';

    for (let i = 0; i < FREE_DAILY_LIMIT; i++) {
      const status = checkRateLimit(clientId, false);
      expect(status.allowed).toBe(true);
      expect(status.remaining).toBe(FREE_DAILY_LIMIT - i);
      incrementUsage(clientId, false);
    }

    const checkBlocked = checkRateLimit(clientId, false);
    expect(checkBlocked.allowed).toBe(false);
    expect(checkBlocked.remaining).toBe(0);

    const incBlocked = incrementUsage(clientId, false);
    expect(incBlocked.allowed).toBe(false);
    expect(incBlocked.remaining).toBe(0);
  });

  test('unlimited generations for Pro users', () => {
    const clientId = 'pro-user-1';

    for (let i = 0; i < 10; i++) {
      const status = checkRateLimit(clientId, true);
      expect(status.allowed).toBe(true);
      const inc = incrementUsage(clientId, true);
      expect(inc.allowed).toBe(true);
    }
  });
});
