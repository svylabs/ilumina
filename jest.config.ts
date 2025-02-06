import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",  // ✅ Ensures Jest uses ESM for TypeScript
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {},
  transformIgnorePatterns: ["/node_modules/"], // ✅ Ensure node_modules are not transformed
};

export default config;
