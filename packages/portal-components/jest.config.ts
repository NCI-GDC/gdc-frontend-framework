import type { JestConfigWithTsJest } from "ts-jest/dist/types";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
        isolatedModules: true,
      },
    ],
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/analysis(.*)$": "<rootDir>/src/analysis/$1",
    "^@/layout(.*)$": "<rootDir>/src/layout/$1",
    "^@/modals/(.*)$": "<rootDir>/src/modals/$1",
    "^@/cohort/(.*)$": "<rootDir>/src/cohort/$1",
    "^@/common/(.*)$": "<rootDir>/src/common/$1",
  },
  modulePaths: ["<rootDir>"],
  modulePathIgnorePatterns: ["dist", "node_modules"],
  testTimeout: 50000,
};

export default config;
