export const FREE_DAILY_LIMIT = 3;

interface UsageRecord {
  count: number;
  date: string;
}

// In-memory store for rate limiting (fallback for server runtime)
const usageStore = new Map<string, UsageRecord>();

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function checkRateLimit(clientId: string, isPro = false): {
  allowed: boolean;
  remaining: number;
  count: number;
} {
  if (isPro) {
    return { allowed: true, remaining: 999, count: 0 };
  }

  const today = getTodayKey();
  const record = usageStore.get(clientId);

  if (!record || record.date !== today) {
    return {
      allowed: true,
      remaining: FREE_DAILY_LIMIT,
      count: 0,
    };
  }

  const remaining = Math.max(0, FREE_DAILY_LIMIT - record.count);
  return {
    allowed: record.count < FREE_DAILY_LIMIT,
    remaining,
    count: record.count,
  };
}

export function incrementUsage(clientId: string, isPro = false): {
  allowed: boolean;
  remaining: number;
  count: number;
} {
  if (isPro) {
    return { allowed: true, remaining: 999, count: 0 };
  }

  const today = getTodayKey();
  const record = usageStore.get(clientId);

  if (!record || record.date !== today) {
    usageStore.set(clientId, { count: 1, date: today });
    return {
      allowed: true,
      remaining: FREE_DAILY_LIMIT - 1,
      count: 1,
    };
  }

  if (record.count >= FREE_DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      count: record.count,
    };
  }

  record.count += 1;
  usageStore.set(clientId, record);

  return {
    allowed: true,
    remaining: FREE_DAILY_LIMIT - record.count,
    count: record.count,
  };
}

export function resetUsageStore(): void {
  usageStore.clear();
}
