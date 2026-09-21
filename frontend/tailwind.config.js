/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF6EE',   // Sandal cream
          100: '#F5EBD9',  // Champagne sandal
          200: '#EBD6B8',  // Sandal silk
          300: '#DEBF94',  // Light sandalwood
          400: '#CFA36B',  // Sandalwood gold
          500: '#BD8A48',  // Rich warm sandalwood / amber
          600: '#9F6F30',  // Terracotta sandalwood
          700: '#7E5320',  // Dark sandalwood
          800: '#5F3C15',  // Espresso sandal
          900: '#3F250C',  // Roasted sandal
          950: '#261506',  // Deep obsidian espresso
        },
        forest: {
          50: '#EBF3EC',
          100: '#DCE9DD',
          200: '#B9D3BC',
          300: '#8FB994',
          400: '#5F9B69',
          500: '#3A7B4F',
          600: '#24513A',  // Primary Brand & Button Color
          700: '#1D432F',  // Primary Button Hover
          800: '#163324',
          900: '#102319',
          950: '#0B1711',
        },
        warm: {
          bg: '#F6F2EA',       // Primary Background
          surface: '#FFFDF9',  // Main Surface
          subtle: '#F0EBE1',   // Secondary Warm Surface
          border: '#E4DDD2',   // Warm Border
        },
        terracotta: {
          50: '#FAF0EB',
          100: '#F5E1D8',
          200: '#EABFB0',
          300: '#DC9D86',
          400: '#CD7E62',
          500: '#B96545',      // Terracotta Accent
          600: '#A15234',
          700: '#834027',
          800: '#66311E',
          900: '#4A2315',
        },
        ochre: {
          50: '#FBF6EE',
          100: '#F6ECDD',
          200: '#ECD8BA',
          300: '#DEC194',
          400: '#CCA86F',
          500: '#A8752F',      // Warm Gold / Ochre Accent
          600: '#8D5F22',
          700: '#704918',
        },
        sandal: {
          50: '#FAF6EE',
          100: '#F5EBD9',
          200: '#EBD6B8',
          300: '#DCC097',
          400: '#CFA977',
          500: '#BE8E52',
          600: '#A07238',
          700: '#7E5728',
          800: '#5C3E1B',
          900: '#3E2711',
          950: '#231407',
        },
        espresso: {
          800: '#2A1F18',
          850: '#231812',
          900: '#1C130E',
          950: '#140D09',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
