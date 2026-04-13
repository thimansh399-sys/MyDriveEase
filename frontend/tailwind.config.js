module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#19e68c', // Bright green
        dark: '#101924', // Deep dark
        accent: '#19e6c1', // Accent teal
        background: '#18222f', // Main background
        text: '#e5e7eb', // Light text
        card: '#18222f', // Card backgrounds
        border: '#22313f', // Muted border
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
