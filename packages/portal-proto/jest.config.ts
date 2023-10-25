import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "@sjcrh": "ts-jest",
    "node_modules/(react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend)/.+\\.(j|t)sx?$":
      "ts-jest",
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
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.svg$": "<rootDir>/__mocks__/svg.ts",
  },
  modulePaths: ["<rootDir>"],
  setupFiles: ["jest-canvas-mock"],
  transformIgnorePatterns: [
    "node_modules/(?!@sjcrh|react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend)/",
    "!proteinpaint",
  ],
  testTimeout: 20000,
};

export default config;
