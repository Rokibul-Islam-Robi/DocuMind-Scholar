/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // slate-50
        card: '#ffffff',
        student: {
          DEFAULT: '#6351d8', // Lumo Brand Purple
          hover: '#5240c4',
          light: '#8b9bf7',   // Periwinkle
          dark: '#1c1243',    // Midnight Violet
          amber: '#f5a623',   // Warm Amber CTA
          coral: '#ff593b',   // Coral Stat
          gradient: 'from-[#1c1243] via-[#38207d] to-[#6351d8]',
        },
        researcher: {
          DEFAULT: '#059669', // emerald-600
          hover: '#047857',
          light: '#10b981',
          gradient: 'from-emerald-600 via-teal-600 to-indigo-700',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft-md': '0 6px 16px -4px rgba(0, 0, 0, 0.07), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
        'soft-xl': '0 12px 32px -6px rgba(0, 0, 0, 0.09), 0 4px 12px -3px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
