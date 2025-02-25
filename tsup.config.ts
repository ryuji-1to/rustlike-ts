import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/index.ts"],
    clean: true,
    format: ["esm", "cjs"],
    minify: false,
    dts: true,
    outDir: "./lib",
  },
  {
    entry: ["./src/index.ts"],
    clean: true,
    format: ["esm", "cjs"],
    minify: true,
    dts: true,
    outDir: "./lib",
    outExtension: ({ format }) => ({
      js: format === "cjs" ? ".min.cjs" : ".min.js",
    }),
  },
]);
