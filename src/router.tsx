import { createRouter as createTanStackRouter } from "@tanstack/solid-router";
import type { AppRouterContext } from "./app/router/context";
import { routeTree } from "./routeTree.gen";

function createRouter() {
  return createTanStackRouter({
    routeTree,
    context: undefined! as AppRouterContext,
    defaultPreload: "intent",
    defaultStaleTime: 5_000,
    scrollRestoration: true,
  });
}

let clientRouter: ReturnType<typeof createRouter> | null = null;

export function getRouter() {
  if (typeof window === "undefined") {
    return createRouter();
  }

  if (!clientRouter) {
    clientRouter = createRouter();
  }

  return clientRouter;
}

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
