/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c',
        card: '#121318',
        cardHover: '#1a1c23',
        primary: {
          50: '#f0f6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accent: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          emerald: '#10b981',
        }
      },
    },
  },
  plugins: [],
};
