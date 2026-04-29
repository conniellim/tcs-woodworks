import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2C3E2D',
          dark: '#1e2b1f',
          deeper: '#162018',
          light: '#4a6b4c',
        },
        stone: {
          DEFAULT: '#F7F5F2',
          mid: '#EDE9E3',
          border: '#E8E4DE',
          muted: '#D4CFC8',
        },
        sage: {
          DEFAULT: '#A8C5A0',
          dark: '#7A8C7B',
          deeper: '#5A6B5B',
        },
        status: {
          new: '#E8A838',
          confirmed: '#A8C5A0',
          pending: '#9B8EA0',
          inprogress: '#7A9EC5',
          completed: '#B0B0B0',
          cancelled: '#C08080',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
