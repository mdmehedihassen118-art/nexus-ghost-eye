import { NextRequest, NextResponse } from 'next/server';
import { generatePromptsForBusiness } from '@/lib/ai';
import { CategoryId } from '@/types';

const FREE_DAILY_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, businessName, isPro, currentUsageCount } = body as {
      category: CategoryId;
      businessName: string;
      isPro?: boolean;
      currentUsageCount?: number;
    };

    if (!category || !['marketing', 'sales', 'coding', 'hr'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category selected. Choose Marketing, Sales, Coding, or HR.' },
        { status: 400 }
      );
    }

    if (!businessName || typeof businessName !== 'string' || !businessName.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid business name.' },
        { status: 400 }
      );
    }

    const usage = currentUsageCount ?? 0;

    // Enforce 3 prompts per day limit for Free Tier
    if (!isPro && usage >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: `Daily limit reached! Free users get ${FREE_DAILY_LIMIT} generations per day. Upgrade to Pro for unlimited generations.`,
          limitReached: true,
          remainingDailyGenerations: 0,
        },
        { status: 403 }
      );
    }

    const prompts = await generatePromptsForBusiness(category, businessName.trim());
    const nextUsageCount = usage + 1;
    const remaining = isPro ? Infinity : Math.max(0, FREE_DAILY_LIMIT - nextUsageCount);

    return NextResponse.json({
      prompts,
      usageCount: nextUsageCount,
      remainingDailyGenerations: remaining,
      isPro: !!isPro,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
