import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptCraft AI - Generate Custom AI Prompts for Business',
  description: 'Instant, tailored AI prompts for Marketing, Sales, Coding, and HR. Boost your team productivity with custom GPT prompts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
