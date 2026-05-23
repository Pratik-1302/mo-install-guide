/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        paper: '#FAF8F5',
        ink: '#171615',
        rule: '#E5DFD6',
        muted: '#6B6862',
        amber: {
          DEFAULT: '#B45309',
          soft: '#D97706',
        },
        coal: {
          900: '#0E0D0C',
          800: '#171615',
          700: '#22201E',
          600: '#2E2B28',
          500: '#3B3835',
          400: '#5A554F',
        },
        cream: '#E8E4DC',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [],
};
