import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptCraft AI - Custom AI Prompts for Businesses",
  description: "Select your category (Marketing, Sales, Coding, HR), enter your business name, and generate 5 tailored high-converting AI prompts.",
  keywords: ["AI prompts", "Marketing prompts", "Sales prompts", "Coding prompts", "HR prompts", "Prompt generator", "AI tool"],
  authors: [{ name: "PromptCraft AI" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-gray-100 antialiased selection:bg-indigo-500 selection:text-white">
        <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-transparent blur-3xl -z-10" />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
