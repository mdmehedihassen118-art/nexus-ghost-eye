import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptCraft AI - Generate Production AI Prompts for Business',
  description: 'Select your business category (Marketing, Sales, Coding, HR), enter your company name, and instantly get 5 high-converting, custom AI prompts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0c] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
