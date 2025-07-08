import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  external: ["vite"],
  treeshake: true,
  splitting: false,
  outDir: "dist",
});
