// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        'scale-in-fast': 'scale-in-fast 0.2s ease-out forwards',
        'blob': 'blob 12s infinite ease-in-out',
        'pulse-slow': 'pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradient-shift 1.5s ease-in-out forwards',
        'whac': 'whac 0.15s ease-out',
        'pulse-orb': 'pulse-orb 3s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate', // NEW
        'orbit': 'orbit 5s linear infinite', // NEW
        'spin-slow': 'spin 3s linear infinite', // NEW - Slower spin
        'ping-once': 'ping 1s cubic-bezier(0, 0, 0.2, 1) forwards', // NEW - For quick pings
        'bounce-step': 'bounce-step 0.6s ease-out forwards', // NEW - For step indicators
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-in-fast': {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.2)', opacity: '0.35' },
        },
        'gradient-shift': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
        'whac': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(0.9)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        // NEW ANIMATIONS FOR ORBITAL FLOW
        'pulse-orb': { // For the central glowing orb
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 15px rgba(59,130,246,0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 30px rgba(96,165,250,1)' },
        },
        'orbit': { // For the orbiting particles
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg) translateY(80px) translateX(0px) scale(0.8)', opacity: '0' },
          '25%': { opacity: '0.6', transform: 'translate(-50%, -50%) rotate(90deg) translateY(60px) translateX(20px) scale(1)' },
          '50%': { opacity: '1', transform: 'translate(-50%, -50%) rotate(180deg) translateY(80px) translateX(0px) scale(1.2)' },
          '75%': { opacity: '0.6', transform: 'translate(-50%, -50%) rotate(270deg) translateY(60px) translateX(-20px) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -50%) rotate(360deg) translateY(80px) translateX(0px) scale(0.8)' },
        },
        'bounce-step': { // For the step indicators
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
      boxShadow: {
        'xl-active': '0 15px 30px -5px rgba(0, 0, 0, 0.4), inset 0 0 0 2px rgba(255, 255, 255, 0.2)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        '2xl-custom-drag': '0 35px 60px -15px rgba(0, 0, 0, 0.6)',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};