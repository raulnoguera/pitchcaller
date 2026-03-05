/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        field: {
          dark: '#0a0f1e',
          card: '#111827',
          border: '#1f2937',
        },
        pitch: {
          fastball: '#ef4444',
          curveball: '#3b82f6',
          slider: '#a855f7',
          changeup: '#22c55e',
          sinker: '#f97316',
          cutter: '#eab308',
          splitter: '#06b6d4',
          two_seam: '#ec4899',
        },
      },
    },
  },
  plugins: [],
}
