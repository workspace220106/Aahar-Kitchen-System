import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FBF6EC',
        surface: '#F3EADB',
        sand: '#EADCC4',
        ink: '#2B2420',
        muted: '#6F6152',
        turmeric: '#E0A21B',
        leaf: '#3F6B3A',
        chilli: '#B8371F',
        clay: '#C8693E',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: { copy: '60ch' },
    },
  },
  plugins: [],
} satisfies Config;
