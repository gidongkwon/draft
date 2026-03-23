import { describe, expect, it, vi } from "vite-plus/test";
import { RootRouteErrorView } from "../app/ui/root-route-error-view";

const createRootRouteWithContextMock = vi.fn(() => {
  return (options: Record<string, unknown>) => ({
    options,
    useRouteContext: () => () => ({ viewer: null }),
  });
});

vi.mock("@tanstack/solid-router", () => ({
  HeadContent: () => null,
  Outlet: () => null,
  Scripts: () => null,
  createRootRouteWithContext: createRootRouteWithContextMock,
  useRouter: () => ({ invalidate: vi.fn() }),
}));

vi.mock("@tanstack/solid-router-devtools", () => ({
  TanStackRouterDevtools: () => null,
}));

vi.mock("@tanstack/solid-start", () => ({
  useServerFn: () => vi.fn(),
}));

vi.mock("@solidjs/meta", () => ({
  MetaProvider: (props: { children: unknown }) => props.children,
}));

vi.mock("solid-js/web", async () => {
  const actual = await vi.importActual<typeof import("solid-js/web")>("solid-js/web");
  return {
    ...actual,
    HydrationScript: () => null,
  };
});

vi.mock("../app/providers/relay-provider", () => ({
  RelayProvider: (props: { children: unknown }) => props.children,
}));

vi.mock("../features/auth/model/auth-modal-store", () => ({
  createAuthModalStore: () => ({
    state: { open: false },
    close: vi.fn(),
    openDirectly: vi.fn(),
    openForAction: vi.fn(),
  }),
}));

vi.mock("../features/auth/model/protected-action-gate", () => ({
  createProtectedActionGate: () => ({
    resume: vi.fn(),
    run: vi.fn(),
  }),
}));

vi.mock("../features/auth/ui/auth-modal", () => ({
  AuthModal: () => null,
}));

vi.mock("../app/router/current-request", () => ({
  createAppRouterContext: (value: unknown) => value,
}));

vi.mock("../app/ui/app-shell", () => ({
  AppShell: (props: { children: unknown }) => props.children,
}));

vi.mock("../shared/api/relay", () => ({
  getRelayEnvironment: vi.fn(),
}));

vi.mock("../shared/auth/server", () => ({
  completeSignIn: vi.fn(),
  getCurrentViewer: vi.fn().mockResolvedValue({ viewer: null }),
  requestSignInChallenge: vi.fn(),
  signOut: vi.fn(),
}));

describe("root route", () => {
  it("registers the global route error component", async () => {
    const { Route } = await import("./__root");

    expect(Route.options.errorComponent).toBe(RootRouteErrorView);
  });
});
