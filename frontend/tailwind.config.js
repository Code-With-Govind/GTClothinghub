/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Minimalist Warm Ivory & Espresso Fashion Color System
        fashion: {
          black: '#292621',
          bg: '#F5F1E8',
          sectionBg: '#FAF8F3',
          white: '#FFFFFF',
          text: '#292621',
          muted: '#6F6A61',
          border: '#DDD7CB',
          stone: '#FAF8F3',
          accent: '#B89452',
          darkBg: '#292621',
          card: '#FFFFFF',
        },
        // Legacy Brand aliases mapped cleanly to fashion palette
        brand: {
          50: '#FAF8F3',
          100: '#F5F1E8',
          200: '#DDD7CB',
          300: '#C8C1B3',
          400: '#A39C8E',
          500: '#6F6A61',
          600: '#4A463E',
          700: '#36322B',
          800: '#292621',
          900: '#1D1A16',
          950: '#12100E',
        },
        accent: {
          DEFAULT: '#292621',
          hover: '#36322B',
          gold: '#B89452',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'Syne', 'sans-serif'],
        brand: ['Syne', 'Outfit', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'fashion-sm': '0 2px 8px rgba(17, 17, 17, 0.04)',
        'fashion-md': '0 8px 24px rgba(17, 17, 17, 0.06)',
        'fashion-lg': '0 16px 40px rgba(17, 17, 17, 0.08)',
        'fashion-hover': '0 20px 45px rgba(17, 17, 17, 0.12)',
      },
    },
  },
  plugins: [],
};
