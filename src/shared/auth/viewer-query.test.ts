import { describe, expect, it } from "vite-plus/test";

describe("viewer summary mapping", () => {
  it("maps the graphql viewer into shell auth state", async () => {
    const { toViewerSummary } = await import("./viewer-query");

    const viewer = toViewerSummary({
      id: "viewer-1",
      name: "Lucid",
      username: "lucid",
      avatarUrl: "https://cdn.example/avatar.png",
    });

    expect(viewer).toEqual({
      id: "viewer-1",
      name: "Lucid",
      handle: "@lucid",
      avatarUrl: "https://cdn.example/avatar.png",
    });
  });
});
