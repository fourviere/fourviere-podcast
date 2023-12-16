module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:tailwindcss/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      "./packages/app/tsconfig.json",
      "./packages/core/tsconfig.json",
      "./packages/ui/tsconfig.json",
    ],
  },
  plugins: ["@typescript-eslint"],
  root: true,
};
