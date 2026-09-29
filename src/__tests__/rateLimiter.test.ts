import { checkRateLimit, incrementRateLimit, resetRateLimitStore } from '../lib/rateLimiter';
import { CATEGORIES } from '../lib/types';

describe('RateLimiter Utility', () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  test('CATEGORIES contains Marketing, Sales, Coding, and HR', () => {
    expect(CATEGORIES).toEqual(['Marketing', 'Sales', 'Coding', 'HR']);
  });

  test('Free tier allows 3 calls then blocks 4th call', () => {
    const id = 'test_user_1';

    // Check initial limit
    const initialCheck = checkRateLimit(id, false);
    expect(initialCheck.allowed).toBe(true);
    expect(initialCheck.remaining).toBe(3);

    // Call 1
    const res1 = incrementRateLimit(id, false);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    // Call 2
    const res2 = incrementRateLimit(id, false);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    // Call 3
    const res3 = incrementRateLimit(id, false);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);

    // Call 4 - should exceed limit
    const res4 = incrementRateLimit(id, false);
    expect(res4.allowed).toBe(false);
    expect(res4.remaining).toBe(0);

    // Subsequent check should also indicate not allowed
    const checkAfterExceeded = checkRateLimit(id, false);
    expect(checkAfterExceeded.allowed).toBe(false);
    expect(checkAfterExceeded.remaining).toBe(0);
  });

  test('Pro tier bypasses rate limit', () => {
    const id = 'pro_user_1';

    const check = checkRateLimit(id, true);
    expect(check.allowed).toBe(true);

    for (let i = 0; i < 10; i++) {
      const res = incrementRateLimit(id, true);
      expect(res.allowed).toBe(true);
    }
  });
});
