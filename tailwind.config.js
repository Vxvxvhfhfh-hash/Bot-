/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk color palette
        'cyber': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'neon': {
          'blue': '#00f5ff',
          'purple': '#bf00ff',
          'pink': '#ff0080',
          'green': '#00ff94',
          'yellow': '#ffff00',
          'red': '#ff0040',
        },
        'dark': {
          100: '#1a1a2e',
          200: '#16213e',
          300: '#0f0f23',
          400: '#0a0a0a',
          500: '#000000',
        }
      },
      fontFamily: {
        'cyber': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
        'futura': ['Futura', 'Arial', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'matrix': 'matrix 20s linear infinite',
        'typing': 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite',
      },
      keyframes: {
        glow: {
          'from': { 
            boxShadow: '0 0 20px #00ff94, 0 0 30px #00ff94, 0 0 40px #00ff94' 
          },
          'to': { 
            boxShadow: '0 0 30px #00ff94, 0 0 40px #00ff94, 0 0 50px #00ff94, 0 0 60px #00ff94' 
          },
        },
        'pulse-neon': {
          '0%, 100%': { 
            textShadow: '0 0 5px #00ff94, 0 0 10px #00ff94, 0 0 15px #00ff94',
            transform: 'scale(1)'
          },
          '50%': { 
            textShadow: '0 0 10px #00ff94, 0 0 20px #00ff94, 0 0 30px #00ff94',
            transform: 'scale(1.05)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#00ff94' },
        },
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        'gradient-neon': 'linear-gradient(135deg, #00ff94 0%, #00f5ff 100%)',
        'gradient-purple': 'linear-gradient(135deg, #bf00ff 0%, #ff0080 100%)',
      },
      backdropBlur: {
        'cyber': '20px',
      },
      borderRadius: {
        'cyber': '0.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}