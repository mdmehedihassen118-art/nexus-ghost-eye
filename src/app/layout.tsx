import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptCraft AI - Enterprise Prompt Engineering SaaS',
  description:
    'Generate 5 custom, high-impact AI prompts tailored for your business across Marketing, Sales, Coding, and HR verticals.',
  keywords: ['Prompt Engineering', 'AI Prompts', 'ChatGPT', 'Claude', 'SaaS', 'Marketing Prompts', 'Coding Prompts'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
