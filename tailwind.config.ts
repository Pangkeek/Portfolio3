import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono:    ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      colors: {
        accent:  '#c8ff00',
        accent2: '#ff4d6d',
        bg:      '#080808',
        surface: '#111111',
        border:  '#1e1e1e',
        muted:   '#555555',
      },
    },
  },
  plugins: [],
}

export default config
