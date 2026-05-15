/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ArcLock Dark Theme
        primary: {
          DEFAULT: '#00D4AA',
          50: '#E6FFF9',
          100: '#B3FFE8',
          200: '#80FFD7',
          300: '#4DFFC6',
          400: '#1AFFB5',
          500: '#00D4AA',
          600: '#00A888',
          700: '#007D66',
          800: '#005244',
          900: '#002722',
        },
        accent: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        dark: {
          900: '#0A0E1A',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
          500: '#4B5563',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.08)',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        inter: ['Inter'],
        'inter-bold': ['Inter-Bold'],
        'inter-medium': ['Inter-Medium'],
        'inter-semibold': ['Inter-SemiBold'],
      },
    },
  },
  plugins: [],
};
