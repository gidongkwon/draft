import { defineConfig } from "vite-plus";
import solid from "vite-plugin-solid";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import devtools from "solid-devtools/vite";

// https://vitejs.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  plugins: [devtools(), tanstackRouter({ target: "solid" }), solid()],
});
