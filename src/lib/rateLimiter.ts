import { RateLimitCheckResult } from './types';

// In-memory rate limiter store for free tier users
// Limits users to 3 prompt generations per 24 hours per identifier
const FREE_TIER_LIMIT = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RateRecord {
  count: number;
  resetAt: number;
}

const usageStore = new Map<string, RateRecord>();

export function checkRateLimit(identifier: string, isPro: boolean = false): RateLimitCheckResult {
  if (isPro) {
    return {
      allowed: true,
      remaining: 999,
      limit: 999,
      resetTime: Date.now() + WINDOW_MS,
    };
  }

  const now = Date.now();
  const record = usageStore.get(identifier);

  if (!record || now > record.resetAt) {
    return {
      allowed: true,
      remaining: FREE_TIER_LIMIT,
      limit: FREE_TIER_LIMIT,
      resetTime: now + WINDOW_MS,
    };
  }

  const remaining = Math.max(0, FREE_TIER_LIMIT - record.count);
  return {
    allowed: remaining > 0,
    remaining,
    limit: FREE_TIER_LIMIT,
    resetTime: record.resetAt,
  };
}

export function incrementRateLimit(identifier: string, isPro: boolean = false): RateLimitCheckResult {
  if (isPro) {
    return {
      allowed: true,
      remaining: 999,
      limit: 999,
      resetTime: Date.now() + WINDOW_MS,
    };
  }

  const now = Date.now();
  let record = usageStore.get(identifier);

  if (!record || now > record.resetAt) {
    record = { count: 1, resetAt: now + WINDOW_MS };
  } else {
    record.count += 1;
  }

  usageStore.set(identifier, record);

  const remaining = Math.max(0, FREE_TIER_LIMIT - record.count);
  return {
    allowed: record.count <= FREE_TIER_LIMIT,
    remaining,
    limit: FREE_TIER_LIMIT,
    resetTime: record.resetAt,
  };
}

export function resetRateLimitStore(): void {
  usageStore.clear();
}
