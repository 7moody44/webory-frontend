/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        'webory-navy-dark': '#0B1C2D',
        'webory-navy-light': '#0F2A44',
        'webory-blue': '#3B82F6',
        'webory-blue-dark': '#2563EB',
        'webory-green': '#22C55E',
        'webory-text-primary': '#FFFFFF',
        'webory-text-secondary': '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 1s ease-out forwards',
        'slideInBlur': 'slideInBlur 1.2s ease-out forwards',
        'fadeInSlide': 'fadeInSlide 0.8s ease-out forwards',
        'fadeInScale': 'fadeInScale 0.8s ease-out forwards',
        'fadeSlideIn': 'fadeSlideIn 1s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' },
        },
        slideInBlur: {
          '0%': { opacity: '0', transform: 'translateX(-30px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)', filter: 'blur(0px)' },
        },
        fadeInSlide: {
          '0%': { opacity: '0', transform: 'translateX(20px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateX(0)', filter: 'blur(0px)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)', filter: 'blur(3px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' },
        },
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}