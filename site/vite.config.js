import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import svgr from "vite-plugin-svgr";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

const alias = (alias) => path.resolve(__dirname, alias);

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": alias("src"),
      "@osn/common-ui/es": alias("node_modules/@osn/common-ui/dist/esm"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeModulesPolyfillPlugin()],
    },
  },
});
