import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PromptCraft AI - Custom Prompts for Your Business',
  description: 'Generate 5 high-converting, tailored AI prompts for Marketing, Sales, Coding, and HR in seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F17] text-gray-100 antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
