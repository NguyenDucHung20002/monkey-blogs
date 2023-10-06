/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        '1/4': '25%',
        '1/2': '50%'
      },
    },
  },
  plugins: ["@tailwindcss/line-clamp"],
};
