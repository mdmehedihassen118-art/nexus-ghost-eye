import { NextResponse } from "next/server";

export interface PromptItem {
  id: string;
  title: string;
  category: string;
  promptText: string;
  purpose: string;
  tips: string;
}

const CATEGORY_TEMPLATES: Record<string, (bizName: string, details: string, audience: string) => PromptItem[]> = {
  Marketing: (bizName, details, audience) => [
    {
      id: "mkt-1",
      title: "High-Converting Product Value Proposition",
      category: "Marketing",
      promptText: `Act as a world-class Direct Response Copywriter. Create 5 compelling, highly persuasive value proposition headlines and 3 tagline variations for "${bizName}"${details ? ` (${details})` : ""}${audience ? ` targeting ${audience}` : ""}.\n\nRequirements:\n- Focus on quantifiable benefits and clear transformation.\n- Include one hook based on urgency, one on curiosity, and three on direct value.\n- Format as a ready-to-test hero banner blueprint.`,
      purpose: "Craft high-converting website hero copy and value proposition statements.",
      tips: "Replace placeholder bracketed metrics with your actual conversion data."
    },
    {
      id: "mkt-2",
      title: "30-Day Viral Content & Lead Gen Strategy",
      category: "Marketing",
      promptText: `You are a Senior Social Media Strategist for top B2B & B2C SaaS brands. Generate a structured 30-day content matrix for "${bizName}" to attract ideal prospects${audience ? ` (${audience})` : ""}.\n\nInclude:\n1. 10 High-performing LinkedIn/X post frameworks.\n2. 5 Educational thread/carousel concepts.\n3. 3 Lead magnet hook ideas with call-to-action scripts.`,
      purpose: "Build an organic content pipeline that drives qualified leads.",
      tips: "Schedule top posts on Tuesday and Thursday mornings for maximum engagement."
    },
    {
      id: "mkt-3",
      title: "Cold Email Outreach Sequence (4-Touch)",
      category: "Marketing",
      promptText: `Act as a Cold Email Specialist who gets 45%+ open rates. Draft a 4-email cold outreach sequence for "${bizName}" pitch${details ? ` offering ${details}` : ""}.\n\nEmail 1: The Personal Hook & Pain Point\nEmail 2: Case Study & Quick Win\nEmail 3: Low-friction Offer / Free Audit\nEmail 4: Gentle Breakup Email\n\nEnsure tone is natural, conversational, and non-salesy.`,
      purpose: "Acquire new client leads via outbound email campaigns.",
      tips: "Keep initial email under 100 words with a soft call-to-action like 'open to a quick 2-min video?'"
    },
    {
      id: "mkt-4",
      title: "High-ROAS Meta & Google Ad Campaign Copy",
      category: "Marketing",
      promptText: `Create 3 distinct ad copy variations (Problem-Agitate-Solve, Social Proof, Short & Punchy) for "${bizName}".\n\nFor each variation provide:\n- Primary Text\n- Headline (30 chars max)\n- Description\n- Recommended Call to Action button\n- Visual asset recommendation (image/video style)`,
      purpose: "Run profitable paid campaigns across Facebook, Instagram, and Google Ads.",
      tips: "A/B test the short punchy hook against the Problem-Agitate-Solve framework."
    },
    {
      id: "mkt-5",
      title: "SEO Keyword Strategy & Pillar Page Blueprint",
      category: "Marketing",
      promptText: `Act as an SEO Director. Design an organic content strategy for "${bizName}" to rank for high-intent purchase keywords.\n\nProvide:\n1. 1 Primary Topic Cluster with 5 sub-topic cluster articles.\n2. Outlines for 3 high-volume search intent blog posts.\n3. On-page SEO recommendations and internal linking structure.`,
      purpose: "Drive organic search traffic and establish domain authority.",
      tips: "Target long-tail keywords with buying intent rather than broad informational keywords."
    }
  ],

  Sales: (bizName, details, audience) => [
    {
      id: "sal-1",
      title: "Discovery Call Pitch & Objection Handling Script",
      category: "Sales",
      promptText: `Act as an Elite Enterprise Sales Consultant. Build a full discovery call script for "${bizName}"${details ? ` selling ${details}` : ""}.\n\nInclude:\n- 5 High-impact qualifying questions.\n- SPIN selling framework transitions.\n- Battle-tested responses for top 3 objections: 'Too expensive', 'Need to consult team', and 'Using a competitor'.`,
      purpose: "Master sales calls and handle tough price and competition objections effortlessly.",
      tips: "Ask qualifying questions before presenting pricing to anchor value first."
    },
    {
      id: "sal-2",
      title: "Custom Proposal & Pitch Deck Executive Summary",
      category: "Sales",
      promptText: `Write a compelling executive summary for a sales proposal for "${bizName}".\n\nStructure:\n1. Client Challenge & Current Bottlenecks\n2. Proposed Solution & Implementation Roadmap\n3. ROI Model & Key Outcomes\n4. Investment Options (Good, Better, Best Pricing Matrix)`,
      purpose: "Close deals faster with clear, value-focused proposal summaries.",
      tips: "Highlight ROI timeframe early to shorten approval cycles."
    },
    {
      id: "sal-3",
      title: "Inbound Lead Follow-Up & Reactivation Cadence",
      category: "Sales",
      promptText: `Design a 5-step follow-up campaign for warm leads who went quiet after receiving a demo or pricing from "${bizName}".\n\nInclude multi-channel touches (Email, LinkedIn message, Phone call script) designed to re-engage prospects without sounding pushy.`,
      purpose: "Re-engage cold or stalled sales pipelines and recover lost opportunities.",
      tips: "Share relevant industry news or a quick video tip in Touch 3 to deliver value."
    },
    {
      id: "sal-4",
      title: "Upsell & Cross-Sell Account Expansion Script",
      category: "Sales",
      promptText: `Create an account manager playbook for "${bizName}" to upsell existing clients to higher tiers or add-on services.\n\nProvide email templates and conversation scripts triggered by key customer usage milestones.`,
      purpose: "Increase Customer Lifetime Value (LTV) and Net Revenue Retention.",
      tips: "Time your upsell conversation right after a successful milestone or positive review."
    },
    {
      id: "sal-5",
      title: "Competitor Comparison & Battlecard Sheet",
      category: "Sales",
      promptText: `Draft a 1-page sales battlecard comparing "${bizName}" against top market competitors${details ? ` in ${details}` : ""}.\n\nOutline key differentiators, feature matrix comparison, landmine questions to ask prospects, and quick counter-arguments.`,
      purpose: "Equip sales reps to win against competitors during sales calls.",
      tips: "Focus on business outcomes and customer support advantages rather than feature lists."
    }
  ],

  Coding: (bizName, details, audience) => [
    {
      id: "cod-1",
      title: "Production Technical Architecture & System Design",
      category: "Coding",
      promptText: `Act as a Principal Software Architect. Design a scalable, production-ready system architecture for "${bizName}"${details ? ` building ${details}` : ""}.\n\nProvide:\n1. Microservices / Monolith recommendation with reasoning.\n2. Database schema design (SQL & NoSQL recommendation + relationships).\n3. API Route architecture & caching strategy (Redis, CDN).\n4. Scalability and security checklist (JWT, rate limiting, CORS).`,
      purpose: "Architect robust, scalable tech stacks and software foundations.",
      tips: "Review caching layers early to prevent database bottlenecks under heavy load."
    },
    {
      id: "cod-2",
      title: "Automated Test Suite & Integration Blueprint",
      category: "Coding",
      promptText: `Act as a Senior QA Automation Engineer. Create a comprehensive testing strategy and code templates for "${bizName}".\n\nInclude:\n- Unit test setup (Jest/Vitest).\n- Integration tests for core API endpoints.\n- End-to-end user flow test scripts (Playwright/Cypress).\n- CI/CD GitHub Actions pipeline configuration file.`,
      purpose: "Ensure high code quality and bug-free production deployments.",
      tips: "Run E2E tests against staging environments before merging to main."
    },
    {
      id: "cod-3",
      title: "RESTful & GraphQL API Schema Generator",
      category: "Coding",
      promptText: `Write production-ready OpenAPI/Swagger and TypeScript interfaces for "${bizName}" backend services.\n\nInclude standard CRUD operations, authentication middleware, error response schemas, and rate-limiting wrappers.`,
      purpose: "Standardize API contracts between frontend and backend engineering teams.",
      tips: "Use strict TypeScript types to eliminate runtime type errors."
    },
    {
      id: "cod-4",
      title: "Code Refactoring & Security Audit Prompt",
      category: "Coding",
      promptText: `Review this codebase module for "${bizName}" and perform a security audit and performance optimization:\n\n- Identify potential SQL Injection, XSS, and OWASP Top 10 vulnerabilities.\n- Optimize async/await database calls and memory leaks.\n- Provide refactored clean code using SOLID principles.`,
      purpose: "Audit codebases for security vulnerabilities and performance bottlenecks.",
      tips: "Paste your code snippet directly into the model along with this prompt."
    },
    {
      id: "cod-5",
      title: "DevOps Infrastructure as Code (Docker & Kubernetes)",
      category: "Coding",
      promptText: `Act as a Lead DevOps Engineer. Generate multi-stage Dockerfiles and docker-compose configurations for "${bizName}" frontend, backend, and PostgreSQL database.\n\nInclude production security hardening, non-root user execution, and health check routes.`,
      purpose: "Containerize applications for seamless cloud deployment on AWS, GCP, or Vercel.",
      tips: "Use Alpine base images to minimize image size and attack surface."
    }
  ],

  HR: (bizName, details, audience) => [
    {
      id: "hr-1",
      title: "High-Impact Job Description & Candidate Assessment",
      category: "HR",
      promptText: `Act as a Chief People Officer. Draft an inclusive, highly appealing job description and evaluation matrix for "${bizName}"${details ? ` hiring for ${details}` : ""}.\n\nInclude:\n- Mission-driven company overview & culture intro.\n- Key responsibilities & 90-day success metrics.\n- Required vs Nice-to-have skills.\n- 5 behavioral interview questions with scoring rubrics.`,
      purpose: "Attract and hire top 1% talent while eliminating bias.",
      tips: "Define 90-day deliverables clearly in the interview phase to align expectations."
    },
    {
      id: "hr-2",
      title: "New Employee Onboarding 30-60-90 Day Plan",
      category: "HR",
      promptText: `Create a structured 30-60-90 day onboarding blueprint for new team members at "${bizName}".\n\nOutline:\n- Day 1-7: Company culture, tools setup, buddy assignment.\n- Day 30: First quick wins and core tasks mastery.\n- Day 60: Cross-functional collaboration and feedback.\n- Day 90: Full ownership of core KPIs and goal setting.`,
      purpose: "Reduce employee churn and accelerate new hire time-to-productivity.",
      tips: "Assign a dedicated onboarding buddy outside of the direct manager."
    },
    {
      id: "hr-3",
      title: "Employee Performance Review & Feedback Framework",
      category: "HR",
      promptText: `Build a quarterly performance review template for "${bizName}".\n\nInclude:\n- Self-assessment questions.\n- Peer review 360-degree feedback framework.\n- Manager evaluation criteria based on impact, ownership, and values.\n- Actionable PIP (Performance Improvement Plan) framework.`,
      purpose: "Conduct constructive, objective quarterly performance reviews.",
      tips: "Focus feedback on specific behavior examples rather than general traits."
    },
    {
      id: "hr-4",
      title: "Company Culture Handbook & Value Statements",
      category: "HR",
      promptText: `Draft 5 core culture values and operating principles for "${bizName}".\n\nFor each value provide:\n- Concise name\n- Narrative explanation\n- 'What this looks like in practice' vs 'What we do NOT tolerate'.`,
      purpose: "Align team culture and set clear behavioral standards for scaling.",
      tips: "Reference core values during team all-hands meetings and performance reviews."
    },
    {
      id: "hr-5",
      title: "Remote Work & Conflict Resolution Protocol",
      category: "HR",
      promptText: `Create a clear internal communication policy and conflict resolution framework for "${bizName}".\n\nCover async communication etiquette, response time expectations, escalation paths for team friction, and psychological safety guidelines.`,
      purpose: "Maintain high team morale, productivity, and remote work harmony.",
      tips: "Default to asynchronous video/docs before scheduling live meetings."
    }
  ]
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category = "Marketing", businessName = "My Business", businessDetails = "", targetAudience = "" } = body;

    const validCategory = CATEGORY_TEMPLATES[category] ? category : "Marketing";
    const generator = CATEGORY_TEMPLATES[validCategory];

    // Generate the 5 custom prompt items
    const generatedPrompts = generator(businessName, businessDetails, targetAudience);

    // If OPENAI_API_KEY is available, we could enrich prompts, but local template engine ensures 100% fast & reliable generation
    return NextResponse.json({
      success: true,
      category: validCategory,
      businessName,
      prompts: generatedPrompts,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate prompts. Please try again." },
      { status: 500 }
    );
  }
}
