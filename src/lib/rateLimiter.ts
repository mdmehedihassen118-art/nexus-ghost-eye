export const FREE_DAILY_LIMIT = 3;

interface UsageRecord {
  count: number;
  date: string;
}

// In-memory fallback for rate limiting per client IP or identifier
const rateLimitStore = new Map<string, UsageRecord>();

/**
 * Gets formatted date string YYYY-MM-DD
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Checks usage and increments count if under limit.
 */
export function checkAndIncrementUsage(
  clientId: string,
  isPro: boolean = false
): { allowed: boolean; remaining: number; count: number; limit: number; resetAt: string } {
  const today = getTodayDateString();
  const resetAt = new Date(new Date().setHours(24, 0, 0, 0)).toISOString();

  if (isPro) {
    return {
      allowed: true,
      remaining: Infinity,
      count: 0,
      limit: Infinity,
      resetAt
    };
  }

  const record = rateLimitStore.get(clientId);

  if (!record || record.date !== today) {
    // New day or new user, record usage of 1
    rateLimitStore.set(clientId, { count: 1, date: today });
    return {
      allowed: true,
      remaining: FREE_DAILY_LIMIT - 1,
      count: 1,
      limit: FREE_DAILY_LIMIT,
      resetAt
    };
  }

  if (record.count >= FREE_DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      count: record.count,
      limit: FREE_DAILY_LIMIT,
      resetAt
    };
  }

  record.count += 1;
  rateLimitStore.set(clientId, record);

  return {
    allowed: true,
    remaining: FREE_DAILY_LIMIT - record.count,
    count: record.count,
    limit: FREE_DAILY_LIMIT,
    resetAt
  };
}

/**
 * Gets current usage info without incrementing
 */
export function getUsageInfo(clientId: string, isPro: boolean = false) {
  const today = getTodayDateString();
  const resetAt = new Date(new Date().setHours(24, 0, 0, 0)).toISOString();

  if (isPro) {
    return {
      count: 0,
      limit: Infinity,
      remaining: Infinity,
      isPro: true,
      resetAt
    };
  }

  const record = rateLimitStore.get(clientId);
  const count = (!record || record.date !== today) ? 0 : record.count;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - count);

  return {
    count,
    limit: FREE_DAILY_LIMIT,
    remaining,
    isPro: false,
    resetAt
  };
}

/**
 * Resets store - helpful for testing
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}
