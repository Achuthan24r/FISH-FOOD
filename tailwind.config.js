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
        forest: {
          900: '#0b1d17',
          DEFAULT: '#14342A',
          800: '#14342A',
          700: '#1c493b',
          600: '#255e4d',
        },
        leaf: {
          DEFAULT: '#2E7D4F',
          light: '#3ea369',
          dark: '#215c3a',
          50: '#f0f9f3',
          100: '#dcf0e4',
          500: '#2E7D4F',
          600: '#266942',
        },
        gold: {
          DEFAULT: '#F2A900',
          hover: '#d99700',
          light: '#fff5df',
          50: '#fffbf2',
          100: '#fef5df',
          400: '#f7be38',
          500: '#F2A900',
          600: '#d89400',
        },
        sand: {
          DEFAULT: '#F4F7F2',
          50: '#fafcfa',
          100: '#F4F7F2',
          200: '#e5ece2',
          300: '#d3dfce',
        },
      },
      fontFamily: {
        heading: ['Merriweather', 'Cambria', 'serif'],
        sans: ['Inter', 'Calibri', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 52, 42, 0.08), 0 2px 6px -1px rgba(20, 52, 42, 0.04)',
        'elevated': '0 10px 25px -3px rgba(20, 52, 42, 0.12), 0 4px 10px -2px rgba(20, 52, 42, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
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
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
