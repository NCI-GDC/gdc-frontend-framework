module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/core/(.*)$": "<rootDir>/src/core/$1",
  },
  modulePaths: ["<rootDir>"],
  testTimeout: 50000,
};
