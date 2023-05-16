import { PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'node:path'
import svgr from 'vite-plugin-svgr'
import nodePolyfills from "rollup-plugin-node-polyfills";

const alias = (alias: string) => path.resolve(__dirname, alias)

export default defineConfig({
  plugins: [react(), svgr(), nodePolyfills() as PluginOption],
  define: {
    process: JSON.stringify({ env: process.env }),
  },
  resolve: {
    alias: {
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      path: "rollup-plugin-node-polyfills/polyfills/path",
      url: "rollup-plugin-node-polyfills/polyfills/url",

      imgs: alias("public/imgs"),
      components: alias("src/components"),
      services: alias("src/services"),
      pages: alias("src/pages"),
      utils: alias("src/utils"),
      store: alias("src/store"),
      hooks: alias("src/hooks"),
      context: alias("src/context"),
      '@osn/common-ui/es': alias('node_modules/@osn/common-ui/dist/esm')
    },
  },
});
