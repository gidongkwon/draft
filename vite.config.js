import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import solid from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import relay from "vite-plugin-relay-lite";

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  staged: {
    "*": "vp check --fix",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    relay(),
    devtools(),
    solid({ ssr: env.mode !== "test" }),
  ],
}));
