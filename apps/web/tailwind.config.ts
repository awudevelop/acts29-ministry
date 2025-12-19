import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/admin-ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Navy blue from Acts 29 branding
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1a2f44',
          950: '#102a43',
        },
        // Navy - Deep blue from logo
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#627d98',
          500: '#334e68',
          600: '#243b53',
          700: '#1a2f44',
          800: '#162b3d',
          900: '#102536',
          950: '#0a1929',
        },
        // Gold - From logo accents
        gold: {
          50: '#fefbf3',
          100: '#fdf4e1',
          200: '#fbe8c3',
          300: '#f7d794',
          400: '#f0c05a',
          500: '#c9a227',
          600: '#b8860b',
          700: '#8b6914',
          800: '#6b5116',
          900: '#564213',
          950: '#332609',
        },
        // Secondary colors - warm and welcoming
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        // Accent for calls to action - using gold
        accent: {
          50: '#fefbf3',
          100: '#fdf4e1',
          200: '#fbe8c3',
          300: '#f7d794',
          400: '#f0c05a',
          500: '#c9a227',
          600: '#b8860b',
          700: '#8b6914',
          800: '#6b5116',
          900: '#564213',
          950: '#332609',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-cal-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
