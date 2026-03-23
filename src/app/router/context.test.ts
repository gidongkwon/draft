import { describe, expect, it } from "vite-plus/test";

describe("app router context", () => {
  it("keeps only serializable auth state", async () => {
    const { createAppRouterContext } = await import("./current-request");

    const context = createAppRouterContext({
      viewer: { id: "viewer-1", name: "Lucid", handle: "@lucid", avatarUrl: null },
    });

    expect(context.viewer?.handle).toBe("@lucid");
    expect("sessionToken" in context).toBe(false);
  });
});
