/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        betano: {
          primary: '#FF3C00',
          secondary: '#FF0279',
          green: '#0ECF5E',
          orange: '#EF4A0F',
          dark: '#222536',
          surface: '#1A202E',
          card: '#2A3046',
          border: '#3A4863',
          light: '#3A4863',
          muted: '#B3B3B3',
          text: '#FFFFFF',
          'text-secondary': '#B3B3B3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-betano': 'linear-gradient(135deg, #FF3C00 0%, #FF6B00 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
