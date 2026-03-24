import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import devtools from "solid-devtools/vite";
import Icons from "unplugin-icons/vite";
import relay from "vite-plugin-relay-lite";
import solid from "vite-plugin-solid";
import { defineConfig } from "vite-plus";

const env =
  "process" in globalThis
    ? (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env
    : undefined;
const argv =
  "process" in globalThis
    ? ((globalThis as { process?: { argv?: string[] } }).process?.argv ?? [])
    : [];

const isTestMode = env?.VITEST === "true" || env?.NODE_ENV === "test";
const vpCommand = argv[2];
const shouldRunRelayCodegen = vpCommand === "dev" || vpCommand === "build";

export default defineConfig({
  staged: {
    "*": ["sh -lc 'vp check --fix'"],
  },
  preview: {
    allowedHosts: ["draft.gidong.dev"],
  },
  lint: {
    ignorePatterns: ["**/*.graphql.ts"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: ["**/*.graphql.ts"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    Icons({ compiler: "solid" }),
    relay({ codegen: shouldRunRelayCodegen }),
    devtools(),
    solid({ ssr: !isTestMode }),
  ],
});
