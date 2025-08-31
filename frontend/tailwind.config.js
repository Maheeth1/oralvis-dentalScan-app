/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // A nice blue for primary actions
        secondary: '#10B981', // A calm green for secondary actions or success
        accent: '#6366F1',   // A subtle indigo for accents
        dark: '#1F2937',     // Dark gray for text
        light: '#F3F4F6',    // Light gray for backgrounds
        'gray-lighter': '#F9FAFB', // Even lighter gray
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'md-light': '0 4px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}