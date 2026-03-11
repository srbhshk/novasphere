import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/tokens.css"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
  loader: {
    ".css": "copy",
  },
});
