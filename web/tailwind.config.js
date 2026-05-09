/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          from: '#FD297B',
          via: '#FF5864',
          to: '#FF655B',
        },
        nope: '#F2385A',
        like: '#4CDC8F',
        superl: '#42A5F5',
        rewind: '#FFB800',
        boost: '#B74FFF',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #FD297B 0%, #FF5864 50%, #FF655B 100%)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'SF Pro Display',
          'Noto Sans SC',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, 0.12)',
        action: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
