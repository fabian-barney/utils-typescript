import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
      reportsDirectory: "coverage"
    },
    include: ["test/**/*.test.ts"]
  }
});
