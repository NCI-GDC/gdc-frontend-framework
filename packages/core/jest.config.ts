module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "<rootDir>/setupTests.ts",
  moduleNameMapper: {
    "^@/core/(.*)$": "<rootDir>/src/core/$1",
  },
  modulePaths: ["<rootDir>"],
  testTimeout: 50000,
};
