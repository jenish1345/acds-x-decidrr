/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          primary: '#E5322D',
          navy: '#1e3a5f',
          darkblue: '#2c5282',
          slate: '#475569',
          lightgray: '#f1f5f9',
          border: '#e2e8f0',
          background: '#FFFFFF',
          text: '#47474F',
          textmuted: '#6b7280',
        },
        status: {
          critical: '#dc2626',
          warning: '#f59e0b',
          healthy: '#059669',
        }
      },
      fontFamily: {
        sans: ['Graphik', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
      }
    },
  },
  plugins: [],
}
