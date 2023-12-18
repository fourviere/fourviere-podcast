module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:prettier/recommended",
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
  rules: {
    "prettier/prettier": "error",
  },
  plugins: ["@typescript-eslint", "react", "prettier"],
  root: true,
};
