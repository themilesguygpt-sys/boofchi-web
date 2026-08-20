import { defineConfig } from "eslint/config";

import baseConfig from "./packages/config/eslint/base.mjs";

export default defineConfig(baseConfig, {
  files: ["scripts/**/*.mjs"],
  languageOptions: {
    globals: {
      AbortSignal: "readonly",
      Buffer: "readonly",
      console: "readonly",
      fetch: "readonly",
      process: "readonly",
      setTimeout: "readonly",
    },
  },
});
