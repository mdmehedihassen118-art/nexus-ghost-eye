import OpenAI from 'openai';
import { Category, PromptItem } from './types';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export function getFallbackPrompts(category: Category, businessName: string): PromptItem[] {
  const name = businessName || 'your business';

  switch (category) {
    case 'Marketing':
      return [
        {
          id: 'm1',
          title: '30-Day Content Strategy',
          description: 'A structured content plan for social media and blog.',
          prompt: `Create a comprehensive 30-day content calendar for ${name} targeting our ideal audience. Focus on high engagement, educational posts, and conversion-driven call-to-actions.`
        },
        {
          id: 'm2',
          title: 'High-Converting Ad Copy',
          description: 'Persuasive ad variations for Meta & Google Ads.',
          prompt: `Write 3 variations of high-converting ad copy for ${name}. Include catchy headlines, benefit-focused body copy, and a strong CTA to drive sales.`
        },
        {
          id: 'm3',
          title: 'Brand Positioning Statement',
          description: 'Define your unique value proposition clearly.',
          prompt: `Craft a compelling brand positioning statement and core messaging hierarchy for ${name} to differentiate us from key market competitors.`
        },
        {
          id: 'm4',
          title: 'Email Newsletter Sequence',
          description: 'A 5-part welcome email onboarding campaign.',
          prompt: `Draft a 5-part welcome email sequence for new subscribers of ${name}. Introduce our core story, share key value, and offer a first-time user discount.`
        },
        {
          id: 'm5',
          title: 'SEO Keyword Strategy',
          description: 'Targeted search terms to drive organic traffic.',
          prompt: `Identify 10 high-intent, low-competition target keyphrases for ${name} and outline article concepts to rank for each topic.`
        }
      ];

    case 'Sales':
      return [
        {
          id: 's1',
          title: 'Cold Outreach Email Template',
          description: 'High-response outbound email tailored to B2B leads.',
          prompt: `Draft a personalized, concise cold outreach email for decision-makers on behalf of ${name}. Focus on solving their main pain point without sounding overly salesy.`
        },
        {
          id: 's2',
          title: 'Objection Handling Playbook',
          description: 'Responses for pricing, timing, and competitor objections.',
          prompt: `Provide top 5 buyer objections for ${name}'s services/products and draft effective, empathetic responses for our sales team.`
        },
        {
          id: 's3',
          title: 'Follow-Up Sequence',
          description: 'Multi-touch email follow-ups after a proposal.',
          prompt: `Write a 3-step follow-up email sequence for ${name} to re-engage prospective clients who went silent after receiving a proposal.`
        },
        {
          id: 's4',
          title: 'Sales Pitch Deck Outline',
          description: '10-slide pitch structure that closes deals.',
          prompt: `Create a 10-slide outline for a high-converting sales pitch presentation for ${name}. Include problem, solution, ROI case study, and next steps.`
        },
        {
          id: 's5',
          title: 'Upsell & Cross-Sell Script',
          description: 'Maximize customer lifetime value during renewals.',
          prompt: `Develop a natural sales conversation script for ${name} team members to offer premium upgrades to existing satisfied customers.`
        }
      ];

    case 'Coding':
      return [
        {
          id: 'c1',
          title: 'REST API Architecture Plan',
          description: 'Design scalable backend endpoints and schemas.',
          prompt: `Design a scalable RESTful API architecture for ${name}'s platform. Specify endpoints, standard JSON response format, status codes, and security authentication.`
        },
        {
          id: 'c2',
          title: 'Automated Test Suite Plan',
          description: 'End-to-end and unit testing strategy.',
          prompt: `Outline an automated testing strategy for ${name} including unit tests, integration tests, and CI/CD workflow steps to ensure high reliability.`
        },
        {
          id: 'c3',
          title: 'Database Schema Design',
          description: 'Optimized relational schema with indexing.',
          prompt: `Draft a PostgreSQL database schema design for ${name}. Include table relations, key constraints, and indexing strategy for optimal performance.`
        },
        {
          id: 'c4',
          title: 'Security & Code Audit Checklist',
          description: 'Identify OWASP vulnerabilities and code smells.',
          prompt: `Provide a comprehensive web security and code quality review checklist for engineering teams working on ${name}.`
        },
        {
          id: 'c5',
          title: 'System Architecture Diagram Plan',
          description: 'Cloud deployment architecture (AWS/Vercel/Docker).',
          prompt: `Propose a modern cloud architecture setup for ${name} incorporating containerization, CDN caching, database replication, and monitoring.`
        }
      ];

    case 'HR':
      return [
        {
          id: 'h1',
          title: 'Job Description Generator',
          description: 'Clear, compelling job postings to attract talent.',
          prompt: `Write a clear and engaging job description for a Senior Role at ${name}. Outline key responsibilities, required qualifications, and company culture.`
        },
        {
          id: 'h2',
          title: 'Employee Onboarding Checklist',
          description: 'Ensure smooth integration for new hires.',
          prompt: `Create a comprehensive 30-60-90 day onboarding checklist for new team members joining ${name}.`
        },
        {
          id: 'h3',
          title: 'Structured Interview Guide',
          description: 'Behavioral and technical questions with rubrics.',
          prompt: `Develop a structured interview question framework for ${name} to assess technical competence and alignment with team values.`
        },
        {
          id: 'h4',
          title: 'Performance Review Framework',
          description: 'Constructive 360-degree review prompts.',
          prompt: `Design a quarterly performance review template for ${name} focusing on achievements, areas for growth, and goal alignment.`
        },
        {
          id: 'h5',
          title: 'Team Culture & Remote Guidelines',
          description: 'Asynchronous communication & team wellness policy.',
          prompt: `Draft a concise Remote Work & Communication Policy document for ${name} promoting productivity, trust, and healthy work-life balance.`
        }
      ];
  }
}

export async function generatePrompts(category: Category, businessName: string): Promise<PromptItem[]> {
  if (!openai) {
    return getFallbackPrompts(category, businessName);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI prompt engineer. Generate exactly 5 highly effective, customized prompts for a user's business.
Return ONLY valid JSON format matching this array structure:
[
  {
    "id": "1",
    "title": "Short Descriptive Title",
    "description": "One sentence summary of what this prompt does",
    "prompt": "The detailed prompt text personalized for the business name"
  }
]`
        },
        {
          role: 'user',
          content: `Business Name: "${businessName}". Category: "${category}". Generate 5 unique prompts.`
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (content) {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length >= 5) {
        return parsed.slice(0, 5).map((item, idx) => ({
          id: String(item.id || idx + 1),
          title: String(item.title || `Prompt ${idx + 1}`),
          description: String(item.description || ''),
          prompt: String(item.prompt || '')
        }));
      }
    }
    return getFallbackPrompts(category, businessName);
  } catch (err) {
    console.error('Error calling OpenAI API, falling back:', err);
    return getFallbackPrompts(category, businessName);
  }
}
