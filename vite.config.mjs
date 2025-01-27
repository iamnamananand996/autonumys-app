import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(), // Resolve aliases from tsconfig.json
  ],
  test: {
    globals: true,
    environment: "jsdom", // or 'jsdom' for DOM testing
    setupFiles: "tests/setup.ts", // Path to the setup file
  },
});
