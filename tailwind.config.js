module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 5s ease infinite',
        'snow-fall': 'snow-fall 15s linear infinite',
        'spin-slow': 'spin 1s linear infinite',
        'pulse-slow': 'pulse 1s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center',
          },
        },
        'snow-fall': {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'frost': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
        'frost-hover': '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      textShadow: ['group-hover'],
    },
  },
  plugins: [],
}