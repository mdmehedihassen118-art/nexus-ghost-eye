interface UsageRecord {
  count: number;
  date: string;
}

const memoryStore: Record<string, UsageRecord> = {};

export const MAX_FREE_DAILY_PROMPTS = 3;

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function checkRateLimit(clientId: string, isPro: boolean = false): {
  allowed: boolean;
  remaining: number;
  count: number;
} {
  if (isPro) {
    return { allowed: true, remaining: 999, count: 0 };
  }

  const today = getTodayKey();
  const record = memoryStore[clientId];

  if (!record || record.date !== today) {
    return {
      allowed: true,
      remaining: MAX_FREE_DAILY_PROMPTS,
      count: 0
    };
  }

  const remaining = Math.max(0, MAX_FREE_DAILY_PROMPTS - record.count);
  return {
    allowed: record.count < MAX_FREE_DAILY_PROMPTS,
    remaining,
    count: record.count
  };
}

export function incrementRateLimit(clientId: string, isPro: boolean = false): {
  remaining: number;
  count: number;
} {
  if (isPro) {
    return { remaining: 999, count: 0 };
  }

  const today = getTodayKey();
  const record = memoryStore[clientId];

  if (!record || record.date !== today) {
    memoryStore[clientId] = { count: 1, date: today };
    return { remaining: MAX_FREE_DAILY_PROMPTS - 1, count: 1 };
  }

  record.count += 1;
  const remaining = Math.max(0, MAX_FREE_DAILY_PROMPTS - record.count);
  return { remaining, count: record.count };
}

export function resetMemoryStore(): void {
  for (const key in memoryStore) {
    delete memoryStore[key];
  }
}
