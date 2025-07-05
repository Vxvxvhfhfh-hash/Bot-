/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25D366',
          'green-dark': '#075E54',
          'green-light': '#DCF8C6',
          teal: '#128C7E',
          'teal-dark': '#075E54',
          gray: '#ECE5DD',
          'gray-dark': '#34495E',
        },
      },
    },
  },
  plugins: [],
}