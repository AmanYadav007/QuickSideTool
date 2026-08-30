// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07111F',
        card: '#101A2C',
        border: '#1E293B',
        primary: '#2563EB',
        primaryHover: '#3B82F6',
        text: '#F8FAFC',
        secondary: '#64748B',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['52px', { lineHeight: '56px', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '40px', fontWeight: '700' }],
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
        glow: '0 4px 20px rgba(37, 99, 235, 0.15)',
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