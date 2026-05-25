/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        primary: 'var(--primary)',
        'primary-600': 'var(--primary-600)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        border: 'var(--border)',
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--muted)'
        }
      },
      boxShadow: {
        soft: '0 12px 30px -18px rgba(15, 23, 42, 0.18)',
        glass: '0 8px 20px rgba(15, 23, 42, 0.10)'
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.18)' },
          '50%': { boxShadow: '0 0 0 10px rgba(37, 99, 235, 0)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.3s ease-out both',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
