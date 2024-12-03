import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
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
    "^@/app(.*)$": "<rootDir>/src/app/$1",
    "^@/components(.*)$": "<rootDir>/src/components/$1",
    "^@/features/(.*)$": "<rootDir>/src/features/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.svg$": "<rootDir>/__mocks__/svg.ts",
    "^redux-persist/lib/storage/createWebStorage$":
      "<rootDir>/__mocks__/createWebStorageMock.js",
  },
  modulePaths: ["<rootDir>"],
  setupFiles: ["jest-canvas-mock"],
  transformIgnorePatterns: [
    "node_modules/(?!@sjcrh|react-dnd|dnd-core|@react-dnd|react-dnd-html5-backend|uuid)/",
    "!proteinpaint",
  ],
  testTimeout: 50000,
};

export default config;
