/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary"],
      exclude: [
        "tests/**/*",
        "*.test.ts",
        "**/*.test.ts",
        "public/",
        "build/",
        "types/",
        "**/*.d.ts",
        "prisma/",
        "**/prisma.server.ts",
        "**/server.ts",
        "**/scripts/**",
        // configs
        "**/eslint.config.*",
        "**/remix.config.*",
        "**/vite.config.*",
        //
        "**/helpers.ts",
      ],
      reportsDirectory: "./tests/coverage",
    },
  },
});
