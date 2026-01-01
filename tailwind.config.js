// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Zalando Sans Variable"',
          '"Zalando Sans"',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': 'rgb(229 231 235)',
            '--tw-prose-headings': 'rgb(255 255 255)',
            '--tw-prose-links': 'rgb(255 255 255)',
            '--tw-prose-bullets': 'rgb(148 163 184)',
            '--tw-prose-quotes': 'rgb(226 232 240)',
            '--tw-prose-code': 'rgb(226 232 240)',
            '--tw-prose-th-borders': 'rgb(51 65 85 / 0.6)',
            '--tw-prose-td-borders': 'rgb(51 65 85 / 0.4)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
