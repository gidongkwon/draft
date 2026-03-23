import { describe, expect, it } from "vite-plus/test";

describe("auth complete link helpers", () => {
  it("requires a non-empty verification code", async () => {
    const { parseAuthCompleteSearch } = await import("./complete-link");

    expect(() => parseAuthCompleteSearch({})).toThrow(/code/i);
    expect(() => parseAuthCompleteSearch({ code: "" })).toThrow(/code/i);
  });

  it("accepts an internal next path and falls back on unsafe values", async () => {
    const { parseAuthCompleteSearch, resolvePostSignInRedirect } = await import("./complete-link");

    expect(parseAuthCompleteSearch({ code: "ABC123", next: "/drafts" })).toEqual({
      code: "ABC123",
      next: "/drafts",
    });
    expect(resolvePostSignInRedirect("/drafts")).toBe("/drafts");
    expect(resolvePostSignInRedirect("https://evil.example")).toBe("/");
    expect(resolvePostSignInRedirect("//evil.example")).toBe("/");
    expect(resolvePostSignInRedirect("drafts")).toBe("/");
  });
});
