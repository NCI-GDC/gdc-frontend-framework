import type { JestConfigWithTsJest } from "ts-jest/dist/types";
// Optional local proteinpaint client resolution for tests (empty when the
// published package is installed, e.g. CI). See ppLocalDev.mjs for details.
import { jestModuleNameMapper } from "./src/features/proteinpaint/ppLocalDev.mjs";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
    "@sjcrh": [
      "ts-jest",
      {
        "ts-jest": {
          tsconfig: "tsconfig.test.json",
        },
      },
    ],
    "node_modules/(react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend|uuid)/.+\\.(j|t)sx?$":
      [
        "ts-jest",
        {
          "ts-jest": {
            tsconfig: "tsconfig.test.json",
          },
        },
      ],
    // uncomment when testing with npm linked sjpp client package code
    // "proteinpaint/client": "ts-jest"
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    ...jestModuleNameMapper(__dirname),
    "^@/app(.*)$": "<rootDir>/src/app/$1",
    "^@/components(.*)$": "<rootDir>/src/components/$1",
    "^@/features/(.*)$": "<rootDir>/src/features/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.svg$": "<rootDir>/__mocks__/svg.ts",
    "^redux-persist/lib/storage/createWebStorage$":
      "<rootDir>/__mocks__/createWebStorageMock.js",
    "^react-markdown$": "<rootDir>/__mocks__/react-markdown.tsx",
    "^d3$": "<rootDir>/../../node_modules/d3/dist/d3.min.js",
  },
  modulePaths: ["<rootDir>"],
  setupFiles: ["jest-canvas-mock"],
  transformIgnorePatterns: [
    "node_modules/(?!@sjcrh|react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend|uuid)/",
    "!proteinpaint",
  ],
  modulePathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  testTimeout: 50000,
  reporters: [
    "default",
    [
      "jest-slow-test-reporter",
      { numTests: 10, warnOnSlowerThan: 500, color: true },
    ],
  ],
};

export default config;
