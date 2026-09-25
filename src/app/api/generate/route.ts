import { NextRequest, NextResponse } from 'next/server';
import { generatePromptsWithAI } from '@/lib/openai';
import { Category, CATEGORIES, PromptGenerationResponse } from '@/lib/types';

// In-memory rate limiting store for IP / user session tracking
// Maps IP address -> { count: number, date: string }
const usageStore = new Map<string, { count: number; date: string }>();

const FREE_DAILY_LIMIT = 3;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || '127.0.0.1';
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { category, businessName, isPro } = body as {
      category?: Category;
      businessName?: string;
      isPro?: boolean;
    };

    if (!category || !CATEGORIES.some((c) => c.id === category)) {
      return NextResponse.json(
        { error: 'Invalid or missing category. Supported categories: Marketing, Sales, Coding, HR' },
        { status: 400 }
      );
    }

    if (!businessName || typeof businessName !== 'string' || !businessName.trim()) {
      return NextResponse.json(
        { error: 'Business name is required.' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(req);
    const today = getTodayString();
    let userUsage = usageStore.get(clientIp);

    if (!userUsage || userUsage.date !== today) {
      userUsage = { count: 0, date: today };
      usageStore.set(clientIp, userUsage);
    }

    // Pro users bypass the free daily limit
    if (!isPro && userUsage.count >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: 'Daily free limit reached (3/3). Upgrade to Pro ($9/mo) for unlimited prompt generations!',
          remainingFreeGenerations: 0,
          limitReached: true,
        },
        { status: 429 }
      );
    }

    // Increment usage count if not Pro
    if (!isPro) {
      userUsage.count += 1;
      usageStore.set(clientIp, userUsage);
    }

    const remainingFreeGenerations = isPro ? 9999 : Math.max(0, FREE_DAILY_LIMIT - userUsage.count);
    const prompts = await generatePromptsWithAI(category, businessName.trim());

    const responseData: PromptGenerationResponse = {
      prompts,
      remainingFreeGenerations,
      isPro: !!isPro,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error generating prompts:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while generating prompts.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const today = getTodayString();
  const userUsage = usageStore.get(clientIp);

  const used = userUsage && userUsage.date === today ? userUsage.count : 0;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);

  return NextResponse.json({
    usedGenerations: used,
    remainingFreeGenerations: remaining,
    dailyLimit: FREE_DAILY_LIMIT,
  });
}
