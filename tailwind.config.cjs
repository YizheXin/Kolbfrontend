module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/lib/**/*.{js,ts}',
  ],
  darkMode: 'class',  // This is important
  theme: {
    extend: {
      colors: {
        'deepest-blue': '#081229',
        'midnight-black': '#020B16',
        'button-grey': '#2c2c2c',
        // Add default dark mode colors
        dark: {
          DEFAULT: '#1f2937',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      backgroundImage: {
        'blue-black-gradient': 'linear-gradient(to right, #081229, #020B16)',
      },
      // Rest of your theme config...
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwindcss-animate'),
  ],
};