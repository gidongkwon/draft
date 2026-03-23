import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const createRouterMock = vi.fn((options) => ({ options }));
const routeTree = { id: "__root__" };

vi.mock("@tanstack/solid-router", () => {
  return {
    createRouter: createRouterMock,
  };
});

vi.mock("../../routeTree.gen", () => {
  return {
    routeTree,
  };
});

describe("getRouter", () => {
  beforeEach(() => {
    createRouterMock.mockClear();
  });

  it("creates a router with the generated route tree", async () => {
    const { getRouter } = await import("../../router");
    const router = getRouter();

    expect(router).toBeDefined();
    expect(router.options.routeTree).toBeDefined();
    expect(router.options.scrollRestoration).toBe(true);
    expect(createRouterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        routeTree,
        defaultPreload: "intent",
        defaultStaleTime: 5_000,
        scrollRestoration: true,
      }),
    );
  });
});
