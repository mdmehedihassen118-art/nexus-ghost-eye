import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptCraft AI - Generate Custom Prompts for Business',
  description: 'Select a category (Marketing, Sales, Coding, HR), enter your business name, and get 5 production-ready AI prompts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F17] text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
