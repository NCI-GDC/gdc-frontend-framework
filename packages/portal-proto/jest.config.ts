import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    "@stjude": "ts-jest",
    // uncomment when testing with npm linked sjpp client package code
    // "proteinpaint/client": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/app(.*)$": "<rootDir>/src/app/$1",
    "^@/components(.*)$": "<rootDir>/src/components/$1",
    "^@/features/(.*)$": "<rootDir>/src/features/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "react-markdown": "<rootDir>/__mocks__/react-markdown.tsx",
  },
  modulePaths: ["<rootDir>"],
  setupFiles: ["jest-canvas-mock"],
  transformIgnorePatterns: ["node_modules/(?!@stjude)", "!proteinpaint"],
};

export default config;
