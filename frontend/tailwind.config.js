/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60A5FA', // blue-400
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',  // blue-600
        },
        secondary: {
          light: '#A1A1AA', // gray-400
          DEFAULT: '#71717A', // gray-500
          dark: '#52525B',  // gray-600
        },
        danger: {
          light: '#F87171', // red-400
          DEFAULT: '#EF4444', // red-500
          dark: '#DC2626',  // red-600
        },
        background: '#F9FAFB', // gray-50
        textPrimary: '#1F2937', // gray-800
        textSecondary: '#6B7280', // gray-500
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
