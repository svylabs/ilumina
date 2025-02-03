const config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }] // ✅ Correct transformation syntax
  },
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true, // Enable ESM mode
    }
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1" // ✅ Fix path resolution for ES Modules
  },
  transformIgnorePatterns: ["node_modules/(?!(flocc)/)"], // ✅ Allow transpiling specific dependencies if needed
  verbose: true, // Enable detailed test logs
};

export default config;
