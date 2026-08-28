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
          navy: '#1e3a5f',
          darkblue: '#2c5282',
          slate: '#475569',
          lightgray: '#f1f5f9',
          border: '#e2e8f0',
        },
        status: {
          critical: '#dc2626',
          warning: '#f59e0b',
          healthy: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
