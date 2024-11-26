module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  globalSetup: "<rootDir>/setupTests.ts",
  moduleNameMapper: {
    "^@/core/(.*)$": "<rootDir>/src/core/$1",
  },
  modulePaths: ["<rootDir>"],
  testTimeout: 50000,
};
