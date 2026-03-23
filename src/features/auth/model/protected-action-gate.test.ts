import { describe, expect, it, vi } from "vite-plus/test";

describe("protected action gate", () => {
  it("opens auth when a signed-out user tries to create a post", async () => {
    const { createProtectedActionGate } = await import("./protected-action-gate");

    const openAuth = vi.fn();
    const continuation = vi.fn();
    const gate = createProtectedActionGate({
      isAuthenticated: () => false,
      openAuth,
    });

    gate.run({ type: "new-post" }, continuation);

    expect(openAuth).toHaveBeenCalledWith({ type: "new-post" });
    expect(continuation).not.toHaveBeenCalled();
  });
});
