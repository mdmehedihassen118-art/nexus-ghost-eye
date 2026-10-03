import { checkAndIncrementUsage, getUsageInfo, clearRateLimitStore, FREE_DAILY_LIMIT } from '../src/lib/rateLimiter';

describe('rateLimiter lib', () => {
  beforeEach(() => {
    clearRateLimitStore();
  });

  it('allows 3 generations per day for free users', () => {
    const user = 'user_free_123';

    // 1st attempt
    const res1 = checkAndIncrementUsage(user, false);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);
    expect(res1.count).toBe(1);

    // 2nd attempt
    const res2 = checkAndIncrementUsage(user, false);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    // 3rd attempt
    const res3 = checkAndIncrementUsage(user, false);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);

    // 4th attempt - blocked
    const res4 = checkAndIncrementUsage(user, false);
    expect(res4.allowed).toBe(false);
    expect(res4.remaining).toBe(0);
    expect(res4.count).toBe(3);
  });

  it('allows unlimited generations for Pro users', () => {
    const user = 'user_pro_456';

    for (let i = 0; i < 10; i++) {
      const res = checkAndIncrementUsage(user, true);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(Infinity);
    }
  });

  it('accurately retrieves current usage info without incrementing', () => {
    const user = 'user_test_789';

    expect(getUsageInfo(user, false).count).toBe(0);
    expect(getUsageInfo(user, false).remaining).toBe(FREE_DAILY_LIMIT);

    checkAndIncrementUsage(user, false);

    expect(getUsageInfo(user, false).count).toBe(1);
    expect(getUsageInfo(user, false).remaining).toBe(FREE_DAILY_LIMIT - 1);
  });
});
