/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": ".625rem", // 10px
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
