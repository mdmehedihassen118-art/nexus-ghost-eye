import { NextRequest, NextResponse } from 'next/server';
import { checkAndIncrementUsage } from '@/lib/rateLimiter';
import { generatePromptsForBusiness } from '@/lib/openai';
import { Category, CATEGORIES } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, businessName, businessDescription, isPro = false, clientId: providedClientId } = body;

    // Validate inputs
    if (!category || !businessName || typeof businessName !== 'string' || !businessName.trim()) {
      return NextResponse.json(
        { error: 'Category and business name are required fields.' },
        { status: 400 }
      );
    }

    const validCategories: Category[] = CATEGORIES.map((c) => c.id);
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Determine client identifier (IP or client-provided unique ID)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    const clientId = providedClientId || clientIp;

    // Check rate limits for free tier
    const usage = checkAndIncrementUsage(clientId, Boolean(isPro));

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: 'Daily limit reached (3/3 prompts generated today). Upgrade to Pro for unlimited prompts.',
          remainingPrompts: 0,
          isPro: false,
          resetAt: usage.resetAt
        },
        { status: 429 }
      );
    }

    // Generate prompts using OpenAI or fallback generator
    const prompts = await generatePromptsForBusiness(category, businessName.trim(), businessDescription?.trim());

    return NextResponse.json({
      prompts,
      remainingPrompts: usage.remaining,
      isPro: Boolean(isPro)
    });
  } catch (error: any) {
    console.error('Error in /api/generate route:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while generating prompts.' },
      { status: 500 }
    );
  }
}
