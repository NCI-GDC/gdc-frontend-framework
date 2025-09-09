module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/core/(.*)$": "<rootDir>/src/core/$1",
  },
  modulePaths: ["<rootDir>"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
  testTimeout: 50000,
};
