import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      name: "Onboardly",
      fileName: "onboardly",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "onboardly.js",
        assetFileNames: "onboardly.[ext]",
        extend: true,
      },
    },
    minify: "terser",
    cssCodeSplit: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
