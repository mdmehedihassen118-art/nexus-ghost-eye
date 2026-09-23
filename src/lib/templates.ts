import { Category, CategoryId } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    iconName: 'Megaphone',
    description: 'Ad copy, SEO content, viral social campaigns, and email sequences',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'sales',
    name: 'Sales',
    iconName: 'TrendingUp',
    description: 'Cold outreach, objection handling scripts, and pitch decks',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'coding',
    name: 'Coding',
    iconName: 'Code2',
    description: 'Architecture designs, refactoring guides, bug fixes, and unit tests',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'hr',
    name: 'HR & Operations',
    iconName: 'Users',
    description: 'Job descriptions, employee onboarding, interview rubrics, and feedback',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export const TEMPLATES_BY_CATEGORY: Record<
  CategoryId,
  Array<{
    title: string;
    template: (biz: string) => string;
    tags: string[];
    explanation: string;
  }>
> = {
  marketing: [
    {
      title: 'High-Converting Social Media Campaign Launch',
      template: (biz) =>
        `Act as a CMO and senior copywriting expert for "${biz}". Create a 7-day multi-channel launch campaign targeting decision-makers. Include:\n1. 3 attention-grabbing headline hooks per day.\n2. Storytelling angle highlighting pain points and solution benefits.\n3. Clear Call-to-Action (CTA) tailored for LinkedIn and Twitter/X.\n4. Recommended image/video visual descriptions for each post.`,
      tags: ['Social Media', 'Content Strategy', 'Copywriting'],
      explanation: 'Generates a ready-to-schedule 7-day social campaign tailored specifically to your company brand voice.',
    },
    {
      title: 'SEO Long-Form Content Outline & Search Intent Framework',
      template: (biz) =>
        `Act as an SEO Content Strategist for "${biz}". Generate a high-ranking, 2000-word blog post outline targeting our core industry keywords. The output should include:\n- Target primary keyword & 5 semantic LSI keywords.\n- H2 and H3 heading structure optimized for Featured Snippets.\n- FAQ section answering top user intent questions.\n- Internal linking strategy and meta title + meta description options.`,
      tags: ['SEO', 'Content Marketing', 'Organic Traffic'],
      explanation: 'Provides an SEO-optimized blueprint structured to rank on Google search result pages.',
    },
    {
      title: 'Cold Email Nurture Sequence for Higher Conversion',
      template: (biz) =>
        `Act as a Direct Response Email Specialist representing "${biz}". Draft a 4-part email sequence designed to nurture leads who signed up for our resource. Structure:\n- Email 1: Welcome & immediate value deliverable (warm, authoritative tone).\n- Email 2: The "Aha!" epiphany story & common industry mistake.\n- Email 3: Case study breakdown showing real ROI.\n- Email 4: Low-friction CTA for a strategy call or trial signup.`,
      tags: ['Email Marketing', 'Lead Nurturing', 'Conversion'],
      explanation: 'Crafts persuasive multi-touch email sequences that convert cold leads into active customers.',
    },
    {
      title: 'Product Positioning & Tagline Generator',
      template: (biz) =>
        `Act as a Brand Positioning Strategist for "${biz}". Analyze our value proposition and craft:\n1. 5 distinct tagline options (Minimalist, Bold, Benefit-driven, Visionary, Urgent).\n2. A 30-second elevator pitch for potential investors/customers.\n3. Unique Value Proposition (UVP) statement following the framework: "We help [Target Audience] achieve [Desired Outcome] through [Unique Mechanism]".`,
      tags: ['Branding', 'Positioning', 'Messaging'],
      explanation: 'Establishes clear, memorable brand messaging and taglines that differentiate you from competitors.',
    },
    {
      title: 'Paid Ads Matrix (Meta / Google Ads Copy & Hook Variations)',
      template: (biz) =>
        `Act as a Performance Marketer for "${biz}". Create an ad matrix for Meta (Facebook/Instagram) and Google Search ads targeting ideal customers. Provide:\n- 3 Hook variations (Fear of Missing Out, Data/Logic driven, Problem-Agitate-Solve).\n- Primary ad body copy (short-form and long-form options).\n- Headline variations optimized for high Click-Through-Rate (CTR).\n- A direct landing page CTA recommendation.`,
      tags: ['PPC Ads', 'Performance Marketing', 'Growth'],
      explanation: 'Builds high-CTR paid advertisement variations ready for A/B testing across ad networks.',
    },
  ],
  sales: [
    {
      title: 'Hyper-Personalized B2B Cold Outreach Script',
      template: (biz) =>
        `Act as a VP of Enterprise Sales at "${biz}". Write a high-converting cold outreach sequence (LinkedIn InMail + Email) for reaching C-level executives.\nRequirements:\n- Short length (<120 words).\n- Hook referencing common current pain points in our industry.\n- Concise value proposition of "${biz}".\n- Low-friction call to action (e.g., "Open to a 5-minute feedback chat?").`,
      tags: ['Cold Outreach', 'B2B Sales', 'Prospecting'],
      explanation: 'Produces concise, non-spammy cold emails optimized for response rates from executives.',
    },
    {
      title: 'Objection Handling Playbook & Battlecard',
      template: (biz) =>
        `Act as a Sales Enablement Director for "${biz}". Create an Objection Handling Battlecard for our sales team. Address the top 5 sales objections:\n1. "It's too expensive / budget constraints"\n2. "We are currently using a competitor"\n3. "We don't have time to implement this right now"\n4. "Need to check with senior leadership"\n5. "We can build this in-house"\nFor each objection, provide a Feel-Felt-Found response and a discovery question to regain control.`,
      tags: ['Sales Scripts', 'Objection Handling', 'Deal Closing'],
      explanation: 'Equips sales teams with quick, empathetic, and persuasive responses to close hesitant buyers.',
    },
    {
      title: 'High-Stakes Discovery Call Framework & Question Checklist',
      template: (biz) =>
        `Act as a Senior Account Executive for "${biz}". Draft a structured 30-minute Discovery Call agenda using the SPIN (Situation, Problem, Implication, Need-Payoff) selling framework tailored to prospective clients of "${biz}". Include 10 targeted discovery questions designed to uncover budget, authority, need, and timeline (BANT).`,
      tags: ['Discovery Call', 'SPIN Selling', 'Qualification'],
      explanation: 'Ensures discovery calls accurately qualify leads and extract critical deal information.',
    },
    {
      title: 'Winning Enterprise Sales Proposal & Executive Summary',
      template: (biz) =>
        `Act as a Deal Desk Strategist for "${biz}". Generate an Executive Summary and Proposal Template for a prospective enterprise buyer. Include:\n- Context & Understanding of Client Challenges.\n- Proposed Solution Blueprint powered by "${biz}".\n- Expected Business Impact & Measurable ROI metrics.\n- Tiered Pricing Options (Standard, Premium, Enterprise).\n- Implementation Roadmap & Next Steps.`,
      tags: ['Proposals', 'Enterprise Sales', 'Pitch'],
      explanation: 'Creates compelling enterprise proposal templates that justify ROI and speed up deal signing.',
    },
    {
      title: 'Post-Demo Follow-Up & Urgency-Building Sequence',
      template: (biz) =>
        `Act as a Top-Performing Account Manager at "${biz}". Write a post-demo follow-up email designed to maintain momentum and move the deal into contract review. Include a summary of key wins discussed, customized implementation timeline, address any open questions, and set a clear micro-deadline.`,
      tags: ['Follow-Up', 'Closing', 'Pipeline Velocity'],
      explanation: 'Prevents deal stagnation by keeping prospects engaged and motivated immediately following a product demo.',
    },
  ],
  coding: [
    {
      title: 'Production-Grade API Architecture & Data Schema Design',
      template: (biz) =>
        `Act as a Principal Software Architect building systems for "${biz}". Create a complete API design and Data Modeling specification for our core service module.\nInclude:\n1. REST/GraphQL endpoint definitions with request/response JSON payloads.\n2. Database Schema (PostgreSQL SQL or Prisma / MongoDB) with indices and relations.\n3. Scalability considerations (caching, rate limiting, connection pooling).\n4. Edge case handling & error response structure.`,
      tags: ['Architecture', 'API Design', 'Database'],
      explanation: 'Designs resilient, scalable REST API specs and database schemas ready for implementation.',
    },
    {
      title: 'Comprehensive Refactoring & Clean Code Guide',
      template: (biz) =>
        `Act as a Tech Lead at "${biz}". Review and refactor modern application code for optimal performance and readability. Provide:\n- Step-by-step refactoring guidelines targeting SOLID principles.\n- Memory management and async performance optimization tactics.\n- Strict TypeScript typing / type guard implementation.\n- Example before-and-after code transformations with benchmark logic.`,
      tags: ['Clean Code', 'TypeScript', 'Refactoring'],
      explanation: 'Transforms legacy code into maintainable, modern, and type-safe software patterns.',
    },
    {
      title: 'Automated Unit & Integration Test Suite Framework',
      template: (biz) =>
        `Act as a QA Lead and Software Engineer in Test at "${biz}". Write a robust test suite framework using Jest / Playwright / Vitest for testing our platform services. Include unit tests for business logic, mocked API/DB dependency calls, integration edge cases (e.g., rate limits, network timeouts), and code coverage setup instructions.`,
      tags: ['Testing', 'Jest', 'Automation'],
      explanation: 'Generates structured test suits ensuring high reliability and code coverage.',
    },
    {
      title: 'Docker, CI/CD Pipeline & Infrastructure as Code (IaC)',
      template: (biz) =>
        `Act as a DevOps Lead at "${biz}". Produce a production-ready DevOps pipeline configuration:\n1. Optimized multi-stage Dockerfile (lightweight Node.js / Python image).\n2. GitHub Actions / GitLab CI workflow configuration for automated linting, testing, and deployment.\n3. Basic Terraform or Docker Compose setup with health checks and environment secret management.`,
      tags: ['DevOps', 'Docker', 'CI/CD'],
      explanation: 'Automates deployment and containerization for fast, reliable cloud releases.',
    },
    {
      title: 'Root-Cause Bug Diagnosis & Performance Profiling Assistant',
      template: (biz) =>
        `Act as a Senior Systems Reliability Engineer (SRE) at "${biz}". Analyze runtime errors, memory leaks, or slow database query logs. Provide a structured diagnostic procedure:\n- Likely root causes ranked by probability.\n- Step-by-step reproduction steps.\n- Immediate hotfix code fix.\n- Long-term structural resolution to prevent recurrence.`,
      tags: ['Debugging', 'Performance', 'SRE'],
      explanation: 'Helps engineers quickly pinpoint, debug, and resolve complex production errors.',
    },
  ],
  hr: [
    {
      title: 'Role-Specific Job Description & Talent Attraction Framework',
      template: (biz) =>
        `Act as the Head of People at "${biz}". Write a compelling, inclusive, and competitive Job Description for an key role in our company.\nStructure:\n- Captivating company introduction highlighting mission & culture at "${biz}".\n- Key Responsibilities & Core Impact Goals (30/60/90 days).\n- Required Skills vs Nice-to-Have Qualifications.\n- Perks, benefits, and salary transparency statement.`,
      tags: ['Recruiting', 'Job Description', 'Talent Acquisition'],
      explanation: 'Drafts attractive job posts that appeal to top talent and clearly outline expectations.',
    },
    {
      title: 'Structured Interview Rubric & Competency Assessment',
      template: (biz) =>
        `Act as a Recruiting Operations Lead for "${biz}". Develop a 4-stage behavioral and technical interview guide for evaluating candidates. Include:\n- 5 STAR-method competency questions with scoring rubrics (1-5 scale).\n- Red flags vs Green flags to listen for in candidate answers.\n- Practical live work-sample exercise prompt and evaluation criteria.`,
      tags: ['Hiring', 'Interviews', 'Talent Evaluation'],
      explanation: 'Standardizes interview evaluations to reduce bias and ensure high candidate quality.',
    },
    {
      title: 'First 90 Days Employee Onboarding Playbook',
      template: (biz) =>
        `Act as an HR Experience Manager at "${biz}". Build a comprehensive 30-60-90 day onboarding framework for new hires joining "${biz}". Include:\n- Day 1 welcome checklist & system access requirements.\n- Week 1 key milestones & buddy program pairing.\n- Month 1-3 performance checkpoints, expectations, and feedback 1-on-1 templates.`,
      tags: ['Onboarding', 'Employee Success', 'Culture'],
      explanation: 'Accelerates new hire productivity and improves long-term team retention.',
    },
    {
      title: 'Constructive Performance Review & 360 Feedback Framework',
      template: (biz) =>
        `Act as an Executive HR Coach for "${biz}". Draft a constructive 360-degree performance review template. Provide clear phrasing for:\n- Recognizing exceptional leadership and initiative.\n- Actionable growth areas with specific SBI (Situation-Behavior-Impact) feedback.\n- Co-created 6-month Professional Development Goals with clear KPIs.`,
      tags: ['Performance Management', 'Feedback', 'Leadership'],
      explanation: 'Delivers balanced, actionable employee reviews that drive continuous growth.',
    },
    {
      title: 'Company Policy, Culture Handbook & Remote Guidelines',
      template: (biz) =>
        `Act as VP of Culture & Operations at "${biz}". Draft a modern, employee-first company policy document covering Hybrid/Remote Work policies, Flexible PTO guidelines, and Communication Etiquette. Ensure tone is supportive, clear, and legally sound while maintaining company values.`,
      tags: ['Operations', 'Company Policy', 'Culture'],
      explanation: 'Creates clear, modern company policies that align team practices with company values.',
    },
  ],
};
