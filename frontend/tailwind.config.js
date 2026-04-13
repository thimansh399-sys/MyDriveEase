module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e', // Ola/Uber green
        dark: '#0a1019', // Deep dark
        accent: '#19e6c1', // Accent teal
        background: '#ffffff', // White backgrounds
        text: '#111111', // Black text
        card: '#f8fafc', // Card backgrounds
        border: '#e5e7eb', // Light border
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
