/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      sans: ["'Noto Sans', sans-serif"],
      serif: ["'Lustria', serif"],
      display: ["'DM Serif Display', serif"],
      cursive: ["'Great Vibes', cursive"]
    },
    extend: {
      colors: {
        'red': '#941C1A',
        'red-dark': '#761213',
        'green': '#688E83',
        'yellow': '#CAA966',
        'yellow-light': '#FDE8D2',
        'off-white': '#F4F2EE',
        'deep-blue': '#121920'
      },
    },
  },
  plugins: [],
}

