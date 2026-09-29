import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, incrementRateLimit } from '@/lib/rateLimiter';
import { generatePromptsWithAI } from '@/lib/openai';
import { Category } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, businessName, isPro } = body as {
      category: Category;
      businessName: string;
      isPro?: boolean;
    };

    if (!category || !['Marketing', 'Sales', 'Coding', 'HR'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid or missing category. Must be Marketing, Sales, Coding, or HR.' },
        { status: 400 }
      );
    }

    // Get client identifier (IP or fallback session key)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous_user';
    const identifier = `client_${ip}`;

    // Check rate limit
    const check = checkRateLimit(identifier, Boolean(isPro));
    if (!check.allowed) {
      return NextResponse.json(
        {
          error: 'Daily free limit reached (3 prompts/day). Upgrade to Pro for $9/month for unlimited generations!',
          remainingPrompts: 0,
          limitReached: true,
        },
        { status: 429 }
      );
    }

    // Increment usage rate
    const updatedRate = incrementRateLimit(identifier, Boolean(isPro));

    // Generate 5 custom prompts
    const prompts = await generatePromptsWithAI(category, businessName || 'Your Business');

    return NextResponse.json({
      prompts,
      remainingPrompts: updatedRate.remaining,
      isPro: Boolean(isPro),
      limitReached: false,
    });
  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while generating prompts.' },
      { status: 500 }
    );
  }
}
