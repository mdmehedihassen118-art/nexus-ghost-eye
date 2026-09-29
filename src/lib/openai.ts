import OpenAI from 'openai';
import { Category, PromptItem } from './types';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export function getFallbackPrompts(category: Category, businessName: string): PromptItem[] {
  const safeName = businessName.trim() || 'Your Business';

  switch (category) {
    case 'Marketing':
      return [
        {
          id: 'm-1',
          category: 'Marketing',
          title: '30-Day Content Strategy & Editorial Calendar',
          promptText: `Act as a senior growth marketing manager for ${safeName}. Create a comprehensive 30-day social media content calendar targeting ideal B2B/B2C buyers. Include post themes, high-converting hooks, call-to-actions (CTAs), and recommended visual assets for LinkedIn, Twitter/X, and Instagram.`,
          description: 'A full monthly content plan designed to boost engagement and customer acquisition.',
          tags: ['Social Media', 'Content Strategy', 'Growth']
        },
        {
          id: 'm-2',
          category: 'Marketing',
          title: 'High-Converting Cold Email & Nurture Sequence',
          promptText: `You are an expert copywriter for ${safeName}. Write a 4-part email sequence for prospective clients. Include: 1) Eye-catching subject lines, 2) Value-first introduction addressing key customer pain points, 3) Social proof / mini case study, and 4) Low-friction Call To Action to book a call.`,
          description: 'A 4-part email drip sequence crafted to turn cold leads into qualified meetings.',
          tags: ['Email Copy', 'Outreach', 'Conversion']
        },
        {
          id: 'm-3',
          category: 'Marketing',
          title: 'Brand Value Proposition & Landing Page Copy',
          promptText: `Create high-converting landing page copy for ${safeName}. Draft a hero section with a compelling headline, sub-headline, top 3 value propositions with icon descriptions, FAQ section addressing top objections, and primary CTA button copy.`,
          description: 'Persuasive website landing page messaging optimized for conversion.',
          tags: ['Landing Page', 'Copywriting', 'Branding']
        },
        {
          id: 'm-4',
          category: 'Marketing',
          title: 'SEO Keywords & Blog Content Cluster Matrix',
          promptText: `Develop an SEO topic cluster for ${safeName}. Identify 1 pillar topic and 5 high-intent cluster blog titles. For each title, outline search intent, target primary/secondary keywords, suggested word count, and internal linking strategy.`,
          description: 'Strategic SEO blueprint to build domain authority and organic traffic.',
          tags: ['SEO', 'Content Cluster', 'Traffic']
        },
        {
          id: 'm-5',
          category: 'Marketing',
          title: 'Paid Ads Strategy & Creative Copy Blueprint',
          promptText: `Write 3 variations of high-performing Meta/Google ad copy for ${safeName}. Format each with: Primary Text, Headline, Description, Visual Direction (image/video concept), and target audience demographic hypotheses to test.`,
          description: 'Multi-variation paid ad campaigns targeted for ROI.',
          tags: ['PPC', 'Paid Ads', 'Copywriting']
        }
      ];

    case 'Sales':
      return [
        {
          id: 's-1',
          category: 'Sales',
          title: 'Discovery Call Script & SPIN Questioning Guide',
          promptText: `Act as a top enterprise sales director for ${safeName}. Craft a 20-minute discovery call playbook. Include open-ended SPIN (Situation, Problem, Implication, Need-payoff) questions, framework for qualifying decision makers, and smooth transitions to product demo.`,
          description: 'Structured discovery script to uncover prospect pain points and urgency.',
          tags: ['Discovery', 'Sales Script', 'Qualification']
        },
        {
          id: 's-2',
          category: 'Sales',
          title: 'Objection Handling Playbook (Price, Timing, Competitor)',
          promptText: `Develop an objection handling cheat sheet for sales reps at ${safeName}. Provide exact response scripts for the top 5 sales objections: 1) "It's too expensive", 2) "Send me an email", 3) "We already use a competitor", 4) "Not a priority right now", and 5) "Need internal sign-off".`,
          description: 'Field-tested objection handling scripts for your sales team.',
          tags: ['Objection Handling', 'Closing', 'Negotiation']
        },
        {
          id: 's-3',
          category: 'Sales',
          title: 'Value-Based Proposal Template & Pricing Justification',
          promptText: `Write a tailored, executive-level proposal executive summary for a prospective client of ${safeName}. Outline customer ROI ROI calculations, implementation timeline, risk mitigation, and tiered solution options (Good, Better, Best).`,
          description: 'Compelling proposal executive summary highlighting clear ROI.',
          tags: ['Proposal', 'Pricing', 'Closing']
        },
        {
          id: 's-4',
          category: 'Sales',
          title: 'LinkedIn Social Selling & InMail Outreach Templates',
          promptText: `Create 3 personalized LinkedIn InMail templates for sales representatives at ${safeName}. Tone should be consultative, warm, non-salesy, and focused on offering quick insights or research relevant to industry executives.`,
          description: 'Consultative InMail outreach messages for LinkedIn prospecting.',
          tags: ['Social Selling', 'LinkedIn', 'Outreach']
        },
        {
          id: 's-5',
          category: 'Sales',
          title: 'Post-Demo Follow-Up & Deal Acceleration Playbook',
          promptText: `Draft a post-demo follow-up communication plan for ${safeName}. Include immediate follow-up email template summarizing key demo takeaways, custom ROI calculator spreadsheet prompt, and a gentle urgency trigger for closing before month-end.`,
          description: 'Follow-up sequence to keep momentum high after product demos.',
          tags: ['Follow Up', 'Deal Closing', 'Pipeline']
        }
      ];

    case 'Coding':
      return [
        {
          id: 'c-1',
          category: 'Coding',
          title: 'Production-Ready Architecture & Tech Stack Spec',
          promptText: `Act as Principal Software Architect for ${safeName}. Design an scalable, high-availability web service architecture. Specify layer-by-layer components (Frontend, API Gateway, Microservices, Database, Caching, CI/CD, Monitoring) and evaluate trade-offs.`,
          description: 'Comprehensive system architecture specification for production scalability.',
          tags: ['Architecture', 'System Design', 'Scalability']
        },
        {
          id: 'c-2',
          category: 'Coding',
          title: 'RESTful API Specification & OpenAPI Documentation',
          promptText: `Design a clean REST API specification for core features at ${safeName}. Include resource routes, HTTP methods, request payloads, response schemas with status codes (200, 400, 401, 404, 500), and rate-limiting header specifications.`,
          description: 'Clean REST API endpoint specifications with standard response formats.',
          tags: ['API Design', 'Backend', 'OpenAPI']
        },
        {
          id: 'c-3',
          category: 'Coding',
          title: 'Code Refactoring & Clean Code Review Checklist',
          promptText: `Act as a Staff Engineer reviewing core codebase logic for ${safeName}. Provide a refactoring guide focusing on SOLID principles, DRY, error handling best practices, async performance optimizations, and strict TypeScript/Python typing.`,
          description: 'Standardized code quality, refactoring, and review standards.',
          tags: ['Refactoring', 'Clean Code', 'TypeScript']
        },
        {
          id: 'c-4',
          category: 'Coding',
          title: 'Automated Testing Suite (Unit, Integration, E2E)',
          promptText: `Write a comprehensive unit and integration testing strategy for ${safeName}. Outline test suites using Jest/PyTest and Cypress/Playwright, mocking external services, edge-case coverage matrix, and CI test execution pipelines.`,
          description: 'Testing strategy and test case specs to ensure continuous quality.',
          tags: ['Testing', 'Jest', 'CI/CD']
        },
        {
          id: 'c-5',
          category: 'Coding',
          title: 'Security Audit & OWASP Top 10 Vulnerability Shield',
          promptText: `Conduct a security assessment for web applications at ${safeName}. Create actionable code defense examples against OWASP Top 10 vulnerabilities including SQL Injection, XSS, CSRF, broken authentication, and rate limiting setup.`,
          description: 'Security auditing guide and defensive code implementations.',
          tags: ['Security', 'OWASP', 'DevSecOps']
        }
      ];

    case 'HR':
      return [
        {
          id: 'h-1',
          category: 'HR',
          title: 'Role Job Description & Competency Framework',
          promptText: `Act as Head of People at ${safeName}. Draft a compelling, inclusive Job Description for key hires. Include company mission, core responsibilities, required vs nice-to-have qualifications, key performance indicators (KPIs), and remote/hybrid benefits.`,
          description: 'Inclusive and attractive job description tailored to modern talent.',
          tags: ['Recruiting', 'Job Description', 'Talent']
        },
        {
          id: 'h-2',
          category: 'HR',
          title: 'Structured Interview Rubric & Scorecard',
          promptText: `Create a 4-stage structured interview process for candidates applying to ${safeName}. Provide specific behavioral and situational questions (STAR method), expected positive/negative signals, and a 1-5 evaluation scoring rubric.`,
          description: 'Objective candidate evaluation framework to eliminate hiring bias.',
          tags: ['Interviews', 'Hiring', 'Evaluation']
        },
        {
          id: 'h-3',
          category: 'HR',
          title: '30-60-90 Day Employee Onboarding Plan',
          promptText: `Develop an engaging 30-60-90 day onboarding roadmap for new team members at ${safeName}. Outline milestone goals for Month 1 (Learn), Month 2 (Contribute), and Month 3 (Lead), along with buddy assignment checklists.`,
          description: 'Structured onboarding workflow to accelerate new hire ramp up.',
          tags: ['Onboarding', 'Employee Success', 'Retention']
        },
        {
          id: 'h-4',
          category: 'HR',
          title: 'Performance Review & Continuous Feedback Framework',
          promptText: `Design a quarterly 360-degree performance review template for ${safeName}. Include self-assessment prompts, peer feedback questions, manager review criteria, and SMART goal setting framework.`,
          description: 'Growth-oriented 360 performance appraisal framework.',
          tags: ['Performance', 'Feedback', 'Growth']
        },
        {
          id: 'h-5',
          category: 'HR',
          title: 'Company Culture & Employee Engagement Playbook',
          promptText: `Craft an internal employee culture and engagement strategy for ${safeName}. Outline monthly team building ideas, peer recognition programs, wellness initiatives, and constructive feedback pulse surveys.`,
          description: 'Initiatives and programs to build a vibrant, productive workplace culture.',
          tags: ['Culture', 'Engagement', 'Retention']
        }
      ];

    default:
      return [];
  }
}

export async function generatePromptsWithAI(
  category: Category,
  businessName: string
): Promise<PromptItem[]> {
  if (!openai) {
    return getFallbackPrompts(category, businessName);
  }

  try {
    const prompt = `You are an expert prompt engineer creating 5 custom, high-value, actionable AI prompts for a business in the ${category} domain named "${businessName}".
    Return ONLY a raw JSON array containing 5 objects with the following schema:
    [
      {
        "id": "unique-id-1",
        "category": "${category}",
        "title": "Short descriptive title",
        "promptText": "Detailed, highly actionable prompt text tailored specifically to ${businessName}",
        "description": "Brief summary of what this prompt achieves",
        "tags": ["Tag1", "Tag2", "Tag3"]
      }
    ]
    Do not wrap in markdown codeblocks if possible, or return strictly standard JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanContent) as PromptItem[];

    if (Array.isArray(parsed) && parsed.length === 5) {
      return parsed;
    }

    return getFallbackPrompts(category, businessName);
  } catch (err) {
    console.error('Error generating prompts with OpenAI, using fallback:', err);
    return getFallbackPrompts(category, businessName);
  }
}
