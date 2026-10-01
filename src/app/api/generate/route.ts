import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Category, CATEGORIES, GeneratePromptsRequest, GeneratePromptsResponse } from '@/lib/types';
import { checkRateLimit, incrementUsage } from '@/lib/rateLimiter';

const openaiApiKey = process.env.OPENAI_API_KEY;

function generateFallbackPrompts(category: Category, businessName: string): string[] {
  const name = businessName.trim() || 'our business';
  switch (category) {
    case 'Marketing':
      return [
        `Develop a 30-day social media launch strategy for ${name} targeting ideal customer personas with actionable content buckets.`,
        `Draft 5 high-converting headline variations for ${name}'s landing page focusing on core benefits and clear CTAs.`,
        `Create a multi-step email nurture campaign for new leads subscribing to ${name}'s newsletter.`,
        `Outline a comprehensive SEO keyword and content marketing plan for ${name} to outrank top industry competitors.`,
        `Write a compelling press release for ${name} announcing a groundbreaking new feature or service line.`
      ];
    case 'Sales':
      return [
        `Write a high-converting cold email sequence (3 touchpoints) for ${name} targeting B2B decision makers.`,
        `Create an objection-handling script for sales representatives at ${name} dealing with budget constraints.`,
        `Draft a persuasive product demo pitch script tailored for ${name}'s key enterprise clients.`,
        `Formulate a follow-up email template for prospects who went dark after receiving a proposal from ${name}.`,
        `Develop a referral request strategy and message script for happy existing clients of ${name}.`
      ];
    case 'Coding':
      return [
        `Design a scalable database schema and system architecture for ${name}'s web application.`,
        `Refactor a core backend API endpoint for ${name} to improve performance, error handling, and type safety.`,
        `Write unit and integration tests using Jest/React Testing Library for ${name}'s core user flow.`,
        `Create a step-by-step CI/CD pipeline automation script for ${name}'s GitHub deployment.`,
        `Draft an API documentation specification (OpenAPI 3.0 format) for ${name}'s developer endpoints.`
      ];
    case 'HR':
      return [
        `Draft a comprehensive job description and requirements for a key position at ${name}.`,
        `Create a structured 90-day onboarding checklist for new team members joining ${name}.`,
        `Formulate a behavioral interview question bank with rubric scoring for candidates at ${name}.`,
        `Write an internal company newsletter template highlighting achievements and cultural updates for ${name}.`,
        `Develop a performance review framework with goal-setting (OKR) templates for managers at ${name}.`
      ];
    default:
      return [
        `Generate a growth strategy tailored for ${name} in the ${category} domain.`,
        `Identify top 3 operational optimizations for ${name}.`,
        `Draft a customer success framework for ${name}.`,
        `Design a competitive intelligence template for ${name}.`,
        `Build an execution roadmap for key initiatives at ${name}.`
      ];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: GeneratePromptsRequest = await req.json();
    const { category, businessName } = body;

    if (!category || !CATEGORIES.includes(category)) {
      return NextResponse.json<GeneratePromptsResponse>(
        { success: false, error: 'Invalid or missing category.' },
        { status: 400 }
      );
    }

    if (!businessName || typeof businessName !== 'string' || !businessName.trim()) {
      return NextResponse.json<GeneratePromptsResponse>(
        { success: false, error: 'Business name is required.' },
        { status: 400 }
      );
    }

    // Client ID determination
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const isPro = req.cookies.get('pro_access')?.value === 'true';

    const rateCheck = checkRateLimit(clientIp, isPro);
    if (!rateCheck.allowed) {
      return NextResponse.json<GeneratePromptsResponse>(
        {
          success: false,
          remainingDailyPrompts: 0,
          isPro: false,
          error: 'Daily free limit reached (3/3 prompts generated today). Upgrade to Pro for unlimited access!'
        },
        { status: 429 }
      );
    }

    let prompts: string[] = [];

    if (openaiApiKey && openaiApiKey !== 'mock-key') {
      try {
        const openai = new OpenAI({ apiKey: openaiApiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert prompt engineer. Generate exactly 5 distinct, highly practical, and effective AI prompts tailored to the user\'s business and requested category. Return ONLY a JSON array of 5 prompt strings without markdown formatting.'
            },
            {
              role: 'user',
              content: `Business Name: "${businessName.trim()}"\nCategory: "${category}"\nProvide 5 tailored prompts.`
            }
          ],
          temperature: 0.7,
        });

        const textResponse = completion.choices[0]?.message?.content?.trim() || '';
        try {
          const parsed = JSON.parse(textResponse);
          if (Array.isArray(parsed) && parsed.length >= 5) {
            prompts = parsed.slice(0, 5).map(p => String(p));
          }
        } catch {
          // Fallback if parsing fails
          const lines = textResponse.split('\n').filter(line => line.trim().length > 0);
          if (lines.length >= 5) {
            prompts = lines.slice(0, 5).map(l => l.replace(/^\d+[\.\)]\s*/, '').replace(/^"|"$/g, '').trim());
          }
        }
      } catch (err) {
        console.error('OpenAI API Error, falling back to local template prompts:', err);
      }
    }

    if (prompts.length < 5) {
      prompts = generateFallbackPrompts(category, businessName);
    }

    const usage = incrementUsage(clientIp, isPro);

    return NextResponse.json<GeneratePromptsResponse>({
      success: true,
      prompts,
      remainingDailyPrompts: usage.remaining,
      isPro,
    });
  } catch (error) {
    console.error('Error generating prompts:', error);
    return NextResponse.json<GeneratePromptsResponse>(
      { success: false, error: 'An error occurred while generating prompts.' },
      { status: 500 }
    );
  }
}
