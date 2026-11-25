/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sonez: {
          blue: '#3861FB',
          blueHover: '#2952E8',
          blueLight: '#EEF2FF',
          dark: '#0A0A0C',
          black: '#000000',
          grayBg: '#F8F9FA',
          border: '#E5E7EB',
          textMuted: '#6B7280',
        }
      },
      fontFamily: {
        display: ['Syncopate', 'Space Grotesk', 'sans-serif'],
        headline: ['Syne', 'Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
