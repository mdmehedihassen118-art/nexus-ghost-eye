# PromptCraft AI 🚀

PromptCraft AI is a simple, production-ready SaaS application that generates custom AI prompts for businesses across multiple categories: **Marketing**, **Sales**, **Coding**, and **HR**.

## Features

- **Category-Tailored AI Prompts**: Instantly generate 5 high-converting, tailored prompts based on your business name and context.
- **Free & Pro Tiers**:
  - **Free Tier**: 3 prompt generations per day.
  - **Pro Tier ($9/month)**: Unlimited generations, custom tuning, priority exports, and direct AI execution testing.
- **Clean Dark UI**: Modern dark theme built with Next.js App Router, Tailwind CSS, and Lucide icons.
- **Stripe Payment Integration**: Integrated Stripe Checkout for seamless $9/month Pro subscription upgrades.
- **Export & Saved Library**: One-click prompt copying, CSV/Text exporting, and local history management.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe Configuration (optional - fallback demo mode enabled if missing)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# OpenAI API Key (optional - intelligent fallback prompt engine provided if missing)
OPENAI_API_KEY=sk-...
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Payments**: Stripe
- **Icons**: Lucide React
