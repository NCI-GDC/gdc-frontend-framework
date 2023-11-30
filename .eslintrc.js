module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@next/next/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "jsx-a11y",
    "react",
    "react-hooks",
    "@typescript-eslint",
    "eslint-plugin-tsdoc",
  ],
  ignorePatterns: ["*.svg"],
  rules: {
    "tsdoc/syntax": "warn",
    // disable these because we're using React 17+ with the jsx transform
    // need to reverify these rules
    "@next/next/no-sync-scripts": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true, argsIgnorePattern: "^_" },
    ],
    //keep this until issue in next js is resolved https://github.com/vercel/next.js/discussions/32233
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
    "react-hooks/exhaustive-deps": [
      "warn",
      {
        additionalHooks:
          "(useDeepCompareEffect|useDeepCompareCallback|useDeepCompareMemo)",
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
    next: {
      rootDir: "packages/portal-proto",
    },
  },
};
