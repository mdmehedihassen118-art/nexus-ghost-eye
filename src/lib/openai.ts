import OpenAI from 'openai';
import { Category, GeneratedPrompt } from './types';

// Fallback templates when OpenAI API key is missing or calls fail
function getFallbackPrompts(category: Category, businessName: string, businessDescription?: string): GeneratedPrompt[] {
  const desc = businessDescription ? ` (${businessDescription})` : '';

  switch (category) {
    case 'Marketing':
      return [
        {
          id: 'mkt-1',
          title: 'High-Converting Landing Page Copy',
          prompt: `Act as a senior conversion copywriter. Write a headline, subheadline, 3 key benefits, and a compelling call-to-action for ${businessName}${desc}. Target potential customers seeking high quality and clear value. Use persuasive, modern language.`,
          category: 'Marketing',
          tags: ['Copywriting', 'Landing Page', 'Conversion']
        },
        {
          id: 'mkt-2',
          title: '30-Day Social Media Content Calendar',
          prompt: `Create a 30-day social media content plan for ${businessName}${desc}. Group posts into 4 pillars: Educational, Social Proof/Behind-the-Scenes, Product/Service Highlights, and Engagement/Polls. Include main hooks and suggested post formats (Reels, Carousels, Text).`,
          category: 'Marketing',
          tags: ['Social Media', 'Content Strategy', 'Planning']
        },
        {
          id: 'mkt-3',
          title: 'Targeted Google & Meta Ad Copy Strategy',
          prompt: `Generate 3 ad variations (1 Pain-Point Focused, 1 Feature-Focused, 1 Offer-Focused) for ${businessName}${desc}. For each variation, supply a headline (under 30 chars), main primary text (under 125 chars), and recommended audience targeting keywords.`,
          category: 'Marketing',
          tags: ['Paid Ads', 'PPC', 'Campaigns']
        },
        {
          id: 'mkt-4',
          title: 'SEO Long-Form Article Outline & Keywords',
          prompt: `Develop a comprehensive SEO blog post outline that positions ${businessName}${desc} as an industry authority. Include primary keyword recommendations, secondary keywords, H2/H3 subheadings, and key takeaways for readers.`,
          category: 'Marketing',
          tags: ['SEO', 'Blogging', 'Content Marketing']
        },
        {
          id: 'mkt-5',
          title: 'Lead Magnet & Email Nurture Sequence',
          prompt: `Outline a lead magnet idea for ${businessName}${desc} to capture emails, followed by a 4-part welcome email sequence (Email 1: Value Delivery, Email 2: Brand Story, Email 3: Social Proof/Case Study, Email 4: Special Offer/CTA).`,
          category: 'Marketing',
          tags: ['Email Marketing', 'Lead Gen', 'Nurture']
        }
      ];

    case 'Sales':
      return [
        {
          id: 'sales-1',
          title: 'High-Response Cold Email Sequence',
          prompt: `Write a 3-step personalized cold outreach email sequence to decision-makers on behalf of ${businessName}${desc}. Keep Email 1 under 125 words focusing on a critical industry pain point. Email 2 is a value-add follow-up, and Email 3 is a polite final check-in.`,
          category: 'Sales',
          tags: ['Cold Email', 'Outreach', 'B2B']
        },
        {
          id: 'sales-2',
          title: 'Sales Pitch & Elevator Framework',
          prompt: `Develop a 30-second elevator pitch and a 3-minute sales presentation outline for ${businessName}${desc}. Define the problem, the solution, unique value proposition, and key closing question.`,
          category: 'Sales',
          tags: ['Sales Pitch', 'Closing', 'Presentation']
        },
        {
          id: 'sales-3',
          title: 'Objection Handling Playbook',
          prompt: `List the top 5 common customer objections (e.g. Price, Timing, Competitors) for ${businessName}${desc} and write empathetic, high-converting responses using the Feel-Felt-Found framework.`,
          category: 'Sales',
          tags: ['Objection Handling', 'Negotiation', 'Playbook']
        },
        {
          id: 'sales-4',
          title: 'LinkedIn Prospecting Direct Message',
          prompt: `Draft 3 distinct LinkedIn direct message templates (Connection Request, Initial Message, and Follow-up) to prospect ideal clients for ${businessName}${desc} without sounding overly pushy.`,
          category: 'Sales',
          tags: ['LinkedIn', 'Social Selling', 'Outreach']
        },
        {
          id: 'sales-5',
          title: 'Client Discovery Call Question Matrix',
          prompt: `Create a structured list of 10 powerful open-ended discovery questions to uncover needs, budget, timeline, and decision-making criteria when talking to prospective clients for ${businessName}${desc}.`,
          category: 'Sales',
          tags: ['Discovery Call', 'Qualifying', 'Sales Strategy']
        }
      ];

    case 'Coding':
      return [
        {
          id: 'code-1',
          title: 'Production REST/GraphQL API Architecture',
          prompt: `Design a scalable API specification for a service supporting ${businessName}${desc}. Provide key endpoints/queries, request/response JSON schemas, authentication flow (JWT/OAuth2), and error handling best practices in TypeScript/Node.js.`,
          category: 'Coding',
          tags: ['API Design', 'Backend', 'Architecture']
        },
        {
          id: 'code-2',
          title: 'Automated Test Suite & Edge Case Coverage',
          prompt: `Write comprehensive unit and integration test suites using Jest and React Testing Library (or Vitest) for core functionality in ${businessName}${desc}. Include test cases for edge cases, error handling, and mock API calls.`,
          category: 'Coding',
          tags: ['Testing', 'Jest', 'Quality Assurance']
        },
        {
          id: 'code-3',
          title: 'Code Refactoring & Performance Optimization',
          prompt: `Review and refactor TypeScript/JavaScript code for ${businessName}${desc}. Focus on improving algorithmic efficiency, reducing memory usage, applying clean code principles (SOLID), and adding descriptive JSdoc annotations.`,
          category: 'Coding',
          tags: ['Refactoring', 'Performance', 'Clean Code']
        },
        {
          id: 'code-4',
          title: 'Database Schema Design & Query Optimization',
          prompt: `Design an optimized SQL database schema (PostgreSQL) for ${businessName}${desc}. Include table relationships, indexes for quick search performance, foreign key constraints, and sample migration scripts.`,
          category: 'Coding',
          tags: ['Database', 'PostgreSQL', 'SQL']
        },
        {
          id: 'code-5',
          title: 'CI/CD Pipeline & Infrastructure Setup',
          prompt: `Draft a GitHub Actions CI/CD workflow YAML file for building, testing, and deploying ${businessName}${desc}. Include steps for linting, security scanning, running tests, docker building, and deployment checks.`,
          category: 'Coding',
          tags: ['DevOps', 'CI/CD', 'GitHub Actions']
        }
      ];

    case 'HR':
      return [
        {
          id: 'hr-1',
          title: 'Role-Specific Job Description & Requirements',
          prompt: `Write an engaging, inclusive job description for a key team role at ${businessName}${desc}. Include role overview, core responsibilities, required vs nice-to-have qualifications, company culture statement, and perks.`,
          category: 'HR',
          tags: ['Recruiting', 'Job Description', 'Hiring']
        },
        {
          id: 'hr-2',
          title: '30-60-90 Day Employee Onboarding Plan',
          prompt: `Create a structured 30-60-90 day onboarding checklist and roadmap for new team members joining ${businessName}${desc}. Include milestones, key tools to master, and 1-on-1 feedback check-ins.`,
          category: 'HR',
          tags: ['Onboarding', 'Employee Success', 'Management']
        },
        {
          id: 'hr-3',
          title: 'Structured Interview Questionnaire & Scoring Rubric',
          prompt: `Develop a set of 8 behavioral and situational interview questions with a 1-5 scoring rubric for evaluating candidates applying to ${businessName}${desc}. Align questions with team core values and technical competence.`,
          category: 'HR',
          tags: ['Interviews', 'Evaluation', 'Hiring']
        },
        {
          id: 'hr-4',
          title: 'Performance Review Framework & Feedback Templates',
          prompt: `Design a quarterly performance review template for managers and self-assessments at ${businessName}${desc}. Include sections for key achievements, areas for growth, goal setting (OKRs), and constructive feedback guidelines.`,
          category: 'HR',
          tags: ['Performance', 'Feedback', 'OKRs']
        },
        {
          id: 'hr-5',
          title: 'Remote-First Company Policy & Culture Handbook',
          prompt: `Draft a clear, empathetic remote work and communication policy handbook section for ${businessName}${desc}. Cover async communication guidelines, working hours, equipment stipends, and wellness practices.`,
          category: 'HR',
          tags: ['Culture', 'Company Policy', 'Remote Work']
        }
      ];

    default:
      return [];
  }
}

export async function generatePromptsForBusiness(
  category: Category,
  businessName: string,
  businessDescription?: string
): Promise<GeneratedPrompt[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === 'mock-key' || apiKey.startsWith('sk-test-placeholder')) {
    return getFallbackPrompts(category, businessName, businessDescription);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const promptContext = businessDescription
      ? `Business Name: "${businessName}". Description: "${businessDescription}".`
      : `Business Name: "${businessName}".`;

    const systemPrompt = `You are an expert prompt engineer specializing in ${category}.
Generate exactly 5 tailored, highly effective AI prompts for a business in the ${category} domain.

Output MUST be valid JSON with a single array named "prompts" containing 5 objects. Each object must have:
- "title": concise descriptive title for the prompt
- "prompt": detailed, actionable system/user prompt ready to copy-paste into ChatGPT or Claude
- "tags": array of 2-3 short relevant topic tags

Format:
{
  "prompts": [
    {
      "title": "...",
      "prompt": "...",
      "tags": ["...", "..."]
    }
  ]
}`;

    const userPrompt = `Generate 5 custom ${category} prompts for: ${promptContext}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return getFallbackPrompts(category, businessName, businessDescription);
    }

    const parsed = JSON.parse(content);
    const rawPrompts = parsed.prompts || parsed;

    if (!Array.isArray(rawPrompts) || rawPrompts.length === 0) {
      return getFallbackPrompts(category, businessName, businessDescription);
    }

    return rawPrompts.slice(0, 5).map((item: any, idx: number) => ({
      id: `${category.toLowerCase()}-ai-${idx + 1}-${Date.now()}`,
      title: item.title || `${category} Prompt ${idx + 1}`,
      prompt: item.prompt || '',
      category,
      tags: Array.isArray(item.tags) ? item.tags : [category]
    }));
  } catch (error) {
    console.error('Error generating prompts via OpenAI:', error);
    return getFallbackPrompts(category, businessName, businessDescription);
  }
}
