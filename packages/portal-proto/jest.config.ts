import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
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
  },
  modulePaths: ["<rootDir>"],
  setupFiles: ["jest-canvas-mock"],
};

export default config;
