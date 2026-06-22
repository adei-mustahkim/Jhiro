import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: [],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        ".next/",
        "**/*.config.*",
        "**/*.md",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components/*": path.resolve(__dirname, "./src/components/*"),
      "@/lib/*": path.resolve(__dirname, "./src/lib/*"),
      "@/hooks/*": path.resolve(__dirname, "./src/hooks/*"),
      "@/types/*": path.resolve(__dirname, "./src/types/*"),
    },
  },
});
