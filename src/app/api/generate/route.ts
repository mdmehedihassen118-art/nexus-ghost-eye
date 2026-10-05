import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, incrementRateLimit } from '@/lib/rateLimiter';
import { generatePrompts } from '@/lib/openai';
import { Category, CATEGORIES } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, businessName, userId, isPro } = body as {
      category: Category;
      businessName: string;
      userId?: string;
      isPro?: boolean;
    };

    if (!category || !CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category specified.' },
        { status: 400 }
      );
    }

    if (!businessName || typeof businessName !== 'string' || businessName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Business name is required.' },
        { status: 400 }
      );
    }

    // Determine client identifier (IP or provided user ID)
    const ip = req.headers.get('x-forwarded-for') || 'anonymous-client';
    const clientId = userId || ip;
    const proUser = Boolean(isPro);

    // Rate limiting check
    const limitStatus = checkRateLimit(clientId, proUser);
    if (!limitStatus.allowed) {
      return NextResponse.json(
        {
          error: 'Free limit reached (3 prompt requests per day). Upgrade to Pro for unlimited prompts!',
          remainingPrompts: 0,
          isPro: false
        },
        { status: 429 }
      );
    }

    const prompts = await generatePrompts(category, businessName.trim());
    const updatedLimit = incrementRateLimit(clientId, proUser);

    return NextResponse.json({
      prompts,
      remainingPrompts: updatedLimit.remaining,
      isPro: proUser
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while generating prompts.' },
      { status: 500 }
    );
  }
}
