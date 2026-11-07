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
        ps: {
          bg: '#080b12',
          surface: '#111827',
          surfaceLight: '#172237',
          card: '#0f172a',
          border: '#1e293b',
          borderLight: '#334155',
          blue: '#0070d1',
          blueDark: '#00439c',
          blueLight: '#2997ff',
          neon: '#00d4ff',
          // Classic PlayStation symbols
          triangle: '#2dd4bf',
          circle: '#f87171',
          cross: '#60a5fa',
          square: '#f472b6',
        }
      },
      boxShadow: {
        'ps-glow': '0 0 25px -5px rgba(0, 112, 209, 0.4), 0 0 10px -2px rgba(0, 212, 255, 0.3)',
        'ps-glow-lg': '0 0 40px -5px rgba(0, 112, 209, 0.6), 0 0 20px -2px rgba(0, 212, 255, 0.5)',
        'ps-cyan': '0 0 20px rgba(0, 212, 255, 0.4)',
        'ps-card': '0 8px 30px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
