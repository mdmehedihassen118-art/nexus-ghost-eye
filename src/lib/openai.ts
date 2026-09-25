import OpenAI from 'openai';
import { Category, GeneratedPrompt } from './types';

const openaiApiKey = process.env.OPENAI_API_KEY;

export const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

export function getFallbackPrompts(category: Category, businessName: string): GeneratedPrompt[] {
  const cleanName = businessName.trim() || 'Your Business';

  switch (category) {
    case 'Marketing':
      return [
        {
          id: 'mkt-1',
          title: 'High-Converting Landing Page Copy',
          category: 'Marketing',
          tags: ['Copywriting', 'Conversion'],
          prompt: `Act as a senior conversion copywriter. Draft a compelling hero section, 3 value propositions, and a high-converting Call To Action (CTA) for ${cleanName}. Focus on target customer pain points, clear benefits, and a modern, engaging tone.`
        },
        {
          id: 'mkt-2',
          title: '30-Day Social Media Content Calendar',
          category: 'Marketing',
          tags: ['Social Media', 'Strategy'],
          prompt: `Create a 30-day social media content matrix tailored for ${cleanName}. Include 5 core content pillars (Educational, Product Spotlight, Behind-the-Scenes, Customer Success, and Interactive Polls). Provide post ideas, hook lines, and hashtag suggestions.`
        },
        {
          id: 'mkt-3',
          title: 'Viral Product Launch Email Campaign',
          category: 'Marketing',
          tags: ['Email Marketing', 'Launch'],
          prompt: `Write a 4-part email sequence for launching a new product/feature for ${cleanName}:\n1. Teaser Email: Curiosity hook & problem outline.\n2. Announcement: Features, urgency, & exclusive offer.\n3. Social Proof & FAQs: Testimonials & objection busting.\n4. Last Chance: Final call to action before offer ends.`
        },
        {
          id: 'mkt-4',
          title: 'SEO Content & Keyword Strategy Blueprint',
          category: 'Marketing',
          tags: ['SEO', 'Content Strategy'],
          prompt: `Develop an SEO content roadmap for ${cleanName}. Identify 5 high-intent focus topics, primary and long-tail target keywords, meta descriptions, and outline 3 comprehensive blog post titles that will drive targeted organic traffic.`
        },
        {
          id: 'mkt-5',
          title: 'Target Customer Persona & Positioning Framework',
          category: 'Marketing',
          tags: ['Branding', 'Positioning'],
          prompt: `Create 2 detailed Ideal Customer Personas (ICP) for ${cleanName}. Outline demographics, primary goals, main frustrations, buying triggers, key decision factors, and brand messaging angles that resonate best with them.`
        }
      ];

    case 'Sales':
      return [
        {
          id: 'sales-1',
          title: 'High-Response B2B Cold Email Sequence',
          category: 'Sales',
          tags: ['Cold Email', 'Outreach'],
          prompt: `Draft a 3-step personalized B2B cold email sequence to prospect decision-makers on behalf of ${cleanName}.\n- Email 1: Short value-driven pitch with a zero-friction question.\n- Email 2: Follow-up sharing a relevant case study or metric.\n- Email 3: Polite break-up email emphasizing missed opportunities.`
        },
        {
          id: 'sales-2',
          title: 'Sales Discovery Call Script & Question Framework',
          category: 'Sales',
          tags: ['Discovery', 'Sales Calls'],
          prompt: `Write a comprehensive sales discovery call structure for rep teams at ${cleanName}. Include rapport building, 6 probing SPIN framework questions (Situation, Problem, Implication, Need-payoff), and transition lines to solution demo.`
        },
        {
          id: 'sales-3',
          title: 'Objection Handling Playbook',
          category: 'Sales',
          tags: ['Objections', 'Closing'],
          prompt: `Provide tailored responses for the top 5 sales objections faced by ${cleanName} (Pricing, "Send me an email", "Using a competitor", "Not the right time", "Need manager approval"). Use the Feel-Felt-Found or Reframing framework for each.`
        },
        {
          id: 'sales-4',
          title: 'Enterprise Proposal & Value Pitch Deck Outline',
          category: 'Sales',
          tags: ['Proposals', 'Deals'],
          prompt: `Outline a 10-slide enterprise sales proposal deck for ${cleanName}. Define executive summary, problem statement, solution overview, ROI projections, implementation timeline, pricing tiers, and client testimonials.`
        },
        {
          id: 'sales-5',
          title: 'LinkedIn Sales Navigator Connection & Nurture Messages',
          category: 'Sales',
          tags: ['LinkedIn', 'Social Selling'],
          prompt: `Create 3 non-spammy LinkedIn outreach messaging templates for ${cleanName}:\n1. Connection Request message.\n2. Thank you for connecting + value insight share.\n3. Subtle call booking invitation.`
        }
      ];

    case 'Coding':
      return [
        {
          id: 'code-1',
          title: 'System Architecture & Scalable Tech Stack Plan',
          category: 'Coding',
          tags: ['Architecture', 'System Design'],
          prompt: `Design a scalable system architecture for an application serving ${cleanName}. Detail recommended frontend/backend frameworks, database selection (SQL vs NoSQL), caching strategy, serverless/cloud architecture, security specs, and microservices breakdown.`
        },
        {
          id: 'code-2',
          title: 'Code Refactoring & Performance Optimization Guide',
          category: 'Coding',
          tags: ['Refactoring', 'Performance'],
          prompt: `Act as a principal software engineer. Review and optimize codebase module standards for ${cleanName}. Detail step-by-step techniques for reducing latency, optimizing database queries, eliminating memory leaks, and applying SOLID design principles.`
        },
        {
          id: 'code-3',
          title: 'RESTful API Specification & OpenAPI Schema',
          category: 'Coding',
          tags: ['API Design', 'Backend'],
          prompt: `Draft a full REST API design specification for ${cleanName}'s core platform. Define standard endpoints, request/response JSON payloads, HTTP status codes, authentication protocols (JWT/OAuth2), and rate-limiting error structures.`
        },
        {
          id: 'code-4',
          title: 'Comprehensive Unit & Integration Testing Suite Strategy',
          category: 'Coding',
          tags: ['Testing', 'QA'],
          prompt: `Develop a automated testing framework guide for ${cleanName}. Outline test cases for core business logic, edge cases, mocking external service APIs, database integration tests, and CI/CD pipeline automation setup.`
        },
        {
          id: 'code-5',
          title: 'Developer Onboarding & Code Review Checklist',
          category: 'Coding',
          tags: ['DevOps', 'Best Practices'],
          prompt: `Create an engineer onboarding guide and pull request (PR) review checklist for ${cleanName}. Include setup commands, git workflow standards, code style enforcement, security checks, and deployment verification tasks.`
        }
      ];

    case 'HR':
      return [
        {
          id: 'hr-1',
          title: 'Compelling Role Job Description & Hiring Spec',
          category: 'HR',
          tags: ['Recruiting', 'Hiring'],
          prompt: `Write an attractive, inclusive Job Description for a key role at ${cleanName}. Include company mission summary, core responsibilities, required vs nice-to-have skills, key growth impact, and culture perks to attract top 5% talent.`
        },
        {
          id: 'hr-2',
          title: '30-60-90 Day Employee Onboarding Plan',
          category: 'HR',
          tags: ['Onboarding', 'Operations'],
          prompt: `Design a structured 30-60-90 day onboarding framework for new hires at ${cleanName}. Define specific learning milestones, key team introductions, project deliverables, and weekly check-in agendas to ensure fast team integration.`
        },
        {
          id: 'hr-3',
          title: 'Performance Review & Constructive Feedback Template',
          category: 'HR',
          tags: ['Performance', 'Feedback'],
          prompt: `Create a quarterly performance review template for managers at ${cleanName}. Include evaluation metrics (impact, collaboration, growth mindset), self-assessment prompts, and constructive 360-degree feedback frameworks.`
        },
        {
          id: 'hr-4',
          title: 'Company Culture & Remote Work Policy Playbook',
          category: 'HR',
          tags: ['Culture', 'Policy'],
          prompt: `Draft a clear, empathetic remote work and communication policy document for ${cleanName}. Cover core overlapping hours, async communication rules, meeting etiquette, wellness support, and team collaboration guidelines.`
        },
        {
          id: 'hr-5',
          title: 'Structured Interview Question Matrix & Rubric',
          category: 'HR',
          tags: ['Interviews', 'Evaluation'],
          prompt: `Develop a structured behavioral and technical interview score card for candidate evaluation at ${cleanName}. Include 5 situational questions assessing problem solving, adaptability, communication, alignment with company values, and a candidate grading rubric.`
        }
      ];

    default:
      return [];
  }
}

export async function generatePromptsWithAI(category: Category, businessName: string): Promise<GeneratedPrompt[]> {
  if (!openai) {
    return getFallbackPrompts(category, businessName);
  }

  try {
    const systemPrompt = `You are PromptCraft AI, an expert AI prompt engineer.
Your task is to generate exactly 5 actionable, high-value, highly specific system prompts tailored specifically for a business named "${businessName}" in the "${category}" domain.

Output MUST be a JSON array containing exactly 5 objects, formatted like this:
[
  {
    "id": "p1",
    "title": "Short Catchy Prompt Title",
    "prompt": "Detailed step-by-step prompt text...",
    "category": "${category}",
    "tags": ["Tag1", "Tag2"]
  }
]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate 5 custom prompts for ${businessName} in the ${category} category.` }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return getFallbackPrompts(category, businessName);
    }

    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length === 5) {
      return parsed.map((item, idx) => ({
        id: item.id || `ai-${category.toLowerCase()}-${idx + 1}`,
        title: item.title || `${category} Prompt ${idx + 1}`,
        prompt: item.prompt || '',
        category: category,
        tags: item.tags || [category]
      }));
    }

    return getFallbackPrompts(category, businessName);
  } catch (err) {
    console.error('OpenAI generation error, using fallback:', err);
    return getFallbackPrompts(category, businessName);
  }
}
