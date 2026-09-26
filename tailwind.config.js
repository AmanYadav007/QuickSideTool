// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Brand palette (DESIGN.md). Prefer the semantic CSS variables in
      // src/index.css (e.g. text-[var(--color-text-muted)]); these names are
      // for the few places that need Tailwind opacity modifiers.
      colors: {
        background: '#021B1A', // Rich Black
        card: '#06302B', // Pine
        border: '#0B453A', // Basil
        primary: '#00DF81', // Caribbean Green
        primaryHover: '#2CC295', // Mountain Meadow
        text: '#F1F7F6', // Anti-Flash White
        secondary: '#AACBC4', // Pistachio
        brand: {
          'rich-black': '#021B1A',
          'dark-green': '#032221',
          'bangladesh-green': '#03624C',
          'mountain-meadow': '#2CC295',
          'caribbean-green': '#00DF81',
          'anti-flash-white': '#F1F7F6',
          pine: '#06302B',
          basil: '#0B453A',
          forest: '#095544',
          frog: '#17876D',
          mint: '#2FA98C',
          stone: '#707D7D',
          pistachio: '#AACBC4',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'h1': ['52px', { lineHeight: '56px', fontWeight: '600' }],
        'h2': ['36px', { lineHeight: '40px', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '28px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        small: ['14px', { lineHeight: '20px', fontWeight: '400' }],
      },
      spacing: {
        xs: '8px',
        s: '16px',
        m: '24px',
        l: '40px',
        xl: '64px',
      },
      boxShadow: {
        glow: '0 4px 20px rgba(0, 223, 129, 0.15)',
        lift: '0 4px 12px rgba(0, 0, 0, 0.3)',
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
      maxWidth: {
        content: '1200px',
      },
      height: {
        hero: '420px',
        'hero-mobile': '300px',
      },
      minHeight: {
        card: '120px',
      },
    },
  },
  plugins: [],
};