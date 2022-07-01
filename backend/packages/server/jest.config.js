module.exports = {
  collectCoverageFrom: ["**/*.{js}", "!**/node_modules/**"],
  preset: "@shelf/jest-mongodb",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": require.resolve("babel-jest"),
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@polkadot|@babel/runtime/helpers/esm/)",
  ],
};
