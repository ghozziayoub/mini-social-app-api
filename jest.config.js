/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  forceExit: true,
  verbose: true,
  testTimeout: 30000,
  cache: false,
  detectOpenHandles: true,
  silent: true
};
