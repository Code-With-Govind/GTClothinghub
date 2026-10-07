/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // GT Clothing Hub Refined Neutral Fashion Palette
        gt: {
          bg: '#F7F5F0',
          text: '#111111',
          secondary: '#666666',
          border: '#E5E2DC',
          white: '#FFFFFF',
          olive: '#6F7358',
          black: '#111111',
        },
        fashion: {
          black: '#111111',
          bg: '#F7F5F0',
          sectionBg: '#F7F5F0',
          white: '#FFFFFF',
          text: '#111111',
          muted: '#666666',
          border: '#E5E2DC',
          stone: '#F7F5F0',
          accent: '#6F7358',
          darkBg: '#111111',
          card: '#FFFFFF',
        },
        brand: {
          50: '#F7F5F0',
          100: '#F7F5F0',
          200: '#E5E2DC',
          300: '#D5D1C8',
          400: '#999999',
          500: '#666666',
          600: '#444444',
          700: '#222222',
          800: '#111111',
          900: '#111111',
          950: '#000000',
          espresso: '#111111',
          beige: '#E5E2DC',
          gold: '#6F7358',
          cream: '#F7F5F0',
          grey: '#666666',
        },
        accent: {
          DEFAULT: '#111111',
          hover: '#222222',
          olive: '#6F7358',
          gold: '#6F7358',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Manrope', 'sans-serif'],
        brand: ['Inter', 'Manrope', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
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
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'fashion-sm': '0 2px 8px rgba(17, 17, 17, 0.03)',
        'fashion-md': '0 8px 24px rgba(17, 17, 17, 0.05)',
        'fashion-lg': '0 16px 40px rgba(17, 17, 17, 0.08)',
        'fashion-hover': '0 12px 30px rgba(17, 17, 17, 0.1)',
      },
    },
  },
  plugins: [],
};
