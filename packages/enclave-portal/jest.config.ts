import type { JestConfigWithTsJest } from "ts-jest/dist/types";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  modulePathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  testEnvironment: "jsdom",
};

export default config;
