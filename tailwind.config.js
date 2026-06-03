/**
 * Tailwind config — reference / compatibility file.
 *
 * This project uses Tailwind CSS v4 with the official Vite plugin
 * (`@tailwindcss/vite`). With v4 the theme is driven CSS-first from the
 * `@theme { ... }` block in `src/index.css`, so this file is OPTIONAL.
 *
 * It is provided so the same color tokens also work if the project is ever
 * run on a classic v3 PostCSS pipeline. Keeping the names in sync with the
 * `@theme` block means utilities like `bg-agro-card` / `text-agro-accent`
 * resolve identically in both setups.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'agro-bg': '#060a0f',
        'agro-surface': '#0a1410',
        'agro-card': '#0d1a14',
        'agro-card-soft': '#0f211a',
        'agro-border': '#1b3328',
        'agro-border-soft': '#14241c',
        'agro-accent': '#00e676',
        'agro-accent-dim': '#00b85f',
        'agro-danger': '#ff5252',
        'agro-warning': '#ffb020',
        'agro-muted': '#7d93a3',
        'agro-text': '#e6f1ea',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px -12px rgb(0 0 0 / 0.6)',
        glow: '0 0 0 1px rgb(0 230 118 / 0.25), 0 10px 40px -12px rgb(0 230 118 / 0.25)',
      },
    },
  },
  plugins: [],
}
